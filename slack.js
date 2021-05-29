const express = require("express");
const app = express();
const socketio = require("socket.io");
app.use(express.static(__dirname + "/public"));
console.log(process.env);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public" + "/chat.html");
});
const expressServer = app.listen(process.env.PORT || 3000);
// this is the socket server
const io = socketio(expressServer);
// getting all the namespaces
let namespaces = require("./data/namespaces");

io.on("connection", (socket) => {
  // client connected to main namespace
  // build an ns list that we will send back to the client
  // list will contain img and endpoint
  // img for showing, endpoint for namespace

  const nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });
  //   send the nslist back to the client. here we will use socket not io,
  // because we want it to go back to the connected client only.
  //   all all the user who are connected, only the user who is connected
  socket.emit("nsList", nsData);
});
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    //   we can still get the query object from handshake cz, handshake occurs only once
    const username = nsSocket.handshake.query.username
      ? nsSocket.handshake.query.username
      : "Dev Ankit";
    // console.log(`${nsSocket.id} joins ${namespace.nsTitle}`);
    // at this point one socket is connected in the current namespace
    // forward all the room information to the socket
    nsSocket.emit("nsRoomData", namespace.rooms);
    nsSocket.on("joinRoom", async (roomToJoin) => {
      // we need to deal with chat history here
      //   first find the room object from the namespace
      const keys = Array.from(nsSocket.rooms);
      const roomToLeave = keys[1];
      nsSocket.leave(roomToLeave);
      updateClientsInRooms(namespace, roomToLeave);
      nsSocket.join(roomToJoin);
      updateClientsInRooms(namespace, roomToJoin);
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });
      nsSocket.emit("chatHistory", nsRoom.history);
    });
    nsSocket.on("userMsgToServer", (data) => {
      const fullMsg = {
        text: data.text,
        time: Date.now(),
        username: username,
        avatar: "https://via.placeholder.com/30",
      };
      //   we want to send this msg to ALL the sockets in the room in which the current socket is in
      // so we need to find room name
      const keys = Array.from(nsSocket.rooms);
      //   the first element in the key is socket-id,
      // by default a socket is joined in a room which has a room name same as his id
      const roomName = keys[1];
      //   now we need to find the room object inside this namespace
      // on that object we have out history array, where we can store msg history
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomName;
      });
      nsRoom.history.push(fullMsg);

      io.of(namespace.endpoint).to(roomName).emit("msgToClient", fullMsg);
    });
  });
});
const updateClientsInRooms = async (namespace, roomToJoin) => {
  const ids = await io.of(namespace.endpoint).in(roomToJoin).allSockets();
  io.of(namespace.endpoint).to(roomToJoin).emit("totalClients", ids.size);
};
