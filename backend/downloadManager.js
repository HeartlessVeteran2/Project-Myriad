// Download Manager stub
export class DownloadManager {
  constructor() {
    this.queue = [];
  }
  addDownload(item) {
    this.queue.push(item);
  }
  getQueue() {
    return this.queue;
  }
}
