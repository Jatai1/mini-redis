import net from "node:net";

const server = net.createServer((socket) => {
  console.log("client connected");

  socket.on("data", (data) => {
    console.log(data.toString());
    socket.write(data);
  });
  socket.on("end", () => {
    console.log("client disconnected");
  });
  socket.on("error", (err) => {
    console.error(err);
  });
});
server.on("error", (err) => {
  console.log(err);
});

server.listen(6379, () => {
  console.log("listening on 6379");
});
