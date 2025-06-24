import { describe, it, expect } from "vitest";

describe("array join", () => {
  it("should join array into greeting", () => {
    const words = ["Hello", "world!"];
    expect(words.join(", ")).toBe("Hello, world!");
  });
});
