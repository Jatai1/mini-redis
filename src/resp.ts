export function encodeSimpleString(text: string): string {
  if (text.includes(`\r`) || text.includes(`\n`)) {
    throw new Error("simple string can not contain \\r or \\n");
  }
  return `+${text}\r\n`;
}

export function encodeError(text: string): string {
  if (text.includes("\r") || text.includes("\n")) {
    throw new Error(" string can not contain \\r or \\n");
  }
  return `-${text}\r\n`;
}

export function encodeInteger(num: number): string {
  if (!Number.isInteger(num)) {
    throw new Error("integer has to be whole number");
  }
  return `:${num}\r\n`;
}

export function encodeBulkString(text: string): string {
  const byteLength = Buffer.byteLength(text, "utf-8");
  return `$${byteLength}\r\n${text}\r\n`;
}

export function encodeNull(): string {
  return `$-1\r\n`;
}

export function parseCommand(
  buf: Buffer,
): { args: string[]; consumed: number } | null {
  const result: string[] = [];

  if (buf.length === 0) return null;

  if (buf[0] !== "*".charCodeAt(0)) {
    throw new Error("missing *");
  }

  let pos = 0;

  const lenEnd = buf.indexOf("\r\n", pos);
  if (lenEnd === -1) return null;

  const count = Number(buf.toString("utf-8", pos + 1, lenEnd));
  if (!Number.isInteger(count) || count < 0)
    throw new Error("number has to be an integer and not negative");

  pos = lenEnd + 2;

  for (let i = 0; i < count; i++) {
    if (pos >= buf.length) return null;
    if (buf[pos] !== "$".charCodeAt(0)) {
      throw new Error("missing $");
    }

    const lenEnd1 = buf.indexOf("\r\n", pos);
    if (lenEnd1 === -1) return null;

    const len = Number(buf.toString("utf-8", pos + 1, lenEnd1));
    if (!Number.isInteger(len) || len < 0)
      throw new Error("number has to be an integer and not negative");

    pos = lenEnd1 + 2;

    if (buf.length < pos + len + 2) return null;

    result.push(buf.toString("utf-8", pos, pos + len));
    if (buf.toString("utf-8", pos + len, pos + len + 2) !== "\r\n") {
      throw new Error("bulk string not ends with \\r\\n");
    }

    pos += len + 2;
  }

  return { args: result, consumed: pos };
}
