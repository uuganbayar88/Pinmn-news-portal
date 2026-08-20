export interface ThreeGateEnv {
  userAgent: string;
  reducedMotion: boolean;
  saveData?: boolean;
  deviceMemory?: number;
  webglSupported: boolean;
}

// In-app webviews (FB/IG/Messenger/Line) are the site's slowest environment
// and a large share of traffic (architecture doc NFR-8) — never load WebGL there.
const IN_APP_BROWSER = /FBAN|FBAV|FB_IAB|FBIOS|Instagram|Messenger|Line\//i;

export function shouldEnableThree(env: ThreeGateEnv): boolean {
  if (env.reducedMotion) return false;
  if (env.saveData) return false;
  if (env.deviceMemory !== undefined && env.deviceMemory < 4) return false;
  if (!env.webglSupported) return false;
  if (IN_APP_BROWSER.test(env.userAgent)) return false;
  return true;
}

interface NetworkInformationLike {
  saveData?: boolean;
}

export function readThreeGateEnv(): ThreeGateEnv {
  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
    deviceMemory?: number;
  };
  let webglSupported = false;
  try {
    const canvas = document.createElement("canvas");
    webglSupported = Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    webglSupported = false;
  }
  return {
    userAgent: nav.userAgent,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: nav.connection?.saveData,
    deviceMemory: nav.deviceMemory,
    webglSupported,
  };
}
