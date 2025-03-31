import styles from './history.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';
import Page from '../../components/Page.tsx';
import Footer from '../../components/Footer/Footer.tsx';

const History: React.FC = () => {
  return (
    <div className={styles.about}>
      <Navbar />
      <Page>
        <div className={'page_title'}>Our History</div>

        <div className={styles.about_text}></div>
      </Page>
      <Footer button={false} />
    </div>
  );
};

export default History;
