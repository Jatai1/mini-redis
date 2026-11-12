import { describe, it, expect } from "vitest";
import {
  encodeSimpleString,
  encodeInteger,
  encodeError,
  encodeBulkString,
  encodeNull,
} from "../src/resp.js";

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
