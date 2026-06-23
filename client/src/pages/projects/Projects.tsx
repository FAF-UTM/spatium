import styles from './projects.module.css';
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Page from '../../components/Page';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import PageLoading from '../../components/PageLoading/PageLoading';
import { useTranslation } from 'react-i18next';

interface ProjectItem {
  title_ro: string;
  title_ru: string;
  title_en: string;
  description_ro: string;
  description_ru: string;
  description_en: string;
  to?: string; // 'to' is optional
  img?: string; // 'img' is optional
  date?: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t, i18n } = useTranslation();

  const getTitleByLanguage = (item: ProjectItem): string => {
    switch (i18n.language) {
      case 'ro':
        return item.title_ro;
      case 'ru':
        return item.title_ru;
      case 'en':
      default:
        return item.title_en;
    }
  };

  const getDescriptionByLanguage = (item: ProjectItem): string => {
    switch (i18n.language) {
      case 'ro':
        return item.description_ro;
      case 'ru':
        return item.description_ru;
      case 'en':
      default:
        return item.description_en;
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`/json/projects.json`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProjects(data); // Set the fetched projects data
      } catch (error) {
        console.error('Error fetching projects data:', error);
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchProjects();
  }, []); // Run on mount

  if (loading) {
    return <PageLoading />; // Show a loading message while fetching data
  }

  return (
    <div className={styles.projects_page}>
      <Navbar />
      <Page>
        <div className="page_title">{t('navbar.projects')}</div>
        <div className={styles.projects_page}>
          <div className={styles.projects_cards}>
            {projects.map((item, index: number) => {
              const hasLink = !!item.to; // Check if the 'to' prop exists

              return (
                <Link
                  key={index}
                  to={hasLink ? item.to! : '#'}
                  className={styles.projects}
                  style={{ cursor: hasLink ? 'pointer' : 'default' }} // Change cursor based on 'to'
                >
                  {item.img ? (
                    <img
                      src={item.img}
                      alt="Project"
                      className={styles.projects_img}
                    />
                  ) : (
                    <div className={styles.projects_img_empty}></div>
                  )}
                  <div className={styles.projects_title}>
                    {getTitleByLanguage(item)}
                  </div>
                  <div className={styles.projects_subtitle}>
                    {getDescriptionByLanguage(item)}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Page>
      <Footer button={false} />
    </div>
  );
};

export default Projects;
