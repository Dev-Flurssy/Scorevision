# ScoreVision

It is an AI powered student performance analytics where a CSV, JSON TXT or Excel file of student scores can be uploaded and instant insights like grade distributions, subject breakdowns, at-risk flags, and plain-English recommendations can be derived.

**Live demo:**

---

## What it does

- Parses CSV, Excel (.xlsx/.xls), JSON, and TXT score files
- Detects student ID and score columns automatically
- Computes per-subject statistics (mean, median, std, pass rate)
- Flags top performers and at-risk students
- Correlates attendance with academic performance
- Generates actionable written recommendations
- Exports the full report as a PDF

---

## Stack

| Layer      | Tech                                 |
| ---------- | ------------------------------------ |
| Frontend   | React 19, TypeScript, Vite, Recharts |
| Backend    | Node.js, Express 5, TypeScript       |
| Analysis   | Python 3, pandas                     |
| Styling    | Plain CSS with CSS variables         |
| PDF export | jsPDF + html2canvas                  |

---

## License

MIT
