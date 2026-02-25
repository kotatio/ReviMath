import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import Results from './pages/Results';
import Admin from './pages/Admin';
import Import from './pages/Import';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lesson/:id" element={<Lesson />} />
      <Route path="/results" element={<Results />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/import" element={<Import />} />
    </Routes>
  );
}
