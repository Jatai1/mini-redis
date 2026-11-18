import {
  encodeSimpleString,
  encodeError,
  encodeBulkString,
  encodeInteger,
  encodeNull,
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
