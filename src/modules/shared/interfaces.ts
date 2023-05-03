
export type ObjectKey = string | number | symbol;
export type AnyObject = Record<ObjectKey, any>;


export type ValueOf<T> = T[keyof T];

/** Same as keyof but this works with union types */
export type KeysOfUnion<Type> = Type extends Type ? keyof Type : never;
export type UnionToIntersection<Type> = { [Key in KeysOfUnion<Type>]: Extract<Type, { [key in Key]?: any }>[Key] };


export type FlagChecker<Flag extends string> =(flag: Flag) => boolean // TODO | (flag: Flag) => Promise<boolean>;

type t = {
  t1: {
    r1: string;
    r2: string;
  }
  t2: {
    r2: number;
    r6: number;
  }
}

type t2 = UnionToIntersection<ValueOf<t>>
