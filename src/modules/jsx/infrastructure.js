import { BaseFlagger } from '../shared/BaseFlagger/app';

export class FlagShaperJSX extends BaseFlagger {
  Toggle({ flags, on, off }) {
    return this.validator.allFlagsAreEnabled(flags) ? on : off;
  }

  RenderIn({ flag, children, component: Component, props }) {
    if (this.validator.allFlagsAreEnabled(flag)) {
      if (!!Component) {
        return <Component {...props} />;
      }

      return children;
    }

    return null;
  }

  UnRenderIn({ flag, children }) {
    if (this.validator.allFlagsAreEnabled(flag)) {
      return null;
    }

    return children;
  }

  enableComponentIn(flag, component) {
    if (this.validator.allFlagsAreEnabled(flag)) {
      return component;
    }
    return () => null;
  }
};