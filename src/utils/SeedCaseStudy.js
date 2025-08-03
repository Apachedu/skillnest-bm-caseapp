import { useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import db from '../firebase/firebase';

const SeedCaseStudy = () => {
  useEffect(() => {
    const seedData = async () => {
      const docRef = await addDoc(collection(db, 'caseStudies'), {
        title: "EcoBike Expansion Dilemma",
        topic: "Leadership & Expansion",
        commandTerm: "Evaluate",
        paperType: "Paper 2",
        caseText: [
          "EcoBike is a mid-sized Indian startup that designs and sells electric bicycles. Founded by former cyclist and entrepreneur Aarav Patel, the company gained popularity for its affordable and eco-friendly bikes in urban Indian markets. The business operates with a centralized structure and is known for its founder’s charismatic and hands-on leadership.",
          "In 2023, EcoBike attempted to expand into Southeast Asia and the Middle East. Initial results were mixed: while sales in Vietnam grew steadily, operations in Dubai and Jakarta struggled. Local managers reported inconsistent decision-making processes and a lack of strategic alignment. Employees expressed confusion over roles and reported delays in implementing marketing campaigns and supply orders.",
          "Aarav maintained control over key decisions, rarely delegating authority. This leadership style, which once energized the startup’s early days, now clashed with the complexity of international operations. Staff turnover increased by 30% in overseas offices, and customer satisfaction scores fell below target.",
          "EcoBike’s board is debating whether to hire regional general managers and shift to a more democratic leadership style—or continue with centralized control to preserve brand consistency. Meanwhile, competitors like GreenWheels and UrbanCycle are expanding rapidly across Asia using decentralized strategies."
        ],
        dataTable: [
          "Region,Turnover %,Customer Satisfaction %",
          "Vietnam,12,88",
          "Dubai,30,65",
          "Jakarta,28,62"
        ],
        questions: [
          "Evaluate the impact of Aarav's leadership style on EcoBike’s international expansion strategy.",
          "Recommend a suitable organizational structure for EcoBike as it scales internationally. Justify your answer."
        ],
        modelAnswer: "To be added after classroom iteration.",
        feedbackTips: "Focus on leadership theories (autocratic, democratic, situational) and link to organizational structure.",
        resources: "Business Management HL Textbook, Chapter 2.5 and 2.2.",
        toolkit: "Leadership models, Organizational charts, SWOT analysis."
      });

      console.log("✅ Case study seeded with ID:", docRef.id);
    };

    seedData();
  }, []);

  return <p>Seeding data to Firestore...</p>;
};

export default SeedCaseStudy;
