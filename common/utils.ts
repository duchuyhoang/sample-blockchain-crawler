import { NETWORK } from "./enum";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import util from "util";
import converter from "hex2dec";
import base64 from "base-64";
export const dateInMiliseconds = () => {
  return Date.now();
};

export const getMoralisChain = (network: NETWORK) => {
  const mapNetwork: { [key: string]: EvmChain } = {
    [NETWORK.ETH]: EvmChain.GOERLI,
    [NETWORK.BSC]: EvmChain.BSC_TESTNET,
    [NETWORK.POLYGON]: EvmChain.MUMBAI,
  };
  return mapNetwork[network] || EvmChain.GOERLI;
};

export const log = (object: Object) => {
  console.log(
    util.inspect(object, { showHidden: false, depth: null, colors: true })
  );
};

export const sleep = async (time = 1000) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });

export function unpackPrice(_price: string) {
  const _scale = 1;
  const paddedString = _price.slice(2);
  let whole = parseFloat(
    converter.hexToDec(paddedString.slice(0, 4)) as string
  );
  let decimal = parseFloat(converter.hexToDec(paddedString.slice(4)) as string);

  if (whole > 9999) {
    whole = 9999;
  }
  if (decimal > 9999) {
    decimal = 9999;
  }

  const w = whole * _scale;
  const d = (decimal * _scale) / 10000;
  const price = w + d;

  return price;
}

const decimalToPaddedHexString = (number: number, bitsize: number): string => {
  const byteCount = Math.ceil(bitsize / 8);
  const maxBinValue = Math.pow(2, bitsize) - 1;
  /* In node.js this function fails for bitsize above 32 bits */
  if (bitsize > 32) throw "number above maximum value";
  /* Conversion to unsigned form based on  */
  if (number < 0) number = maxBinValue + number + 1;
  return (
    "0x" +
    (number >>> 0)
      .toString(16)
      .toUpperCase()
      .padStart(byteCount * 2, "0")
  );
};

export const packPrice = (price: number): string => {
  if (price > 9999.9999) throw new Error("too high");

  const stringVersion = price.toString();
  const parts = stringVersion.split(".");
  let res: string;

  if (parts.length == 2) {
    const whole = parts[0];
    let decimal = parts[1];
    while (decimal.length < 4) {
      decimal += "0";
    }
    const wholeHex = decimalToPaddedHexString(Number(whole), 16);
    const decimalHex = decimalToPaddedHexString(Number(decimal), 16);
    const hexRepr = wholeHex.concat(decimalHex.slice(2));
    res = hexRepr;
  } else {
    if (parts.length != 1) throw new Error("price packing issue");
    const whole = parts[0];
    const wholeHex = decimalToPaddedHexString(Number(whole), 16);
    const decimalHex = "0000";
    res = wholeHex.concat(decimalHex);
  }
  return res;
};

export const wrapperAsync = async (asyncFunc: Promise<any>) => {
  try {
    const rs = await asyncFunc;
    return [rs, null];
  } catch (e) {
    return [null, e];
  }
};
