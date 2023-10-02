import { AnyObject } from 'readable-types';

export declare const keyOf: <T extends AnyObject>(o: T) => Array<keyof T>;
export declare const cloneDeep: <T>(input: T) => T;