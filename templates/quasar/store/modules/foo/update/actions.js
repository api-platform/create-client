import { types } from './mutation_types';
import { resetCommon, retrieveCommon, updateCommon } from '../../../../common/store/update/actions';

export const reset = state => {
  resetCommon(state, { types });
};

export const retrieve = (state, id) => retrieveCommon(state, id, { types });
export const update = (state, values) => updateCommon(state, values, { types });
