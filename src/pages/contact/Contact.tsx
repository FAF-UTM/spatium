import styles from './contact.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';
import Page from '../../components/Page.tsx';
import Footer from '../../components/Footer/Footer.tsx';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.contact}>
      <Navbar />
      <Page>
        <div className={'page_title'}>{t('navbar.contact_us')}</div>

        <div className={styles.contact_text}></div>
      </Page>
      <Footer button={false} />
    </div>
  );
};

export default Contact;
