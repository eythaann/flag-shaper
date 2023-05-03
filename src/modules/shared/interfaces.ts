
export type AllowedFlags = string;
export type FlagChecker<Flag extends AllowedFlags> = (flag: Flag) => boolean // TODO | (flag: Flag) => Promise<boolean>;

