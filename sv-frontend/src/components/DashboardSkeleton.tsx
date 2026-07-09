import { useEffect, useState } from "react";

const STEPS = [
  "Uploading file…",
  "Parsing data…",
  "Running analysis…",
  "Generating insights…",
  "Almost done…",
];

/** Cycles through step messages to give the user progress feedback */
function useLoadingSteps(intervalMs = 1800) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return STEPS[step];
}


const Shimmer = ({
  width = "100%",
  height = 16,
  radius = 6,
  style,
}: {
  width?: string | number;
  height?: number;
  radius?: number;
  style?: React.CSSProperties;
}) => (
  <div
    className="skeleton-shimmer"
    style={{ width, height, borderRadius: radius, ...style }}
    aria-hidden="true"
  />
);


const StatCardSkeleton = () => (
  <div className="stat-card skeleton-card">
    <Shimmer width={52} height={36} radius={8} />
    <Shimmer width="65%" height={12} radius={4} />
  </div>
);


const ChartCardSkeleton = ({ wide = false }: { wide?: boolean }) => (
  <section className={`chart-card${wide ? " chart-card-wide" : ""} skeleton-card`}>
    <Shimmer width="45%" height={16} radius={6} style={{ marginBottom: 20 }} />
    <Shimmer width="100%" height={wide ? 220 : 280} radius={10} />
  </section>
);


const InsightCardSkeleton = () => (
  <div className="insight-card skeleton-card">
    <Shimmer width="55%" height={16} radius={6} style={{ marginBottom: 20 }} />
    {[90, 75, 85, 70, 80].map((w, i) => (
      <Shimmer key={i} width={`${w}%`} height={12} radius={4} style={{ marginBottom: 12 }} />
    ))}
  </div>
);


const TableSkeleton = () => (
  <section className="student-table skeleton-card">
    <Shimmer width="50%" height={16} radius={6} style={{ marginBottom: 20 }} />
    {/* header row */}
    <div className="skeleton-table-row skeleton-table-header">
      {[30, 20, 20, 20].map((w, i) => (
        <Shimmer key={i} width={`${w}%`} height={10} radius={3} />
      ))}
    </div>
  
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="skeleton-table-row">
        {[30, 20, 20, 20].map((w, j) => (
          <Shimmer key={j} width={`${w}%`} height={12} radius={3} />
        ))}
      </div>
    ))}
  </section>
);


export const DashboardSkeleton = () => {
  const label = useLoadingSteps();

  return (
    <main className="dashboard" aria-busy="true" aria-label="Loading analysis">
      {/* status banner */}
      <div className="skeleton-status" role="status" aria-live="polite">
        <span className="skeleton-spinner" aria-hidden="true" />
        <span className="skeleton-status-text">{label}</span>
      </div>

      {/* header */}
      <div className="dashboard-header">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Shimmer width={200} height={28} radius={8} />
          <Shimmer width={140} height={14} radius={4} />
        </div>
        <Shimmer width={120} height={38} radius={10} />
      </div>

     
      <div className="stat-grid">
        {Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>

     
      <div className="charts">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
        <ChartCardSkeleton wide />
      </div>

      
      <div className="insight-grid">
        <InsightCardSkeleton />
        <InsightCardSkeleton />
      </div>

     
      <div className="tables">
        <TableSkeleton />
        <TableSkeleton />
      </div>
    </main>
  );
};
