import { mutationTypes } from '../mutation_types';

const types = ['RESET', 'SET_ERROR', 'SET_DELETED', 'TOGGLE_LOADING'];

export const makeTypes = module => mutationTypes(module, 'DELETE', types);
