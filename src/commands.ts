import * as store from "./store.js";

export function handleSet(args: string[]): string {
  const [key, value] = args;
  if (key === undefined || value === undefined) {
    return "-ERR wrong number of arguments for 'set' command\r\n";
  }
  store.set(key, value);
  return "+OK\r\n";
}

export function handleGet(args: string[]): string {
  if (args.length !== 1) {
    return "-ERR wrong number of arguments for 'set' command\r\n";
  }
  const v = store.get(key);
  return v === undefined ? "$-1\r\n" : `$${v.length}\r\n${v}\r\n`;
}

export function handleDel(args: string[]): string {
  let count = 0;
  for (const key of args) {
    if (store.del(key)) count++;
  }
  return `:${count}\r\n`;
}

export function handleEcho(args: string[]): string {
  const [msg] = args;
  if (msg === undefined) {
    return "-ERR wrong number of arguments for 'echo' command\r\n";
  }
  return `$${msg.length}\r\n${msg}\r\n`;
}

export function handleCommand(args: string[]): string {
  const [name, ...rest] = args;
  switch (name?.toUpperCase()) {
    case "PING":
      return "+PONG\r\n";
    case "ECHO":
      return handleEcho(rest);
    case "SET":
      return handleSet(rest);
    case "GET":
      return handleGet(rest);
    case "DEL":
      return handleDel(rest);
    default:
      return "-ERR unknown command\r\n";
  }
}
