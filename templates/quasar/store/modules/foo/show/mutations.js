import { types } from './mutation_types';
import initState from './state';
import makeMutations from '../../../../common/store/show/mutations';

export default makeMutations(initState, types, 'SHOW');
