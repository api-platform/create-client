import { resetCommon, retrieveCommon, updateCommon } from '../../../../common/store/update/actions';
import { ENTRYPOINT } from "../../../../config/{{{hashEntry}}}_entrypoint";

export default function(types) {
  const reset = context => {
    resetCommon(context, { types });
  };

  const retrieve = (context, id) =>
    retrieveCommon(context, { id, ep: ENTRYPOINT }, { types });
  const update = (context, values) =>
    updateCommon(context, { values, ep: ENTRYPOINT }, { types });

  return { reset, retrieve, update };
}
