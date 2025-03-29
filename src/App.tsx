import './App.css';
import Home from './pages/home/Home.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './i18n';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
