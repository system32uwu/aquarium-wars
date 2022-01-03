import { BigNumber, BigNumberish, utils } from 'ethers'

export const parsedDecimalValue = (val: number): BigNumber =>
  utils.parseUnits(val.toString(), 18)

export const unparseDecimalValue = (val: BigNumberish): string =>
  utils.formatUnits(val)
