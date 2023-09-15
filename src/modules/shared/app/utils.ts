import { AnyObject } from "readable-types";
import * as rfdc from "rfdc";

export const keyOf = <T extends AnyObject>(o: T): Array<keyof T> => {
  return Object.keys(o) as Array<keyof T>
}

export const cloneDeep = rfdc();