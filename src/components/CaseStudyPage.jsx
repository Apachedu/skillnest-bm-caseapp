import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import db from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CaseStudyPage = () => {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const localKey = `${id.startsWith('econ-') ? 'econ' : 'bm'}-responses-${id}`;

  // Load saved answers
  useEffect(() => {
    const saved = localStorage.getItem(localKey);
    if (saved) setResponses(JSON.parse(saved));
  }, [localKey]);

  // Save on change
  useEffect(() => {
    localStorage.setItem(localKey, JSON.stringify(responses));
  }, [responses, localKey]);

  // Fetch from Firestore
  useEffect(() => {
    const fetchCase = async () => {
      try {
        const docRef = doc(db, 'caseStudies', id);
        const snap = await getDoc(docRef);
        snap.exists() ? setCaseStudy(snap.data()) : setCaseStudy(null);
      } catch (err) {
        console.error('Failed to fetch case:', err);
        setCaseStudy(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  const handleResponseChange = (e, index) => {
    const value = e.target.value;
    setResponses(prev => ({ ...prev, [index]: value }));
  };

  const renderTable = () => {
    if (!Array.isArray(caseStudy.dataTable) || caseStudy.dataTable.length === 0) return null;
    const rows = caseStudy.dataTable.map(row => row.split(','));
    return (
      <table className="w-full border mt-4 text-sm">
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i}>
              {cells.map((cell, j) => (
                <td key={j} className="border px-3 py-2">{cell.trim()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) return <p className="p-4 text-gray-500">Loading case study...</p>;
  if (!caseStudy) return <p className="p-4 text-red-500">Case study not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <Link to="/" className="text-blue-600 text-sm underline">← Back to Case Studies</Link>

      <h1 className="text-2xl font-bold text-gray-800 mt-4">{caseStudy.title}</h1>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Topic:</strong> {caseStudy.topic} &nbsp;|&nbsp;
        <strong>Command Term:</strong> {caseStudy.commandTerm} &nbsp;|&nbsp;
        <strong>Paper:</strong> {caseStudy.paperType}
      </p>

      <div className="mt-4 space-y-3 text-gray-700">
        {Array.isArray(caseStudy.caseText) ? caseStudy.caseText.map((para, i) => (
          <p key={i}>{para}</p>
        )) : <p>{caseStudy.caseText}</p>}
      </div>

      {renderTable()}

      <div className="mt-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">❓ Questions</h2>
        {caseStudy.questions?.map((q, idx) => (
          <div key={idx} className="space-y-2">
            <label className="font-medium text-gray-800">{idx + 1}. {q}</label>
            <textarea
              className="w-full border border-gray-300 rounded p-2"
              rows="4"
              placeholder="Type your response..."
              value={responses[idx] || ''}
              onChange={(e) => handleResponseChange(e, idx)}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {caseStudy.modelAnswer && (
          <details className="border rounded p-3">
            <summary className="font-semibold text-blue-700 cursor-pointer">💡 Model Answer</summary>
            <p className="mt-2 text-gray-700">{caseStudy.modelAnswer}</p>
          </details>
        )}
        {caseStudy.TOK && (
          <details className="border rounded p-3">
            <summary className="font-semibold text-purple-700 cursor-pointer">🧠 TOK Connection</summary>
            <p className="mt-2 text-gray-700 italic">{caseStudy.TOK}</p>
          </details>
        )}
        {caseStudy.IA && (
          <details className="border rounded p-3">
            <summary className="font-semibold text-pink-700 cursor-pointer">📊 IA Idea</summary>
            <p className="mt-2 text-gray-700">{caseStudy.IA}</p>
          </details>
        )}
        {caseStudy.EE && (
          <details className="border rounded p-3">
            <summary className="font-semibold text-green-700 cursor-pointer">📘 EE Exploration</summary>
            <p className="mt-2 text-gray-700">{caseStudy.EE}</p>
          </details>
        )}
        {caseStudy.resources && (
          <details className="border rounded p-3">
            <summary className="font-semibold text-indigo-700 cursor-pointer">🔗 Resources</summary>
            <a href={caseStudy.resources} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 block">
              {caseStudy.resources}
            </a>
          </details>
        )}
      </div>
    </div>
  );
};

export default CaseStudyPage;

      