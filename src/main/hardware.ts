import os from "os";
import { execFile } from "child_process";

export type Hardware = {
  cpu: string;
  cores: number;
  ramGb: number;
  gpu: string;
};

export type Recommendation = {
  memoryMb: number;
  renderer: "vulkan" | "sodium";
  reason: string;
  optimizedFlags: boolean;
};

export type ScanResult = Hardware & { recommend: Recommendation };

// Aikar's flags, the well known G1GC tuning that smooths Minecraft frame times.
export const AIKAR_FLAGS = [
  "-XX:+UseG1GC",
  "-XX:+ParallelRefProcEnabled",
  "-XX:MaxGCPauseMillis=200",
  "-XX:+UnlockExperimentalVMOptions",
  "-XX:+DisableExplicitGC",
  "-XX:+AlwaysPreTouch",
  "-XX:G1NewSizePercent=30",
  "-XX:G1MaxNewSizePercent=40",
  "-XX:G1HeapRegionSize=8M",
  "-XX:G1ReservePercent=20",
  "-XX:G1HeapWastePercent=5",
  "-XX:G1MixedGCCountTarget=4",
  "-XX:InitiatingHeapOccupancyPercent=15",
  "-XX:G1MixedGCLiveThresholdPercent=90",
  "-XX:G1RSetUpdatingPauseTimePercent=5",
  "-XX:SurvivorRatio=32",
  "-XX:+PerfDisableSharedMem",
  "-XX:MaxTenuringThreshold=1",
];

export async function scanHardware(): Promise<ScanResult> {
  const cpus = os.cpus();
  const cpu = (cpus[0]?.model || "Unknown CPU").replace(/\s+/g, " ").trim();
  const cores = cpus.length;
  const ramGb = Math.max(1, Math.round(os.totalmem() / 1024 ** 3));
  const gpu = await detectGpu();
  return { cpu, cores, ramGb, gpu, recommend: recommend(ramGb, gpu) };
}

function detectGpu(): Promise<string> {
  return new Promise((resolve) => {
    try {
      execFile(
        "powershell",
        ["-NoProfile", "-Command", "Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name"],
        { timeout: 6000, windowsHide: true },
        (err, stdout) => {
          if (err || !stdout) return resolve("Unknown GPU");
          const names = stdout.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
          const dedicated = names.find((n) => /nvidia|geforce|rtx|gtx|radeon|\bamd\b/i.test(n));
          resolve(dedicated || names[0] || "Unknown GPU");
        }
      );
    } catch {
      resolve("Unknown GPU");
    }
  });
}

function recommend(ramGb: number, gpu: string): Recommendation {
  // Give the JVM about half the system RAM, clamped. Beyond 8 GB rarely helps a
  // Fabric client and just makes GC pauses longer.
  let mem = Math.round(ramGb / 2) * 1024;
  mem = Math.max(2048, Math.min(8192, mem));
  if (ramGb <= 4) mem = 2048;

  // Sodium is the reliable FPS boost on every GPU. VulkanMod is left as an
  // opt-in experiment in the Mods tab.
  const reason = `${gpu} detected. Sodium is the most reliable FPS boost and works on this GPU. Recommended ${(mem / 1024).toFixed(0)} GB RAM.`;
  return { memoryMb: mem, renderer: "sodium", reason, optimizedFlags: true };
}
