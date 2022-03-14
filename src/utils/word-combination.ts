export const combineWithSymbol = (params: string[], combinator: ' ' | ', '): string => {
  const power = params.filter((test) => test.length !== 0)
  return power.join(combinator)
}

export const capitalizeFirstLetter = (param: string): string => {
  return param[0].toUpperCase() + param.slice(1).toLowerCase()
}
