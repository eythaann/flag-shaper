const _test = {
  'default': () => {
    console.log('in default');
  },
  'flagA': {
    default: () => {
      console.log('in A');
    },
    flagC: () => {
      console.log('in AC');
    },
  },
  'flagB': () => {
    console.log('in B');
  },
};

const isFlagEnabled = (x: string) => x === 'flagB' || x === 'flagC';

const fnNameLater = (x: any): any => {
  if (typeof x === 'object') {
    for (const flag of Object.keys(x).reverse()) {
      if (flag !== 'default' && !isFlagEnabled(flag)) {
        continue;
      }

      return fnNameLater(x[flag]);
    }
  }

  return x;
};

const p = fnNameLater(_test);
p();