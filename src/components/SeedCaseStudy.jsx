import React, { useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const SeedCaseStudy = ({ onSeed }) => {
  useEffect(() => {
    const seedData = async () => {
      const caseStudy = {
        id: 'bm-bike-001',
        title: "EcoBike's Leadership Challenges",
        topic: '2.3 Leadership and Management',
        command: 'Evaluate',
        paper: 'Paper 2',
        caseText: 'EcoBike is a rapidly expanding green mobility firm...',
        dataTable: ['Revenue: $1.2M', 'Staff Turnover: 14%', 'Customer Satisfaction: 82%'],
        questions: [
          {
            id: 1,
            text: 'To what extent does leadership style influence organizational identity?',
            marks: 10,
          },
          {
            id: 2,
            text: 'Analyse how EcoBike’s leadership approach affects team performance across regions.',
            marks: 10,
          }
        ],
        teacherNotes: {
          modelAnswer: 'The case highlights issues with leadership style...',
          feedbackTips: 'Students should explore how charisma may inspire...',
          resources: 'Survey data, interviews, expansion press release',
          toolkit: ['Leadership Style', 'Delegation', 'Organizational Structure']
        }
      };

      try {
        await addDoc(collection(db, 'casestudies'), caseStudy);
        console.log('✅ Seeded EcoBike case study!');
        onSeed();
      } catch (error) {
        console.error('❌ Seeding failed:', error);
      }
    };

    seedData();
  }, [onSeed]);

  return null;
};

export default SeedCaseStudy;
