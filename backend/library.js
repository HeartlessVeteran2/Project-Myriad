// Unified Library module (manga + anime, local + online)
export class Library {
  constructor() {
    this.items = [];
  }
  addItem(item) {
    this.items.push(item);
  }
  getAll() {
    return this.items;
  }
}
