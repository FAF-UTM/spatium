import styles from './notfound.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';

const NotFound: React.FC = () => {
  return (
    <div className={styles.about}>
      <Navbar />
      404 | Not Found
    </div>
  );
};

export default NotFound;
