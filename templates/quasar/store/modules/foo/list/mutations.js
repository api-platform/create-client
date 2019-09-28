import { types } from './mutation_types';
import initState from './state';
import makeState from '../../../../common/store/list/mutations';

const mutations = makeState(initState, types);

export default mutations;
