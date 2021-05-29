function joinRoom(roomName) {
  nsSocket.emit("joinRoom", roomName);
  nsSocket.on("chatHistory", (history) => {
    const messageUl = document.querySelector("#messages");
    messageUl.innerHTML = "";
    history.forEach((msg) => {
      const convertedDate = new Date(msg.time).toLocaleString();
      messageUl.innerHTML += `<li>
      <div class="user-image">
        <img src="${msg.avatar}" />
      </div>
      <div class="user-message">
        <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
        <div class="message-text">${msg.text}</div>
      </div>
    </li>`;
    });
    messageUl.scrollTo(0, messageUl.scrollHeight);
  });
  nsSocket.on("totalClients", (numClients) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numClients} <span class="glyphicon glyphicon-user"></span
      ></span>`;
    document.querySelector(".curr-room-text").innerText = roomName;
  });
  let searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", (e) => {
    let messages = Array.from(document.getElementsByClassName("message-text"));
    messages.forEach((msg) => {
      if (
        msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1
      ) {
        // the msg does not contain the user search term!
        msg.style.display = "none";
      } else {
        msg.style.display = "block";
      }
    });
  });
}
