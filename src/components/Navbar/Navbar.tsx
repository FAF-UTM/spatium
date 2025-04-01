import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../Icon.tsx';
import Button from '../Button.tsx';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
  theme?: string;
}
const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const toggleMenuVisibility = () => setIsMenuVisible(!isMenuVisible);
  const toggleMenu = (menuKey: string) => {
    if (activeMenu !== menuKey) {
      setActiveMenu(menuKey);
    } else {
      setActiveMenu(null);
    }
  };

  const navigate = useNavigate();
  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      const pathParts = location.pathname.split('/').filter(Boolean);
      if (['en', 'ro', 'ru'].includes(pathParts[0])) {
        pathParts[0] = lang;
      } else {
        pathParts.unshift(lang);
      }
      const newPath = `/${pathParts.join('/')}/`.replace(/\/+$/, '/');
      navigate(newPath);
      localStorage.setItem('i18nextLng', lang);
    });
  };

  return (
    <div
      className={`${styles.topnav} ${theme != 'dark' && styles.theme_light}`}
    >
      <Link to="/" className={styles.topbnav_menu_home}>
        <svg
          width="92"
          height="87"
          viewBox="0 0 92 87"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M92 0H0V87H92V0Z" fill="#F9B517" />
          <path
            d="M11.5453 17.0703V13.5461H8.76632V17.0703H6.75789V8.36715H8.76632V11.7398H11.5453V8.36715H13.5789V17.0703H11.5453ZM21.9178 14.304C21.9178 14.784 21.8209 15.2008 21.6272 15.5545C21.4336 15.9082 21.1767 16.2072 20.8567 16.4514C20.5367 16.6872 20.1704 16.864 19.7578 16.9819C19.3536 17.0998 18.9367 17.1587 18.5072 17.1587C18.0778 17.1587 17.6567 17.104 17.2441 16.9945C16.8399 16.8766 16.4778 16.704 16.1578 16.4766C15.8378 16.2408 15.5809 15.9503 15.3872 15.605C15.1936 15.2514 15.0967 14.8345 15.0967 14.3545V8.36715H17.1051V13.9756C17.1051 14.2282 17.1472 14.4429 17.2314 14.6198C17.3157 14.7882 17.4251 14.9272 17.5599 15.0366C17.6946 15.1377 17.842 15.2135 18.002 15.264C18.1704 15.3145 18.3388 15.3398 18.5072 15.3398C18.6672 15.3398 18.8314 15.3145 18.9999 15.264C19.1683 15.2135 19.3157 15.1377 19.442 15.0366C19.5767 14.9272 19.6862 14.7882 19.7704 14.6198C19.8546 14.4429 19.8967 14.2282 19.8967 13.9756V8.36715H21.9178V14.304ZM30.0545 13.0156L29.2334 14.5819L28.4755 15.9082H27.0482L26.2776 14.5314L25.4945 13.0282H25.4439V17.0703H23.4355V8.36715H25.2797L26.7197 11.1966L27.7429 13.2682H27.8187L28.8797 11.1208L30.2566 8.36715H32.1008V17.0703H30.0924V13.0156H30.0545ZM38.3871 15.3524H35.5829L35.065 17.0703H32.905L35.9744 8.36715H38.046L41.065 17.0703H38.9176L38.3871 15.3524ZM36.0881 13.7103H37.8818L37.705 13.1166L37.0102 10.7166H36.9597L36.265 13.1166L36.0881 13.7103ZM43.9472 12.0682V17.0703H41.9388V8.36715H43.7451L45.1978 10.4766L47.1051 13.3693H47.143V8.36715H49.1388V17.0703H47.3451L45.5515 14.4177L44.0104 12.0682H43.9472Z"
            fill="#231F20"
          />
          <path
            d="M10.3453 23.1735V30.0703H8.33684V23.1735H6.12632V21.3672H12.5432V23.1735H10.3453ZM17.3472 21.3672C17.8272 21.3672 18.2356 21.4472 18.5725 21.6072C18.9093 21.7672 19.183 21.9777 19.3935 22.2387C19.6125 22.4998 19.7683 22.7987 19.8609 23.1356C19.9619 23.464 20.0125 23.7966 20.0125 24.1335C20.0125 24.3608 19.9788 24.5924 19.9114 24.8282C19.844 25.0556 19.7472 25.2745 19.6209 25.485C19.503 25.6872 19.3556 25.8808 19.1788 26.0661C19.0019 26.2429 18.804 26.3945 18.5851 26.5208L20.1388 30.0703H17.9914L16.6777 26.8619H15.4398V30.0703H13.4314V21.3672H17.3472ZM15.4398 25.1061H16.9304C17.3009 25.1061 17.5662 25.0135 17.7262 24.8282C17.8946 24.6345 17.9788 24.4029 17.9788 24.1335C17.9788 23.864 17.8946 23.6366 17.7262 23.4514C17.5577 23.2577 17.2925 23.1608 16.9304 23.1608H15.4398V25.1061ZM25.8542 28.3524H23.05L22.5321 30.0703H20.3721L23.4415 21.3672H25.5131L28.5321 30.0703H26.3847L25.8542 28.3524ZM23.5552 26.7103H25.3489L25.1721 26.1166L24.4773 23.7166H24.4268L23.7321 26.1166L23.5552 26.7103ZM31.4143 24.8787H34.888V26.6598H31.4143V30.0703H29.4059V21.3672H35.4817V23.1608H31.4143V24.8787ZM38.3716 24.8787H41.8453V26.6598H38.3716V30.0703H36.3632V21.3672H42.4389V23.1608H38.3716V24.8787ZM45.5814 21.3672V30.0703H43.573V21.3672H45.5814ZM52.5331 23.7293C52.2467 23.485 51.952 23.325 51.6488 23.2493C51.3541 23.165 51.0678 23.1229 50.7899 23.1229C50.6215 23.1229 50.4531 23.1482 50.2846 23.1987C50.1162 23.2493 49.9646 23.3293 49.8299 23.4387C49.6952 23.5398 49.5815 23.6787 49.4889 23.8556C49.4046 24.024 49.3625 24.2345 49.3625 24.4872V26.9503C49.3625 27.2029 49.4046 27.4177 49.4889 27.5945C49.5815 27.7629 49.6952 27.9019 49.8299 28.0114C49.9731 28.1124 50.1288 28.1882 50.2973 28.2387C50.4657 28.2893 50.6341 28.3145 50.8025 28.3145C51.072 28.3145 51.3499 28.2766 51.6362 28.2008C51.9225 28.1166 52.2257 27.9524 52.5457 27.7082L53.4931 29.2745C53.1394 29.5693 52.7225 29.7924 52.2425 29.944C51.771 30.0872 51.2783 30.1587 50.7646 30.1587C50.3604 30.1587 49.952 30.104 49.5394 29.9945C49.1352 29.885 48.7688 29.7166 48.4404 29.4893C48.1204 29.2619 47.8594 28.9756 47.6573 28.6303C47.4552 28.2766 47.3541 27.8598 47.3541 27.3798V24.0956C47.3541 23.6156 47.451 23.2029 47.6446 22.8577C47.8467 22.504 48.1078 22.2135 48.4278 21.9861C48.7478 21.7503 49.1057 21.5777 49.5015 21.4682C49.9057 21.3503 50.3141 21.2914 50.7267 21.2914C51.2404 21.2914 51.7457 21.3629 52.2425 21.5061C52.7394 21.6493 53.1604 21.8724 53.5057 22.1756L52.5331 23.7293ZM57.6507 26.4829L56.6528 27.6324V30.0703H54.6444V21.3672H56.6528V24.765L59.5328 21.3672H61.9076L58.977 24.904L62.0591 30.0703H59.7097L57.6507 26.4829ZM65.0839 21.3672V30.0703H63.0755V21.3672H65.0839ZM68.865 25.0682V30.0703H66.8566V21.3672H68.6629L70.1155 23.4766L72.0229 26.3693H72.0608V21.3672H74.0566V30.0703H72.2629L70.4692 27.4177L68.9282 25.0682H68.865ZM81.9315 28.8703C81.7378 29.1145 81.5146 29.3208 81.262 29.4893C81.0178 29.6493 80.7652 29.7798 80.5041 29.8808C80.2431 29.9819 79.982 30.0535 79.721 30.0956C79.4599 30.1377 79.2157 30.1587 78.9883 30.1587C78.5925 30.1587 78.1925 30.104 77.7883 29.9945C77.3841 29.885 77.0178 29.7166 76.6894 29.4893C76.361 29.2619 76.0915 28.9756 75.881 28.6303C75.6788 28.2766 75.5778 27.8598 75.5778 27.3798V24.1335C75.5778 23.6535 75.6746 23.2366 75.8683 22.8829C76.0704 22.5293 76.3315 22.2345 76.6515 21.9987C76.9799 21.7545 77.3462 21.5735 77.7504 21.4556C78.1546 21.3377 78.5673 21.2787 78.9883 21.2787C79.502 21.2787 80.0157 21.3545 80.5294 21.5061C81.0515 21.6493 81.4852 21.8724 81.8304 22.1756L80.8578 23.7293C80.5715 23.485 80.2641 23.325 79.9357 23.2493C79.6157 23.165 79.3167 23.1229 79.0388 23.1229C78.8704 23.1229 78.702 23.1482 78.5336 23.1987C78.3652 23.2493 78.2094 23.3293 78.0662 23.4387C77.9231 23.5398 77.8052 23.6787 77.7125 23.8556C77.6283 24.024 77.5862 24.2345 77.5862 24.4872V26.9503C77.5862 27.2029 77.6283 27.4177 77.7125 27.5945C77.7967 27.7629 77.9062 27.9019 78.041 28.0114C78.1757 28.1124 78.3231 28.1882 78.4831 28.2387C78.6515 28.2893 78.8199 28.3145 78.9883 28.3145C79.1399 28.3145 79.2957 28.2935 79.4557 28.2514C79.6241 28.2093 79.7799 28.1293 79.9231 28.0114V26.8366H78.7231V25.144H81.9315V28.8703Z"
            fill="#231F20"
          />
          <path
            d="M10.6737 34.3672C11.1537 34.3672 11.5621 34.4472 11.8989 34.6072C12.2358 34.7672 12.5095 34.9777 12.72 35.2387C12.9389 35.4998 13.0947 35.7987 13.1874 36.1356C13.2884 36.464 13.3389 36.7966 13.3389 37.1335C13.3389 37.3608 13.3053 37.5924 13.2379 37.8282C13.1705 38.0556 13.0737 38.2745 12.9474 38.485C12.8295 38.6872 12.6821 38.8808 12.5053 39.0661C12.3284 39.2429 12.1305 39.3945 11.9116 39.5208L13.4653 43.0703H11.3179L10.0042 39.8619H8.76632V43.0703H6.75789V34.3672H10.6737ZM8.76632 38.1061H10.2568C10.6274 38.1061 10.8926 38.0135 11.0526 37.8282C11.2211 37.6345 11.3053 37.4029 11.3053 37.1335C11.3053 36.864 11.2211 36.6366 11.0526 36.4514C10.8842 36.2577 10.6189 36.1608 10.2568 36.1608H8.76632V38.1061ZM14.4059 34.3672H20.4817V36.1608H16.4143V37.7903H19.888V39.5714H16.4143V41.2893H20.4817V43.0703H14.4059V34.3672ZM28.4388 40.5187C28.4388 40.9566 28.3462 41.3398 28.1609 41.6682C27.9757 41.9882 27.723 42.2577 27.403 42.4766C27.0914 42.6956 26.7209 42.8598 26.2914 42.9693C25.8704 43.0787 25.4241 43.1335 24.9525 43.1335C24.6325 43.1335 24.3209 43.1166 24.0178 43.0829C23.723 43.0493 23.4367 42.9903 23.1588 42.9061C22.8809 42.8135 22.603 42.6914 22.3251 42.5398C22.0557 42.3798 21.7862 42.1819 21.5167 41.9461L22.6409 40.4682C23.0114 40.7629 23.382 40.9819 23.7525 41.125C24.1314 41.2598 24.5104 41.3272 24.8893 41.3272C25.1672 41.3272 25.3988 41.3019 25.5841 41.2514C25.7693 41.2008 25.9167 41.1377 26.0262 41.0619C26.1441 40.9777 26.2241 40.8893 26.2662 40.7966C26.3167 40.704 26.342 40.6156 26.342 40.5314C26.342 40.405 26.3083 40.2956 26.2409 40.2029C26.182 40.1019 26.0767 40.0093 25.9251 39.925C25.7736 39.8408 25.5714 39.7566 25.3188 39.6724C25.0746 39.5882 24.7672 39.4956 24.3967 39.3945C23.9925 39.285 23.6346 39.1629 23.323 39.0282C23.0114 38.885 22.7462 38.7166 22.5272 38.5229C22.3167 38.3208 22.1567 38.085 22.0472 37.8156C21.9378 37.5461 21.883 37.2219 21.883 36.8429C21.883 36.4472 21.9588 36.0935 22.1104 35.7819C22.2704 35.4619 22.4893 35.1924 22.7672 34.9735C23.0536 34.7461 23.3904 34.5735 23.7778 34.4556C24.1736 34.3377 24.603 34.2787 25.0662 34.2787C25.5714 34.2787 26.0683 34.325 26.5567 34.4177C27.0536 34.5103 27.5672 34.7335 28.0978 35.0872L27.2009 36.704C26.7883 36.4429 26.4093 36.2787 26.0641 36.2114C25.7272 36.144 25.3862 36.1103 25.0409 36.1103C24.7209 36.1103 24.4599 36.165 24.2578 36.2745C24.0641 36.3756 23.9672 36.5482 23.9672 36.7924C23.9672 36.9019 23.9967 37.0029 24.0557 37.0956C24.123 37.1798 24.2325 37.264 24.3841 37.3482C24.5357 37.4324 24.7336 37.5166 24.9778 37.6008C25.222 37.6766 25.5209 37.765 25.8746 37.8661C26.4304 38.0177 26.8767 38.1903 27.2136 38.384C27.5504 38.5693 27.8072 38.7756 27.9841 39.0029C28.1693 39.2219 28.2914 39.4619 28.3504 39.7229C28.4093 39.9756 28.4388 40.2408 28.4388 40.5187ZM29.6403 34.3672H35.7161V36.1608H31.6487V37.7903H35.1224V39.5714H31.6487V41.2893H35.7161V43.0703H29.6403V34.3672ZM41.8164 41.3524H39.0121L38.4942 43.0703H36.3342L39.4037 34.3672H41.4753L44.4942 43.0703H42.3469L41.8164 41.3524ZM39.5174 39.7103H41.3111L41.1342 39.1166L40.4395 36.7166H40.389L39.6942 39.1166L39.5174 39.7103ZM49.2839 34.3672C49.7639 34.3672 50.1723 34.4472 50.5091 34.6072C50.846 34.7672 51.1197 34.9777 51.3302 35.2387C51.5491 35.4998 51.7049 35.7987 51.7976 36.1356C51.8986 36.464 51.9491 36.7966 51.9491 37.1335C51.9491 37.3608 51.9155 37.5924 51.8481 37.8282C51.7807 38.0556 51.6839 38.2745 51.5576 38.485C51.4397 38.6872 51.2923 38.8808 51.1155 39.0661C50.9386 39.2429 50.7407 39.3945 50.5218 39.5208L52.0755 43.0703H49.9281L48.6144 39.8619H47.3765V43.0703H45.3681V34.3672H49.2839ZM47.3765 38.1061H48.867C49.2376 38.1061 49.5028 38.0135 49.6628 37.8282C49.8313 37.6345 49.9155 37.4029 49.9155 37.1335C49.9155 36.864 49.8313 36.6366 49.6628 36.4514C49.4944 36.2577 49.2291 36.1608 48.867 36.1608H47.3765V38.1061ZM58.1951 36.7293C57.9088 36.485 57.614 36.325 57.3109 36.2493C57.0161 36.165 56.7298 36.1229 56.4519 36.1229C56.2835 36.1229 56.1151 36.1482 55.9466 36.1987C55.7782 36.2493 55.6266 36.3293 55.4919 36.4387C55.3572 36.5398 55.2435 36.6787 55.1509 36.8556C55.0666 37.024 55.0245 37.2345 55.0245 37.4872V39.9503C55.0245 40.2029 55.0666 40.4177 55.1509 40.5945C55.2435 40.7629 55.3572 40.9019 55.4919 41.0114C55.6351 41.1124 55.7909 41.1882 55.9593 41.2387C56.1277 41.2893 56.2961 41.3145 56.4645 41.3145C56.734 41.3145 57.0119 41.2766 57.2982 41.2008C57.5845 41.1166 57.8877 40.9524 58.2077 40.7082L59.1551 42.2745C58.8014 42.5693 58.3845 42.7924 57.9045 42.944C57.433 43.0872 56.9403 43.1587 56.4266 43.1587C56.0224 43.1587 55.614 43.104 55.2014 42.9945C54.7972 42.885 54.4309 42.7166 54.1024 42.4893C53.7824 42.2619 53.5214 41.9756 53.3193 41.6303C53.1172 41.2766 53.0161 40.8598 53.0161 40.3798V37.0956C53.0161 36.6156 53.113 36.2029 53.3066 35.8577C53.5088 35.504 53.7698 35.2135 54.0898 34.9861C54.4098 34.7503 54.7677 34.5777 55.1635 34.4682C55.5677 34.3503 55.9761 34.2914 56.3888 34.2914C56.9024 34.2914 57.4077 34.3629 57.9045 34.5061C58.4014 34.6493 58.8224 34.8724 59.1677 35.1756L58.1951 36.7293ZM65.0938 43.0703V39.5461H62.3148V43.0703H60.3064V34.3672H62.3148V37.7398H65.0938V34.3672H67.1275V43.0703H65.0938Z"
            fill="#231F20"
          />
          <path
            d="M11.9368 49.7293C11.6505 49.485 11.3558 49.325 11.0526 49.2493C10.7579 49.165 10.4716 49.1229 10.1937 49.1229C10.0253 49.1229 9.85684 49.1482 9.68842 49.1987C9.52 49.2493 9.36842 49.3293 9.23368 49.4387C9.09895 49.5398 8.98526 49.6787 8.89263 49.8556C8.80842 50.024 8.76632 50.2345 8.76632 50.4872V52.9503C8.76632 53.2029 8.80842 53.4177 8.89263 53.5945C8.98526 53.7629 9.09895 53.9019 9.23368 54.0114C9.37684 54.1124 9.53263 54.1882 9.70105 54.2387C9.86947 54.2893 10.0379 54.3145 10.2063 54.3145C10.4758 54.3145 10.7537 54.2766 11.04 54.2008C11.3263 54.1166 11.6295 53.9524 11.9495 53.7082L12.8968 55.2745C12.5432 55.5693 12.1263 55.7924 11.6463 55.944C11.1747 56.0872 10.6821 56.1587 10.1684 56.1587C9.76421 56.1587 9.35579 56.104 8.94316 55.9945C8.53895 55.885 8.17263 55.7166 7.84421 55.4893C7.52421 55.2619 7.26316 54.9756 7.06105 54.6303C6.85895 54.2766 6.75789 53.8598 6.75789 53.3798V50.0956C6.75789 49.6156 6.85474 49.2029 7.04842 48.8577C7.25053 48.504 7.51158 48.2135 7.83158 47.9861C8.15158 47.7503 8.50947 47.5777 8.90526 47.4682C9.30947 47.3503 9.7179 47.2914 10.1305 47.2914C10.6442 47.2914 11.1495 47.3629 11.6463 47.5061C12.1432 47.6493 12.5642 47.8724 12.9095 48.1756L11.9368 49.7293ZM14.0482 47.3672H20.124V49.1608H16.0566V50.7903H19.5303V52.5714H16.0566V54.2893H20.124V56.0703H14.0482V47.3672ZM23.4579 51.0682V56.0703H21.4495V47.3672H23.2558L24.7085 49.4766L26.6158 52.3693H26.6537V47.3672H28.6495V56.0703H26.8558L25.0621 53.4177L23.5211 51.0682H23.4579ZM33.7581 49.1735V56.0703H31.7497V49.1735H29.5391V47.3672H35.956V49.1735H33.7581ZM36.8442 47.3672H42.92V49.1608H38.8527V50.7903H42.3263V52.5714H38.8527V54.2893H42.92V56.0703H36.8442V47.3672ZM48.1614 47.3672C48.6414 47.3672 49.0498 47.4472 49.3866 47.6072C49.7235 47.7672 49.9971 47.9777 50.2077 48.2387C50.4266 48.4998 50.5824 48.7987 50.675 49.1356C50.7761 49.464 50.8266 49.7966 50.8266 50.1335C50.8266 50.3608 50.7929 50.5924 50.7256 50.8282C50.6582 51.0556 50.5614 51.2745 50.435 51.485C50.3171 51.6872 50.1698 51.8808 49.9929 52.0661C49.8161 52.2429 49.6182 52.3945 49.3992 52.5208L50.9529 56.0703H48.8056L47.4919 52.8619H46.254V56.0703H44.2456V47.3672H48.1614ZM46.254 51.1061H47.7445C48.115 51.1061 48.3803 51.0135 48.5403 50.8282C48.7087 50.6345 48.7929 50.4029 48.7929 50.1335C48.7929 49.864 48.7087 49.6366 48.5403 49.4514C48.3719 49.2577 48.1066 49.1608 47.7445 49.1608H46.254V51.1061Z"
            fill="#231F20"
          />
          <line
            x1="5.7002"
            y1="63.7461"
            x2="83.7002"
            y2="63.7461"
            stroke="#231F20"
            strokeWidth="2"
          />
        </svg>
      </Link>
      <div
        className={`${styles.topnav_right} ${isMenuVisible ? styles.topnav_right_show : ''}`}
      >
        <div
          className={styles.topbnav_menu}
          onClick={() => toggleMenu('menu_1')}
        >
          <Icon
            type="plus"
            color={'var(--theme_primary_color_yellow_0)'}
            className={`${styles.topbnav_menu_icon} ${
              activeMenu === 'menu_1' && styles.topbnav_menu_icon_rotate
            }`}
          />
          <span className={'span_special_text'}>{t('navbar.media')}</span>
          <div
            className={`${styles.topbnav_submenu} ${
              activeMenu === 'menu_1' && styles.topbnav_submenu_show
            } ${theme != 'dark' && styles.theme_light_menu}`}
          >
            <Link to={'/news'} className={styles.topbnav_submenu_btn}>
              {t('navbar.news')}
            </Link>
            <Link to={'/gallery'} className={styles.topbnav_submenu_btn}>
              {t('navbar.gallery')}
            </Link>
          </div>
        </div>
        <div
          className={styles.topbnav_menu}
          onClick={() => toggleMenu('menu_2')}
        >
          <Icon
            type="plus"
            color={'var(--theme_primary_color_yellow_0)'}
            className={`${styles.topbnav_menu_icon} ${
              activeMenu === 'menu_2' && styles.topbnav_menu_icon_rotate
            }`}
          />
          <span className={'span_special_text'}>{t('navbar.about_us')}</span>
          <div
            className={`${styles.topbnav_submenu} ${
              activeMenu === 'menu_2' && styles.topbnav_submenu_show
            } ${theme != 'dark' && styles.theme_light_menu}`}
          >
            <Link to={'/about'} className={styles.topbnav_submenu_btn}>
              About us
            </Link>
            <Link to={'/history'} className={styles.topbnav_submenu_btn}>
              Our history
            </Link>
            <Link to={'/comunity'} className={styles.topbnav_submenu_btn}>
              Comunity
            </Link>
          </div>
        </div>
        <Link to="/projects" className={styles.topbnav_menu}>
          <Icon type={'empty'} className={styles.topbnav_menu_mobile_desktop} />
          {t('navbar.projects')}
        </Link>

        <Button
          style={{ textTransform: 'uppercase' }}
          className={styles.topbnav_menu_contactus}
          color={'var(--theme_primary_color_blue_0)'}
          bgcolor={'var(--theme_primary_color_blue_4)'}
          border={'var(--theme_primary_color_blue_4)'}
          hover_bgcolor={'var(--theme_primary_color_yellow_0)'}
          hover_border={'var(--theme_primary_color_yellow_0)'}
          to="/contacts"
          icon={'arrow_right'}
        >
          <span className={'span_special_text'}>{t('navbar.contact_us')}</span>
        </Button>

        <div
          className={`${styles.topbnav_menu_lang_btn} ${styles.topbnav_menu_mobile_desktop_only}`}
          onClick={() => toggleMenu('menu_3')}
        >
          <div>
            {i18n.language === 'en' ? (
              <Icon type="en" size="28px" />
            ) : i18n.language === 'ro' ? (
              <Icon type="ro" size="28px" />
            ) : (
              <Icon type="ru" size="28px" />
            )}
          </div>

          <div
            className={`${styles.topbnav_submenu_lang_popup} ${
              activeMenu === 'menu_3' && styles.topbnav_submenu_lang_popup_show
            }`}
          >
            <Icon type="en" onClick={() => handleChangeLanguage('en')} />
            <Icon type="ro" onClick={() => handleChangeLanguage('ro')} />
            <Icon type="ru" onClick={() => handleChangeLanguage('ru')} />
          </div>
        </div>
      </div>

      <div className={`${styles.topbnav_menu_mobile_block}`}>
        <div
          className={` ${styles.topbnav_menu_mobile} ${styles.topbnav_menu_lang_btn}`}
          onClick={() => {
            setIsMenuVisible(false);
            toggleMenu('menu_4');
          }}
        >
          <div>
            {i18n.language === 'en' ? (
              <Icon type="en" size="28px" />
            ) : i18n.language === 'ro' ? (
              <Icon type="ro" size="28px" />
            ) : (
              <Icon type="ru" size="28px" />
            )}
          </div>
          <div
            style={{ marginTop: '10px' }}
            className={`${styles.topbnav_submenu_lang_popup} ${
              activeMenu === 'menu_4' && styles.topbnav_submenu_lang_popup_show
            }`}
          >
            <Icon type="en" onClick={() => handleChangeLanguage('en')} />
            <Icon type="ro" onClick={() => handleChangeLanguage('ro')} />
            <Icon type="ru" onClick={() => handleChangeLanguage('ru')} />
          </div>
        </div>
        <Icon
          type="menu"
          color={theme != 'dark' ? 'var(--theme_primary_color_blue_0)' : '#fff'}
          className={styles.topbnav_menu_mobile}
          onClick={toggleMenuVisibility}
        />
      </div>
    </div>
  );
};

export default Navbar;
