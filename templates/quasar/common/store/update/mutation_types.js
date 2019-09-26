import { mutationTypes } from '../mutation_types';

const types = [
  'RESET',
  'SET_ERROR',
  'SET_RETRIEVED',
  'SET_UPDATED',
  'SET_VIOLATIONS',
  'TOGGLE_LOADING',
];

export const makeTypes = module => mutationTypes(module, 'UPDATE', types);
