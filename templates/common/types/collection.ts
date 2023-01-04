import type { View } from './view';

export interface PagedCollection<T> {
  '@context'?: string;
  '@id'?: string;
  '@type'?: string;
  '{{hydraPrefix}}member': T[];
  '{{hydraPrefix}}search'?: object;
  '{{hydraPrefix}}totalItems'?: number;
  '{{hydraPrefix}}view': View;
}
