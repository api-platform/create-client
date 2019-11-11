import { types } from './mutation_types';
import { createCommon, resetCommon } from '../../../../common/store/create/actions';

export const create = (context, values) =>
  createCommon(context, { page: '{{{name}}}', values }, { types });

export const reset = context => {
  resetCommon(context, { types });
};
