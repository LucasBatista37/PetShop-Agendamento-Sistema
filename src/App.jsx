import './App.css';
import './index.css';

import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments/Appointments';
import { ServicesConfig } from '@/components/Services';

function App() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/services" element={<ServicesConfig />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="*" element={<p>Página não encontrada</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
