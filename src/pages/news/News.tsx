import styles from './news.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';
import Page from '../../components/Page.tsx';
import Footer from '../../components/Footer/Footer.tsx';

const News: React.FC = () => {
  return (
    <div className={styles.news}>
      <Navbar />
      <Page>
        <div className={'page_title'}>News</div>

        <div className={styles.news_page}></div>
      </Page>
      <Footer button={false} />
    </div>
  );
};

export default News;
