import net from "node:net";
import { encodeSimpleString, encodeError, parseCommand } from "./resp.js";

const server = net.createServer((socket) => {
  let buffer = Buffer.alloc(0);
  console.log("client connected");

  socket.on("data", (data: Buffer) => {
    buffer = Buffer.concat([buffer, data]);

    while (true) {
      let result;
      try {
        result = parseCommand(buffer);
      } catch {
        socket.end(encodeError("ERR protocol error"));
        return;
      }
      if (result === null) break;

      buffer = buffer.subarray(result.consumed);
      console.log(result.args);
      socket.write(encodeSimpleString("OK"));
    }
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
