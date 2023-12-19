const io = require("socket.io")(3006, {
  cors: {
    origin: "http://192.168.31.155:8080",
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
});

let strikeHasBeenDone = false;
let ajime = false;
let characterAvailable = ["kirby", "knight"];
const characterAssignation = new Map();

function assignCharacter(socket) {
  characterAssignation.set(socket, characterAvailable[0]);
  socket.emit(characterAvailable[0]);
  characterAvailable = characterAvailable.slice(1);
}

function freeCharacter(socket) {
  characterAvailable = [
    ...characterAvailable,
    characterAssignation.get(socket),
  ];
  characterAssignation.delete(socket);
}

function getRandomDelay() {
  return 2 + Math.floor(Math.random() * 4);
}

let gameDelay;

function launchGame() {
  strikeHasBeenDone = false;
  gameDelay = setTimeout(() => {
    ajime = true;
    io.emit("ajime");
  }, getRandomDelay() * 1000);
}

function disconnectAll() {
  for (let socket of characterAssignation.keys()) {
    socket.disconnect();
  }
  characterAssignation.clear();
  characterAvailable = ["kirby", "knight"];
}

io.on("connection", function (socket) {
  const playerNumber = io.engine.clientsCount;

  if (playerNumber > 2) {
    socket.emit("error", { message: "Too many players" });
    socket.disconnect();
    return;
  }

  assignCharacter(socket);

  if (playerNumber === 2) {
    io.emit("ready");
    launchGame();
  }

  socket.on("reconnect", (attemptNumber) => {
    console.log("client reconnect - ", socket.id);
  });

  socket.on("disconnect", () => {
    clearTimeout(gameDelay);
    freeCharacter(socket);
    socket.broadcast.emit("waiting");
  });

  socket.on("ping", () => {
    console.log("ping received", socket.id);
    socket.emit("pong");
  });

  socket.on("strike", () => {
    clearTimeout(gameDelay);
    if (strikeHasBeenDone) {
      return;
    }
    strikeHasBeenDone = true;
    socket.broadcast.emit(ajime ? "striked" : "won");
    socket.emit(ajime ? "won" : "striked");
    ajime = false;
    setTimeout(() => {
      disconnectAll();
    }, 5 * 1000);
  });
});
