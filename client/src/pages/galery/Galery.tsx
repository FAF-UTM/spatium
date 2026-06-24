import styles from './galery.module.css';
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar.tsx';
import Page from '../../components/Page.tsx';
import Footer from '../../components/Footer/Footer.tsx';
import PageLoading from '../../components/PageLoading/PageLoading.tsx';
import { useTranslation } from 'react-i18next';
import Icon from '../../components/Icon.tsx';
import { listCards } from '../../api/content';

interface NewsItem {
  title_ro: string;
  title_ru: string;
  title_en: string;
  description_ro: string;
  description_ru: string;
  description_en: string;
  to?: string; // 'to' is optional
  img?: string; // 'img' is optional
  date?: string;
  images?: { url: string; publicId: string }[];
}

const Galery: React.FC = () => {
  const [showBlogPosts, setBlogPosts] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { t, i18n } = useTranslation();

  const getTitleByLanguage = (item: NewsItem): string => {
    switch (i18n.language) {
      case 'ro':
        return item.title_ro;
      case 'ru':
        return item.title_ru;
      case 'en':
      default:
        return item.title_en;
    }
  };

  const getDescriptionByLanguage = (item: NewsItem): string => {
    switch (i18n.language) {
      case 'ro':
        return item.description_ro;
      case 'ru':
        return item.description_ru;
      case 'en':
      default:
        return item.description_en;
    }
  };

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const res = await listCards('gallery');
        setBlogPosts(res.data); // Set the fetched gallery items
      } catch (error) {
        console.error('Error fetching gallery data:', error);
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
        <div className={'page_title'}>{t('navbar.gallery')}</div>

        <div className={styles.news_page}>
          <div className={styles.blog_cards}>
            {showBlogPosts.map((item, index: number) => {
              const hasLink = !!item.to; // Check if the 'to' prop exists

              return (
                <div className={styles.galery_block} key={index}>
                  <div>
                    <svg
                      width="84"
                      height="84"
                      viewBox="0 0 84 84"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="84"
                        height="84"
                        rx="13.7705"
                        fill="#102A4C"
                        fill-opacity="0.1"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M36.9597 16.7969C31.1734 16.7969 26.9171 16.9895 24.0117 17.1967C20.3154 17.4611 17.4626 20.3128 17.1983 24.0113C16.9911 26.9156 16.7984 31.1719 16.7984 36.9582C16.7984 42.7445 16.9911 47.0007 17.1983 49.9062C17.4559 53.5061 20.1665 56.3052 23.7227 56.6938C23.5809 53.4775 23.513 50.2583 23.5188 47.0388C23.5188 41.1775 23.7137 36.8417 23.9277 33.8522C24.3107 28.4871 28.4886 24.3092 33.8537 23.9261C36.8432 23.7133 41.179 23.5173 47.0403 23.5173C50.9046 23.5173 54.1046 23.6024 56.6954 23.7212C56.3067 20.1649 53.5076 17.4544 49.9077 17.1967C47.0023 16.9895 42.746 16.7969 36.9597 16.7969ZM47.0403 26.8775C41.254 26.8775 36.9978 27.0702 34.0923 27.2774C30.3961 27.5417 27.5432 30.3934 27.2789 34.0919C27.0717 36.9962 26.879 41.2525 26.879 47.0388C26.879 52.8251 27.0717 57.0814 27.2789 59.9868C27.5432 63.6831 30.395 66.5359 34.0934 66.8002C36.9978 67.0074 41.254 67.2001 47.0403 67.2001C52.8266 67.2001 57.0829 67.0074 59.9884 66.8002C63.6846 66.5359 66.5374 63.6842 66.8018 59.9857C67.009 57.0814 67.2016 52.8251 67.2016 47.0388C67.2016 41.2525 67.009 36.9962 66.8018 34.0908C66.5374 30.3945 63.6857 27.5417 59.9872 27.2774C57.0829 27.0702 52.8266 26.8775 47.0403 26.8775ZM51.5206 38.0782C51.5206 36.89 51.9927 35.7504 52.8329 34.9102C53.6731 34.07 54.8127 33.5979 56.0009 33.5979C57.1892 33.5979 58.3287 34.07 59.1689 34.9102C60.0092 35.7504 60.4812 36.89 60.4812 38.0782C60.4812 39.2665 60.0092 40.4061 59.1689 41.2463C58.3287 42.0865 57.1892 42.5585 56.0009 42.5585C54.8127 42.5585 53.6731 42.0865 52.8329 41.2463C51.9927 40.4061 51.5206 39.2665 51.5206 38.0782ZM63.7484 53.636C62.5573 52.5479 61.3386 51.4902 60.0936 50.464C58.4214 49.0953 56.1768 48.8791 54.341 50.1033C53.1492 50.8986 51.5497 52.0803 49.4922 53.8231C46.3661 50.8471 44.183 48.9463 42.7269 47.7545C41.0536 46.3869 38.8089 46.1696 36.9731 47.3939C35.4521 48.4087 33.2623 50.0563 30.3065 52.6985C30.3804 55.6242 30.5036 57.9584 30.6313 59.7471C30.7769 61.7778 32.3024 63.3034 34.3331 63.4479C37.1523 63.6495 41.328 63.8399 47.0403 63.8399C52.7527 63.8399 56.9283 63.6495 59.7487 63.4479C61.7794 63.3023 63.3049 61.7778 63.4494 59.7471C63.5636 58.1533 63.6734 56.1271 63.7484 53.636Z"
                        fill="#102A4C"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.blog_date}>{item.date}</div>
                    <div className={styles.blog_title}>
                      {getTitleByLanguage(item)}
                    </div>
                    <div className={styles.blog_subtitle}>
                      {getDescriptionByLanguage(item)}
                    </div>
                    {item.images && item.images.length > 0 && (
                      <div className={styles.galery_images}>
                        {item.images.map((image, imgIndex) => (
                          <a
                            key={imgIndex}
                            href={image.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.galery_image_link}
                          >
                            <img
                              src={image.url}
                              alt={getTitleByLanguage(item)}
                              loading="lazy"
                              className={styles.galery_image}
                            />
                          </a>
                        ))}
                      </div>
                    )}
                    {hasLink && (
                      <a href={item.to!} className={styles.link}>
                        See all materials{' '}
                        <Icon type={'arrow_right'} color={'rgb(208, 173, 240)'} />
                      </a>
                    )}
                  </div>
                </div>
                // <Link
                //   key={index}
                //   to={hasLink ? item.to! : '#'}
                //   className={styles.blog}
                //   style={{ cursor: hasLink ? 'pointer' : 'default' }} // Change cursor based on 'to'
                // >
                //   <div className={styles.blog_date}>{item.date}</div>
                //   <div className={styles.blog_title}>
                //     {getTitleByLanguage(item)}
                //   </div>
                //   <div className={styles.blog_subtitle}>
                //     {getDescriptionByLanguage(item)}
                //   </div>
                // </Link>
              );
            })}
          </div>
        </div>
      </Page>
      <Footer button={false} />
    </div>
  );
};

export default Galery;
