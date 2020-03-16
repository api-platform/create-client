import { types } from './mutation_types';
import { resetCommon, retrieveCommon, updateCommon } from '../../../../common/store/update/actions';
import { ENTRYPOINT } from "../../../../config/{{{hashEntry}}}_entrypoint";

export const reset = context => {
  resetCommon(context, { types });
};

export const retrieve = (context, id) =>
  retrieveCommon(context, { id, ep: ENTRYPOINT }, { types });
export const update = (context, values) =>
  updateCommon(context, { values, ep: ENTRYPOINT }, { types });
