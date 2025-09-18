// src/components/labs/TheoryView.jsx
import { useState, useEffect } from "react";
import { API_BASE } from "../api";

export default function TheoryView({ experimentId, onBack }) {
  const [theoryData, setTheoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!experimentId) return;

    fetch(`${API_BASE}/api/theory/${experimentId}`)
      .then((res) => res.json())
      .then((data) => {
        const normalized = {
          ...data,
          materials_required: Array.isArray(data.materials_required)
            ? data.materials_required
            : typeof data.materials_required === "string"
            ? data.materials_required
                .split(/\r?\n|,/)
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
          procedure: Array.isArray(data.procedure)
            ? data.procedure
            : typeof data.procedure === "string"
            ? data.procedure.trim()
            : [],
        };
        setTheoryData(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading theory:", err);
        setLoading(false);
      });
  }, [experimentId]);

  if (loading) return <div>Loading theory...</div>;
  if (!theoryData?.success) return <div>❌ Theory not found</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-10">
      <button
        onClick={onBack}
        className="mb-6 self-start bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        ⬅ Back
      </button>

      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        {theoryData.title}
      </h1>

      <div className="max-w-3xl text-gray-800 space-y-6">
        {/* Theory */}
        <section>
          <h2 className="text-xl font-semibold mb-2">📖 Theory</h2>
          <p>{theoryData.theory}</p>
        </section>

        {/* Materials */}
        <section>
          <h2 className="text-xl font-semibold mb-2">🧪 Materials Required</h2>
          <ul className="list-disc list-inside">
            {theoryData.materials_required.map((m, idx) => (
              <li key={idx}>{m}</li>
            ))}
          </ul>
        </section>

        {/* Procedure */}
        <section>
          <h2 className="text-xl font-semibold mb-2">⚙️ Procedure</h2>
          {Array.isArray(theoryData.procedure) ? (
            <ol className="list-decimal list-inside">
              {theoryData.procedure.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          ) : (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: theoryData.procedure }}
            />
          )}
        </section>
      </div>
    </div>
  );
}
