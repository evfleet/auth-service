export const createAPIResponse = (success, payload, code) => {
  if (success) {
    return {
      data: payload
    };
  } else {
    return {
      error: {
        code,
        message: payload
      }
    };
  }
};