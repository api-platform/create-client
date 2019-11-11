import { types } from './mutation_types';
import initState from './state';
import makeMutations from '../../../../common/store/list/mutations';

const mutations = makeMutations(initState, types);

export default mutations;
