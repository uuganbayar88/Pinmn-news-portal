import { describe, expect, it } from "vitest";
import { filterSearch } from "./search";
import type { SearchEntry } from "./types";

const index: SearchEntry[] = [
  { category: "Эдийн засаг", title: "Төв банк бодлогын хүүг хэвээр хадгалав", date: "08.07" },
  { category: "Хот", title: "УБ метроны төслийн явц", date: "08.05" },
];

describe("filterSearch", () => {
  it("returns everything for an empty or whitespace query", () => {
    expect(filterSearch(index, "")).toHaveLength(2);
    expect(filterSearch(index, "   ")).toHaveLength(2);
  });

  it("matches title case-insensitively", () => {
    expect(filterSearch(index, "МЕТРО")).toEqual([index[1]]);
  });

  it("matches category and date", () => {
    expect(filterSearch(index, "эдийн")).toEqual([index[0]]);
    expect(filterSearch(index, "08.05")).toEqual([index[1]]);
  });

  it("returns empty for no match", () => {
    expect(filterSearch(index, "zzz")).toEqual([]);
  });
});
