import { mutationTypes } from '../mutation_types';

const types = [
  'RESET',
  'SET_ITEMS',
  'SET_SELECT_ITEMS',
  'SET_SELECT_ITEMS_TEMPLATE',
  'SET_ERROR',
  'SET_VIEW',
  'TOGGLE_LOADING',
  'SET_TOTALITEMS',
];

export const makeTypes = module => mutationTypes(module, 'LIST', types);
