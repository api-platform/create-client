import { types } from './mutation_types';
import initState from './state';
import makeState from '../../../../common/store/update/mutations';

export default makeState(initState, types, 'UPDATE');
