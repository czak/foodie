// @vitest-environment happy-dom

import { describe, test, expect, vi, afterEach } from "vitest";
import { loadData, saveData, removeData } from "./index";

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("loadData", () => {
  test("returns stored value when key exists", () => {
    const testKey = "test-key";
    const testValue = "test-value";
    localStorage.setItem(testKey, testValue);

    const result = loadData(testKey);

    expect(result).toBe(testValue);
  });

  test("returns null when key does not exist", () => {
    const result = loadData("non-existent-key");

    expect(result).toBeNull();
  });

  test("returns null when localStorage throws error", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("localStorage error");
      },
    });

    const result = loadData("any-key");

    expect(result).toBeNull();
  });

  test("returns empty strings verbatim", () => {
    localStorage.setItem("empty-key", "");

    const result = loadData("empty-key");

    expect(result).toBe("");
  });
});

describe("saveData", () => {
  test("saves data to localStorage", () => {
    const key = "save-test";
    const value = "saved value";

    saveData(key, value);

    expect(localStorage.getItem(key)).toBe(value);
  });

  test("handles localStorage errors gracefully", () => {
    vi.stubGlobal("localStorage", {
      setItem: () => {
        throw new Error("localStorage error");
      },
    });

    expect(() => saveData("test-key", "test-value")).not.toThrow();
  });
});

describe("removeData", () => {
  test("removes data from localStorage", () => {
    localStorage.setItem("remove-test", "value");

    removeData("remove-test");

    expect(localStorage.getItem("remove-test")).toBeNull();
  });

  test("handles localStorage errors gracefully", () => {
    vi.stubGlobal("localStorage", {
      removeItem: () => {
        throw new Error("localStorage error");
      },
    });

    expect(() => removeData("test-key")).not.toThrow();
  });
});
