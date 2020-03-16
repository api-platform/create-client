import { types } from './mutation_types';
import { delCommon, resetCommon } from '../../../../common/store/delete/actions';
import { ENTRYPOINT } from "../../../../config/{{{hashEntry}}}_entrypoint";

export const del = (context, item) => delCommon(context, { item, ep: ENTRYPOINT }, { types });

export const reset = context => {
  resetCommon(context, { types });
};
