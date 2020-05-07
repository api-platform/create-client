export const mutationTypes = (m, area, todoTypes) => {
  let types = {};
  todoTypes.forEach(item => (types[`${item}`] = `${m}_${area}_${item}`));
  return types;
};
