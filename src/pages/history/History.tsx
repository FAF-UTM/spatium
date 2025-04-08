import styles from './history.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';
import Page from '../../components/Page.tsx';
import Footer from '../../components/Footer/Footer.tsx';
import { useTranslation } from 'react-i18next';

const History: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.about}>
      <Navbar />
      <Page>
        <div className={'page_title'}>{t('history.title')}</div>
        <div className={styles.about_text}>
          <p>{t('history.p1')}</p>
          <p>
            {t('history.p2_1')} <a href="https://utm.md/">{t('history.utm')}</a>{' '}
            {t('history.p2_2')}{' '}
            <a href="https://www.politie.nl/">{t('history.dutch_police')}</a>{' '}
            {t('history.p2_3')}
          </p>
          <p>{t('history.p3')}</p>
          <br />
          <b>{t('history.partnerships_title')}</b>
          <p>{t('history.partnerships')}</p>
          <br />
          <b>{t('history.academic_title')}</b>
          <p>{t('history.academic')}</p>
          <br />
          <b>{t('history.education_title')}</b>
          <p>{t('history.education')}</p>
        </div>
      </Page>
      <Footer button={false} />
    </div>
  );
};

export default History;
