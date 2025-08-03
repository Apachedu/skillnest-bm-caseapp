// src/components/SeedCaseStudy.jsx
import React, { useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import db from '../firebase/firebase';

const SeedCaseStudy = () => {
  useEffect(() => {
    const seedData = async () => {
      const newCase = {
        title: "EcoBike Global Expansion",
        topic: "1.6 Growth and Evolution",
        commandTerm: "Evaluate",
        paperType: "Paper 2",
        caseText: [
          "EcoBike, an innovative startup founded in Germany, quickly gained market share in Europe through its affordable and eco-friendly electric bikes.",
          "The company’s charismatic founder, Lars, led with a visionary yet autocratic leadership style. Employees admired his passion but often felt micromanaged.",
          "As EcoBike expanded to Asia and South America, regional teams reported confusion in communication, unclear delegation, and leadership bottlenecks.",
          "A recent employee satisfaction survey showed declining morale and lack of clarity in decision-making processes."
        ],
        dataTable: [
          "Region,Revenue (2024),Employee Turnover Rate",
          "Europe,$12M,5%",
          "Asia,$4M,15%",
          "South America,$3M,18%"
        ],
        questions: [
          "Evaluate how EcoBike’s leadership style impacted its international expansion.",
          "Using the data provided, assess the challenges EcoBike faces in sustaining global growth."
        ],
        TOK: "How does the leadership style influence ethical decision-making in international business?",
        IA: "Business expansion and leadership approaches in global markets.",
        EE: "To what extent does leadership style impact international business growth?",
        modelAnswer: "EcoBike’s autocratic leadership worked well during early domestic growth, but the lack of delegation and regional autonomy hurt global scalability. High turnover and employee dissatisfaction suggest the need for a more democratic or situational leadership style.",
        feedbackTips: "Encourage referencing data and leadership theory. Include evaluative language and consider long-term impacts.",
        resources: "Hoang Textbook, Chapter 1.6; IB BM Guide",
        toolkit: "SWOT, Lewin’s Leadership Styles, Herzberg’s Motivation Theory"
      };

      try {
        await addDoc(collection(db, 'caseStudies'), newCase);
        console.log("✅ Case study seeded successfully.");
      } catch (error) {
        console.error("🔥 Error seeding case study:", error);
      }
    };

    seedData();
  }, []);

  return <p className="text-sm text-gray-500">Seeding case study (check console)...</p>;
};

export default SeedCaseStudy;
