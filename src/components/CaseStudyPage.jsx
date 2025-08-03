import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import db from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CaseStudyPage = () => {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [bandScores, setBandScores] = useState({});
  const [marksOutOfTen, setMarksOutOfTen] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem(`responses-${id}`);
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`responses-${id}`, JSON.stringify(responses));
  }, [responses, id]);

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

  const feedbackMessage = (score, paperType) => {
    if (score >= 9) return `Excellent depth, clarity, and application. Your structure and command term focus are impressive. (Based on ${paperType})`;
    if (score >= 7) return `Good understanding and structure with minor improvements needed in evaluation or application. (Based on ${paperType})`;
    if (score >= 5) return `Satisfactory response. Basic analysis present but lacks depth in examples or structure. (Based on ${paperType})`;
    if (score >= 3) return `Some attempt made. More use of business terminology and real-world linkage needed. (Based on ${paperType})`;
    return `Response is limited or off-topic. Focus on understanding the command term and including structured points. (Based on ${paperType})`;
  };

  const mapToBand = (score) => {
    if (score >= 9) return 7;
    if (score >= 8) return 6;
    if (score >= 7) return 5;
    if (score >= 6) return 4;
    if (score >= 5) return 3;
    if (score >= 3) return 2;
    return 1;
  };

  const handleChange = (e, index) => {
    setResponses({ ...responses, [index]: e.target.value });
    setSubmitted({ ...submitted, [index]: false });
  };

  const handleSubmit = (index) => {
    const answer = (responses[index] || '').toLowerCase();
    let score = 1;

    const keywords = ['leadership', 'delegation', 'structure', 'expansion', 'communication'];
    const matches = keywords.filter(kw => answer.includes(kw)).length;

    if (answer.length > 400 && matches >= 4) {
      score = 10;
    } else if (answer.length > 300 && matches >= 3) {
      score = 8;
    } else if (answer.length > 200 && matches >= 2) {
      score = 6;
    } else if (answer.length > 100 && matches >= 1) {
      score = 4;
    } else {
      score = 2;
    }

    const band = mapToBand(score);
    const paperType = caseStudy?.paperType || 'Paper 1';

    setMarksOutOfTen(prev => ({ ...prev, [index]: score }));
    setBandScores(prev => ({ ...prev, [index]: band }));
    setSubmitted(prev => ({ ...prev, [index]: true }));
    setFeedback(prev => ({ ...prev, [index]: feedbackMessage(score, paperType) }));
  };

  if (loading) return <p className="p-4 text-gray-600">Loading case study...</p>;
  if (!caseStudy) return <p className="p-4 text-red-500">Case Study not found.</p>;

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <Link to="/" className="text-blue-500 underline text-sm">
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mt-4">{caseStudy.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          <strong>Topic:</strong> {caseStudy.topic} | <strong>Command:</strong> {caseStudy.commandTerm} | <strong>Paper:</strong> {caseStudy.paperType}
        </p>

        {/* Case Text */}
        <div className="space-y-3">
          {Array.isArray(caseStudy.caseText) && caseStudy.caseText.map((p, i) => (
            <p key={i}>{p}</p>
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
                    {row.split(',').map((cell, j) => (
                      <td key={j} className="border px-3 py-2">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Questions and Responses */}
        {Array.isArray(caseStudy.questions) && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">❓ Questions</h2>
            {caseStudy.questions.map((q, i) => (
              <div key={i} className="mb-5">
                <p className="font-medium mb-2">{i + 1}. {q}</p>
                <textarea
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  rows="6"
                  value={responses[i] || ''}
                  onChange={(e) => handleChange(e, i)}
                />
                <button
                  className="mt-2 px-4 py-1 bg-green-600 text-white rounded text-sm"
                  onClick={() => handleSubmit(i)}
                >Submit</button>
                {(submitted[i] || bandScores[i]) && (
                  <div className="text-sm mt-1 text-green-700 border border-green-500 p-2">
                    ✅ Answer saved! Marks: {marksOutOfTen[i] || 0}/10 | Estimated Band: {bandScores[i] || 1}/7<br />
                    💬 Feedback: {feedback[i]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Theory & Exploration (Collapsible) */}
        <div className="mt-6">
          <details className="mb-2">
            <summary className="cursor-pointer font-semibold text-gray-800">🌍 Theory & Exploration</summary>
            <div className="pl-4 pt-2 space-y-1">
              {caseStudy.TOK && <p><strong>TOK:</strong> {caseStudy.TOK}</p>}
              {caseStudy.IA && <p><strong>IA:</strong> {caseStudy.IA}</p>}
              {caseStudy.EE && <p><strong>EE:</strong> {caseStudy.EE}</p>}
            </div>
          </details>
        </div>

        {/* Teacher Notes (Collapsible) */}
        <div className="mt-6">
          <details>
            <summary className="cursor-pointer font-semibold text-gray-800">📘 Teacher Notes</summary>
            <div className="pl-4 pt-2 space-y-1">
              {caseStudy.modelAnswer && <p><strong>Model Answer:</strong> {caseStudy.modelAnswer}</p>}
              {caseStudy.feedbackTips && <p><strong>Feedback Tips:</strong> {caseStudy.feedbackTips}</p>}
              {caseStudy.resources && <p><strong>Resources:</strong> {caseStudy.resources}</p>}
              {caseStudy.toolkit && <p><strong>Toolkit:</strong> {caseStudy.toolkit}</p>}
            </div>
          </details>
        </div>
      </div>
    </>
  );
};

export default CaseStudyPage;
