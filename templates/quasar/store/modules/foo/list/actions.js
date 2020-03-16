import { types } from './mutation_types';
import { getItemsCommon, getSelectItemsCommon } from '../../../../common/store/list/actions';
import { ENTRYPOINT } from "../../../../config/{{{hashEntry}}}_entrypoint";

const hydraPrefix = '{{{hydraPrefix}}}';
const page = '{{{name}}}';

export const getItems = (context, options) =>
  getItemsCommon(
    context,
    { ...{ page, ep: ENTRYPOINT, params: {} }, ...options },
    { types, hydraPrefix },
  );

export const getSelectItems = (context, options) =>
  getSelectItemsCommon(
    context,
    { ...{ page, ep: ENTRYPOINT, params: { properties: ['id', 'name'] } }, ...options },
    { types, hydraPrefix },
  );
