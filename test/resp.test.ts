import {
  encodeSimpleString,
  encodeError,
  encodeBulkString,
  encodeInteger,
  encodeNull,
  parseCommand,
} from "../src/resp.js";

import { describe, it, expect } from "vitest";

describe("encodeSimpleString", () => {
  it("encode simple string", () => {
    expect(encodeSimpleString("OK")).toBe("+OK\r\n");
  });
  it("throws when string contains \\r or \\n", () => {
    expect(() => encodeSimpleString("a\r\nb")).toThrow();
  });
});

describe("encodeError", () => {
  it("encode Error", () => {
    expect(encodeError("ERR unknown command")).toBe("-ERR unknown command\r\n");
  });

  it("throws when string contains \\r or \\n", () => {
    expect(() => encodeError("a\r\nb")).toThrow();
  });
});

describe("encodeInteger", () => {
  it("encodes number", () => {
    expect(encodeInteger(2)).toBe(":2\r\n");
  });
  it("throws when number is not an integer", () => {
    expect(() => encodeInteger(1.5)).toThrow();
  });
});

describe("encodeBulkString", () => {
  it("encodes empty string", () => {
    expect(encodeBulkString("")).toBe("$0\r\n\r\n");
  });

  it("encodes special characters", () => {
    expect(encodeBulkString("hả")).toBe("$4\r\nhả\r\n");
  });

  it("encodes string contains \\r\\n", () => {
    expect(encodeBulkString("a\r\n")).toBe("$3\r\na\r\n\r\n");
  });
});

describe("encodeNull", () => {
  it("encodes null", () => {
    expect(encodeNull()).toBe("$-1\r\n");
  });
});

describe("parseCommand", () => {
  it("parses PING", () => {
    expect(parseCommand(Buffer.from("*1\r\n$4\r\nPING\r\n"))).toEqual(["PING"]);
  });

  it("parses SET a 1", () => {
    expect(
      parseCommand(Buffer.from("*3\r\n$3\r\nSET\r\n$1\r\na\r\n$1\r\n1\r\n")),
    ).toEqual(["SET", "a", "1"]);
  });

  it("parses Việt", () => {
    expect(parseCommand(Buffer.from("*1\r\n$6\r\nViệt\r\n"))).toEqual(["Việt"]);
  });

  it("throws when parses Việt but only counts 4 bytes", () => {
    expect(() => parseCommand(Buffer.from("*1\r\n$4\r\nViệt\r\n"))).toThrow();
  });

  it("throws when missing $", () => {
    expect(() => parseCommand(Buffer.from("*1\r\n4\r\nViệt\r\n"))).toThrow();
  });

  it("throws when parses resp with string as number", () => {
    expect(() => parseCommand(Buffer.from("*abc\r\n"))).toThrow();
  });

  it("throws when bulk length is not a number", () => {
    expect(() => parseCommand(Buffer.from("*1\r\n$x\r\n"))).toThrow();
  });

  it("throws when \\r\\n has not arrived", () => {
    expect(() => parseCommand(Buffer.from("*1"))).toThrow();
  });
});
