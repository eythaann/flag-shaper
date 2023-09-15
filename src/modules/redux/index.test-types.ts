import { ExtractByFlags, ModifyUsingInterface } from "./app";

interface OldITestDeep {
  testDeep1: number;
  testDeep2: number;
  testDeep3: number;
}

type ITestDeep = ModifyUsingInterface<OldITestDeep, [
  ['featureA', { testDeep1: string }],
  ['featureC', { addedInC: boolean[] }]
]>

interface OldIProp4 {
  test1: number;
  test2: string;
  test3: string;
  test4: ITestDeep
}

type IProp4 = ModifyUsingInterface<OldIProp4, [
  ['featureA', { test1: string }],
  ['featureB', { test2: number }]
]>

interface OldReduxState {
  prop1: string[];
  prop2: string[];
  prop3: string[];
  prop4: IProp4;
}

export type ReduxStateType = ModifyUsingInterface<OldReduxState, [
  ['featureA', { prop3: number[] }],
  ['featureB', { prop3: boolean[] }]
]>


const ReduxState = {} as ReduxStateType;


const ReduxStateFC = {} as ExtractByFlags<ReduxStateType, ['featureC']>;

const ReduxStateFA: ExtractByFlags<ReduxStateType, ['featureA']> = {
  prop1: [String()],
  prop2: [String()],
  prop3: [Number()],
  prop4: {
    test1: String(),
    test2: String(),
    test3: String(),
    test4: {
      testDeep1: String(),
      testDeep2: Number(),
      testDeep3: Number(),
    },
  },
}

const selectorBuilder = new SelectorBuilder<ReduxStateType>();

const selectProp4 = selectorBuilder.createSelector('prop4');

const selectTest1 = selectorBuilder.createSelectorFrom(selectProp4, 'test1');
const selectTest4 = selectorBuilder.createSelectorFrom(selectProp4, 'test4');

const selectDeep = selectorBuilder.createSelectorFrom(selectTest4, 'addedInC');

const selectDeepAlternative = selectorBuilder.createSelector(['prop4', 'test4', 'testDeep1']);

const t1 = selectTest4(ReduxStateFA);
//     ^?

const t2 = selectDeep(ReduxState);
//     ^?

const t3 = selectDeep(ReduxStateFC);
//     ^?

const t4 = selectDeepAlternative(ReduxStateFA);
//     ^?