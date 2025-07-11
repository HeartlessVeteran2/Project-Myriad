// Tracking and history stub
export class Tracking {
  constructor() {
    this.history = [];
  }
  addHistory(entry) {
    this.history.push(entry);
  }
  getHistory() {
    return this.history;
  }
}
