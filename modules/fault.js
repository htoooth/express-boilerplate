class ResultError extends Error {
  constructor(msg, opts) {
    super(msg)
    Object.assign(this, opts)
  }
}

module.exports = {
  Err: ResultError
}
