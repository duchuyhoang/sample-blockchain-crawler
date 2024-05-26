import { Repository } from "typeorm";
import { NETWORK } from "../common/enum";
import dataSource from "../configs/dataSource";
import Loans from "../entities/Loan";

export default class LoanService extends Repository<Loans> {
  constructor() {
    super(Loans, dataSource.createEntityManager());
  }
  public async getLoanByLoanIdAndNetwork({
    lendingId,
    network,
  }: {
    lendingId: string;
    network: NETWORK;
  }) {
    return this.findOne({
      where: {
        network,
        lendingId,
      },
      relations: ["nft"],
    });
  }
}
