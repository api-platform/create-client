import { types } from './mutation_types';
import { delCommon, resetCommon } from '../../../../common/store/delete/actions';

export const del = (state, item) => delCommon(state, item, { types });

export const reset = state => {
  resetCommon(state, { types });
};
