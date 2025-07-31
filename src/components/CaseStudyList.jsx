import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import db from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const CaseStudyList = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'caseStudies'));
        const cases = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCaseStudies(cases);
      } catch (error) {
        console.error('Error fetching case studies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) return <p className="text-gray-500">Loading case studies...</p>;

  return (
    <ul className="space-y-4">
      {caseStudies.map(cs => (
        <li key={cs.id} className="border p-4 rounded bg-white shadow hover:shadow-md transition">
          <Link to={`/case/${cs.id}`} className="text-lg font-medium text-brandBlue hover:underline">
            {cs.title}
          </Link>
          <p className="text-sm text-gray-600">{cs.topic} — {cs.commandTerm}</p>
        </li>
      ))}
    </ul>
  );
};

export default CaseStudyList;
