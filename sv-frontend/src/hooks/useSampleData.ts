import type { AnalysisResult, AppState } from "../types/dataTypes";
import { API_BASE } from "../config/api";

type SetState = (state: AppState) => void;

export const useSampleData = (setState: SetState) => {
  return async () => {
    setState({ status: "loading" });

    try {
      // 1. Fetch the sample CSV from /public
      const csvRes = await fetch("/sample_students.csv");
      if (!csvRes.ok) {
        setState({
          status: "error",
          message: `Could not load sample file (HTTP ${csvRes.status}). Make sure the dev server is running.`,
        });
        return;
      }

      const blob = await csvRes.blob();
      const file = new File([blob], "sample_students.csv", { type: "text/csv" });

      const formData = new FormData();
      formData.append("file", file);

      // 2. Send to backend
      let res: Response;
      try {
        res = await fetch(`${API_BASE}/api/upload`, { method: "POST", body: formData });
      } catch {
        setState({
          status: "error",
          message: "Cannot reach the backend. Make sure the Node server is running on port 5000.",
        });
        return;
      }

      // 3. Parse response
      let data: AnalysisResult;
      try {
        data = await res.json();
      } catch {
        setState({
          status: "error",
          message: `Backend returned an invalid response (HTTP ${res.status}).`,
        });
        return;
      }

      if (!res.ok || !data.success) {
        const msg =
          (data as unknown as { error?: string }).error ||
          `Analysis failed (HTTP ${res.status}).`;
        setState({ status: "error", message: msg });
        return;
      }

      setState({ status: "success", data });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    }
  };
};
