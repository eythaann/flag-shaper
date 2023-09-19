import { JSXElementConstructor } from 'react';
import { AnyObject } from 'readable-types';
import { FlagShaperChecker } from '../../checker';
import { FlaggedPropsAndState } from '../../jsx';
import { AllowedFlags, IConfig } from '../../shared/domain/interfaces';
import { SelectorBuilder } from './SelectorBuilder';
import { SliceTools } from './SliceTools';

export class ReduxFlagShaper<Flag extends AllowedFlags, Config extends IConfig> extends FlagShaperChecker<Flag, Config> {
  public readonly SelectorBuilder = SelectorBuilder;

  public getSliceTools<State extends AnyObject>() {
    return new SliceTools<State, Flag>(this.config.createSliceFn);
  }

  public connect<
    T extends FlaggedPropsAndState,
  >(...args: [
    mapStateToProps: (state: any, ownProps: T['ExternalProps']) => T['ReduxStateProps'],
    mapDispatchToProps?: any,
    mergeProps?: any,
    options?: any
  ]) {
    return (component: JSXElementConstructor<T['completeProps']>) => this.config.connectFn(args)(component) as JSXElementConstructor<T['ExternalProps']>;
  }
}