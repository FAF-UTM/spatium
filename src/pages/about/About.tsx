import styles from './about.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Page from '../../components/Page';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.about}>
      <Navbar />
      <Page>
        <div className="page_title">{t('about.pageTitle')}</div>

        <div className={styles.about_text}>
          <div className={styles.about_title}>
            <b>{t('about.aboutSpatium.title')}</b>
          </div>
          <b>{t('about.aboutSpatium.subtitle')}</b>{' '}
          {t('about.aboutSpatium.text')}
          <div className={styles.about_title}>
            <b>{t('about.ourMission.title')}</b>
          </div>
          {t('about.ourMission.text')}
          <div className={styles.about_title}>
            <b>{t('about.whatWeDo.title')}</b>
          </div>
          <ul>
            {(t('about.whatWeDo.list', { returnObjects: true }) as string[]).map(
              (item: string, index: number) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
          <div className={styles.about_title}>
            <b>{t('about.ourTeam.title')}</b>
          </div>
          {t('about.ourTeam.text')}
          <div className={styles.about_title}>
            <b>{t('about.ourVision.title')}</b>
          </div>
          {t('about.ourVision.text')}
          <br />
          <br />
          {t('about.conclusion')}
        </div>
      </Page>
      <Footer button={false} />
    </div>
  );
};

export default About;
