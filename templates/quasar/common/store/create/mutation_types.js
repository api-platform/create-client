import { mutationTypes } from '../mutation_types';

const types = ['RESET', 'SET_CREATED', 'SET_ERROR', 'SET_VIOLATIONS', 'TOGGLE_LOADING'];

export const makeTypes = module => mutationTypes(module, 'CREATE', types);
