"use client";
import { useState, useEffect } from "react";
import {
  Github,
  Send,
  MapPin,
  Cpu,
  Server,
  Database,
  Code2,
  Box,
  Zap,
  GraduationCap,
  Globe,
} from "lucide-react";

interface LanyardSpotify {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
}

interface LanyardData {
  spotify?: LanyardSpotify;
}

function useLanyard(userId: string) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ws: WebSocket;
    let hbInterval: ReturnType<typeof setInterval>;

    function connect() {
      ws = new WebSocket("wss://api.lanyard.rest/socket");

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.op === 1) {
          ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
          hbInterval = setInterval(
            () => ws.send(JSON.stringify({ op: 3 })),
            msg.d.heartbeat_interval
          );
        }
        if (msg.op === 0) {
          setData(msg.d as LanyardData);
          setLoading(false);
        }
      };

      ws.onclose = () => {
        clearInterval(hbInterval);
        setTimeout(connect, 3000);
      };
    }

    connect();
    return () => {
      clearInterval(hbInterval);
      if (ws) ws.close();
    };
  }, [userId]);

  return { data, loading };
}

function Equalizer() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 14 }}>
      {[0, 0.15, 0.3, 0.15, 0.25].map((delay, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 2,
            background: "linear-gradient(to top, #1db954, #1ed760)",
            animation: `eq ${0.7 + i * 0.1}s ease-in-out ${delay}s infinite alternate`,
            height: "100%",
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
}

function Vinyl({ img, size = 56, spinning }: { img?: string; size?: number; spinning: boolean }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div
        className={spinning ? "vinyl-spin" : ""}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: img
            ? `url(${img}) center/cover`
            : "conic-gradient(from 0deg, #1a1a1a 0%, #2a2a2a 20%, #111 40%, #222 60%, #111 80%, #1a1a1a 100%)",
          border: "2px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: "50%",
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        />
      </div>
    </div>
  );
}

function SpotifyCard() {
  const DISCORD_ID = "295136901436932098";
  const { data, loading } = useLanyard(DISCORD_ID);
  const spotify = data?.spotify;
  const isPlaying = !!spotify;

  return (
    <div
      className="card-hover"
      style={{
        gridColumn: "span 1",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        animation: "slideIn 0.5s ease both 0.55s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#1db954">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            color: isPlaying ? "#1db954" : "rgba(255,255,255,0.35)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {loading ? "Connecting…" : isPlaying ? "Now Playing" : "Not Playing"}
        </span>
        {isPlaying && <Equalizer />}
      </div>

      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="spinner" />
        </div>
      ) : isPlaying && spotify ? (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Vinyl img={spotify.album_art_url} size={52} spinning />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {spotify.song}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {spotify.artist}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 10, color: "rgba(255,255,255,0.28)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {spotify.album}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Vinyl spinning={false} size={52} />
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>No track playing</p>
            <p style={{ margin: "3px 0 0", fontSize: 10, color: "rgba(255,255,255,0.18)" }}>
              Silence is golden
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CodeMock() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 12,
        padding: "12px 14px",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 11,
        lineHeight: 1.75,
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#f8f8f2",
      }}
    >
      <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
        {"// worker.go"}
      </div>
      <div>
        <span style={{ color: "#ff79c6" }}>func</span>{" "}
        <span style={{ color: "#50fa7b" }}>ProcessTask</span>
        <span>(</span>
        <span style={{ color: "#ffb86c" }}>ch</span>{" "}
        <span style={{ color: "#8be9fd" }}>&lt;-chan</span>{" "}
        <span>Task</span>
        <span>)</span> {"{"}
      </div>
      <div style={{ paddingLeft: 16 }}>
        <span style={{ color: "#ff79c6" }}>go</span>{" "}
        <span style={{ color: "#ff79c6" }}>func</span>() {"{"}
      </div>
      <div style={{ paddingLeft: 32 }}>
        <span style={{ color: "#ff79c6" }}>for</span>{" "}
        <span>task</span> :={" "}
        <span style={{ color: "#ff79c6" }}>range</span>{" "}
        <span>ch</span> {"{"}
      </div>
      <div style={{ paddingLeft: 48 }}>
        <span style={{ color: "#50fa7b" }}>handle</span>
        <span>(task.ID)</span>
      </div>
      <div style={{ paddingLeft: 32 }}>{"}"}</div>
      <div style={{ paddingLeft: 16 }}>{"}"} ()</div>
      <div>{"}"}</div>
      <div
        style={{
          marginTop: 8,
          padding: "5px 10px",
          background: "rgba(80,250,123,0.13)",
          borderRadius: 6,
          border: "1px solid rgba(80,250,123,0.3)",
          fontSize: 10,
        }}
      >
        <span style={{ color: "#50fa7b" }}>✓</span>{" "}
        <span style={{ color: "#8be9fd" }}>Task</span>{" "}
        <span style={{ color: "#fff", fontWeight: 600 }}>tid_7f3a2</span>{" "}
        <span style={{ color: "rgba(255,255,255,0.75)" }}>queued → non-blocking</span>
      </div>
    </div>
  );
}

function GrpcMock() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 12,
        padding: "12px 14px",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 11,
        lineHeight: 1.75,
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#f8f8f2",
      }}
    >
      <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
        {"// service.proto"}
      </div>
      <div>
        <span style={{ color: "#ff79c6" }}>service</span>{" "}
        <span style={{ color: "#8be9fd" }}>OrderService</span> {"{"}
      </div>
      <div style={{ paddingLeft: 16 }}>
        <span style={{ color: "#50fa7b" }}>rpc</span>{" "}
        <span style={{ color: "#f8f8f2" }}>CreateOrder</span>
      </div>
      <div style={{ paddingLeft: 32 }}>
        <span style={{ color: "#ffb86c" }}>(OrderRequest)</span>
      </div>
      <div style={{ paddingLeft: 32 }}>
        <span style={{ color: "#ff79c6" }}>returns</span>{" "}
        <span style={{ color: "#ffb86c" }}>(OrderResponse)</span>;
      </div>
      <div>{"}"}</div>
      <div style={{ marginTop: 8, display: "flex", gap: 5, flexWrap: "wrap" }}>
        {["protobuf", "gRPC", "TLS"].map((t) => (
          <span
            key={t}
            style={{
              padding: "2px 7px",
              background: "rgba(139,233,253,0.08)",
              border: "1px solid rgba(139,233,253,0.2)",
              borderRadius: 4,
              fontSize: 9.5,
              color: "#8be9fd",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

const skills = [
  { icon: <Cpu size={13} />, label: "Go / Concurrency", color: "#00acd7" },
  { icon: <Zap size={13} />, label: "Goroutines & Channels", color: "#00acd7" },
  { icon: <Server size={13} />, label: "REST APIs", color: "#6cb6ff" },
  { icon: <Server size={13} />, label: "gRPC / Protobuf", color: "#6cb6ff" },
  { icon: <Database size={13} />, label: "PostgreSQL", color: "#336791" },
  { icon: <Database size={13} />, label: "MongoDB", color: "#4db33d" },
  { icon: <Code2 size={13} />, label: "JavaScript", color: "#f7df1e" },
  { icon: <Code2 size={13} />, label: "HTML / CSS", color: "#e44d26" },
  { icon: <Box size={13} />, label: "Docker", color: "#2496ed" },
  { icon: <Server size={13} />, label: "Microservices", color: "#9b59b6" },
  { icon: <Cpu size={13} />, label: "Worker Pools", color: "#00acd7" },
  { icon: <Globe size={13} />, label: "Gin / Echo", color: "#1db954" },
];

export default function Portfolio() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const tz = time
    ? time.toLocaleTimeString("en-KZ", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Almaty",
      })
    : "--:--:--";

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes eq {
          from { transform: scaleY(0.15); }
          to   { transform: scaleY(1); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          100% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
        }
        .vinyl-spin { animation: spinSlow 4s linear infinite; }
        .spinner {
          width: 20px; height: 20px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: #1db954;
          border-radius: 50%;
          animation: spinSlow 0.8s linear infinite;
        }
        .card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .card-hover:hover {
          transform: scale(1.013);
          border-color: rgba(255,255,255,0.18) !important;
          box-shadow: 0 0 28px rgba(99,179,255,0.08), 0 8px 32px rgba(0,0,0,0.55);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.75);
          transition: all 0.2s ease;
          cursor: default;
        }
        .badge:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(99,179,255,0.4);
        }
        .online-dot {
          position: absolute;
          bottom: 1px; right: 1px;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #060608;
          animation: pulseRing 2s ease-out infinite;
        }
        @media (max-width: 900px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .col-4 { grid-column: span 2 !important; }
          .hero  { grid-row: span 1 !important; }
        }
        @media (max-width: 560px) {
          .bento-grid { grid-template-columns: 1fr !important; }
          .col-1, .col-2, .col-4, .hero {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#060608",
          padding: "32px 20px 60px",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
          <div
            className="bento-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}
          >
            {/* HERO */}
            <div
              className="card-hover hero"
              style={{
                gridColumn: "span 2",
                gridRow: "span 2",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 340,
                animation: "slideIn 0.5s ease both 0.04s",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        width: 52, height: 52, borderRadius: "50%",
                        background: "linear-gradient(135deg, #1a3a5c, #0d2035)",
                        border: "2px solid rgba(99,179,255,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 19, fontWeight: 700, color: "#63b3ff",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      MT
                    </div>
                    <div className="online-dot" />
                  </div>
                  <div>
                    <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>
                      Marsel Tazhibayev
                    </h1>
                    <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "rgba(255,255,255,0.38)", fontFamily: "'JetBrains Mono', monospace" }}>
                      @biwbarmak
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "5px 12px", borderRadius: 20,
                    background: "rgba(99,179,255,0.08)", border: "1px solid rgba(99,179,255,0.2)",
                    marginBottom: 16,
                  }}
                >
                  <Cpu size={12} color="#63b3ff" />
                  <span style={{ fontSize: 12, color: "#63b3ff", fontWeight: 500 }}>
                    Backend-focused Developer · Go / Fullstack
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.58)", maxWidth: 380 }}>
                  Experienced in Go concurrency and designing scalable backend architectures for
                  high-load tasks. Building robust, production-ready systems with clean abstractions.
                </p>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, color: "rgba(255,255,255,0.32)", fontSize: 12 }}>
                  <MapPin size={12} />
                  <span>Astana, Kazakhstan</span>
                  <span style={{ marginLeft: 10, fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.18)", fontSize: 11 }}>
                    {tz}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a
                    href="https://github.com/PinUpDeveloper"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 14px", borderRadius: 10,
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 500,
                    }}
                  >
                    <Github size={14} /> GitHub
                  </a>
                  <a
                    href="https://t.me/biwbarmak"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 14px", borderRadius: 10,
                      background: "rgba(41,182,246,0.08)", border: "1px solid rgba(41,182,246,0.2)",
                      color: "#29b6f6", textDecoration: "none", fontSize: 13, fontWeight: 500,
                    }}
                  >
                    <Send size={14} /> Telegram
                  </a>
                </div>
              </div>
            </div>

            {/* CAPCODE */}
            <div
              className="card-hover col-2"
              style={{
                gridColumn: "span 2",
                background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20,
                padding: 22, display: "flex", flexDirection: "column", gap: 14,
                animation: "slideIn 0.5s ease both 0.14s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                    <Zap size={13} color="#f9a825" />
                    <span style={{ fontSize: 10.5, color: "#f9a825", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Project
                    </span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#fff" }}>Capcode</h2>
                </div>
                <span style={{ fontSize: 10.5, padding: "3px 9px", borderRadius: 6, background: "rgba(80,250,123,0.08)", border: "1px solid rgba(80,250,123,0.2)", color: "#50fa7b" }}>
                  Active
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Server-Worker", "Goroutines", "Channels", "Non-blocking"].map((t) => (
                  <span key={t} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, background: "rgba(0,172,215,0.08)", border: "1px solid rgba(0,172,215,0.2)", color: "#00acd7" }}>
                    {t}
                  </span>
                ))}
              </div>
              <CodeMock />
            </div>

            {/* gRPC */}
            <div
              className="card-hover col-2"
              style={{
                gridColumn: "span 2",
                background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20,
                padding: 22, display: "flex", flexDirection: "column", gap: 14,
                animation: "slideIn 0.5s ease both 0.24s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                    <Server size={13} color="#8be9fd" />
                    <span style={{ fontSize: 10.5, color: "#8be9fd", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Project
                    </span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#fff" }}>ap2_a1</h2>
                </div>
                <span style={{ fontSize: 10.5, padding: "3px 9px", borderRadius: 6, background: "rgba(139,233,253,0.08)", border: "1px solid rgba(139,233,253,0.2)", color: "#8be9fd" }}>
                  Microservices
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["gRPC", "Protocol Buffers", "Modular", "Service Mesh"].map((t) => (
                  <span key={t} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, background: "rgba(255,184,108,0.08)", border: "1px solid rgba(255,184,108,0.2)", color: "#ffb86c" }}>
                    {t}
                  </span>
                ))}
              </div>
              <GrpcMock />
            </div>

            {/* SKILLS */}
            <div
              className="card-hover col-4"
              style={{
                gridColumn: "span 4",
                background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20,
                padding: 22, animation: "slideIn 0.5s ease both 0.34s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}>
                <Code2 size={13} color="rgba(255,255,255,0.4)" />
                <h2 style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.09em", textTransform: "uppercase" }}>
                  Stack &amp; Skills
                </h2>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {skills.map(({ icon, label, color }) => (
                  <span key={label} className="badge">
                    <span style={{ color }}>{icon}</span>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* EDUCATION */}
            <div
              className="card-hover col-2"
              style={{
                gridColumn: "span 2",
                background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(99,179,255,0.1)", borderRadius: 20,
                padding: 22, display: "flex", flexDirection: "column", gap: 12,
                animation: "slideIn 0.5s ease both 0.44s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <GraduationCap size={13} color="rgba(255,255,255,0.4)" />
                <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                  Education
                </span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>
                  Astana IT University
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.48)" }}>
                  B.Sc. Software Engineering
                </p>
              </div>
              <div>
                <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ width: "66.6%", height: "100%", background: "linear-gradient(to right, #63b3ff, #9b59b6)", borderRadius: 2 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.26)" }}>
                  <span>2024</span>
                  <span>Trimester 6 of 9</span>
                  <span>2027</span>
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
                Year 3 · Currently enrolled
              </div>
            </div>

            {/* STATUS */}
            <div
              className="card-hover col-1"
              style={{
                gridColumn: "span 1",
                background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(34,197,94,0.14)", borderRadius: 20,
                padding: 22, display: "flex", flexDirection: "column", gap: 10,
                justifyContent: "center", animation: "slideIn 0.5s ease both 0.5s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "blink 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 10.5, color: "#22c55e", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Open to Work
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                Available for backend roles, collaborations, and open source.
              </p>
              <div style={{ padding: "6px 9px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)", fontSize: 10.5, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>
                English: B2 Intermediate
              </div>
            </div>

            {/* SPOTIFY */}
            <SpotifyCard />
          </div>

          <p style={{ textAlign: "center", marginTop: 40, fontSize: 10.5, color: "rgba(255,255,255,0.13)", fontFamily: "'JetBrains Mono', monospace" }}>
            © 2026 Marsel Tazhibayev
          </p>
        </div>
      </div>
    </>
  );
}
