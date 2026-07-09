import { AnalysisResult } from "../types/dataTypes";
import { StudentTable } from "./StudentTable";
import { Chart } from "./Chart";
import { InsightCard } from "./InsightCard";
import { FaTrophy, FaTriangleExclamation, FaRotateLeft, FaFilePdf } from "react-icons/fa6";
import { useExportPDF } from "../hooks/useExportPDF";

interface Props {
  data: AnalysisResult;
  onReset: () => void;
}

export const Dashboard = ({ data, onReset }: Props) => {
  const { summary, insights, recommendations, chartData, attendanceInsight } =
    data;
  const { gradeDistribution, totalStudents, subjectAnalysed } = summary;
  const { exportPDF, exporting } = useExportPDF(data);

  return (
    <main className="dashboard" id="dashboard-export-root">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Analysis Complete</h2>
          <p className="dashboard-sub">
            {totalStudents} students · {subjectAnalysed} subject
            {subjectAnalysed !== 1 ? "s" : ""}
          </p>
          <button className="btn btn-ghost" onClick={onReset}>
            <FaRotateLeft aria-hidden="true" />
            Upload Another File
          </button>
        </div>
        <button
          className="btn btn-export"
          onClick={exportPDF}
          disabled={exporting}
          aria-label="Export report as PDF"
        >
          <FaFilePdf aria-hidden="true" />
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card-value">{totalStudents}</span>
          <span className="stat-card-label">Total Students</span>
        </div>
        <div className="stat-card stat-card-green">
          <span className="stat-card-value">{gradeDistribution.green}</span>
          <span className="stat-card-label">Top Performers</span>
        </div>
        <div className="stat-card stat-card-yellow">
          <span className="stat-card-value">{gradeDistribution.yellow}</span>
          <span className="stat-card-label">Average</span>
        </div>
        <div className="stat-card stat-card-red">
          <span className="stat-card-value">{gradeDistribution.red}</span>
          <span className="stat-card-label">At Risk</span>
        </div>
        {attendanceInsight?.difference != null && (
          <div className="stat-card stat-card-blue">
            <span className="stat-card-value">
              {attendanceInsight.difference.toFixed(1)}
            </span>
            <span className="stat-card-label">High vs Low Attendance Gap</span>
          </div>
        )}
      </div>

      <Chart chartData={chartData} />

      <div className="insight-grid">
        <InsightCard
          title="Key Insights"
          items={insights}
          variant="insight"
        />
        <InsightCard
          title="Recommendations"
          items={recommendations}
          variant="recommendation"
        />
      </div>

      <div className="tables">
        <StudentTable
          students={summary.topStudents}
          title="Top Performers"
          titleIcon={<FaTrophy />}
          variant="top"
        />
        <StudentTable
          students={summary.weakStudents}
          title="Students Needing Support"
          titleIcon={<FaTriangleExclamation />}
          variant="weak"
        />
      </div>
    </main>
  );
};
