export const insertIntoArray = (arr: any[], value: any, source?: string) => {
  return arr.reduce((result, element, index, array) => {
    result.push(element);
    console.log({ result }, source);
    if (index < array.length - 1) {
      result.push(value);
    }

    return result;
  }, []);
};
