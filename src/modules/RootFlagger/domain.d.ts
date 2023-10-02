import { Metadata } from 'modules/shared/domain/interfaces';

export type ReduxMetadata = Metadata<{
  unique: string;
  types: unknown;
}>;