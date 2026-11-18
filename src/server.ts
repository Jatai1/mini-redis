import net from "node:net";

const server = net.createServer((socket) => {
  console.log("Server: Client is connected");

  socket.on("data", (data) => {
    console.log(data.toString());
    socket.write(data);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error(err.message);
  });
});

server.listen(6379, () => {
  console.log("Server is listening on port 6379");
});
