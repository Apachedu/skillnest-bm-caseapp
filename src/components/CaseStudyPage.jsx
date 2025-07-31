import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import db from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CaseStudyPage = () => {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [loading, setLoading] = useState(true);

  // Load saved responses
  useEffect(() => {
    const saved = localStorage.getItem(`responses-${id}`);
    if (saved) setResponses(JSON.parse(saved));
  }, [id]);

  // Save responses to localStorage
  useEffect(() => {
    localStorage.setItem(`responses-${id}`, JSON.stringify(responses));
  }, [responses, id]);

  // Fetch case study from Firestore
  useEffect(() => {
    const fetchCase = async () => {
      try {
        const docRef = doc(db, 'caseStudies', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCaseStudy(docSnap.data());
        } else {
          setCaseStudy(null);
        }
      } catch (err) {
        console.error('Error fetching case:', err);
        setCaseStudy(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  const handleChange = (e, index) => {
    setResponses({ ...responses, [index]: e.target.value });
  };

  const handleSubmit = (index) => {
    setSubmitted((prev) => ({ ...prev, [index]: true }));
  };

  if (loading) return <p className="p-4 text-gray-600">Loading case study...</p>;
  if (!caseStudy) return <p className="p-4 text-red-500">Case Study not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Link to="/" className="text-blue-500 underline text-sm">← Back to Dashboard</Link>

      <h1 className="text-2xl font-bold text-gray-800 mt-4">{caseStudy.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        <strong>Topic:</strong> {caseStudy.topic} | <strong>Command:</strong> {caseStudy.commandTerm} | <strong>Paper:</strong> {caseStudy.paperType}
      </p>

      {/* Case Text */}
      <div className="space-y-3">
        {Array.isArray(caseStudy.caseText) && caseStudy.caseText.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      {/* Data Table */}
      {Array.isArray(caseStudy.dataTable) && caseStudy.dataTable.length > 1 && (
        <div className="mt-6">
          <h2 className="font-semibold text-gray-800 mb-2">📊 Data Table</h2>
          <table className="min-w-full border border-gray-300 text-sm">
            <tbody>
              {caseStudy.dataTable.map((row, i) => (
                <tr key={i}>
                  {row.split(',').map((cell, j) => (
                    <td key={j} className="border px-3 py-2">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Questions */}
      {Array.isArray(caseStudy.questions) && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">❓ Questions</h2>
          {caseStudy.questions.map((q, i) => (
            <div key={i} className="mb-5">
              <p className="font-medium mb-2">{i + 1}. {q}</p>
              <textarea
                className="w-full border border-gray-300 rounded p-2 text-sm"
                rows="4"
                value={responses[i] || ''}
                onChange={(e) => handleChange(e, i)}
              />
              <button
                className="mt-2 px-4 py-1 bg-green-600 text-white rounded text-sm"
                onClick={() => handleSubmit(i)}
              >Submit</button>
              {submitted[i] && <p className="text-green-600 text-sm mt-1">Answer saved ✅</p>}
            </div>
          ))}
        </div>
      )}

      {/* Other Sections */}
      <div className="mt-6 space-y-3">
        {caseStudy.modelAnswer && (
          <details className="border p-3 rounded">
            <summary className="cursor-pointer font-semibold text-blue-600">💡 Model Answer</summary>
            <p className="mt-2 text-gray-700">{caseStudy.modelAnswer}</p>
          </details>
        )}

        {caseStudy.toolkit && (
          <details className="border p-3 rounded">
            <summary className="cursor-pointer font-semibold text-yellow-700">🧰 Toolkit</summary>
            <p className="mt-2 text-gray-700">{caseStudy.toolkit}</p>
          </details>
        )}

        {caseStudy.TOK && (
          <details className="border p-3 rounded">
            <summary className="cursor-pointer font-semibold text-purple-700">🧠 TOK Connection</summary>
            <p className="mt-2 italic text-gray-700">{caseStudy.TOK}</p>
          </details>
        )}

        {caseStudy.IA && (
          <details className="border p-3 rounded">
            <summary className="cursor-pointer font-semibold text-pink-700">📊 IA Idea</summary>
            <p className="mt-2 text-gray-700">{caseStudy.IA}</p>
          </details>
        )}

        {caseStudy.EE && (
          <details className="border p-3 rounded">
            <summary className="cursor-pointer font-semibold text-green-700">📘 EE Exploration</summary>
            <p className="mt-2 text-gray-700">{caseStudy.EE}</p>
          </details>
        )}

        {caseStudy.resources && (
          <details className="border p-3 rounded">
            <summary className="cursor-pointer font-semibold text-gray-700">🔗 Additional Resources</summary>
            <p className="mt-2 text-blue-600 underline"><a href={caseStudy.resources} target="_blank" rel="noopener noreferrer">View Resource</a></p>
          </details>
        )}
      </div>
    </div>
  );
};

export default CaseStudyPage;

