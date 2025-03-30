import styles from './contact.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';

const Contact: React.FC = () => {
  return (
    <div className={styles.about}>
      <Navbar />
      Contact
    </div>
  );
};

export default Contact;
