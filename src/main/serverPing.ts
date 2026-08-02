import net from "net";

// Minecraft server list ping (SLP) client.
// Implements the modern JSON status protocol from wiki.vg. Sends a handshake
// with protocol version -1 (any) followed by a Status Request, then reads
// the JSON blob the server hands back.
//
// This is the same call the vanilla multiplayer screen uses to fill in the
// motd, player count, and favicon for each entry.

export type ServerStatus = {
  ok: true;
  latencyMs: number;
  motd: string;                 // stripped of § color codes
  version: string;
  players: { online: number; max: number };
  favicon: string | null;       // data URL if present
};

export type PingResult = ServerStatus | { ok: false; error: string };

export function pingServer(host: string, port = 25565, timeoutMs = 5000): Promise<PingResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    let done = false;
    const finish = (result: PingResult) => { if (done) return; done = true; try { sock.destroy(); } catch {} resolve(result); };

    const sock = net.connect({ host, port, family: 4 });
    const to = setTimeout(() => finish({ ok: false, error: "Timed out" }), timeoutMs);

    let buf = Buffer.alloc(0);

    sock.on("error", (e) => { clearTimeout(to); finish({ ok: false, error: shortError(e.message) }); });
    sock.on("connect", () => {
      const handshake = buildHandshake(host, port);
      sock.write(prefix(handshake));
      const request = Buffer.from([0x00]);
      sock.write(prefix(request));
    });
    sock.on("data", (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      const parsed = tryParseStatus(buf);
      if (!parsed) return;
      clearTimeout(to);
      try {
        const json = JSON.parse(parsed);
        finish({
          ok: true,
          latencyMs: Date.now() - start,
          motd: extractMotd(json.description),
          version: (json.version && json.version.name) || "unknown",
          players: { online: (json.players && json.players.online) || 0, max: (json.players && json.players.max) || 0 },
          favicon: typeof json.favicon === "string" ? json.favicon : null,
        });
      } catch {
        finish({ ok: false, error: "Bad server response" });
      }
    });
    sock.on("close", () => { if (!done) finish({ ok: false, error: "Connection closed" }); });
  });
}

function shortError(msg: string): string {
  if (msg.includes("ENOTFOUND")) return "Host not found";
  if (msg.includes("ECONNREFUSED")) return "Refused";
  if (msg.includes("ETIMEDOUT")) return "Timed out";
  if (msg.includes("EAI_AGAIN")) return "DNS unreachable";
  return msg.split("\n")[0];
}

function extractMotd(desc: any): string {
  if (!desc) return "";
  if (typeof desc === "string") return stripColorCodes(desc);
  let out = "";
  const walk = (n: any) => {
    if (!n) return;
    if (typeof n === "string") out += n;
    else if (typeof n.text === "string") out += n.text;
    if (Array.isArray(n.extra)) n.extra.forEach(walk);
  };
  walk(desc);
  return stripColorCodes(out);
}

function stripColorCodes(s: string): string {
  return s.replace(/[§Â][0-9a-fk-or]/gi, "").trim();
}

function buildHandshake(host: string, port: number): Buffer {
  const hostBytes = Buffer.from(host, "utf8");
  return Buffer.concat([
    Buffer.from([0x00]),                    // packet id
    writeVarInt(-1),                         // protocol version (any)
    writeVarInt(hostBytes.length), hostBytes,
    Buffer.from([(port >> 8) & 0xff, port & 0xff]),
    writeVarInt(1),                          // next state: status
  ]);
}

function prefix(payload: Buffer): Buffer {
  return Buffer.concat([writeVarInt(payload.length), payload]);
}

function writeVarInt(value: number): Buffer {
  const bytes: number[] = [];
  let v = value >>> 0;
  while (true) {
    if ((v & ~0x7f) === 0) { bytes.push(v); return Buffer.from(bytes); }
    bytes.push((v & 0x7f) | 0x80);
    v >>>= 7;
  }
}

function readVarInt(buf: Buffer, offset: number): { value: number; size: number } | null {
  let value = 0, size = 0, shift = 0;
  while (true) {
    if (offset + size >= buf.length) return null;
    const b = buf[offset + size];
    size++;
    value |= (b & 0x7f) << shift;
    if ((b & 0x80) === 0) return { value, size };
    shift += 7;
    if (shift >= 35) return null;
  }
}

function tryParseStatus(buf: Buffer): string | null {
  const outer = readVarInt(buf, 0);
  if (!outer) return null;
  const totalLen = outer.value;
  const start = outer.size;
  if (buf.length < start + totalLen) return null;
  const packetId = readVarInt(buf, start);
  if (!packetId || packetId.value !== 0x00) return null;
  const strLen = readVarInt(buf, start + packetId.size);
  if (!strLen) return null;
  const jsonStart = start + packetId.size + strLen.size;
  if (buf.length < jsonStart + strLen.value) return null;
  return buf.slice(jsonStart, jsonStart + strLen.value).toString("utf8");
}
