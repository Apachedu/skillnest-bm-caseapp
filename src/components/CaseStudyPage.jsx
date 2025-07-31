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
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear saved responses on load (for development reset)
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
    let message = '';
    switch (score) {
      case 7:
        message = 'Outstanding analysis and application to the real-world context.';
        break;
      case 6:
        message = 'Excellent depth and clarity in explanation.';
        break;
      case 5:
        message = 'Good understanding with minor elaboration needed.';
        break;
      case 4:
        message = 'Satisfactory response, but more depth is expected.';
        break;
      case 3:
        message = 'Some understanding, more real-world linkages required.';
        break;
      case 2:
        message = 'Basic attempt. Focus on command term and structure.';
        break;
      default:
        message = 'Insufficient response. Try expanding and adding examples.';
    }
    return `${message} (Based on ${paperType})`;
  };

  const handleChange = (e, index) => {
    setResponses({ ...responses, [index]: e.target.value });
    setSubmitted({ ...submitted, [index]: false });
  };

  const handleSubmit = (index) => {
    const answer = responses[index] || '';
    let score = 1;
    if (answer.length > 600) score = 7;
    else if (answer.length > 450) score = 6;
    else if (answer.length > 350) score = 5;
    else if (answer.length > 250) score = 4;
    else if (answer.length > 150) score = 3;
    else if (answer.length > 50) score = 2;

    const paperType = caseStudy?.paperType || 'Paper 1';

    console.log({
      answerLength: answer.length,
      score,
      paperType,
      feedback: feedbackMessage(score, paperType)
    });

    setBandScores(prev => ({ ...prev, [index]: score }));
    setSubmitted(prev => ({ ...prev, [index]: true }));
    setFeedback(prev => ({ ...prev, [index]: feedbackMessage(score, paperType) }));
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

      <div className="space-y-3">
        {Array.isArray(caseStudy.caseText) && caseStudy.caseText.map((p, i) => <p key={i}>{p}</p>)}
      </div>

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
                <div className="text-sm mt-1 text-green-700 border border-red-500 p-2">
                  ✅ Answer saved! Estimated Band Score: {bandScores[i] || 1}/7<br />
                  💬 Feedback: {feedback[i]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
            <p className="mt-2 text-blue-600 underline">
              <a href={caseStudy.resources} target="_blank" rel="noopener noreferrer">View Resource</a>
            </p>
          </details>
        )}
      </div>
    </div>
  );
};

export default CaseStudyPage;
