import { UnionToIntersection } from "readable-types";
import { UnionOrIntersectionType } from "typescript";
import { ExtractByFlags, ModifyUsingInterface } from "./app";


interface OldITestDeep {
  testDeep1: number;
  testDeep2: number;
  testDeep3: number;
}

type ITestDeep = ModifyUsingInterface<OldITestDeep, [
  ['featureA', { testDeep1: string }],
  ['featureB', { testDeep2: string }]
]>

interface OldIProp4 {
  test1: string;
  test2: string;
  test3: string;
  test4: ITestDeep
}

type ITest = ModifyUsingInterface<OldIProp4, [
  ['featureA', { test1: number }],
  ['featureB', { test2: number }]
]>

interface OldReduxState {
  prop1: string[];
  prop2: string[];
  prop3: string[];
  prop4: ITest;
}

type ReduxState = ModifyUsingInterface<OldReduxState, [
  ['featureA', { prop3: number[] }],
  ['featureB', { prop3: boolean[] }]
]>

const T0: ReduxState = {} as any;


type T0_5 = ExtractByFlags<ReduxState, ['featureA'] >;

const T1: ExtractByFlags<ReduxState, ['featureA'] > = {
  prop1: [String()],
  prop2: [String()],
  prop3: [Number()],
  prop4: {
    test1: Number(),
    test2: String(),
    test3: String(),
    test4: {
      testDeep1: String(),
      testDeep2: Number(),
      testDeep3: Number(),
    },
  },
}