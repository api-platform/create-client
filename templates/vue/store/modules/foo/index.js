import list from './list'
import create from './create'
import update from './update'
import show from './show'
import del from './delete'

export default {
  namespaced: true,
  modules: {
    list,
    create,
    update,
    show,
    del
  }
}
