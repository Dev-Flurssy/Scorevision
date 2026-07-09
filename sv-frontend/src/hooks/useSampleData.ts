import type { AnalysisResult, AppState } from "../types/dataTypes";

type SetState = (state: AppState) => void;

export const useSampleData = (setState: SetState) => {
  return async () => {
    setState({ status: "loading" });
    try {
      const blob = await fetch("/sample_students.csv").then((r) => r.blob());
      const file = new File([blob], "sample_students.csv", {
        type: "text/csv",
      });
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data: AnalysisResult = await res.json();

      if (data.success) {
        setState({ status: "success", data });
      } else {
        setState({ status: "error", message: "Sample data analysis failed." });
      }
    } catch {
      setState({ status: "error", message: "Failed to load sample data." });
    }
  };
};
