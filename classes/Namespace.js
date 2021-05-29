class Namespace {
  constructor(nsId, nsTitle, img, endpoint) {
    this.nsId = nsId;
    this.nsTitle = nsTitle;
    this.img = img;
    this.endpoint = endpoint;
    this.rooms = [];
  }
  addRoom(roomObj) {
    this.rooms.push(roomObj);
  }
}
module.exports = Namespace;
