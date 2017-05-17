import { combineReducers } from 'redux'

export function retrieveError(state = null, action) {
  switch (action.type) {
    case '{{{ uc }}}_SHOW_RETRIEVE_ERROR':
      return action.retrieveError;

    case '{{{ uc }}}_SHOW_RESET':
      return null;

    default:
      return state;
  }
}

export function retrieveLoading(state = false, action) {
  switch (action.type) {
    case '{{{ uc }}}_SHOW_RETRIEVE_LOADING':
      return action.retrieveLoading;

    case '{{{ uc }}}_SHOW_RESET':
      return false;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case '{{{ uc }}}_SHOW_RETRIEVE_SUCCESS':
      return action.retrieved;

    case '{{{ uc }}}_SHOW_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({retrieveError, retrieveLoading, retrieved});
