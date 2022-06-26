const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const { makeId } = require("./utils");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const clientRooms = {};

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("newGame", () => {
    let roomName = makeId(5);
    clientRooms[socket.id] = roomName;
    socket.emit("gameCode", roomName);

    socket.join(roomName);

    socket.number = 1;
    socket.emit("playerNumber", socket.number);
  });

  socket.on("joinGame", (gameCode) => {
    const room = io.sockets.adapter.rooms.get(gameCode);
    let numClients = room ? room.size : 0;
    if (numClients === 0) {
      socket.emit("unknownGame");
    } else if (numClients > 1) {
      socket.emit("fullGame");
      return;
    }

    clientRooms[socket.id] = gameCode;
    socket.join(gameCode);
    socket.number = 2;
    socket.emit("playerNumber", socket.number);
    let totalClients = room ? room.size : 0;
    //socket.broadcast.to(gameCode).emit("total_clients", totalClients);
    io.to(gameCode).emit("total_clients", totalClients);
  });

  socket.on("send_is_bomber", (isBomber, gameRoom) => {
    socket.broadcast.to(gameRoom).emit("receive_bomber", isBomber);
  });
  socket.on("send_bomber_bomb", (bomberBomb, isBomber, gameRoom) => {
    if (isBomber) {
      socket.broadcast.to(gameRoom).emit("receive_bomber_bomb", bomberBomb);
    }
  });

  socket.on("send_escape_pawn", (escapePawn, isBomber, gameRoom) => {
    if (!isBomber) {
      socket.broadcast.to(gameRoom).emit("receive_escape_pawn", escapePawn);
    }
  });
});

server.listen(3001, () => {
  console.log("Server is running");
});
