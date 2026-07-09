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

interface Props {
  chartData: ChartData;
}

export const Chart = ({ chartData }: Props) => {
  const { subjectAverages, gradeDistribution, topStudents } = chartData;

  return (
    <div className="charts">
      <section className="chart-card">
        <h3 className="chart-card_title">Average Score by Subject</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={subjectAverages}
            margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="subject"
              tick={{ fontSize: 12, fill: "var(--text)" }}
              angle={-30}
              textAnchor="end"
              interval={0}
            ></XAxis>
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "var(--text)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            />
            <Legend verticalAlign="top" />
            <Bar
              dataKey="average"
              name="Avg Score"
              fill="var(--accent)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="passRate"
              name="Pass Rate %"
              fill="var(--accent-muted)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>
      <section className="chart-card">
        <h3 className="chart-card_title">Grade Distribution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={gradeDistribution}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {gradeDistribution.map((entry, index) => (
                <Cell key={index} fill={entry.color}></Cell>
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>
      {topStudents.length > 0 && (
        <section className="chart-card chart-card--wide">
          <h3 className="chart-card__title">Top Performers</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={topStudents}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "var(--text)" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--text)" }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
              <Bar
                dataKey="score"
                name="Avg Score"
                fill="#22c55e"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}
    </div>
  );
};
