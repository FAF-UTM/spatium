import styles from './about.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';
import Page from '../../components/Page.tsx';
import Footer from '../../components/Footer/Footer.tsx';

const About: React.FC = () => {
  return (
    <div className={styles.about}>
      <Navbar />
      <Page>
        <div className={'page_title'}>About us</div>

        <div className={styles.about_text}>
          <div className={styles.about_title}>
            <b> About SPATIUM</b>
          </div>
          <b>
            SPATIUM – the Research Center for Technological Support and
            Information –
          </b>{' '}
          is based at the Faculty of Computers, Informatics, and
          Microelectronics (<b>FCIM</b>) of the Technical University of Moldova
          (<b>UTM</b>). Our center is dedicated to fighting human trafficking
          and modern slavery by harnessing the power of digital innovation and
          collaborative research.
          <div className={styles.about_title}>
            <b> Our Mission</b>
          </div>
          At <b>SPATIUM</b>, we aim to develop advanced technological tools and
          provide accurate information that help prevent and reduce the risks
          associated with human trafficking. With human trafficking on the rise
          globally, we believe that immediate action is essential. Through our
          research and innovative projects, we are committed to raising
          awareness and equipping communities with the solutions they need to
          combat this grave issue.
          <div className={styles.about_title}>
            <b> What We Do</b>
          </div>
          <ul>
            <li>
              <b> Innovation through Collaboration:</b> In partnership with
              international organizations such as the{' '}
              <b>Dutch National Police</b> and media outlets like{' '}
              <b>“Ziarul de Gardă”</b>, we bring together experts from academia,
              law enforcement, and the tech industry.
            </li>
            <li>
              <b> Hackathons and Workshops:</b> Our hackathons serve as dynamic
              forums where developers, researchers, and industry professionals
              brainstorm and build digital prototypes aimed at alerting
              communities and empowering journalists.
            </li>
            <li>
              <b> Research and Development:</b> We actively engage in projects
              like <b>“ESCAPEVAN MOLDOVA,”</b> which have already shown
              significant societal impact by creating practical, user-friendly
              technological solutions.
            </li>
          </ul>
          <div className={styles.about_title}>
            <b> Our Team</b>
          </div>
          Led by <b>Professor Dumitru CIORBĂ</b>, <b>Mariana CATRUC</b> and{' '}
          <b>Gabriel ZAHARIA</b>, we strive to foster a culture of innovation
          and social responsibility through our research initiatives and
          partnerships.
          <div className={styles.about_title}>
            <b>Our Vision</b>
          </div>
          We envision a future where technology is the driving force behind
          social change — a future where digital tools and reliable information
          help build safer communities and a more informed society.
          <br />
          <br />
          By combining academic excellence, international collaboration, and
          cutting-edge research, <b>SPATIUM</b> is at the forefront of
          transforming ideas into solutions that make a real difference.
        </div>
      </Page>
      <Footer button={false} />
    </div>
  );
};

export default About;
