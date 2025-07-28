import React from 'react';
import { Link } from 'react-router-dom';
import { caseStudies } from '../data/caseStudies';

const CaseStudyList = () => (
  <ul className="space-y-4">
    {caseStudies.map(cs => (
      <li key={cs.id} className="border p-4 rounded bg-white shadow hover:shadow-md transition">
        <Link to={`/case/${cs.id}`} className="text-lg font-medium text-brandBlue hover:underline">
          {cs.title}
        </Link>
      </li>
    ))}
  </ul>
);
export default CaseStudyList;
