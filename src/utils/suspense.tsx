export const wrapPromise = <T,>(promise: Promise<T>) => {
  let status = "pending";
  let response: T;
  let error: Error;

  const suspender = promise.then(
    (res) => {
      status = "success";
      response = res;
    },
    (err) => {
      status = "error";
      error = err;
    }
  );

  const handler: Record<string, () => T | void> = {
    pending: () => {
      throw suspender;
    },
    error: () => {
      throw error;
    },
    default: () => response,
  };

  const read = () => {
    const result = handler[status] ? handler[status]() : handler.default();
    return result;
  };

  return { read };
};
