import { types } from './mutation_types';
import { retrieveCommon, resetCommon } from '../../../../common/store/show/actions';
import { ENTRYPOINT } from "../../../../config/{{{hashEntry}}}_entrypoint";

export const retrieve = (context, id) => retrieveCommon(context, { id, ep: ENTRYPOINT }, { types });

export const reset = context => {
  resetCommon(context, { types });
};
