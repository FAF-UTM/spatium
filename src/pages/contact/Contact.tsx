import styles from './contact.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';
import Page from '../../components/Page.tsx';
import Footer from '../../components/Footer/Footer.tsx';

const Contact: React.FC = () => {
  return (
    <div className={styles.contact}>
      <Navbar />
      <Page>
        <div className={'page_title'}>Contact us</div>

        <div className={styles.contact_text}></div>
      </Page>
      <Footer button={false} />
    </div>
  );
};

export default Contact;
