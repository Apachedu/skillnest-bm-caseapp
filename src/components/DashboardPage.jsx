import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import db from '../firebase/firebase';

const DashboardPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'caseStudies'));
        const allCases = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allCases.push({ id: doc.id, title: data.title, topic: data.topic, paperType: data.paperType });
        });
        setCases(allCases);
      } catch (error) {
        console.error('Error fetching case studies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">📚 IB Case Study Dashboard</h1>
      {loading ? (
        <p className="text-gray-600">Loading case studies...</p>
      ) : cases.length === 0 ? (
        <p className="text-red-500">No case studies found.</p>
      ) : (
        <ul className="space-y-4">
          {cases.map((cs) => (
            <li key={cs.id} className="border p-4 rounded hover:bg-gray-50">
              <Link to={`/case/${cs.id}`} className="text-lg font-semibold text-blue-600">
                {cs.title}
              </Link>
              <p className="text-sm text-gray-600">
                <strong>Topic:</strong> {cs.topic} | <strong>Paper:</strong> {cs.paperType}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardPage;
