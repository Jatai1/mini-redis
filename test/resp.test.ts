import { describe, it, expect } from "vitest";
import {
  encodeSimpleString,
  encodeInteger,
  encodeError,
  encodeBulkString,
  encodeNull,
  parseCommand,
} from "../src/resp.js";
import { parse } from "node:path";

describe("encodeSimpleString", () => {
  it("encodes OK", () => {
    expect(encodeSimpleString("OK")).toBe("+OK\r\n");
  });

  it("throws when text contains a newline", () => {
    expect(() => encodeSimpleString("hello\r\nworld")).toThrow();
  });
});

describe("encodeInteger", () => {
  it("encodes 5", () => {
    expect(encodeInteger(5)).toBe(":5\r\n");
  });

  it("throws when num contains not an integer", () => {
    expect(() => encodeInteger(3.5)).toThrow();
  });
});

describe("encodeError", () => {
  it("encodes ERR bad", () => {
    expect(encodeError("ERR bad")).toBe("-ERR bad\r\n");
  });
  it("throws when string contains \\n", () => {
    expect(() => encodeError("\n")).toThrow();
  });

  it("throws when string contains \\r", () => {
    expect(() => encodeError("\r")).toThrow();
  });
});

describe("encodeBulkString", () => {
  it("encodes hi", () => {
    expect(encodeBulkString("hi")).toBe("$2\r\nhi\r\n");
  });

  it('encodes ""', () => {
    expect(encodeBulkString("")).toBe("$0\r\n\r\n");
  });
  it("encodes Việt", () => {
    expect(encodeBulkString("Việt")).toBe("$6\r\nViệt\r\n");
  });
});

describe("encodeNull", () => {
  it("encodes null", () => {
    expect(encodeNull()).toBe("$-1\r\n");
  });
  it("encodes empty string and compares with null", () => {
    expect(encodeNull()).not.toBe("$0\r\n\r\n");
  });
});

describe("parseCommand", () => {
  it("parses PING", () => {
    expect(parseCommand(Buffer.from("*1\r\n$4\r\nPING\r\n"))).toEqual({
      args: ["PING"],
      consumed: 14,
    });
  });

  it("parses SET a 1", () => {
    expect(
      parseCommand(Buffer.from("*3\r\n$3\r\nSET\r\n$1\r\na\r\n$1\r\n1\r\n")),
    ).toEqual({ args: ["SET", "a", "1"], consumed: 27 });
  });

  it("parses Việt", () => {
    expect(parseCommand(Buffer.from("*1\r\n$6\r\nViệt\r\n"))).toEqual({
      args: ["Việt"],
      consumed: 16,
    });
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
    expect(() => parseCommand(Buffer.from("*1\r\n$x"))).toThrow();
  });

  it("throws when parses without \\r\\n", () => {
    expect(() => parseCommand(Buffer.from("*1"))).toThrow();
  });
});
