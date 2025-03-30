import styles from './about.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';

const About: React.FC = () => {
  return (
    <div className={styles.about}>
      <Navbar />
      About
    </div>
  );
};

export default About;
