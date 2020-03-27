import { mutationTypes } from '../mutation_types';

const types = ['RESET', 'SET_ERROR', 'SET_DELETED', 'TOGGLE_LOADING'];

export default m => mutationTypes(m, 'DELETE', types);
