export const success = (data: unknown) => {
  return {
    code: "SUCCESS",
    data,
  };
};

export const error = (message: string, code: string = "ERROR") => {
  return {
    code,
    message,
  };
};
