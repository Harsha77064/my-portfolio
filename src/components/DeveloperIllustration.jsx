/**
 * Animated cartoon developer at a laptop.
 * variant="typing": both hands type.  variant="waving": right hand waves hello.
 * All motion is plain CSS and stops for visitors who prefer reduced motion.
 */

const SKIN = "#7a4a2a";
const SKIN_SHADE = "#663d22";
const HAIR = "#1a1310";
const SHIRT = "#2a2f45";

const CODE_LINES = [
  { x: 14, w: 46, color: "#a78bfa" },
  { x: 24, w: 62, color: "#38bdf8" },
  { x: 24, w: 38, color: "#f472b6" },
  { x: 34, w: 54, color: "#34d399" },
  { x: 24, w: 30, color: "#38bdf8" },
  { x: 14, w: 22, color: "#a78bfa" },
];

const styles = `
.devsvg .blink { transform-box: fill-box; transform-origin: center; animation: devsvg-blink 4.5s infinite; }
@keyframes devsvg-blink { 0%, 93%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }

.devsvg .type-l { animation: devsvg-type 0.32s ease-in-out infinite alternate; }
.devsvg .type-r { animation: devsvg-type 0.32s ease-in-out infinite alternate-reverse; }
@keyframes devsvg-type { from { transform: translateY(0); } to { transform: translateY(-5px); } }

.devsvg .float { animation: devsvg-float 4s ease-in-out infinite; }
.devsvg .float-slow { animation: devsvg-float 5.5s ease-in-out infinite; }
@keyframes devsvg-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

.devsvg .code-line { transform-box: fill-box; transform-origin: left center; animation: devsvg-line 7s infinite both; }
@keyframes devsvg-line {
  0% { transform: scaleX(0); }
  10%, 82% { transform: scaleX(1); }
  92%, 100% { transform: scaleX(0); }
}

.devsvg .cursor { animation: devsvg-cursor 1s steps(1) infinite; }
@keyframes devsvg-cursor { 50% { opacity: 0; } }

.devsvg .steam { animation: devsvg-steam 2.6s ease-in-out infinite; }
@keyframes devsvg-steam {
  0% { opacity: 0; transform: translateY(4px); }
  50% { opacity: 0.8; }
  100% { opacity: 0; transform: translateY(-12px); }
}

.devsvg .pulse { animation: devsvg-pulse 2.2s ease-in-out infinite; }
@keyframes devsvg-pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }

.devsvg .wave { transform-box: view-box; transform-origin: 252px 238px; animation: devsvg-wave 0.9s ease-in-out infinite alternate; }
@keyframes devsvg-wave { from { transform: rotate(-6deg); } to { transform: rotate(16deg); } }

@media (prefers-reduced-motion: reduce) {
  .devsvg * { animation: none !important; }
}
`;

function Arm({ side }) {
  // Sleeve from the shoulder down to a hand resting at the side of the laptop
  const s = side === "left" ? 1 : -1;
  const shoulderX = 200 - s * 52;
  const handX = 200 - s * 78;
  return (
    <g className={side === "left" ? "type-l" : "type-r"}>
      <path
        d={`M${shoulderX} 236 Q${shoulderX - s * 10} 258 ${handX} 274`}
        stroke={SHIRT}
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx={handX} cy="278" rx="11" ry="9" fill={SKIN} />
    </g>
  );
}

function WavingArm() {
  return (
    <g className="wave">
      <path d="M252 238 Q282 218 290 180" stroke={SHIRT} strokeWidth="18" strokeLinecap="round" fill="none" />
      {/* open hand */}
      <g fill={SKIN}>
        <ellipse cx="292" cy="166" rx="12" ry="13" />
        <rect x="282" y="146" width="5" height="14" rx="2.5" />
        <rect x="288" y="143" width="5" height="16" rx="2.5" />
        <rect x="294" y="144" width="5" height="15" rx="2.5" />
        <rect x="300" y="149" width="5" height="12" rx="2.5" />
        <rect x="278" y="160" width="12" height="5" rx="2.5" transform="rotate(-35 284 162)" />
      </g>
    </g>
  );
}

export default function DeveloperIllustration({ variant = "typing", className = "", title }) {
  const waving = variant === "waving";

  return (
    <svg
      viewBox="0 0 400 340"
      className={`devsvg ${className}`}
      role="img"
      aria-label={title || "Cartoon of a developer coding on a laptop"}
    >
      <style>{styles}</style>

      {/* Floating code window */}
      <g transform="translate(268 40)">
        <g className="float">
          <rect width="118" height="96" rx="12" fill="#0f0a1f" stroke="#8b5cf6" strokeWidth="2" />
          <circle cx="14" cy="13" r="3.5" fill="#f87171" />
          <circle cx="25" cy="13" r="3.5" fill="#fbbf24" />
          <circle cx="36" cy="13" r="3.5" fill="#34d399" />
          {CODE_LINES.map((l, i) => (
            <rect
              key={i}
              className="code-line"
              x={l.x}
              y={28 + i * 10}
              width={l.w}
              height="5"
              rx="2.5"
              fill={l.color}
              style={{ animationDelay: `${i * 0.45}s` }}
            />
          ))}
          <rect className="cursor" x="40" y="86" width="2.5" height="7" fill="#e9d5ff" />
        </g>
      </g>

      {/* Floating badges */}
      <g transform="translate(22 70)">
        <g className="float-slow">
          <rect width="64" height="40" rx="12" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="2" />
          <text x="32" y="27" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="18" fontWeight="700" fill="#c4b5fd">
            {"{ }"}
          </text>
        </g>
      </g>
      <g transform="translate(320 168)">
        <g className="float" style={{ animationDelay: "-2s" }}>
          <rect width="56" height="38" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="28" y="25" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="16" fontWeight="800" fill="#7dd3fc">
            AI
          </text>
        </g>
      </g>
      <g transform="translate(30 168)">
        <g className="float" style={{ animationDelay: "-1s" }}>
          <rect width="50" height="34" rx="10" fill="#052e16" stroke="#34d399" strokeWidth="2" />
          <text x="25" y="23" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="14" fontWeight="700" fill="#6ee7b7">
            .py
          </text>
        </g>
      </g>

      {/* Body */}
      <path d="M128 300 C128 246 150 222 200 222 C250 222 272 246 272 300 Z" fill={SHIRT} />
      <rect x="188" y="194" width="24" height="32" rx="8" fill={SKIN_SHADE} />

      {/* Head */}
      <circle cx="157" cy="166" r="9" fill={SKIN_SHADE} />
      <circle cx="243" cy="166" r="9" fill={SKIN_SHADE} />
      <ellipse cx="200" cy="160" rx="42" ry="48" fill={SKIN} />

      {/* Hair */}
      <g fill={HAIR}>
        <path d="M158 160 C150 118 176 98 204 100 C232 100 252 118 244 160 C240 140 228 128 200 128 C174 128 162 140 158 160 Z" />
        <circle cx="166" cy="124" r="17" />
        <circle cx="184" cy="108" r="20" />
        <circle cx="208" cy="104" r="21" />
        <circle cx="230" cy="114" r="19" />
        <circle cx="244" cy="132" r="14" />
        <circle cx="157" cy="142" r="12" />
      </g>

      {/* Eyebrows */}
      <path d="M176 146 Q185 141 193 146" stroke={HAIR} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M207 146 Q215 141 224 146" stroke={HAIR} strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <g className="blink">
        <ellipse cx="185" cy="160" rx="4.5" ry="5.5" fill={HAIR} />
        <ellipse cx="215" cy="160" rx="4.5" ry="5.5" fill={HAIR} />
      </g>
      <circle cx="186.5" cy="158" r="1.4" fill="#fff" />
      <circle cx="216.5" cy="158" r="1.4" fill="#fff" />

      {/* Nose, beard, moustache, smile */}
      <path d="M200 164 Q204 176 198 178" stroke={SKIN_SHADE} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path
        d="M160 170 Q164 208 200 212 Q236 208 240 170 Q232 196 200 199 Q168 196 160 170 Z"
        fill={HAIR}
        opacity="0.92"
      />
      <path d="M186 186 Q200 179 214 186 Q200 191 186 186 Z" fill={HAIR} />
      <path d="M192 193 Q200 198 208 193" stroke="#f5d0c5" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Arms (behind the laptop) */}
      <Arm side="left" />
      {waving ? <WavingArm /> : <Arm side="right" />}

      {/* Desk */}
      <rect x="40" y="296" width="320" height="14" rx="7" fill="#4c1d95" />
      <rect x="60" y="310" width="280" height="6" rx="3" fill="#2e1065" />

      {/* Coffee mug with steam */}
      <g transform="translate(76 262)">
        <path className="steam" d="M10 -6 q-5 -8 0 -16" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path className="steam" style={{ animationDelay: "-1.3s" }} d="M20 -6 q5 -8 0 -16" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <rect width="30" height="34" rx="6" fill="#f472b6" />
        <path d="M30 9 q12 0 12 9 q0 9 -12 9" stroke="#f472b6" strokeWidth="5" fill="none" />
      </g>

      {/* Laptop (back of the lid faces us) */}
      <path d="M138 218 L262 218 Q268 218 268 224 L268 288 L132 288 L132 224 Q132 218 138 218 Z" fill="#d1d5db" />
      <path d="M138 218 L262 218 Q268 218 268 224 L268 230 L132 230 L132 224 Q132 218 138 218 Z" fill="#e5e7eb" />
      <text
        className="pulse"
        x="200"
        y="262"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="22"
        fontWeight="800"
        fill="#8b5cf6"
      >
        {"</>"}
      </text>
      <rect x="116" y="286" width="168" height="10" rx="4" fill="#9ca3af" />
    </svg>
  );
}
