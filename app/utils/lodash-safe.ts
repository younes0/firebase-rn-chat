export const safePick = <T, K extends keyof T>(
  object: T,
  keys: K[],
): Pick<T, K> =>
  Object.assign(
    {},
    ...keys.map((key) => {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        return { [key]: object[key] };
      }
    }),
  );

export const safeOmit = <T extends object, K extends keyof T>(
  object: T,
  keys: K[],
): Omit<T, K> => {
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      delete object[key];
    }
  });

  return object;
};
