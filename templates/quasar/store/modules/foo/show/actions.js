import { types } from './mutation_types';
import { retrieveCommon, resetCommon } from '../../../../common/store/show/actions';

export const retrieve = (state, id) => retrieveCommon(state, id, { types });

export const reset = state => {
  resetCommon(state, { types });
};
