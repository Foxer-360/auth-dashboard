class ApolloClientIsNotSet extends Error {

  constructor() {
    const msg = `Apollo client is not correctly set in context!`;
    super(msg);

    Object.setPrototypeOf(this, ApolloClientIsNotSet.prototype);
  }

}

class IncorrectEnvironmentError extends Error {

  constructor(name: string) {
    const msg = `Incorrect environment specification (variable: ${name})`;
    super(msg);

    Object.setPrototypeOf(this, IncorrectEnvironmentError.prototype);
  }

}

export {
  ApolloClientIsNotSet,
  IncorrectEnvironmentError,
};
