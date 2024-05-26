import { DataSource } from "typeorm";
import path from "path";
console.log("rr", process.env.REDIS_HOST, process.env.REDIS_PORT);

const dataSource = new DataSource({
  type: "postgres",
  username: process.env.TYPEORM_USER,
  password: process.env.TYPEORM_PASSWORD,
  host: process.env.TYPEORM_HOST,
  port: Number(
    process.env.NODE_ENV === "DEVELOPMENT"
      ? process.env.DEV_DATABASE_PORT
      : process.env.DEV_DATABASE_PORT
  ),
  database: process.env.TYPEORM_DATABASE,
  logging: false,
  entities: [path.join(__dirname, "../entities/*{.ts,.js}")],
  synchronize: true,
});

export default dataSource;
