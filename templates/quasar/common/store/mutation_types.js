export const mutationTypes = (module, area, todoTypes) => {
  let types = {
    [module]: {},
  };
  todoTypes.forEach(item => (types[module][`${item}`] = `${module}_${area}_${item}`));
  return types;
};
