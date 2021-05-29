function joinNs(endpoint) {
  // if nsSocket is already present we need to close the conection
  if (nsSocket) {
    nsSocket.disconnect();
    // we need to remove the event listeners also
    document
      .querySelector("#user-message")
      .removeEventListener("submit", formSubmission);
  }
  //   user by default joins the wiki namespace
  nsSocket = io(`http://localhost:3000${endpoint}`);
  nsSocket.on("nsRoomData", (roomData) => {
    const roomListUl = document.querySelector(".room-list");
    roomListUl.innerHTML = "";
    roomData.forEach((room) => {
      const glyph = room.privateRoom === true ? "lock" : "globe";
      roomListUl.innerHTML += `<li class="room">
        <span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}
      </li>`;
    });
    // now we need to add event listeners to all rooms list
    const room = document.getElementsByClassName("room");
    Array.from(room).forEach((element) => {
      element.addEventListener("click", (e) => {
        // console.log(e.target.innerText);
        // join to specific room
        joinRoom(e.target.innerText);
      });
    });
    // add room automatically
    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;
    joinRoom(topRoomName);
  });

  nsSocket.on("msgToClient", (data) => {
    console.log("hey there!");
    document.querySelector("#messages").innerHTML += buildHTML(data);
  });
  const form = document.querySelector(".message-form");
  form.addEventListener("submit", formSubmission);
}
function formSubmission(event) {
  event.preventDefault();
  const msg = document.querySelector("#user-message").value;
  nsSocket.emit("userMsgToServer", { text: msg });
}
const buildHTML = (msg) => {
  const convertedDate = new Date(msg.time).toLocaleString();
  return `<li>
    <div class="user-image">
      <img src="${msg.avatar}" />
    </div>
    <div class="user-message">
      <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
      <div class="message-text">${msg.text}</div>
    </div>
  </li>`;
};
