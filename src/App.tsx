import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BIDashboardPage } from './modules/bi/pages/BIDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/bi" replace />} />
        <Route path="/bi" element={<BIDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
