import { describe, expect, it } from "vitest";
import { shouldEnableThree, type ThreeGateEnv } from "./three-gate";

const capable: ThreeGateEnv = {
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36",
  reducedMotion: false,
  saveData: false,
  deviceMemory: 8,
  webglSupported: true,
};

describe("shouldEnableThree", () => {
  it("enables on a capable desktop browser", () => {
    expect(shouldEnableThree(capable)).toBe(true);
  });

  it("disables for Facebook and Instagram in-app browsers", () => {
    expect(shouldEnableThree({ ...capable, userAgent: capable.userAgent + " [FBAN/FBIOS;FBAV/400.0]" })).toBe(false);
    expect(shouldEnableThree({ ...capable, userAgent: capable.userAgent + " FB_IAB/FB4A" })).toBe(false);
    expect(shouldEnableThree({ ...capable, userAgent: capable.userAgent + " Instagram 300.0" })).toBe(false);
  });

  it("respects prefers-reduced-motion", () => {
    expect(shouldEnableThree({ ...capable, reducedMotion: true })).toBe(false);
  });

  it("respects Save-Data and low device memory", () => {
    expect(shouldEnableThree({ ...capable, saveData: true })).toBe(false);
    expect(shouldEnableThree({ ...capable, deviceMemory: 2 })).toBe(false);
  });

  it("requires WebGL support, but tolerates unknown device memory", () => {
    expect(shouldEnableThree({ ...capable, webglSupported: false })).toBe(false);
    expect(shouldEnableThree({ ...capable, deviceMemory: undefined })).toBe(true);
  });
});
