import styles from './home.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';
import Button from '../../components/Button.tsx';
import Footer from '../../components/Footer/Footer.tsx';

const Home: React.FC = () => {
  return (
    <div className={styles.home_container}>
      <div className={styles.home_hero}>
        <Navbar theme={'dark'} />

        <div className={styles.home_container_center}>
          <div className={styles.home_container_center_top}>
            <div className={styles.home_container_center_top_title}>
              SPATIUM
            </div>
            <div className={styles.home_container_center_top_subtitle}>
              Combating Human Trafficking Through Research and Technology
            </div>
          </div>
          <div className={styles.home_container_center_bottom}>
            Innovative solutions and collaborative research to protect
            vulnerable communities.
          </div>
          <Button
            style={{ textTransform: 'uppercase' }}
            className={styles.topbnav_menu_contactus}
            color={'var(--theme_primary_color_blue_0)'}
            bgcolor={'var(--theme_primary_color_blue_4)'}
            border={'var(--theme_primary_color_blue_4)'}
            hover_bgcolor={'var(--theme_primary_color_yellow_0)'}
            hover_border={'var(--theme_primary_color_yellow_0)'}
            to="/about"
            icon={'arrow_right'}
          >
            <span className={'span_special_text'}>Learn More</span>
          </Button>
        </div>
      </div>
      <Footer button={false} style={{ marginTop: '0px' }} />
    </div>
  );
};

export default Home;
