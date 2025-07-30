import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import db from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CaseStudyPage = () => {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);

  // Load responses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`bm-responses-${id}`);
    if (saved) setResponses(JSON.parse(saved));
  }, [id]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`bm-responses-${id}`, JSON.stringify(responses));
  }, [responses, id]);

  // Fetch case study
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

  if (loading) return <p className="p-4 text-gray-600">Loading case study...</p>;
  if (!caseStudy) return <p className="p-4 text-red-500">Case Study not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Link to="/" className="text-blue-500 underline text-sm">← Back to Case Studies</Link>

      <h1 className="text-2xl font-bold text-gray-800 mt-4">{caseStudy.title}</h1>
      <p className="text-sm text-gray-500 mb-2">
        <strong>Topic:</strong> {caseStudy.topic} | <strong>Level:</strong> {caseStudy.level} | <strong>Command Term:</strong> {caseStudy.commandTerm}
      </p>

      {/* Case Text */}
      <div className="mt-4 space-y-3 text-gray-800">
        {Array.isArray(caseStudy.caseText) && caseStudy.caseText.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* Data Table */}
      {Array.isArray(caseStudy.dataTable) && caseStudy.dataTable.length > 1 && (
        <div className="mt-6">
          <h2 className="font-semibold text-gray-800 mb-2">📊 Data Table</h2>
          <table className="min-w-full border border-gray-300 text-sm">
            <tbody>
              {caseStudy.dataTable.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
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
        <div className="mt-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">❓ Questions</h2>
          {caseStudy.questions.map((question, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-gray-800 font-medium mb-2">{idx + 1}. {question}</p>
              <div className="min-h-[100px] border border-dashed border-gray-400 p-3 rounded text-gray-500 italic">
                Your answer here...
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extras */}
      <div className="mt-8 space-y-4">
        {caseStudy.modelAnswer && (
          <details className="border rounded p-3">
            <summary className="cursor-pointer font-semibold text-blue-700">💡 Model Answer</summary>
            <p className="mt-2 text-gray-700">{caseStudy.modelAnswer}</p>
          </details>
        )}
        {caseStudy.TOK && (
          <details className="border rounded p-3">
            <summary className="cursor-pointer font-semibold text-purple-700">🧠 TOK Connection</summary>
            <p className="mt-2 text-gray-700 italic">{caseStudy.TOK}</p>
          </details>
        )}
        {caseStudy.IA && (
          <details className="border rounded p-3">
            <summary className="cursor-pointer font-semibold text-pink-700">📊 IA Idea</summary>
            <p className="mt-2 text-gray-700">{caseStudy.IA}</p>
          </details>
        )}
        {caseStudy.EE && (
          <details className="border rounded p-3">
            <summary className="cursor-pointer font-semibold text-green-700">📘 EE Exploration</summary>
            <p className="mt-2 text-gray-700">{caseStudy.EE}</p>
          </details>
        )}
      </div>
    </div>
  );
};

export default CaseStudyPage;
