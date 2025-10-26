import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import BlogForm from './components/BlogForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/posts/new" element={<BlogForm mode="create" />} />
          <Route path="/posts/:id" element={<BlogDetail />} />
          <Route path="/posts/:id/edit" element={<BlogForm mode="edit" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;