import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import db from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CaseStudyPage = () => {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);

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

      <div className="mt-4 text-gray-700">
        <p>{caseStudy.caseText}</p>
      </div>

      <div className="mt-6 border-t pt-4">
        <h2 className="font-semibold text-gray-800">💡 Model Answer</h2>
        <p className="mt-2 text-gray-700">{caseStudy.modelAnswer}</p>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold text-gray-800">🧠 TOK Connection</h2>
        <p className="text-gray-700 italic">{caseStudy.TOK}</p>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold text-gray-800">📊 IA Idea</h2>
        <p className="text-gray-700">{caseStudy.IA}</p>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold text-gray-800">📘 EE Exploration</h2>
        <p className="text-gray-700">{caseStudy.EE}</p>
      </div>
    </div>
  );
};

export default CaseStudyPage;
