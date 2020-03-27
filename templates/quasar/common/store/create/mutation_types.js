import { mutationTypes } from '../mutation_types';

const types = ['RESET', 'SET_CREATED', 'SET_ERROR', 'SET_VIOLATIONS', 'TOGGLE_LOADING'];

export default m => mutationTypes(m, 'CREATE', types);
