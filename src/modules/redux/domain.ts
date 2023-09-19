import { Metadata } from '@shared/domain/interfaces';

export type ReduxMetadata = Metadata<{
  unique: string;
  types: unknown;
}>;