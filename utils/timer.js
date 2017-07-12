
class Timer {
  constructor() {
    this.timers = {};
  }

  tap(label) {
    const labelTime = this.timers[label];

    if (labelTime) {
      const duration = process.hrtime(labelTime);
      return duration;
    } else {
      const now = process.hrtime();
      return now;
    }
  }

  static of() {
    return new Timer();
  }
}

module.exports = Timer.of(); 