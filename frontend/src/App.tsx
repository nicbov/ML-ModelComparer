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

  const getModelExplanation = (modelName: string) => {
    switch (modelName) {
      case "Logistic Regression":
        return (
          <p>
            Logistic Regression is a linear model that works well for linearly separable data. 
            If its accuracy is lower than others, it may indicate that the decision boundaries 
            in the data are more complex. Its precision and recall give insight into how well 
            it balances false positives and false negatives.
          </p>
        );
      case "Random Forest":
        return (
          <p>
            Random Forest is an ensemble method that builds multiple decision trees and averages 
            their predictions. High performance here suggests that the model is capturing complex 
            patterns. It's robust to overfitting and often shows strong recall due to its depth.
          </p>
        );
      case "Support Vector Machine":
        return (
          <p>
            Support Vector Machine (SVM) tries to find the optimal boundary between classes. 
            Strong performance indicates well-separated classes. However, lower results might 
            suggest that feature scaling or kernel choice needs tuning.
          </p>
        );
      case "XGBoost":
        return (
          <p>
            XGBoost is a gradient boosting model known for high performance on structured data. 
            If this model performs best, it likely means the dataset benefits from boosting 
            small decision trees iteratively. It’s particularly good at handling noisy data.
          </p>
        );
      default:
        return <p>No explanation available for this model.</p>;
    }
  };

  const MetricExplanation = () => (
    <details
      style={{
        marginTop: "1rem",
        backgroundColor: "#fdfdfd",
        padding: "0.8rem",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "0.9rem",
      }}
    >
      <summary style={{ fontWeight: "bold", cursor: "pointer" }}>
        📘 What do these metrics mean?
      </summary>
      <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem", lineHeight: 1.6 }}>
        <li><strong>Accuracy:</strong> Percentage of total predictions that were correct.</li>
        <li><strong>Precision:</strong> Of the predicted positives, how many were actually positive.</li>
        <li><strong>Recall:</strong> Of all actual positives, how many did we correctly predict.</li>
        <li><strong>F1-Score:</strong> Harmonic mean of precision and recall.</li>
        <li><strong>Support:</strong> Number of true instances for each class.</li>
      </ul>
    </details>
  );

  const ModelSidePanel = ({ title, text }: { title: string; text: string }) => (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        padding: "1rem",
        boxShadow: "0 3px 8px rgba(0,0,0,0.03)",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "#2c3e50" }}>{title}</h3>
      <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.5 }}>{text}</p>
    </div>
  );

  return (
    <div
      style={{
        fontFamily: '"Segoe UI", sans-serif',
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      {/* Top: model descriptions sidebars + center title section */}
      <div style={{ display: "flex", maxWidth: 1300, margin: "0 auto 3rem", width: "100%" }}>
        {/* Left Sidebar */}
        <div style={{ flex: "1", marginRight: "1.5rem" }}>
          <ModelSidePanel
            title="Logistic Regression"
            text="Best for simple, linearly separable data. Interpretable and fast, but may struggle with complex feature interactions."
          />
          <ModelSidePanel
            title="Random Forest"
            text="Averaged decision trees that handle complex patterns well. Tends to generalize better and is resistant to overfitting."
          />
        </div>

        {/* Center Title Section */}
        <div style={{ flex: "2.5" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: "1px solid #e0e0e0",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#333" }}>
              📊 ML Model Comparison
            </h1>
            <p style={{ fontSize: "1.05rem", lineHeight: "1.6", color: "#555" }}>
              Comparing different machine learning models helps us understand how each algorithm handles the 
              dataset. Different models may perform better or worse depending on the complexity, feature interactions, 
              and noise present. By analyzing metrics like accuracy, precision, recall, and F1-score, we can 
              make informed decisions about which model is best suited for the task.
            </p>
          </div>

          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <button
              onClick={fetchModelResults}
              disabled={loading}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "0.7rem 1.5rem",
                fontSize: "1rem",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 2px 6px rgba(0, 123, 255, 0.3)",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
            >
              {loading ? "Calculating..." : "Calculate"}
            </button>
          </div>

          {error && (
            <p style={{ color: "red", textAlign: "center" }}>
              Error: {error}
            </p>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ flex: "1", marginLeft: "1.5rem" }}>
          <ModelSidePanel
            title="Support Vector Machine"
            text="Uses hyperplanes to separate classes in high-dimensional space. Can be very effective with proper kernel and parameter tuning."
          />
          <ModelSidePanel
            title="XGBoost"
            text="Boosted tree model that excels on structured data. Great for noisy or imbalanced datasets, and often wins Kaggle competitions."
          />
        </div>
      </div>

      {/* Results Section - full width 2x2 grid */}
      {results && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "2rem",
            padding: "0 2rem",
            maxWidth: "100vw",
          }}
        >
          {Object.entries(results).map(([modelName, result]) => (
            <div
              key={modelName}
              style={{
                backgroundColor: "white",
                border: "2px solid #888",
                borderRadius: "10px",
                padding: "1.5rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                // keep roughly same width as before but flexible
                width: "100%",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              <h2 style={{ color: "#2c3e50" }}>{modelName}</h2>
              <p style={{ fontSize: "1rem", color: "#444" }}>
                <strong>Accuracy:</strong>{" "}
                <span style={{ color: "#007bff" }}>
                  {(result.accuracy * 100).toFixed(2)}%
                </span>
              </p>

              <h3 style={{ marginTop: "1rem", color: "#333" }}>Classification Report:</h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.95rem",
                  marginTop: "0.5rem",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#e9f0fa" }}>
                    <th style={{ border: "1px solid #ccc", padding: "0.4rem" }}>Class</th>
                    <th style={{ border: "1px solid #ccc", padding: "0.4rem" }}>Precision</th>
                    <th style={{ border: "1px solid #ccc", padding: "0.4rem" }}>Recall</th>
                    <th style={{ border: "1px solid #ccc", padding: "0.4rem" }}>F1-Score</th>
                    <th style={{ border: "1px solid #ccc", padding: "0.4rem" }}>Support</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.report).map(([key, value], index) => {
                    if (typeof value === "number") return null;
                    const bgColor = index % 2 === 0 ? "#fdfdfd" : "#f5f8fb";
                    return (
                      <tr key={key} style={{ backgroundColor: bgColor }}>
                        <td style={{ border: "1px solid #ccc", padding: "0.4rem" }}>{key}</td>
                        <td style={{ border: "1px solid #ccc", padding: "0.4rem" }}>
                          {(value as ModelReport).precision.toFixed(3)}
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "0.4rem" }}>
                          {(value as ModelReport).recall.toFixed(3)}
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "0.4rem" }}>
                          {(value as ModelReport)["f1-score"].toFixed(3)}
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "0.4rem" }}>
                          {(value as ModelReport).support}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <MetricExplanation />

              <details
                style={{
                  marginTop: "1.2rem",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  backgroundColor: "#f1f7fe",
                  padding: "0.8rem",
                  borderRadius: "6px",
                }}
              >
                <summary style={{ fontWeight: "bold", color: "#007bff" }}>
                  What do these results mean for {modelName}?
                </summary>
                <div style={{ marginTop: "0.5rem", color: "#444" }}>
                  {getModelExplanation(modelName)}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
