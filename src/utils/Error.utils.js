class ExpressError extends Error {
  constructor(error, message) {
    super(), (this.error = error);
    this.message = message;
  }
}

export default ExpressError;
