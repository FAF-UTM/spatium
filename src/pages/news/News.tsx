import styles from './news.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';

const News: React.FC = () => {
  return (
    <div className={styles.about}>
      <Navbar />
      News
    </div>
  );
};

export default News;
