import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BIDashboardPage } from './modules/bi/pages/BIDashboardPage';
import { StoreDetailPage } from './modules/bi/pages/StoreDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/bi" replace />} />
        <Route path="/bi" element={<BIDashboardPage />} />
        <Route path="/bi/loja/:storeId" element={<StoreDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
