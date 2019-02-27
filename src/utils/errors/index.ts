class IncorrectEnvironmentError extends Error {

  constructor(name: string) {
    const msg = `Incorrect environment specification (variable: ${name})`;
    super(msg);

    Object.setPrototypeOf(this, IncorrectEnvironmentError.prototype);
  }

}

export {
  IncorrectEnvironmentError,
};
