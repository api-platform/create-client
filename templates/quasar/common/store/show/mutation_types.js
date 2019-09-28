import { mutationTypes } from '../mutation_types';

const types = ['RESET', 'SET_ERROR', 'SET_RETRIEVED', 'TOGGLE_LOADING'];

export const makeTypes = module => mutationTypes(module, 'SHOW', types);
