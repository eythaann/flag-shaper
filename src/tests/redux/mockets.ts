export interface ITestDeep4 {
  reallyDeep1: boolean;
  reallyDeep2: boolean;
  reallyDeep3: boolean;
}

export interface ITest4 {
  testDeep1: number;
  testDeep2: number;
  testDeep3: number;
  testDeep4: ITestDeep4;
}

export interface IProp4 {
  test1: string;
  test2: string;
  test3: string;
  test4: ITest4;
  test4_2: ITest4[];
}

export interface ReduxState {
  prop1: string[];
  prop2: string[];
  prop3: string[];
  prop4: IProp4;
}

export const MocketState: ReduxState = {
  prop1: [String()],
  prop2: [String()],
  prop3: [String()],
  prop4: {
    test1: String(),
    test2: String(),
    test3: String(),
    test4: {
      testDeep1: Number(),
      testDeep2: Number(),
      testDeep3: Number(),
      testDeep4: {
        reallyDeep1: Boolean(),
        reallyDeep2: Boolean(),
        reallyDeep3: Boolean(),
      }
    },
    test4_2: [{}, {}] as ITest4[],
  },
}