import {
  getItemsCommon,
  getSelectItemsCommon
} from '../../../../common/store/list/actions';
import { ENTRYPOINT } from "../../../../config/{{{hashEntry}}}_entrypoint";

const hydraPrefix = '{{{hydraPrefix}}}';
const page = '{{{name}}}';

export default function(types) {
  const getItems = (context, options) =>
    getItemsCommon(
      context,
      { ...{ page, ep: ENTRYPOINT, params: {} }, ...options },
      { types, hydraPrefix },
    );

  const getSelectItems = (context, options) =>
    getSelectItemsCommon(
      context,
      { ...{ page, ep: ENTRYPOINT, params: { properties: ['id', 'name'] } }, ...options },
      { types, hydraPrefix },
    );

  return { getItems, getSelectItems };
}
