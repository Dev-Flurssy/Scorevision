import { ReactNode } from "react";
import { StudentRecord } from "../types/dataTypes";

interface Props {
  students: StudentRecord[];
  title: string;
  titleIcon?: ReactNode;
  variant: "top" | "weak";
}

function gradeLabel(score: number): { label: string; className: string } {
  if (score >= 75) return { label: "Top", className: "badge badge-green" };
  if (score >= 50) return { label: "Average", className: "badge badge-yellow" };
  return { label: "At Risk", className: "badge badge-red" };
}

export const StudentTable = ({ students, title, titleIcon, variant }: Props) => {
  if (students.length === 0) return null;
  const columns = Object.keys(students[0]).filter((k) => !k.startsWith("_"));

  return (
    <section className={`student-table student-table-${variant}`}>
      <h3 className="student-table-title">
        {titleIcon && (
          <span className="student-table-icon" aria-hidden="true">
            {titleIcon}
          </span>
        )}
        {title}
      </h3>
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col.replace(/_/g, " ").toUpperCase()}</th>
              ))}
              <th>OVERALL</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => {
              const total = student._total as number;
              const { label, className } = gradeLabel(total);
              return (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col}>{String(student[col] ?? "—")}</td>
                  ))}
                  <td>{typeof total === "number" ? total.toFixed(1) : "—"}</td>
                  <td>
                    <span className={className}>{label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
