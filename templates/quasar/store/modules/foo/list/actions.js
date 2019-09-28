import { types } from './mutation_types';
import { getItemsCommon, getSelectItemsCommon } from '../../../../common/store/list/actions';

const hydraPrefix = '{{{hydraPrefix}}}';

export const getItems = (state, options) =>
  getItemsCommon(
    state,
    { ...{ page: '{{{name}}}', params: {} }, ...options },
    { types, hydraPrefix },
  );

export const getSelectItems = (state, options) =>
  getSelectItemsCommon(
    state,
    { ...{ page: '{{{name}}}', params: { properties: ['id', 'name'] } }, ...options },
    { types, hydraPrefix },
  );
