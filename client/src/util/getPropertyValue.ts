export function getPropertyValue(
  obj1: Record<string, any>,
  dataToRetrieve: string
): any {
  return dataToRetrieve
    .split(".") // split string based on `.`
    .reduce<Record<string, any> | any>(function (o, k) {
      return o && o[k]; // get inner property if `o` is defined else get `o` and return
    }, obj1); // set initial value as object
}
