import { ChartData } from "../types/dataTypes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

interface Props {
  chartData: ChartData;
}


function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

const tooltipStyle = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
};

export const Chart = ({ chartData }: Props) => {
  const { subjectAverages, gradeDistribution, topStudents } = chartData;
  const width = useWindowWidth();

  const isMobile = width < 600;
  const isTablet = width < 768;
  const isDesktop = width >= 1024;

  // Pie sizing
  const pieOuter = isMobile ? 70 : isTablet ? 85 : isDesktop ? 130 : 110;
  const pieInner = isMobile ? 35 : isTablet ? 42 : isDesktop ? 65 : 55;
  const pieHeight = isMobile ? 220 : isDesktop ? 340 : 280;

  // Bar chart height
  const barHeight = isMobile ? 240 : isDesktop ? 340 : 280;

  // Top performers bar: shrink name column on mobile
  const nameColWidth = isMobile ? 80 : isDesktop ? 130 : 110;
  const topBarHeight = isMobile
    ? Math.max(160, topStudents.length * 36)
    : Math.max(220, topStudents.length * 44);

  return (
    <div className="charts">
     
      <section className="chart-card">
        <h3 className="chart-card-title">Average Score by Subject</h3>
        <ResponsiveContainer width="100%" height={barHeight}>
          <BarChart
            data={subjectAverages}
            margin={{ top: 10, right: 16, left: isMobile ? -10 : 0, bottom: isMobile ? 48 : 44 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="subject"
              tick={{ fontSize: isMobile ? 10 : 12, fill: "var(--text)" }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: isMobile ? 10 : 12, fill: "var(--text)" }}
              width={isMobile ? 28 : 36}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: isMobile ? "0.75rem" : "0.85rem" }} />
            <Bar dataKey="average" name="Avg Score" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="passRate" name="Pass Rate %" fill="var(--green-light)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

    
      <section className="chart-card">
        <h3 className="chart-card-title">Grade Distribution</h3>
        <ResponsiveContainer width="100%" height={pieHeight}>
          <PieChart>
            <Pie
              data={gradeDistribution}
              cx="50%"
              cy={isDesktop ? "48%" : "45%"}
              outerRadius={pieOuter}
              innerRadius={pieInner}
              dataKey="value"
              nameKey="name"
              label={isMobile
                ? false
                : ({ name, percent }) => `${(name ?? "").split(" ")[0]}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={!isMobile}
            >
              {gradeDistribution.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: isMobile ? "0.75rem" : "0.85rem" }} />
          </PieChart>
        </ResponsiveContainer>
      </section>

      
      {topStudents.length > 0 && (
        <section className="chart-card chart-card-wide">
          <h3 className="chart-card-title">Top Performers</h3>
          <ResponsiveContainer width="100%" height={topBarHeight}>
            <BarChart
              data={topStudents}
              layout="vertical"
              margin={{ top: 5, right: 20, left: isMobile ? 4 : 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: isMobile ? 10 : 12, fill: "var(--text)" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: isMobile ? 10 : 12, fill: "var(--text)" }}
                width={nameColWidth}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="score" name="Avg Score" fill="var(--green-light)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}
    </div>
  );
};
