export function encodeSimpleString(s: string): string {
  if (s.includes("\r") || s.includes("\n"))
    throw new Error("string can not include \\r\\n");
  return `+${s}\r\n`;
}

export function encodeError(s: string): string {
  if (s.includes("\r") || s.includes("\n"))
    throw new Error("string can not include \\r\\n");
  return `-${s}\r\n`;
}

export function encodeInteger(n: number): string {
  if (!Number.isInteger(n)) throw new Error("Not an integer");
  return `:${n}\r\n`;
}

export function encodeBulkString(s: string): string {
  return `$${Buffer.byteLength(s, "utf-8")}\r\n${s}\r\n`;
}

export function encodeNull(): string {
  return "$-1\r\n";
}

export function parseCommand(buf: Buffer): string[] {
  if (buf[0] !== 42) throw new Error("missing * at the start");

  const firstRN = buf.indexOf("\r\n");
  if (firstRN === -1) throw new Error("can not find \\r\\n");

  let pos = 0;

  const n = Number(buf.subarray(pos + 1, firstRN));
  if (!Number.isInteger(n)) throw new Error("Not a valid number");
  pos = firstRN + 2;

  const result: string[] = [];

  for (let i = 0; i < n; i++) {
    if (buf[pos] !== 36) throw new Error("missing $");

    const secondRN = buf.indexOf("\r\n", pos);
    if (secondRN === -1) throw new Error("can not find \\r\\n");

    const len = Number(buf.subarray(pos + 1, secondRN));
    if (!Number.isInteger(len)) throw new Error("not a valid number");

    const start = secondRN + 2;
    const end = start + len;
    //buf.length la total so byte dang co, con end la vi tri cua \r nam ngay sau data, end + 1 la \n, nen end + 2 se cho toan bo length cua ca day string, neu so voi bug.length = nhau thi doan string dung do dai
    if (end + 2 > buf.length) throw new Error("incomplete");
    //13 =r, 10 = n, if nay dang check xem co \r\n o sau data khong
    if (buf[end] !== 13 || buf[end + 1] !== 10)
      throw new Error("missing \\r\\n after data");

    const command = buf.subarray(start, end).toString();
    result.push(command);

    pos = end + 2;
  }

  return result;
}
