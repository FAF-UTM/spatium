import './App.css';
import Home from './pages/home/Home.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.tsx';
import { routesConfig } from './routesConfig.tsx';
import DynamicPages from './components/DynamicPages/DynamicPages.tsx';
import NotFound from './pages/notfound/NotFound.tsx';
import BackToTop from './components/back_to_top/BackToTop.tsx';

function App() {
  return (
    <>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <LanguageProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:lang/" element={<Home />} />

              {routesConfig.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
              <Route path="/*" element={<DynamicPages />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BackToTop/>
          </LanguageProvider>
        </BrowserRouter>
      </I18nextProvider>
    </>
  );
}

export default App;
