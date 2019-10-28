import { types } from './mutation_types';
import { retrieveCommon, resetCommon } from '../../../../common/store/show/actions';

export const retrieve = (context, id) => retrieveCommon(context, id, { types });

export const reset = context => {
  resetCommon(context, { types });
};
