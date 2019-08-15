export const timeout = (t: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, t);
  });
};

/* tslint:disable-next-line */
export const noop = () => {};
