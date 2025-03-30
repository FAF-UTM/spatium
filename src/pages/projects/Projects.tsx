import styles from './projects.module.css';
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';

const Projects: React.FC = () => {
  return (
    <div className={styles.about}>
      <Navbar />
      Projects
    </div>
  );
};

export default Projects;
