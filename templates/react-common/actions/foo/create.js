import { SubmissionError } from "redux-form";
import { fetch } from "../../utils/dataAccess";

export function error(error) {
  return { type: "{{{uc}}}_CREATE_ERROR", error };
}

export function loading(loading) {
  return { type: "{{{uc}}}_CREATE_LOADING", loading };
}

export function success(created) {
  return { type: "{{{uc}}}_CREATE_SUCCESS", created };
}

export function create(values) {
  return (dispatch) => {
    dispatch(loading(true));

    return fetch("{{{name}}}", { method: "POST", body: JSON.stringify(values) })
      .then((response) => {
        dispatch(loading(false));

        return response.json();
      })
      .then((retrieved) => dispatch(success(retrieved)))
      .catch((e) => {
        dispatch(loading(false));

        if (e instanceof SubmissionError) {
          dispatch(error(e.errors._error));
          throw e;
        }

        dispatch(error(e.message));
      });
  };
}

export function reset() {
  return (dispatch) => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
