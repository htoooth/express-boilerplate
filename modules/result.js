class Result {
  constructor(data, error) {
    this.error = error
    this.data = data
  }

  isFaulted() {
    return !!this.error
  }

  getData() {
    return this.data
  }

  getError() {
    return this.error
  }

  map(fn) {
    if (this.isFaulted()) {
      return Result.error(this.getError())
    } else {
      return Result.result(fn && fn(this.getData()))
    }
  }

  catch(fn) {
    if (this.isFaulted()) {
      return Result.result(fn && fn(this.getError()))
    } else {
      return Result.result(this.getData())
    }
  }

  asCallback(cb) {
    return cb && cb(this.getError(), this.getData())
  }

  asAsync() {
    if (this.isFaulted()) {
      return Promise.reject(this.getError())
    } else {
      return Promise.resolve(this.getData())
    }
  }

  asPromise() {
    if (this.isFaulted()) {
      return Promise.reject(this.getError())
    } else {
      return Promise.resolve(this.getData())
    }
  }

  static result(data) {
    return new Result(data, null)
  }

  static error(err) {
    return new Result(null, err)
  }

  static of(data, error) {
    return new Result(data, error)
  }
}

module.exports = Result
