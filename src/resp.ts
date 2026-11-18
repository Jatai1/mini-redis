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
