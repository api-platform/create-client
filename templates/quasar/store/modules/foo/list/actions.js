import { types } from './mutation_types';
import { getItemsCommon, getSelectItemsCommon } from '../../../../common/store/list/actions';

const hydraPrefix = '{{{hydraPrefix}}}';

export const getItems = (context, options) =>
  getItemsCommon(
    context,
    { ...{ page: '{{{name}}}', params: {} }, ...options },
    { types, hydraPrefix },
  );

export const getSelectItems = (context, options) =>
  getSelectItemsCommon(
    context,
    { ...{ page: '{{{name}}}', params: { properties: ['id', 'name'] } }, ...options },
    { types, hydraPrefix },
  );
