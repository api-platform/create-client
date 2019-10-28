import { types } from './mutation_types';
import initState from './state';
import makeMutations from '../../../../common/store/create/mutations';

export default makeMutations(initState, types, 'CREATE');
