import "./App.css";
import { UploadFile } from "./components/UploadFile";
import { Dashboard } from "./components/Dashboard";
import { DashboardSkeleton } from "./components/DashboardSkeleton";

import { useState } from "react";
import { AppState } from "./types/dataTypes";
import { Features, Stacks, FaBolt } from "./data/landingData";
import { useSampleData } from "./hooks/useSampleData";

function App() {
  const [state, setState] = useState<AppState>({ status: "idle" });
  const handleSampleData = useSampleData(setState);

  return (
    <div className="app">
      {state.status === "idle" && (
        <>
          <section className="hero">
            <div className="hero-badge">AI-Powered · Python · React</div>
            <h1 className="hero-title">
              Turn Scores Into
              <br />
              <span className="hero-accent">Actionable Insights</span>
            </h1>
            <p className="hero-sub">
              Upload a CSV or Excel file of student scores. Our engine cleans
              the data, detects patterns, flags at-risk students, and generates
              plain-English recommendations, in seconds.
            </p>
            <div className="hero-actions">
              <UploadFile
                onloading={() => setState({ status: "loading" })}
                onSuccess={(data) => setState({ status: "success", data })}
                onError={(message) => setState({ status: "error", message })}
              />
              <div className="hero-divider">
                <span>or</span>
              </div>
              <button className="btn btn-sample" onClick={handleSampleData}>
                <FaBolt aria-hidden="true" /> Try with sample data — no file
                needed
              </button>
            </div>
          </section>

          <section className="features">
            <h2 className="features-title">What you get</h2>
            <div className="features-grid">
              {Features.map((f) => (
                <div key={f.title} className="feature-card">
                  <span className="feature-card-icon" aria-hidden="true">
                    {f.icon}
                  </span>
                  <h3 className="feature-card-title">{f.title}</h3>
                  <p className="feature-card-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="stack">
            <h2 className="stack-title">Built with</h2>
            <div className="stack-pills">
              {Stacks.map((t) => (
                <span key={t} className="stack-pill">
                  {t}
                </span>
              ))}
            </div>
          </section>
        </>
      )}

      {state.status === "loading" && <DashboardSkeleton />}

      {state.status === "error" && (
        <div className="error-banner">
          <p>{state.message}</p>
          <button className="btn btn-ghost" onClick={() => setState({ status: "idle" })}>
            Try Again
          </button>
        </div>
      )}

      {state.status === "success" && (
        <Dashboard
          data={state.data}
          onReset={() => setState({ status: "idle" })}
        />
      )}
    </div>
  );
}

export default App;
