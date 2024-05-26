"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const dataSource = new typeorm_1.DataSource({
    type: "postgres",
    username: process.env.TYPEORM_USER,
    password: process.env.TYPEORM_PASSWORD,
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.PORT),
    database: process.env.TYPEORM_DATABASE,
    logging: false,
    entities: [path_1.default.join(__dirname, "../entities/*{.ts,.js}")],
    synchronize: true,
});
exports.default = dataSource;
