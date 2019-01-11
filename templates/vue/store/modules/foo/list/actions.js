import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'

const getItems = ({ commit }, page = '{{{name}}}') => {
  commit(types.TOGGLE_LOADING)

  fetch(page)
    .then(response => response.json())
    .then((data) => {
      commit(types.TOGGLE_LOADING)
      commit(types.SET_ITEMS, data['{{{hydraPrefix}}}member'])
      commit(types.SET_VIEW, data['{{{hydraPrefix}}}view'])
    })
    .catch((e) => {
      commit(types.TOGGLE_LOADING)
      commit(types.SET_ERROR, e.message)
    })
}

export default getItems
