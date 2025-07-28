import React from 'react';
import CaseStudyList from './components/CaseStudyList';
import logo from './assets/logo.png';

const App = () => (
  <main className="p-6 max-w-6xl mx-auto">
    <div className="flex items-center gap-4 mb-6">
      <img src={logo} alt="SkillNest Logo" className="h-12" />
      <h1 className="text-4xl font-extrabold text-brandBlue">IB Business Case Studies</h1>
    </div>
    <CaseStudyList />
  </main>
);

export default App;