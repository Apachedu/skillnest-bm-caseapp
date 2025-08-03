// src/components/SeedCaseStudy.jsx
import React, { useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const SeedCaseStudy = () => {
  useEffect(() => {
    const seedData = async () => {
      try {
        await addDoc(collection(db, 'caseStudies'), {
          title: 'EcoBike Expansion',
          topic: 'Leadership',
          commandTerm: 'Examine',
          paperType: 'Paper 2',
          caseText: [
            "EcoBike is a growing electric bike startup founded by two entrepreneurs.",
            "The company is looking to expand into European and Asian markets but faces leadership challenges.",
            "Employee surveys reveal dissatisfaction with decision-making transparency and delegation."
          ],
          dataTable: [
            'Region,Sales,Turnover Rate',
            'North America,5000,12%',
            'Europe,1200,22%',
            'Asia,800,30%'
          ],
          questions: [
            "Examine how EcoBike’s leadership style might hinder its global expansion strategy."
          ],
          modelAnswer: "Model answer here...",
          feedbackTips: "Use command terms properly...",
          toolkit: "SWOT, leadership models",
          TOK: "The impact of perspective on leadership evaluations",
          IA: "Business structure and growth",
          EE: "How leadership affects cross-cultural expansion",
          resources: "IB BM textbook, chapter 2"
        });
        console.log('✅ Seed data added!');
      } catch (err) {
        console.error('🔥 Error seeding data:', err);
      }
    };

    seedData();
  }, []);

  return <p className="text-green-700 p-4">Seeding in progress. Check Firestore...</p>;
};

export default SeedCaseStudy;
