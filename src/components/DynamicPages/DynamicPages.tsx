import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from '../Footer/Footer';
import NotFound from '../../pages/notfound/NotFound';
import Page from '../Page';
import './DynamicPages.css';
import Navbar from '../Navbar/Navbar';
import { useTranslation } from 'react-i18next';

interface DynamicPage {
  link: string;
  title_ro: string;
  title_ru: string;
  title_en: string;
  content_ro: string;
  content_ru: string;
  content_en: string;
  type?: string;
}

const DynamicPages: React.FC = () => {
  const [dynamicPages, setDynamicPages] = useState<DynamicPage[]>([]);
  const { i18n } = useTranslation();

  // Helper functions to get the proper title and content based on the current language
  // const getTitleByLanguage = (page: DynamicPage): string => {
  //   switch (i18n.language) {
  //     case 'ro':
  //       return page.title_ro;
  //     case 'ru':
  //       return page.title_ru;
  //     case 'en':
  //     default:
  //       return page.title_en;
  //   }
  // };

  const getContentByLanguage = (page: DynamicPage): string => {
    switch (i18n.language) {
      case 'ro':
        return page.content_ro;
      case 'ru':
        return page.content_ru;
      case 'en':
      default:
        return page.content_en;
    }
  };

  useEffect(() => {
    // Fetch the pages.json file from the public folder
    const fetchPages = async () => {
      try {
        const response = await fetch(`/json/pages.json`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDynamicPages(data);
      } catch (error) {
        console.error('Failed to load pages.json:', error);
      }
    };

    fetchPages();
  }, []);

  return (
    <Routes>
      {dynamicPages.map((page) => (
        <Route
          key={page.link}
          path={`/:lang/${page.link}`}
          element={
            <>
              {/* You may add breadcrumb navigation here if needed */}
              <Navbar theme="light" />
              <Page gap="50px" id="dynamic_pages">
                {/* Optionally display the dynamic page title */}
                {/*<h1>{getTitleByLanguage(page)}</h1>*/}
                <div
                  id="dynamic_page_content"
                  dangerouslySetInnerHTML={{
                    __html: getContentByLanguage(page),
                  }}
                />
              </Page>
              <Footer />
            </>
          }
        />
      ))}
      {/* Fallback route for non-matching paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default DynamicPages;
