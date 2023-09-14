import { AnyFunction, AnyObject, Equals, IsUnknown, IteratorHKT, KeyOfObject, KeysOfUnion, TupleReduceHTK } from "readable-types";
import { Metadata } from "../shared/domain/interfaces";
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

interface extractTypeFormPath<state> extends IteratorHKT.Tuple {
  initialAcc: state;
  return: _RT.ForceExtract<this['acc'], this['current']>
}

type SelectorByFlag<State extends AnyObject, Path extends unknown[]> = (
  <S extends (S['__metadata'] extends State['__metadata'] ? Metadata<State['__metadata']> : Required<Metadata<State['__metadata']>>)>(state: S) => TupleReduceHTK<Path, extractTypeFormPath<S>>
) & Metadata<Path>

class SelectorBuilder<
  State extends Metadata<{ types: AnyObject }>
> {
  createSelector<K extends getAllPosibleKeys<State, Metadata<[]>>>(key: K): SelectorByFlag<State, [K]>;
  createSelector<Path extends string[]>(path: [...Path]): SelectorByFlag<State, Path>;
  createSelector(path: any) {
    const selector = (state: any) => [path].flat().reduce((acc, current) => {
      return acc[current]
    }, state);
    selector.__metadata = path;
    return selector;
  }

  createSelectorFrom<
    Fn extends AnyFunction & Metadata<KeyOfObject[]>,
    Key extends getAllPosibleKeys<State, Fn>,
  >(fn: Fn, path: Key): SelectorByFlag<State, [...NonNullable<Fn['__metadata']>, Key]>

  createSelectorFrom<
    Fn extends AnyFunction & Metadata<KeyOfObject[]>,
    RestPath extends string[],
  >(fn: Fn, path: [...RestPath]): SelectorByFlag<State, [...NonNullable<Fn['__metadata']>, ...RestPath]>

  createSelectorFrom(fn: any, path: any): any {
    const realPath = [...(fn.__metadata || []), ...path];
    const selector = (state: any) => [realPath].flat().reduce((acc, current) => {
      return acc[current]
    }, state);
    selector.__metadata = realPath;
    return selector;
  }
}

type getAllPosibleKeys<
  State,
  Fn extends Metadata<KeyOfObject[]>, 
  R = TupleReduceHTK<NonNullable<Fn['__metadata']>, extractTypeFormPath<State>>
> = IsUnknown<_RT.ForceExtract<R, '__metadata'>> extends true 
  ? keyof R 
  : Exclude<KeysOfUnion<_RT.ForceExtract<NonNullable<_RT.ForceExtract<R, '__metadata'>>, 'types'>>, '__key'>;

const selectorBuilder = new SelectorBuilder<ReduxStateType>()

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