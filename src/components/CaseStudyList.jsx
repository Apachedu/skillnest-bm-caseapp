// src/components/CaseStudyList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import db from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const CaseStudyList = () => {
  const [caseStudies, setCaseStudies] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'caseStudies'));
        const cases = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCaseStudies(cases);
      } catch (err) {
        console.error('🔥 Error fetching cases from Firestore:', err);
      }
    };

    fetchCases();
  }, []);

  return (
    <ul className="space-y-4">
      {caseStudies.map(cs => (
        <li key={cs.id} className="border p-4 rounded bg-white shadow hover:shadow-md transition">
          <Link to={`/case/${cs.id}`} className="text-lg font-medium text-brandBlue hover:underline">
            {cs.title}
          </Link>
          <p className="text-sm text-gray-600">{cs.topic} | {cs.commandTerm} | {cs.paperType}</p>
        </li>
      ))}
    </ul>
  );
};

export default CaseStudyList;
