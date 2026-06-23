import { useEffect, useState } from 'react';
import styles from './BackToTop.module.css';
import Icon from '../Icon.tsx';

export default function BackToTop() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`${styles.scroll_block} ${scrolled ? styles.scrolled : ''}`}
      onClick={scrollToTop}
    >
      <Icon type={'arrow_right'} rotate={'-90deg'} />
    </div>
  );
}
