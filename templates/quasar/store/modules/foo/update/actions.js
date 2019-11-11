import { types } from './mutation_types';
import { resetCommon, retrieveCommon, updateCommon } from '../../../../common/store/update/actions';

export const reset = context => {
  resetCommon(context, { types });
};

export const retrieve = (context, id) => retrieveCommon(context, id, { types });
export const update = (context, values) => updateCommon(context, values, { types });
