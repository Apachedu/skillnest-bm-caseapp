// ✅ Let's fix this properly — permanent, professional, production-ready.
// 📁 File: /src/components/CaseStudyPage.jsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { caseStudies } from '../data/caseStudies.js';

const TABS = ['Overview', 'Data', 'Questions'];

export default function CaseStudyPage() {
  const { id } = useParams();
  const study = caseStudies.find((s) => s.id === id);

  const [activeTab, setActiveTab] = useState('Overview');
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState({});

  if (!study) return <div className="p-4">Case study not found.</div>;

  const handleChange = (e, questionIndex) => {
    setResponses({ ...responses, [questionIndex]: e.target.value });
  };

  const handleSubmit = (questionIndex) => {
    setSubmitted({ ...submitted, [questionIndex]: true });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{study.title}</h1>
      <div className="flex gap-4 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded border ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border-blue-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="prose max-w-none">
          {study.caseText.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {activeTab === 'Data' && (
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr>
              {study.dataTable[0].map((col, i) => (
                <th key={i} className="border px-4 py-2 bg-gray-100">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {study.dataTable.slice(1).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="border px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'Questions' && (
        <div className="space-y-6">
          {study.questions.map((q, i) => (
            <div key={i} className="border p-4 rounded shadow-sm">
              <p className="font-semibold mb-2">Q{i + 1}. {q}</p>
              <textarea
                className="w-full border rounded p-2"
                rows={4}
                value={responses[i] || ''}
                onChange={(e) => handleChange(e, i)}
                disabled={submitted[i]}
              ></textarea>
              <div className="mt-2 flex gap-4">
                <button
                  onClick={() => handleSubmit(i)}
                  className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                  disabled={submitted[i]}
                >
                  Submit
                </button>
                {submitted[i] && (
                  <span className="text-blue-600 font-medium">Answer submitted!</span>
                )}
              </div>
              {submitted[i] && study.answers[i] && (
                <div className="mt-4 text-sm text-gray-700">
                  <p className="font-semibold">Model Answer:</p>
                  <p>{study.answers[i]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
