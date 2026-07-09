export interface SubjectStat {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  pass_rate: number;
}

export interface StudentRecord {
  [key: string]: string | number;
  _total: number;
}

export interface GradeDistribution {
  green: number;
  yellow: number;
  red: number;
}

export interface Summary {
  totalStudents: number;
  subjectsAnalysed: number;
  gradeDistribution: GradeDistribution;
  subjectStats: Record<string, SubjectStat>;
  topStudents: StudentRecord[];
  weakStudents: StudentRecord[];
}

export interface AttendanceInsight {
  high_attendance_avg_score: number | null;
  low_attendance_avg_score: number | null;
  score_difference: number | null;
  attendance_column: string;
}

export interface SubjectAveragePoint {
  subject: string;
  average: number;
  passRate: number;
}

export interface GradeChartPoint {
  name: string;
  value: number;
  color: string;
}

export interface TopStudentPoint {
  name: string;
  score: number;
}

export interface ChartData {
  subjectAverages: SubjectAveragePoint[];
  gradeDistribution: GradeChartPoint[];
  topStudents: TopStudentPoint[];
}

export interface AnalysisResult {
  success: boolean;
  summary: Summary;
  attendanceInsight: AttendanceInsight | null;
  insights: string[];
  recommendations: string[];
  chartData: ChartData;
  columnsDetected: {
    id: string;
    scores: string[];
    attendance: string | null;
  };
}

export type AppState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: AnalysisResult }
  | { status: "error"; message: string };
