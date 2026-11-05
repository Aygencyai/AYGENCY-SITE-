import { Check, X, type LucideIcon } from "lucide-react";

// The before and after drawing Louis chose: a person tangled across their tools (before), then each
// tool running straight into one home, with the person clear-headed on one clean line (now).

export type PanelRow = { icon: LucideIcon; title: string; text: string };

export type BeforeAfterContent = {
  tools: string[];
  beforeLabel: string;
  nowLabel: string;
  panelTitle: string;
  panelRows: PanelRow[];
};

// Same numbers every render, so the tangle never shifts between server and browser.
const rnd = (a: number, b: number) => {
  const v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return v - Math.floor(v);
};
const n = (value: number) => value.toFixed(1);

// A side-on head and shoulders facing right, drawn in a 100 x 100 box.
const headLine =
  "M2 104C8 94 24 92 31 86V80C17 71 10 58 10 44C10 19 29 4 52 4C75 4 89 21 89 39C89 45 95 53 97 58C98 61 93 62 91 63V72C91 79 85 82 78 81L68 80V86C74 92 90 94 98 104";
const headShape = `${headLine}Z`;

function TangledHead({ x, y, size, id }: { x: number; y: number; size: number; id: string }) {
  const scale = size / 100;
  const scribble = Array.from({ length: 34 }, (_, i) => {
    const p = (k: number) => rnd(i + 1, k);
    return `M${n(8 + p(1) * 84)} ${n(4 + p(2) * 72)}C${n(p(3) * 100)} ${n(p(4) * 80)} ${n(p(5) * 100)} ${n(p(6) * 80)} ${n(8 + p(7) * 84)} ${n(4 + p(8) * 72)}`;
  });
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${scale})`}>
      <defs>
        <clipPath id={id}>
          <path d={headShape} />
        </clipPath>
      </defs>
      <path d={headShape} fill="#0A0A0F" />
      <g clipPath={`url(#${id})`} fill="none" stroke="#EAEAF0" strokeOpacity="0.42" strokeWidth={1 / scale}>
        {scribble.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path d={headLine} fill="none" stroke="#EAEAF0" strokeOpacity="0.6" strokeWidth={1.25 / scale} />
    </g>
  );
}

function Mark({ kind, x, y, width, height }: { kind: "before" | "now"; x: number; y: number; width: number; height: number }) {
  const before = kind === "before";
  return (
    <span
      aria-hidden
      style={{ left: `${(x / width) * 100}%`, top: `${(y / height) * 100}%` }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border-2 bg-surface ${before ? "border-error text-error" : "border-cyan text-cyan shadow-glow-sm"}`}
    >
      {before ? <X className="w-5 h-5" strokeWidth={2.5} /> : <Check className="w-5 h-5" strokeWidth={2.5} />}
    </span>
  );
}

function Verdict({ kind, children }: { kind: "before" | "now"; children: string }) {
  const before = kind === "before";
  return (
    <p className={`flex items-center gap-2.5 font-heading text-lg font-medium leading-snug ${before ? "text-ghost-muted" : "text-white"}`}>
      <span aria-hidden className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${before ? "bg-error/15 text-error" : "bg-cyan/15 text-cyan"}`}>
        {before ? <X className="w-3.5 h-3.5" strokeWidth={3} /> : <Check className="w-3.5 h-3.5" strokeWidth={3} />}
      </span>
      {children}
    </p>
  );
}

function Panel({ title, rows, tall = false }: { title: string; rows: PanelRow[]; tall?: boolean }) {
  return (
    <div className={`rounded-xl border border-cyan/50 bg-void p-5 shadow-glow-sm ${tall ? "h-full flex flex-col justify-center" : ""}`}>
      <div className="flex items-center gap-2 mb-3">
        <svg viewBox="190 220 663 600" fill="currentColor" aria-hidden className="w-4 text-cyan">
          <path d="M487 242H638L367 797H213Z" />
          <path d="M583 592H715L830 797H693Z" />
        </svg>
        <span className="font-heading text-lg font-semibold text-white">{title}</span>
      </div>
      <ul>
        {rows.map(({ icon: Icon, title: rowTitle, text }) => (
          <li key={rowTitle} className="grid grid-cols-[26px_1fr] items-start border-t border-ghost/10 py-2.5">
            <Icon className="w-[18px] h-[18px] text-cyan mt-0.5" strokeWidth={1.5} />
            <span>
              <span className="block font-sans text-[15px] font-medium leading-snug text-ghost">{rowTitle}</span>
              <span className="block font-sans text-[13px] leading-snug text-ghost-muted mt-0.5">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DesktopDrawing({ content }: { content: BeforeAfterContent }) {
  const { tools } = content;
  const chipWidth = 132;
  const W = 1088;
  const H = 590;
  const top = 130;
  const y = (i: number) => top + (i * (H - top - 16)) / (tools.length - 1);
  const headX = 92;
  const headY = (top + H - 16) / 2;
  const chipX = 400;
  const panelX = 730;
  return (
    <div className="hidden lg:block relative mt-10" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" fill="none" aria-hidden>
        <defs>
          <linearGradient id="now-lines" gradientUnits="userSpaceOnUse" x1={chipX + chipWidth} y1="0" x2={panelX} y2="0">
            <stop offset="0" stopColor="#00E5FF" stopOpacity="0.45" />
            <stop offset="1" stopColor="#00E5FF" />
          </linearGradient>
        </defs>
        {tools.flatMap((_, i) =>
          [0, 1, 2, 3].map((k) => {
            const key = i * 4 + k + 3;
            const startY = headY + (rnd(i, k + 9) - 0.5) * 80;
            const span = chipX - headX - 30;
            return (
              <path
                key={key}
                d={`M${headX + 30} ${n(startY)}C${n(headX + 30 + span * (0.2 + rnd(key, 1) * 0.4))} ${n(rnd(key, 2) * H)} ${n(headX + 30 + span * (0.45 + rnd(key, 3) * 0.4))} ${n(rnd(key, 4) * H)} ${chipX} ${n(y(i))}`}
                stroke="#FF4D6A"
                strokeOpacity="0.3"
              />
            );
          }),
        )}
        {tools.map((_, i) => (
          <path key={i} d={`M${chipX + chipWidth} ${n(y(i))}H${panelX}`} stroke="url(#now-lines)" />
        ))}
        <TangledHead x={headX} y={headY} size={170} id="tangled-head" />
        <path d={`M${panelX + 58} 74V${top - 12}`} stroke="#00E5FF" strokeWidth="2" />
        <g transform={`translate(${panelX + 22} 0) scale(0.72)`}>
          <path d={headShape} fill="#0A0A0F" />
          <path d={headLine} stroke="#00E5FF" strokeWidth={1.6} />
        </g>
      </svg>
      {tools.map((tool, i) => (
        <span
          key={tool}
          style={{ left: `${(chipX / W) * 100}%`, top: `${(y(i) / H) * 100}%`, width: `${(chipWidth / W) * 100}%` }}
          className="absolute -translate-y-1/2 whitespace-nowrap rounded-full border border-ghost/20 bg-surface py-1 text-center font-sans text-[13px] text-ghost"
        >
          {tool}
        </span>
      ))}
      <div className="absolute left-0 top-0" style={{ width: `${(chipX / W) * 100}%` }}>
        <Verdict kind="before">{content.beforeLabel}</Verdict>
      </div>
      <div className="absolute top-0" style={{ left: `${((chipX + chipWidth + 14) / W) * 100}%`, width: `${((panelX - chipX - chipWidth + 10) / W) * 100}%` }}>
        <Verdict kind="now">{content.nowLabel}</Verdict>
      </div>
      <Mark kind="before" x={258} y={headY} width={W} height={H} />
      <Mark kind="now" x={(chipX + chipWidth + panelX) / 2} y={(y(5) + y(6)) / 2} width={W} height={H} />
      <div className="absolute right-0 bottom-0" style={{ left: `${(panelX / W) * 100}%`, top: `${((top - 14) / H) * 100}%` }}>
        <Panel title={content.panelTitle} rows={content.panelRows} tall />
      </div>
    </div>
  );
}

// Phone: its own composition, running downwards, with the clear-headed person under the card.
function PhoneDrawing({ content }: { content: BeforeAfterContent }) {
  const tools = content.tools.slice(0, 8);
  return (
    <div className="lg:hidden mt-8">
      <Verdict kind="before">{content.beforeLabel}</Verdict>
      <div className="relative mt-4">
        <svg viewBox="0 0 320 250" className="w-full h-auto" fill="none" aria-hidden>
          {Array.from({ length: 26 }, (_, i) => (
            <path
              key={i}
              d={`M${n(130 + rnd(i, 5) * 60)} 110C${n(rnd(i, 1) * 320)} ${n(130 + rnd(i, 2) * 50)} ${n(rnd(i, 3) * 320)} ${n(160 + rnd(i, 4) * 50)} ${16 + (i % 9) * 36} 250`}
              stroke="#FF4D6A"
              strokeOpacity="0.38"
            />
          ))}
          <TangledHead x={160} y={62} size={120} id="tangled-head-phone" />
        </svg>
        <Mark kind="before" x={160} y={190} width={320} height={250} />
      </div>
      <ul className="flex flex-wrap justify-center gap-2">
        {tools.map((tool) => (
          <li key={tool} className="rounded-full border border-ghost/20 bg-surface px-3 py-1 font-sans text-[13px] text-ghost">
            {tool}
          </li>
        ))}
      </ul>
      <div className="mt-7">
        <Verdict kind="now">{content.nowLabel}</Verdict>
      </div>
      <div className="relative">
        <svg viewBox="0 0 320 64" className="w-full h-16" fill="none" aria-hidden>
          <defs>
            <linearGradient id="now-lines-phone" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="64">
              <stop offset="0" stopColor="#00E5FF" stopOpacity="0.3" />
              <stop offset="1" stopColor="#00E5FF" />
            </linearGradient>
          </defs>
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M${n(34 + i * 36)} 0V64`} stroke="url(#now-lines-phone)" />
          ))}
        </svg>
        <Mark kind="now" x={160} y={32} width={320} height={64} />
      </div>
      <Panel title={content.panelTitle} rows={content.panelRows} />
      <svg viewBox="0 0 120 120" className="mx-auto w-24 h-24" fill="none" aria-hidden>
        <path d="M60 0V36" stroke="#00E5FF" strokeWidth="2" />
        <g transform="translate(24 36) scale(0.72)">
          <path d={headShape} fill="#0A0A0F" />
          <path d={headLine} stroke="#00E5FF" strokeWidth={1.6} />
        </g>
      </svg>
    </div>
  );
}

export default function BeforeAfterDrawing({ content }: { content: BeforeAfterContent }) {
  return (
    <>
      <DesktopDrawing content={content} />
      <PhoneDrawing content={content} />
    </>
  );
}
