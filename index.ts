import * as dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Response } from "express";
import Web3 from "web3";
import "reflect-metadata";
import dataSource from "./configs/dataSource";
import Moralis from "moralis";
import NFTCrawler from "./fetcher/NFTCrawler";
import { NETWORK } from "./common/enum";
import LendRentAbi from "./abi/LendRent.json";
import LendRentCrawler from "./fetcher/LendRentCrawler";
import { ethers, Interface, JsonRpcProvider } from "ethers";
import { sleep } from "./common/utils";
import NftCrawlerProcessor from "./queue/NftCrawlerProcessor";
import LendRentProcessor from "./queue/LendRentProcessor";
import { checkRedisReady } from "./configs/redis";
import LentRentLauncher from "./launcher/LentRentLauncher";
import NftCrawlerLauncher from "./launcher/NftCrawlerLauncher";

const app = express();

const startApp = async () => {
  try {
    await checkRedisReady();
    const initializedDatasource = await dataSource.initialize();
    app.use((req, res, next) => {
      req.dataSource = initializedDatasource;
      next();
    });

    await Moralis.start({
      apiKey: process.env.MORALIS_KEY,
    });

    const nftCrawlerLauncher = new NftCrawlerLauncher({
      network: NETWORK.ETH,
    });
    await nftCrawlerLauncher.start();

    const lentRentLauncer = new LentRentLauncher({
      network: NETWORK.ETH,
    });
    await lentRentLauncer.start();

    console.log("Basic crawler running successfully!!!");
    return [true, null];
  } catch (e) {
    console.log(e);
    return [null, e];
  }
};

app.get("/hello", (req, res) => {
  res.json({ message: "Hello world!!!" });
});

app.listen(3000, async () => {
  const [rs, err] = await startApp();
  if (rs) {
    console.log("Server listen");
  } else {
    console.log("Server down");
  }
});
