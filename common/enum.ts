export enum NETWORK {
  ETH = "ETH",
  BSC = "BSC",
  POLYGON = "POLYGON",
}

export enum CRAWL_EVENT {
  TRANSFER = "Transfer",
  SET_APPROVE_FOR_ALL = "ApprovalForAll",
  APPROVAL = "Approval",
  LENT = "Lent",
  RENT = "Rented",
  RETURN = "Returned",
  STOP_LENDING = "LendingStopped",
}

export enum QueueStatus {
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
  WAITING = "WAITING",
}

export enum QueueLogEvent {
  CRAWLER_NFT = "CRAWLER_NFT",
}

export enum ErcType {
  ERC721 = "ERC721",
  KIP17 = "KIP-17",
}

export enum LoanStatus {
  LISTING = "LISTING",
  RENTING = "RENTING",
  EXPIRED = "EXPIRED",
  CLAIMED = "CLAIMED",
  CLOSED = "CLOSED",
}
