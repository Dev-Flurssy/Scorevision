# ScoreVision

AI-powered student performance analytics. Upload a CSV or Excel file of student scores and get instant insights — grade distributions, subject breakdowns, at-risk flags, and plain-English recommendations.

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

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, Recharts |
| Backend | Node.js, Express 5, TypeScript |
| Analysis | Python 3, pandas |
| Styling | Plain CSS with CSS variables |
| PDF export | jsPDF + html2canvas |

---

## Project structure

```
Scorevision/
├── sv-frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Dashboard, Chart, StudentTable, InsightCard, etc.
│   │   ├── hooks/        # useSampleData, useExportPDF, useTheme
│   │   ├── layouts/      # Header, Footer
│   │   ├── types/        # TypeScript interfaces
│   │   └── config/       # api.ts — central API base URL
│   └── public/
│       └── sample_students.csv
└── sv-backend/           # Express API + Python analysis
    ├── src/
    │   ├── server.ts
    │   ├── routes/
    │   └── controllers/
    └── analysis/         # Python scripts
        ├── analyze.py    # Entry point
        ├── loader.py     # File parsing + column detection
        ├── statistics.py # Stats computation
        ├── insights.py   # Insight + recommendation generation
        └── charts.py     # Chart data builder
```

---

## Local development

### Prerequisites

- Node.js 18+
- Python 3.10+ with `pandas` and `openpyxl` installed
- A Python virtual environment is recommended

### 1. Install Python dependencies

```bash
pip install pandas openpyxl
```

### 2. Start the backend

```bash
cd sv-backend
npm install
npm run dev       
```

If your Python executable is not on the system PATH, set the path in `sv-backend/.env`:

```env
PYTHON_PATH=C:/path/to/your/python.exe
FRONTEND_URL=http://localhost:5173
```

### 3. Start the frontend

```bash
cd sv-frontend
npm install
npm run dev        # runs on http://localhost:5173
```

The Vite dev server proxies `/api/*` to `localhost:5000` automatically — no extra config needed locally.

---

## Deployment

### Backend → Railway

1. Push the repo to GitHub.
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub.
3. Set the **Root Directory** to `sv-backend`.
4. Add a `nixpacks.toml` in `sv-backend/` to install Python:

```toml
[phases.setup]
nixPkgs = ["python311", "python311Packages.pip"]

[phases.install]
cmds = ["npm install", "pip install pandas openpyxl"]
```

5. Add environment variables in the Railway dashboard:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | your Vercel frontend URL (add after deploying frontend) |

6. Railway will give you a URL like `https://sv-backend-production.up.railway.app`. Copy it.

---

### Frontend → Vercel

1. In the Vercel dashboard → New Project → Import from GitHub.
2. Set **Root Directory** to `sv-frontend`.
3. Framework preset: **Vite** (auto-detected).
4. Add this environment variable:

| Key | Value |
|---|---|
| `VITE_API_URL` | your Railway backend URL (e.g. `https://sv-backend-production.up.railway.app`) |

5. Deploy. Vercel runs `npm run build` and serves `dist/` automatically.
6. Copy your Vercel URL and paste it back into the Railway `FRONTEND_URL` env var.

---

## Sample data

A sample CSV is included at `sv-frontend/public/sample_students.csv` with 20 students across 5 subjects. Use the "Try with sample data" button to test without uploading a file.

### Expected CSV format

```csv
student_name,mathematics,english,science,history,attendance
Alice Johnson,82,75,90,88,95
Bob Smith,45,60,50,55,72
...
```

- One text column for student names/IDs (auto-detected)
- Any number of numeric score columns (auto-detected)
- An optional `attendance` column for correlation analysis

---

## Environment variables reference

### sv-backend/.env

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
PYTHON_PATH=                        # optional — defaults to system python
```

### sv-frontend/.env.production

```env
VITE_API_URL=https://your-backend.up.railway.app
```

In development, `VITE_API_URL` is left empty and the Vite proxy handles routing.

---

## License

MIT
