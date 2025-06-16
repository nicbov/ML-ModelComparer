import React, { useState } from "react";

type ModelReport = {
  precision: number;
  recall: number;
  "f1-score": number;
  support: number;
};

type ModelResults = {
  accuracy: number;
  report: Record<string, ModelReport | number>;
};

const App: React.FC = () => {
  const [results, setResults] = useState<Record<string, ModelResults> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModelResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/models");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Record<string, ModelResults> = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "2rem auto", padding: "1rem" }}>
      <h1 style={{ textAlign: "center" }}>ML Model Comparison</h1>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          onClick={fetchModelResults}
          disabled={loading}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "0.6rem 1.2rem",
            fontSize: "1rem",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </div>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>
          Error: {error}
        </p>
      )}

      {results && (
        <div>
          {Object.entries(results).map(([modelName, result]) => (
            <div
              key={modelName}
              style={{
                marginBottom: "2rem",
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "1rem",
                boxShadow: "2px 2px 8px #eee",
              }}
            >
              <h2>{modelName}</h2>
              <p><strong>Accuracy:</strong> {(result.accuracy * 100).toFixed(2)}%</p>

              <h3>Classification Report:</h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.9rem",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th style={{ border: "1px solid #ccc", padding: "0.3rem" }}>Class</th>
                    <th style={{ border: "1px solid #ccc", padding: "0.3rem" }}>Precision</th>
                    <th style={{ border: "1px solid #ccc", padding: "0.3rem" }}>Recall</th>
                    <th style={{ border: "1px solid #ccc", padding: "0.3rem" }}>F1-Score</th>
                    <th style={{ border: "1px solid #ccc", padding: "0.3rem" }}>Support</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.report).map(([key, value]) => {
                    if (typeof value === "number") return null; // skip overall accuracy keys inside report
                    return (
                      <tr key={key}>
                        <td style={{ border: "1px solid #ccc", padding: "0.3rem" }}>{key}</td>
                        <td style={{ border: "1px solid #ccc", padding: "0.3rem" }}>{(value as ModelReport).precision.toFixed(3)}</td>
                        <td style={{ border: "1px solid #ccc", padding: "0.3rem" }}>{(value as ModelReport).recall.toFixed(3)}</td>
                        <td style={{ border: "1px solid #ccc", padding: "0.3rem" }}>{(value as ModelReport)["f1-score"].toFixed(3)}</td>
                        <td style={{ border: "1px solid #ccc", padding: "0.3rem" }}>{(value as ModelReport).support}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
