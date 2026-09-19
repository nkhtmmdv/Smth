export function PaperPreview({ lines }: { lines: string[] }) {
  return (
    <div className="paper-mock h-full min-h-[320px] rounded-xl border border-ink-200 bg-white p-6 font-mono text-[13px] leading-7 text-ink-700 shadow-inner">
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre">
          {line || " "}
        </div>
      ))}
    </div>
  );
}
