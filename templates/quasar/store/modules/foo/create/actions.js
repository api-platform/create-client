import { types } from './mutation_types';
import { createCommon, resetCommon } from '../../../../common/store/create/actions';
import { ENTRYPOINT } from "../../../../config/{{{hashEntry}}}_entrypoint";

const page = '{{{name}}}';

export const create = (context, values) =>
  createCommon(context, { page, values, ep: ENTRYPOINT }, { types });

export const reset = context => {
  resetCommon(context, { types });
};
