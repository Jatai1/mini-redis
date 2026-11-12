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
