import { types } from './mutation_types';
import { createCommon, resetCommon } from '../../../../common/store/create/actions';

export const create = (state, values) =>
  createCommon(state, { page: '{{{name}}}', values }, { types });

export const reset = state => {
  resetCommon(state, { types });
};
