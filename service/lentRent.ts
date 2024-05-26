import { EntityManager } from "typeorm";
import { LoanStatus, NETWORK } from "../common/enum";
import { unpackPrice } from "../common/utils";
import dataSource from "../configs/dataSource";
import Loans from "../entities/Loan";
import { LendRentQueueLogData } from "../fetcher/LendRentCrawler";
import LoanService from "./loan";
import NFTService from "./nft";
import { BigNumber } from "bignumber.js";
import NFT from "../entities/NFT";
export interface IRentData {
  network: NETWORK;
  rentedAt: number;
  lendingId: string;
  rentDuration: number;
  renterAddress: string;
}

export interface ILentData {
  network: NETWORK;
  tokenId: string | number;
  isERC721: boolean;
  nftPrice: string;
  lendingId: string;
  lentAmount: string;
  nftAddress: string;
  lenderAddress: string;
  dailyRentPrice: string;
  useNativeToken: boolean;
  maxRentDuration: string;
}

export interface IStopLending {
  network: NETWORK;
  lendingId: string;
  stoppedAt: number;
}

export default class LendRentService {
  private loanService = new LoanService();
  constructor() {}

  // User start listing their nft can be rented
  public async handleLentEvent(queueLog: LendRentQueueLogData) {
    const data: ILentData = queueLog.data;
    const queryRunner = dataSource.createQueryRunner();

    const nftService = new NFTService();
    try {
      let loan: Maybe<Loans> = await this.loanService.getLoanByLoanIdAndNetwork(
        {
          lendingId: data.lendingId,
          network: data.network,
        }
      );
      const nft = await nftService.getNftByTokenIdNetworkAndCollection({
        collectionAddress: data.nftAddress,
        network: data.network,
        tokenId: data.tokenId.toString(),
      });
      if (!nft) {
        return [null, new Error("Nft doesn't exist in system")];
      }
      if (!loan) {
        loan = new Loans();
      } else {
        if (loan.nft.id !== nft.id) {
          return [null, new Error("Nft doesn't exist in system")];
        }
      }
      // Update nft owner based on lender
      nft.ownerAddress = data.lenderAddress;

      // Update loan
      loan.lenderAddress = nft.ownerAddress;
      loan.renterAddress = null;
      loan.lendingId = data.lendingId;
      loan.dailyFee = unpackPrice(data.dailyRentPrice).toString();
      loan.lentAmount = parseInt(data.lentAmount);
      loan.maxRentDuration = parseInt(data.maxRentDuration);
      loan.network = data.network;
      loan.useNativeToken = data.useNativeToken;
      loan.nft = nft;

      loan.status = LoanStatus.LISTING;

      loan.collateral = unpackPrice(data.nftPrice).toString();
      loan.dailyFee = unpackPrice(data.dailyRentPrice).toString();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.save(nft);
      await queryRunner.manager.save(loan);

      await queryRunner.commitTransaction();
      return [loan, null];
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return [null, e];
    } finally {
      await queryRunner.release();
    }
  }

  public async handleRentEvent(queueLog: LendRentQueueLogData) {
    const data: IRentData = queueLog.data;

    const loan: Maybe<Loans> = await this.loanService.getLoanByLoanIdAndNetwork(
      {
        lendingId: data.lendingId,
        network: data.network,
      }
    );

    if (!loan) {
      return [null, "Loan not exist"];
    }

    if (loan.status !== LoanStatus.LISTING) {
      return [null, "Loan is not listing"];
    }

    const nft: NFT = loan.nft;

    // Update nft owner
    nft.ownerAddress = data.renterAddress;

    //Update loan info
    loan.startDate = (parseInt(data.rentedAt.toString()) * 1000).toString();
    loan.rentDuration = data.rentDuration;
    loan.status = LoanStatus.RENTING;
    loan.latestPrice = new BigNumber(loan.collateral)
      .plus(
        new BigNumber(loan.dailyFee).multipliedBy(
          new BigNumber(data.rentDuration)
        )
      )
      .toString();

    const queryRunner = dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.manager.save(nft);
      await queryRunner.manager.save(loan);
      await queryRunner.commitTransaction();
      return [loan, null];
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return [e, null];
    } finally {
      await queryRunner.release();
    }
    // return dataSource.transaction(async (manager: EntityManager) => {
    //   //   const {};
    // });
  }

  public async handleStopLending(queueLog: LendRentQueueLogData) {
    const data: IStopLending = queueLog.data;

    const loan: Maybe<Loans> = await this.loanService.getLoanByLoanIdAndNetwork(
      {
        lendingId: data.lendingId,
        network: data.network,
      }
    );

    if (!loan) {
      return [null, "Loan not exist"];
    }

    loan.status = LoanStatus.CLOSED;
    loan.latestPrice = null;
    loan.rentDuration = null;

    const queryRunner = dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.manager.save(loan);
      return [loan, null];
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return [null, e];
    } finally {
      await queryRunner.release();
    }
  }
}
