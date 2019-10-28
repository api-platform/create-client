import { types } from './mutation_types';
import { delCommon, resetCommon } from '../../../../common/store/delete/actions';

export const del = (context, item) => delCommon(context, item, { types });

export const reset = context => {
  resetCommon(context, { types });
};
