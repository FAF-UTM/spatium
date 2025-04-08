import styles from './contact.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Page from '../../components/Page';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.contact}>
      <Navbar />
      <Page gap="10px">
        <div className={`page_title ${styles.page_title_contacts}`}>
          {t('contact.title')}
        </div>

        <div>
          <b>{t('contact.address_label')}:</b> {t('contact.address')}
        </div>
        <div>
          <b>{t('contact.located_in_label')}:</b> {t('contact.located_in')}
        </div>
        <div>
          <b>{t('contact.hours_label')}:</b> {t('contact.hours')}
        </div>
        <div>
          <b>{t('contact.phone_label')}:</b>{' '}
          <a href="tel:+373022509907">{t('contact.phone')}</a>
        </div>

        <iframe
          className={styles.contact_iframe}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d169.86798887193603!2d28.867870643734943!3d47.06205083037304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97d202ca02209%3A0x412c20f1e56915e4!2sFaculty%20of%20Computers%2C%20Informatics%20and%20Microelectronics!5e0!3m2!1sen!2s!4v1744031555692!5m2!1sen!2s"
          width="800"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Page>
      <Footer button={false} />
    </div>
  );
};

export default Contact;
