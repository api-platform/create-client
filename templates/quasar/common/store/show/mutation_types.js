import { mutationTypes } from '../mutation_types';

const types = ['RESET', 'SET_ERROR', 'SET_RETRIEVED', 'TOGGLE_LOADING'];

export default m => mutationTypes(m, 'SHOW', types);
