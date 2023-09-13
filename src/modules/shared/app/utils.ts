import { AnyObject } from "readable-types";

export const keyOf = <T extends AnyObject>(o: T): Array<keyof T> => {
  return Object.keys(o) as Array<keyof T>
}