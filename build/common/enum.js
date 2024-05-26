"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanStatus = exports.ErcType = exports.QueueLogEvent = exports.QueueStatus = exports.CRAWL_EVENT = exports.NETWORK = void 0;
var NETWORK;
(function (NETWORK) {
    NETWORK["ETH"] = "ETH";
    NETWORK["BSC"] = "BSC";
    NETWORK["POLYGON"] = "POLYGON";
})(NETWORK = exports.NETWORK || (exports.NETWORK = {}));
var CRAWL_EVENT;
(function (CRAWL_EVENT) {
    CRAWL_EVENT["TRANSFER"] = "Transfer";
    CRAWL_EVENT["SET_APPROVE_FOR_ALL"] = "ApprovalForAll";
    CRAWL_EVENT["APPROVAL"] = "Approval";
    CRAWL_EVENT["LENT"] = "Lent";
    CRAWL_EVENT["RENT"] = "Rented";
    CRAWL_EVENT["RETURN"] = "Returned";
    CRAWL_EVENT["STOP_LENDING"] = "LendingStopped";
})(CRAWL_EVENT = exports.CRAWL_EVENT || (exports.CRAWL_EVENT = {}));
var QueueStatus;
(function (QueueStatus) {
    QueueStatus["COMPLETE"] = "COMPLETE";
    QueueStatus["FAILED"] = "FAILED";
    QueueStatus["WAITING"] = "WAITING";
})(QueueStatus = exports.QueueStatus || (exports.QueueStatus = {}));
var QueueLogEvent;
(function (QueueLogEvent) {
    QueueLogEvent["CRAWLER_NFT"] = "CRAWLER_NFT";
})(QueueLogEvent = exports.QueueLogEvent || (exports.QueueLogEvent = {}));
var ErcType;
(function (ErcType) {
    ErcType["ERC721"] = "ERC721";
    ErcType["KIP17"] = "KIP-17";
})(ErcType = exports.ErcType || (exports.ErcType = {}));
var LoanStatus;
(function (LoanStatus) {
    LoanStatus["LISTING"] = "LISTING";
    LoanStatus["RENTING"] = "RENTING";
    LoanStatus["EXPIRED"] = "EXPIRED";
    LoanStatus["CLAIMED"] = "CLAIMED";
    LoanStatus["CLOSED"] = "CLOSED";
})(LoanStatus = exports.LoanStatus || (exports.LoanStatus = {}));
