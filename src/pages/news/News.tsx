import styles from './news.module.css';
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';
import Page from '../../components/Page.tsx';
import Footer from '../../components/Footer/Footer.tsx';
import { Link } from 'react-router-dom';
import PageLoading from '../../components/PageLoading/PageLoading.tsx';

interface NewsItem {
  title: string;
  description: string;
  to?: string; // 'to' is optional
  img?: string; // 'img' is optional
  date?: string;
}

const News: React.FC = () => {
  const [showBlogPosts, setBlogPosts] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(`/json/news.json`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBlogPosts(data); // Set the fetched blog posts
      } catch (error) {
        console.error('Error fetching news data:', error);
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchBlogPosts();
  }, []); // Ensure the useEffect runs only once on mount

  if (loading) {
    return <PageLoading />; // Show a loading message while fetching data
  }

  return (
    <div className={styles.news}>
      <Navbar />
      <Page>
        <div className={'page_title'}>News</div>

        <div className={styles.news_page}>
          <div className={styles.blog_cards}>
            {showBlogPosts.map((item, index: number) => {
              const hasLink = !!item.to; // Check if the 'to' prop exists

              return (
                <Link
                  key={index}
                  to={hasLink ? item.to! : '#'}
                  className={styles.blog}
                  style={{ cursor: hasLink ? 'pointer' : 'default' }} // Change cursor based on 'to'
                >
                  <div className={styles.blog_date}>{item.date}</div>
                  {item.img ? (
                    <img
                      src={item.img}
                      alt="Blog Post"
                      className={styles.blog_img}
                    />
                  ) : (
                    <div className={styles.blog_img_empty}></div>
                  )}
                  <div className={styles.blog_title}>{item.title}</div>
                  <div className={styles.blog_subtitle}>{item.description}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </Page>
      <Footer button={false} />
    </div>
  );
};

export default News;
