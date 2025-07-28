import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import AppsPage from './pages/AppsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apps" element={<AppsPage />} />
            <Route 
              path="/favorites" 
              element={
                <div className="text-center py-8">お気に入りページ（開発予定）</div>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;