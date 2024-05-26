import express from "express";

import type { RedisClientType } from "@common/redisConnection";
import { DataSource } from "typeorm";
declare global {
  namespace Express {
    interface Request {
      user?: UserInfo;
      dataSource: DataSource;
    }
  }
}
