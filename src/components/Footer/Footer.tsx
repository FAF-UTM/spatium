import React from 'react';
import './Footer.css';
import Button from '../Button.tsx';
import Icon from '../Icon.tsx';
import { useTranslation } from 'react-i18next';
import LinkButton from '../LinkButton.tsx';

interface FooterProps {
  button?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Footer: React.FC<FooterProps> = ({
  button = true,
  style,
  className = '',
}) => {
  const {
    t,
    i18n: {},
  } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // This triggers the smooth scrolling
    });
  };

  return (
    <div className={`footer ${className}`} style={{ ...style }}>
      <div className="footer_main">
        <div className="main">
          <div className="footer_main_top">
            <svg
              width="56"
              height="53"
              viewBox="0 0 56 53"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M55.6 0.398438H0.400024V52.5984H55.6V0.398438Z"
                fill="#F9B517"
              />
              <path
                d="M7.32716 10.0391V7.92454H5.65979V10.0391H4.45474V4.81717H5.65979V6.84075H7.32716V4.81717H8.54737V10.0391H7.32716ZM13.5507 8.37927C13.5507 8.66727 13.4926 8.91738 13.3763 9.12959C13.2601 9.3418 13.106 9.52117 12.914 9.66769C12.722 9.80917 12.5022 9.91527 12.2547 9.98601C12.0121 10.0567 11.762 10.0921 11.5043 10.0921C11.2467 10.0921 10.994 10.0593 10.7464 9.99359C10.5039 9.92285 10.2867 9.81927 10.0947 9.68285C9.90266 9.54138 9.74855 9.36706 9.63234 9.1599C9.51613 8.94769 9.45803 8.69759 9.45803 8.40959V4.81717H10.6631V8.18222C10.6631 8.3338 10.6883 8.46264 10.7389 8.56875C10.7894 8.6698 10.8551 8.75317 10.9359 8.81885C11.0168 8.87948 11.1052 8.92496 11.2012 8.95527C11.3022 8.98559 11.4033 9.00075 11.5043 9.00075C11.6003 9.00075 11.6989 8.98559 11.7999 8.95527C11.901 8.92496 11.9894 8.87948 12.0652 8.81885C12.146 8.75317 12.2117 8.6698 12.2622 8.56875C12.3128 8.46264 12.338 8.3338 12.338 8.18222V4.81717H13.5507V8.37927ZM18.4327 7.60622L17.9401 8.54601L17.4853 9.3418H16.6289L16.1666 8.51569L15.6967 7.6138H15.6664V10.0391H14.4613V4.81717H15.5678L16.4318 6.51485L17.0457 7.7578H17.0912L17.7278 6.46938L18.5539 4.81717H19.6605V10.0391H18.4554V7.60622H18.4327ZM23.4322 9.00833H21.7497L21.439 10.0391H20.143L21.9847 4.81717H23.2276L25.039 10.0391H23.7506L23.4322 9.00833ZM22.0529 8.02306H23.1291L23.023 7.66685L22.6061 6.22685H22.5758L22.159 7.66685L22.0529 8.02306ZM26.7683 7.0378V10.0391H25.5633V4.81717H26.6471L27.5187 6.08285L28.6631 7.81843H28.6858V4.81717H29.8833V10.0391H28.8071L27.7309 8.44748L26.8062 7.0378H26.7683Z"
                fill="#231F20"
              />
              <path
                d="M6.60716 13.7017V17.8398H5.40211V13.7017H4.07579V12.6179H7.9259V13.7017H6.60716ZM10.8083 12.6179C11.0963 12.6179 11.3414 12.6659 11.5435 12.7619C11.7456 12.8579 11.9098 12.9843 12.0361 13.1409C12.1675 13.2975 12.261 13.4769 12.3165 13.679C12.3772 13.8761 12.4075 14.0756 12.4075 14.2777C12.4075 14.4142 12.3873 14.5531 12.3468 14.6946C12.3064 14.831 12.2483 14.9624 12.1725 15.0887C12.1018 15.2099 12.0134 15.3262 11.9073 15.4373C11.8012 15.5434 11.6824 15.6344 11.5511 15.7102L12.4833 17.8398H11.1948L10.4066 15.9148H9.6639V17.8398H8.45885V12.6179H10.8083ZM9.6639 14.8613H10.5582C10.7805 14.8613 10.9397 14.8057 11.0357 14.6946C11.1367 14.5784 11.1873 14.4394 11.1873 14.2777C11.1873 14.1161 11.1367 13.9796 11.0357 13.8685C10.9346 13.7523 10.7755 13.6942 10.5582 13.6942H9.6639V14.8613ZM15.9125 16.8091H14.23L13.9192 17.8398H12.6232L14.4649 12.6179H15.7079L17.5192 17.8398H16.2308L15.9125 16.8091ZM14.5331 15.8238H15.6093L15.5032 15.4676L15.0864 14.0276H15.0561L14.6392 15.4676L14.5331 15.8238ZM19.2486 14.7249H21.3328V15.7935H19.2486V17.8398H18.0436V12.6179H21.689V13.6942H19.2486V14.7249ZM23.423 14.7249H25.5072V15.7935H23.423V17.8398H22.2179V12.6179H25.8634V13.6942H23.423V14.7249ZM27.7489 12.6179V17.8398H26.5438V12.6179H27.7489ZM31.9198 14.0352C31.748 13.8887 31.5712 13.7927 31.3893 13.7472C31.2125 13.6967 31.0407 13.6714 30.8739 13.6714C30.7729 13.6714 30.6718 13.6866 30.5708 13.7169C30.4697 13.7472 30.3788 13.7952 30.2979 13.8609C30.2171 13.9215 30.1489 14.0049 30.0933 14.111C30.0428 14.2121 30.0175 14.3384 30.0175 14.4899V15.9678C30.0175 16.1194 30.0428 16.2483 30.0933 16.3544C30.1489 16.4554 30.2171 16.5388 30.2979 16.6045C30.3838 16.6651 30.4773 16.7106 30.5784 16.7409C30.6794 16.7712 30.7805 16.7864 30.8815 16.7864C31.0432 16.7864 31.2099 16.7636 31.3817 16.7182C31.5535 16.6676 31.7354 16.5691 31.9274 16.4226L32.4958 17.3624C32.2836 17.5392 32.0335 17.6731 31.7455 17.7641C31.4626 17.8499 31.167 17.8929 30.8588 17.8929C30.6163 17.8929 30.3712 17.8601 30.1236 17.7944C29.8811 17.7287 29.6613 17.6276 29.4643 17.4912C29.2723 17.3548 29.1156 17.183 28.9944 16.9758C28.8731 16.7636 28.8125 16.5135 28.8125 16.2255V14.255C28.8125 13.967 28.8706 13.7194 28.9868 13.5123C29.108 13.3001 29.2647 13.1257 29.4567 12.9893C29.6487 12.8478 29.8634 12.7443 30.1009 12.6786C30.3434 12.6078 30.5885 12.5725 30.836 12.5725C31.1443 12.5725 31.4474 12.6154 31.7455 12.7013C32.0436 12.7872 32.2963 12.9211 32.5034 13.103L31.9198 14.0352ZM34.9904 15.6874L34.3917 16.3771V17.8398H33.1866V12.6179H34.3917V14.6567L36.1197 12.6179H37.5445L35.7862 14.7401L37.6355 17.8398H36.2258L34.9904 15.6874ZM39.4504 12.6179V17.8398H38.2453V12.6179H39.4504ZM41.719 14.8386V17.8398H40.514V12.6179H41.5977L42.4693 13.8836L43.6137 15.6192H43.6365V12.6179H44.834V17.8398H43.7577L42.6815 16.2483L41.7569 14.8386H41.719ZM49.5589 17.1198C49.4427 17.2664 49.3088 17.3902 49.1572 17.4912C49.0107 17.5872 48.8591 17.6655 48.7025 17.7262C48.5458 17.7868 48.3892 17.8297 48.2326 17.855C48.0759 17.8803 47.9294 17.8929 47.793 17.8929C47.5555 17.8929 47.3155 17.8601 47.073 17.7944C46.8305 17.7287 46.6107 17.6276 46.4136 17.4912C46.2166 17.3548 46.0549 17.183 45.9286 16.9758C45.8073 16.7636 45.7467 16.5135 45.7467 16.2255V14.2777C45.7467 13.9897 45.8048 13.7396 45.921 13.5274C46.0423 13.3152 46.1989 13.1384 46.3909 12.9969C46.5879 12.8504 46.8077 12.7417 47.0503 12.671C47.2928 12.6003 47.5404 12.5649 47.793 12.5649C48.1012 12.5649 48.4094 12.6104 48.7176 12.7013C49.0309 12.7872 49.2911 12.9211 49.4983 13.103L48.9147 14.0352C48.7429 13.8887 48.5585 13.7927 48.3614 13.7472C48.1694 13.6967 47.9901 13.6714 47.8233 13.6714C47.7223 13.6714 47.6212 13.6866 47.5202 13.7169C47.4191 13.7472 47.3256 13.7952 47.2397 13.8609C47.1538 13.9215 47.0831 14.0049 47.0275 14.111C46.977 14.2121 46.9517 14.3384 46.9517 14.4899V15.9678C46.9517 16.1194 46.977 16.2483 47.0275 16.3544C47.0781 16.4554 47.1437 16.5388 47.2246 16.6045C47.3054 16.6651 47.3938 16.7106 47.4898 16.7409C47.5909 16.7712 47.6919 16.7864 47.793 16.7864C47.8839 16.7864 47.9774 16.7737 48.0734 16.7485C48.1745 16.7232 48.2679 16.6752 48.3538 16.6045V15.8996H47.6338V14.8841H49.5589V17.1198Z"
                fill="#231F20"
              />
              <path
                d="M6.80421 20.4187C7.09221 20.4187 7.33726 20.4667 7.53937 20.5627C7.74147 20.6587 7.90568 20.785 8.032 20.9417C8.16337 21.0983 8.25684 21.2777 8.31242 21.4798C8.37305 21.6768 8.40337 21.8764 8.40337 22.0785C8.40337 22.2149 8.38316 22.3539 8.34274 22.4954C8.30232 22.6318 8.24421 22.7632 8.16842 22.8895C8.09768 23.0107 8.00926 23.1269 7.90316 23.2381C7.79705 23.3442 7.67832 23.4352 7.54695 23.5109L8.47916 25.6406H7.19074L6.40253 23.7156H5.65979V25.6406H4.45474V20.4187H6.80421ZM5.65979 22.6621H6.55411C6.77642 22.6621 6.93558 22.6065 7.03158 22.4954C7.13263 22.3792 7.18316 22.2402 7.18316 22.0785C7.18316 21.9168 7.13263 21.7804 7.03158 21.6693C6.93053 21.553 6.77137 21.4949 6.55411 21.4949H5.65979V22.6621ZM9.04355 20.4187H12.689V21.4949H10.2486V22.4726H12.3328V23.5413H10.2486V24.572H12.689V25.6406H9.04355V20.4187ZM17.4633 24.1097C17.4633 24.3724 17.4077 24.6023 17.2966 24.7994C17.1854 24.9914 17.0338 25.153 16.8418 25.2844C16.6549 25.4158 16.4326 25.5143 16.1749 25.58C15.9222 25.6457 15.6544 25.6785 15.3715 25.6785C15.1795 25.6785 14.9926 25.6684 14.8107 25.6482C14.6338 25.628 14.462 25.5926 14.2953 25.5421C14.1286 25.4865 13.9618 25.4133 13.7951 25.3223C13.6334 25.2263 13.4717 25.1076 13.31 24.9661L13.9846 24.0794C14.2069 24.2562 14.4292 24.3876 14.6515 24.4735C14.8789 24.5543 15.1062 24.5947 15.3336 24.5947C15.5003 24.5947 15.6393 24.5796 15.7504 24.5493C15.8616 24.5189 15.95 24.481 16.0157 24.4356C16.0864 24.385 16.1344 24.332 16.1597 24.2764C16.19 24.2208 16.2052 24.1678 16.2052 24.1173C16.2052 24.0415 16.185 23.9758 16.1446 23.9202C16.1092 23.8596 16.046 23.804 15.9551 23.7535C15.8641 23.7029 15.7429 23.6524 15.5913 23.6019C15.4448 23.5514 15.2603 23.4958 15.038 23.4352C14.7955 23.3695 14.5808 23.2962 14.3938 23.2154C14.2069 23.1295 14.0477 23.0284 13.9163 22.9122C13.79 22.7909 13.694 22.6495 13.6283 22.4878C13.5627 22.3261 13.5298 22.1316 13.5298 21.9042C13.5298 21.6667 13.5753 21.4545 13.6662 21.2676C13.7622 21.0756 13.8936 20.9139 14.0603 20.7825C14.2321 20.6461 14.4342 20.5425 14.6667 20.4718C14.9041 20.401 15.1618 20.3657 15.4397 20.3657C15.7429 20.3657 16.041 20.3935 16.334 20.449C16.6321 20.5046 16.9403 20.6385 17.2587 20.8507L16.7206 21.8208C16.473 21.6642 16.2456 21.5657 16.0384 21.5253C15.8363 21.4848 15.6317 21.4646 15.4246 21.4646C15.2326 21.4646 15.0759 21.4975 14.9547 21.5632C14.8384 21.6238 14.7803 21.7274 14.7803 21.8739C14.7803 21.9396 14.798 22.0002 14.8334 22.0558C14.8738 22.1063 14.9395 22.1568 15.0304 22.2074C15.1214 22.2579 15.2401 22.3084 15.3867 22.3589C15.5332 22.4044 15.7126 22.4575 15.9248 22.5181C16.2582 22.609 16.526 22.7126 16.7281 22.8288C16.9302 22.94 17.0843 23.0638 17.1904 23.2002C17.3016 23.3316 17.3749 23.4756 17.4102 23.6322C17.4456 23.7838 17.4633 23.9429 17.4633 24.1097ZM18.1842 20.4187H21.8297V21.4949H19.3892V22.4726H21.4734V23.5413H19.3892V24.572H21.8297V25.6406H18.1842V20.4187ZM25.4898 24.6099H23.8073L23.4965 25.6406H22.2005L24.0422 20.4187H25.2852L27.0965 25.6406H25.8081L25.4898 24.6099ZM24.1104 23.6246H25.1867L25.0805 23.2684L24.6637 21.8284H24.6334L24.2165 23.2684L24.1104 23.6246ZM29.9703 20.4187C30.2583 20.4187 30.5034 20.4667 30.7055 20.5627C30.9076 20.6587 31.0718 20.785 31.1981 20.9417C31.3295 21.0983 31.423 21.2777 31.4785 21.4798C31.5392 21.6768 31.5695 21.8764 31.5695 22.0785C31.5695 22.2149 31.5493 22.3539 31.5089 22.4954C31.4684 22.6318 31.4103 22.7632 31.3345 22.8895C31.2638 23.0107 31.1754 23.1269 31.0693 23.2381C30.9632 23.3442 30.8444 23.4352 30.7131 23.5109L31.6453 25.6406H30.3569L29.5686 23.7156H28.8259V25.6406H27.6209V20.4187H29.9703ZM28.8259 22.6621H29.7202C29.9425 22.6621 30.1017 22.6065 30.1977 22.4954C30.2988 22.3792 30.3493 22.2402 30.3493 22.0785C30.3493 21.9168 30.2988 21.7804 30.1977 21.6693C30.0966 21.553 29.9375 21.4949 29.7202 21.4949H28.8259V22.6621ZM35.317 21.836C35.1453 21.6895 34.9684 21.5935 34.7865 21.548C34.6097 21.4975 34.4379 21.4722 34.2711 21.4722C34.1701 21.4722 34.069 21.4874 33.968 21.5177C33.8669 21.548 33.776 21.596 33.6951 21.6617C33.6143 21.7223 33.5461 21.8057 33.4905 21.9118C33.44 22.0128 33.4147 22.1392 33.4147 22.2907V23.7686C33.4147 23.9202 33.44 24.049 33.4905 24.1552C33.5461 24.2562 33.6143 24.3396 33.6951 24.4053C33.781 24.4659 33.8745 24.5114 33.9756 24.5417C34.0766 24.572 34.1777 24.5872 34.2787 24.5872C34.4404 24.5872 34.6071 24.5644 34.7789 24.5189C34.9507 24.4684 35.1326 24.3699 35.3246 24.2234L35.893 25.1632C35.6808 25.34 35.4307 25.4739 35.1427 25.5648C34.8598 25.6507 34.5642 25.6937 34.256 25.6937C34.0135 25.6937 33.7684 25.6608 33.5208 25.5952C33.2783 25.5295 33.0585 25.4284 32.8615 25.292C32.6695 25.1556 32.5128 24.9838 32.3916 24.7766C32.2703 24.5644 32.2097 24.3143 32.2097 24.0263V22.0558C32.2097 21.7678 32.2678 21.5202 32.384 21.313C32.5053 21.1008 32.6619 20.9265 32.8539 20.7901C33.0459 20.6486 33.2606 20.545 33.4981 20.4794C33.7406 20.4086 33.9857 20.3733 34.2333 20.3733C34.5415 20.3733 34.8446 20.4162 35.1427 20.5021C35.4408 20.588 35.6935 20.7219 35.9006 20.9038L35.317 21.836ZM39.4563 25.6406V23.5261H37.7889V25.6406H36.5838V20.4187H37.7889V22.4423H39.4563V20.4187H40.6765V25.6406H39.4563Z"
                fill="#231F20"
              />
              <path
                d="M7.56211 29.6329C7.39032 29.4863 7.21347 29.3903 7.03158 29.3449C6.85474 29.2943 6.68295 29.2691 6.51621 29.2691C6.41516 29.2691 6.31411 29.2842 6.21305 29.3146C6.112 29.3449 6.02105 29.3929 5.94021 29.4586C5.85937 29.5192 5.79116 29.6026 5.73558 29.7087C5.68505 29.8097 5.65979 29.936 5.65979 30.0876V31.5655C5.65979 31.7171 5.68505 31.8459 5.73558 31.952C5.79116 32.0531 5.85937 32.1364 5.94021 32.2021C6.02611 32.2628 6.11958 32.3082 6.22063 32.3386C6.32168 32.3689 6.42274 32.384 6.52379 32.384C6.68547 32.384 6.85221 32.3613 7.024 32.3158C7.19579 32.2653 7.37768 32.1668 7.56968 32.0202L8.13811 32.96C7.9259 33.1369 7.67579 33.2708 7.38779 33.3617C7.10484 33.4476 6.80926 33.4906 6.50105 33.4906C6.25853 33.4906 6.01347 33.4577 5.76589 33.392C5.52337 33.3263 5.30358 33.2253 5.10653 33.0889C4.91453 32.9524 4.75789 32.7807 4.63663 32.5735C4.51537 32.3613 4.45474 32.1112 4.45474 31.8232V29.8527C4.45474 29.5647 4.51284 29.3171 4.62905 29.1099C4.75032 28.8977 4.90695 28.7234 5.09895 28.587C5.29095 28.4455 5.50568 28.3419 5.74316 28.2762C5.98568 28.2055 6.23074 28.1701 6.47832 28.1701C6.78653 28.1701 7.08968 28.2131 7.38779 28.299C7.6859 28.3849 7.93853 28.5188 8.14568 28.7007L7.56211 29.6329ZM8.82891 28.2156H12.4744V29.2918H10.034V30.2695H12.1182V31.3381H10.034V32.3689H12.4744V33.4375H8.82891V28.2156ZM14.4748 30.4362V33.4375H13.2697V28.2156H14.3535L15.2251 29.4813L16.3695 31.2169H16.3922V28.2156H17.5897V33.4375H16.5135L15.4373 31.8459L14.5127 30.4362H14.4748ZM20.6549 29.2994V33.4375H19.4498V29.2994H18.1235V28.2156H21.9736V29.2994H20.6549ZM22.5065 28.2156H26.152V29.2918H23.7116V30.2695H25.7958V31.3381H23.7116V32.3689H26.152V33.4375H22.5065V28.2156ZM29.2968 28.2156C29.5848 28.2156 29.8299 28.2636 30.032 28.3596C30.2341 28.4556 30.3983 28.5819 30.5246 28.7386C30.656 28.8952 30.7494 29.0746 30.805 29.2767C30.8657 29.4737 30.896 29.6733 30.896 29.8754C30.896 30.0118 30.8758 30.1508 30.8353 30.2922C30.7949 30.4287 30.7368 30.56 30.661 30.6863C30.5903 30.8076 30.5019 30.9238 30.3958 31.035C30.2897 31.1411 30.1709 31.232 30.0395 31.3078L30.9718 33.4375H29.6833L28.8951 31.5124H28.1524V33.4375H26.9473V28.2156H29.2968ZM28.1524 30.459H29.0467C29.269 30.459 29.4282 30.4034 29.5242 30.2922C29.6252 30.176 29.6758 30.0371 29.6758 29.8754C29.6758 29.7137 29.6252 29.5773 29.5242 29.4661C29.4231 29.3499 29.264 29.2918 29.0467 29.2918H28.1524V30.459Z"
                fill="#231F20"
              />
              <line
                x1="3.82019"
                y1="38.6461"
                x2="50.6202"
                y2="38.6461"
                stroke="#231F20"
                stroke-width="1.2"
              />
            </svg>

            <div className="footer_main_top_social">
              <a
                href="https://www.facebook.com/profile.php?id=61551722136267"
                id="footer_main_top_social_facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="26"
                  viewBox="0 0 14 26"
                  fill="none"
                >
                  <path
                    d="M12.3183 14.3814L13.0015 9.92709H8.72787V7.03787C8.72787 5.81928 9.32498 4.63018 11.2391 4.63018H13.1822V0.838076C13.1822 0.838076 11.4187 0.537109 9.73281 0.537109C6.21309 0.537109 3.9125 2.67032 3.9125 6.53225V9.92709H0V14.3814H3.9125V25.1491C5.50786 25.3987 7.13251 25.3987 8.72787 25.1491V14.3814H12.3183Z"
                    fill="white"
                  />
                </svg>
              </a>
              {/*<a href="" id="footer_main_top_social_tiktok">*/}
              {/*  <svg*/}
              {/*    width="25"*/}
              {/*    height="26"*/}
              {/*    viewBox="0 0 25 26"*/}
              {/*    fill="none"*/}
              {/*    xmlns="http://www.w3.org/2000/svg"*/}
              {/*  >*/}
              {/*    <path*/}
              {/*      d="M18.0665 9.39187C19.8027 10.5682 21.9296 11.2603 24.2268 11.2603V7.07055C23.792 7.07064 23.3584 7.02767 22.9331 6.94226V10.2402C20.6361 10.2402 18.5094 9.54808 16.7728 8.37184V16.9219C16.7728 21.1991 13.1145 24.6663 8.60207 24.6663C6.91838 24.6663 5.35345 24.1838 4.05347 23.3564C5.53718 24.7943 7.60634 25.6863 9.8955 25.6863C14.4082 25.6863 18.0667 22.2192 18.0667 17.9418V9.39187H18.0665ZM19.6624 5.16491C18.7751 4.24613 18.1925 3.05878 18.0665 1.74611V1.20721H16.8405C17.1491 2.87562 18.2017 4.301 19.6624 5.16491ZM6.90758 20.0742C6.41184 19.4581 6.14394 18.7045 6.14514 17.9296C6.14514 15.9733 7.81841 14.3872 9.88277 14.3872C10.2675 14.3871 10.6499 14.4429 11.0166 14.5532V10.2698C10.5881 10.2141 10.1556 10.1905 9.7234 10.1992V13.5332C9.35648 13.4229 8.97388 13.3669 8.58906 13.3672C6.5247 13.3672 4.85153 14.9532 4.85153 16.9097C4.85153 18.2931 5.68788 19.4908 6.90758 20.0742Z"*/}
              {/*      fill="white"*/}
              {/*    />*/}
              {/*    <path*/}
              {/*      d="M16.7727 8.37175C18.5093 9.54799 20.636 10.2401 22.933 10.2401V6.94217C21.6508 6.68331 20.5157 6.04824 19.6623 5.16491C18.2015 4.30091 17.149 2.87553 16.8404 1.20721H13.6201V17.9416C13.6128 19.8925 11.9424 21.4722 9.88247 21.4722C8.66859 21.4722 7.59018 20.9237 6.90719 20.0742C5.68759 19.4907 4.85123 18.293 4.85123 16.9098C4.85123 14.9535 6.52441 13.3673 8.58877 13.3673C8.98429 13.3673 9.36551 13.4257 9.7231 13.5332V10.1992C5.28994 10.2861 1.72461 13.7193 1.72461 17.9417C1.72461 20.0495 2.61246 21.9603 4.05345 23.3565C5.35343 24.1838 6.91836 24.6663 8.60205 24.6663C13.1146 24.6663 16.7727 21.1991 16.7727 16.9219V8.37175H16.7727Z"*/}
              {/*      fill="white"*/}
              {/*    />*/}
              {/*  </svg>*/}
              {/*</a>*/}
              <a href="" id="footer_main_top_social_linkedin">
                <svg
                  width="29"
                  height="30"
                  viewBox="0 0 29 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26.7358 0.760254H2.56883C2.01373 0.760254 1.48137 0.980766 1.08886 1.37328C0.696342 1.76579 0.47583 2.29815 0.47583 2.85325V27.0202C0.47583 27.5753 0.696342 28.1076 1.08886 28.5002C1.48137 28.8927 2.01373 29.1132 2.56883 29.1132H26.7358C27.2909 29.1132 27.8232 28.8927 28.2157 28.5002C28.6082 28.1076 28.8288 27.5753 28.8288 27.0202V2.85325C28.8288 2.29815 28.6082 1.76579 28.2157 1.37328C27.8232 0.980766 27.2909 0.760254 26.7358 0.760254ZM8.92658 24.9134H4.66379V11.3729H8.92658V24.9134ZM6.79223 9.4965C6.30869 9.49378 5.8368 9.34788 5.4361 9.07722C5.0354 8.80655 4.72386 8.42326 4.54079 7.97571C4.35772 7.52815 4.31133 7.0364 4.40747 6.56251C4.50362 6.08862 4.73799 5.65382 5.081 5.313C5.42402 4.97218 5.86031 4.74061 6.33481 4.64751C6.80931 4.55441 7.30075 4.60396 7.74712 4.7899C8.19349 4.97584 8.57477 5.28983 8.84286 5.69226C9.11094 6.09469 9.25381 6.56751 9.25342 7.05106C9.25799 7.3748 9.19732 7.69614 9.07505 7.99593C8.95278 8.29572 8.7714 8.56782 8.54173 8.79603C8.31206 9.02423 8.0388 9.20385 7.73822 9.3242C7.43765 9.44454 7.11593 9.50314 6.79223 9.4965ZM24.6388 24.9252H20.378V17.5279C20.378 15.3463 19.4506 14.6729 18.2535 14.6729C16.9894 14.6729 15.749 15.6259 15.749 17.583V24.9252H11.4862V11.3828H15.5856V13.2592H15.6407C16.0522 12.4263 17.4935 11.0028 19.6928 11.0028C22.0713 11.0028 24.6408 12.4145 24.6408 16.5493L24.6388 24.9252Z"
                    fill="white"
                  />
                </svg>
              </a>
              <a href="" id="footer_main_top_social_instagram">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.2793 2.12482C11.6726 2.12482 11.2198 2.14062 9.80334 2.20503C8.38949 2.26984 7.42439 2.49362 6.58002 2.82205C5.70642 3.16123 4.9655 3.61503 4.22736 4.35343C3.48857 5.09169 3.03477 5.83262 2.69452 6.70581C2.36516 7.55046 2.14112 8.51595 2.07751 9.92914C2.01416 11.3458 1.99756 11.7986 1.99756 15.4055C1.99756 19.0124 2.0135 19.4636 2.07777 20.8802C2.14285 22.294 2.36663 23.2591 2.69479 24.1035C3.03424 24.9771 3.48804 25.718 4.22644 26.4561C4.96444 27.1949 5.70536 27.6498 6.57829 27.989C7.42333 28.3174 8.38856 28.5412 9.80215 28.606C11.2188 28.6704 11.6711 28.6862 15.2777 28.6862C18.8849 28.6862 19.3361 28.6704 20.7526 28.606C22.1665 28.5412 23.1326 28.3174 23.9777 27.989C24.8509 27.6498 25.5907 27.1949 26.3286 26.4561C27.0674 25.718 27.5211 24.9771 27.8614 24.1039C28.1879 23.2591 28.4121 22.2937 28.4785 20.8804C28.5421 19.4639 28.5587 19.0124 28.5587 15.4055C28.5587 11.7986 28.5421 11.346 28.4785 9.9294C28.4121 8.51555 28.1879 7.55059 27.8614 6.70621C27.5211 5.83262 27.0674 5.09169 26.3286 4.35343C25.5899 3.61476 24.8511 3.16097 23.9769 2.82218C23.1302 2.49362 22.1646 2.26971 20.7508 2.20503C19.3341 2.14062 18.8831 2.12482 15.2752 2.12482H15.2793ZM14.0879 4.51811C14.4416 4.51758 14.8361 4.51811 15.2793 4.51811C18.8254 4.51811 19.2456 4.53086 20.6459 4.59447C21.9407 4.6537 22.6435 4.87004 23.1117 5.05185C23.7315 5.2925 24.1733 5.58029 24.6379 6.04524C25.1027 6.51006 25.3903 6.9527 25.6316 7.5725C25.8135 8.03998 26.0301 8.74278 26.089 10.0376C26.1526 11.4377 26.1665 11.8581 26.1665 15.4025C26.1665 18.9468 26.1526 19.3674 26.089 20.7673C26.0298 22.0621 25.8135 22.7649 25.6316 23.2325C25.391 23.8523 25.1027 24.2937 24.6379 24.7582C24.173 25.223 23.7317 25.5107 23.1117 25.7515C22.644 25.9341 21.9407 26.1499 20.6459 26.2091C19.2458 26.2727 18.8254 26.2865 15.2793 26.2865C11.7331 26.2865 11.3128 26.2727 9.9129 26.2091C8.61805 26.1493 7.91524 25.933 7.4467 25.7512C6.82703 25.5104 6.38426 25.2228 5.91944 24.7579C5.45462 24.2931 5.16696 23.8515 4.92566 23.2315C4.74385 22.7639 4.52724 22.0611 4.46827 20.7662C4.40466 19.3662 4.39191 18.9457 4.39191 15.3991C4.39191 11.8527 4.40466 11.4344 4.46827 10.0343C4.52751 8.73947 4.74385 8.03666 4.92566 7.56852C5.16643 6.94871 5.45462 6.50607 5.91957 6.04125C6.38439 5.57643 6.82703 5.28864 7.44684 5.04747C7.91498 4.86486 8.61805 4.64905 9.9129 4.58956C11.138 4.53418 11.6128 4.51758 14.0879 4.51479V4.51811ZM22.3685 6.72321C21.4886 6.72321 20.7748 7.43638 20.7748 8.31635C20.7748 9.19618 21.4886 9.91001 22.3685 9.91001C23.2483 9.91001 23.9621 9.19618 23.9621 8.31635C23.9621 7.43651 23.2483 6.72321 22.3685 6.72321ZM15.2793 8.58528C11.5129 8.58528 8.45921 11.639 8.45921 15.4055C8.45921 19.172 11.5129 22.2243 15.2793 22.2243C19.0458 22.2243 22.0985 19.172 22.0985 15.4055C22.0985 11.6391 19.0458 8.58528 15.2793 8.58528ZM15.2793 10.9786C17.7241 10.9786 19.7063 12.9604 19.7063 15.4055C19.7063 17.8503 17.7241 19.8325 15.2793 19.8325C12.8344 19.8325 10.8525 17.8503 10.8525 15.4055C10.8525 12.9604 12.8344 10.9786 15.2793 10.9786Z"
                    fill="white"
                  />
                </svg>
              </a>
              <a style={{ display: 'none' }} href="">
                <svg
                  width="28"
                  height="22"
                  viewBox="0 0 28 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.6605 15.3625L12.6598 15.3629C11.7939 15.8608 10.7096 15.238 10.7096 14.2356V7.76588C10.7096 7.76578 10.7096 7.76567 10.7096 7.76556C10.7096 7.76512 10.7096 7.76467 10.7096 7.76423C10.7098 7.53643 10.7698 7.31265 10.8836 7.1153C10.9977 6.91747 11.1618 6.75316 11.3596 6.63891C11.5573 6.52466 11.7817 6.4645 12.01 6.46446C12.2384 6.46442 12.4627 6.52451 12.6605 6.63867C12.6605 6.63868 12.6605 6.63869 12.6605 6.63871L18.2641 9.87276L12.6605 15.3625ZM12.6605 15.3625L18.2641 12.1271M12.6605 15.3625L18.2641 12.1271M18.2641 12.1271C18.2643 12.127 18.2645 12.1269 18.2646 12.1268L18.2641 12.1271ZM22.2043 1.20821L22.2049 1.20826C23.2779 1.29039 24.2875 1.74826 25.0562 2.50132C25.8247 3.2542 26.3031 4.25391 26.4074 5.32466C26.4074 5.32492 26.4075 5.32519 26.4075 5.32545L26.4605 5.8882L26.56 7.09539C26.56 7.09603 26.5601 7.09667 26.5601 7.09731C26.6529 8.34752 26.7214 9.70534 26.7214 10.9999C26.7214 12.2945 26.6529 13.6524 26.5601 14.9026C26.5601 14.9032 26.56 14.9038 26.56 14.9045L26.4605 16.1114C26.4605 16.1119 26.4604 16.1124 26.4604 16.1129C26.4431 16.3063 26.426 16.4916 26.4077 16.6723L26.4075 16.6744C26.3033 17.7456 25.8247 18.7458 25.0557 19.4989C24.2868 20.252 23.2769 20.7097 22.2037 20.7916L22.2034 20.7916L21.1132 20.8754L21.1093 20.8757L19.9171 20.9578L19.9124 20.9581L18.6364 21.0337L17.3018 21.0975C17.3014 21.0975 17.3011 21.0975 17.3007 21.0976C16.1606 21.1471 15.0195 21.1727 13.8783 21.1744C12.737 21.1727 11.596 21.1471 10.4558 21.0976C10.4555 21.0975 10.4551 21.0975 10.4548 21.0975L9.12014 21.0337L7.84552 20.9581L7.84076 20.9578L6.64848 20.8757L6.64464 20.8754L5.55168 20.7916L5.55163 20.7916C4.47867 20.7095 3.46904 20.2516 2.70036 19.4985C1.93186 18.7457 1.4534 17.7459 1.34912 16.6752C1.34909 16.6749 1.34907 16.6747 1.34904 16.6744L1.29609 16.1118L1.19644 14.9027C1.19641 14.9023 1.19638 14.9019 1.19635 14.9016C1.09535 13.603 1.04159 12.3012 1.03516 10.9987C1.0352 9.70452 1.10368 8.3472 1.19642 7.09741L1.29619 5.88686C1.31341 5.69349 1.33051 5.5082 1.34883 5.32754L1.34884 5.32754L1.34904 5.32544C1.45313 4.25459 1.93146 3.25472 2.6999 2.50168C3.46834 1.74864 4.47768 1.29065 5.55043 1.20825L5.551 1.20821L6.64395 1.12301L7.84018 1.04193L9.11882 0.96617L10.4534 0.902359C10.4538 0.902343 10.4542 0.902328 10.4545 0.902312C11.5952 0.852792 12.7369 0.827162 13.8786 0.825439C15.0106 0.825446 16.173 0.854569 17.301 0.902324C17.3014 0.902344 17.3019 0.902363 17.3023 0.902382L18.6364 0.966169L19.9116 1.04179L19.9158 1.04206L21.1075 1.12282L21.1125 1.12318L22.2043 1.20821Z"
                    fill="white"
                    stroke="white"
                  />
                </svg>
              </a>

              <a href="" id="footer_main_top_social_x_com">
                <svg
                  width="27"
                  height="24"
                  viewBox="0 0 27 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.9111 0H24.9824L16.0874 10.1673L26.5523 24H18.3587L11.9419 15.6095L4.59798 24H0.524409L10.039 13.1246L0 0.0011064H8.4016L14.2022 7.67031L20.9111 0ZM19.4828 21.5638H21.7386L7.17577 2.30895H4.75508L19.4828 21.5638Z"
                    fill="white"
                  />
                </svg>
              </a>
              {/*<a*/}
              {/*  href=""*/}
              {/*  id="footer_main_top_social_ok"*/}
              {/*  style={{ display: 'none' }}*/}
              {/*>*/}
              {/*  <svg*/}
              {/*    width="26"*/}
              {/*    height="26"*/}
              {/*    viewBox="0 0 26 26"*/}
              {/*    fill="none"*/}
              {/*    xmlns="http://www.w3.org/2000/svg"*/}
              {/*  >*/}
              {/*    <path*/}
              {/*      d="M12.8542 6.16925C12.5468 6.15384 12.2394 6.20109 11.9508 6.30812C11.6622 6.41515 11.3984 6.57973 11.1754 6.79187C10.9524 7.004 10.7748 7.25925 10.6534 7.54213C10.5321 7.825 10.4695 8.12959 10.4695 8.43739C10.4695 8.7452 10.5321 9.04978 10.6534 9.33266C10.7748 9.61553 10.9524 9.87079 11.1754 10.0829C11.3984 10.2951 11.6622 10.4596 11.9508 10.5667C12.2394 10.6737 12.5468 10.7209 12.8542 10.7055C13.1616 10.7209 13.4689 10.6737 13.7575 10.5667C14.0461 10.4596 14.3099 10.2951 14.533 10.0829C14.756 9.87079 14.9336 9.61553 15.0549 9.33266C15.1763 9.04978 15.2388 8.7452 15.2388 8.43739C15.2388 8.12959 15.1763 7.825 15.0549 7.54213C14.9336 7.25925 14.756 7.004 14.533 6.79187C14.3099 6.57973 14.0461 6.41515 13.7575 6.30812C13.4689 6.20109 13.1616 6.15384 12.8542 6.16925ZM21.9609 0.187256H3.74743C1.73826 0.187256 0.104736 1.82078 0.104736 3.82995V22.0434C0.104736 24.0526 1.73826 25.6861 3.74743 25.6861H21.9609C23.9701 25.6861 25.6036 24.0526 25.6036 22.0434V3.82995C25.6036 1.82078 23.9701 0.187256 21.9609 0.187256ZM12.8542 3.82426C14.0777 3.82426 15.251 4.31029 16.1162 5.17542C16.9813 6.04055 17.4673 7.21392 17.4673 8.43739C17.4673 9.66087 16.9813 10.8342 16.1162 11.6994C15.251 12.5645 14.0777 13.0505 12.8542 13.0505C11.6307 13.0505 10.4573 12.5645 9.5922 11.6994C8.72707 10.8342 8.24104 9.66087 8.24104 8.43739C8.24104 7.21392 8.72707 6.04055 9.5922 5.17542C10.4573 4.31029 11.6307 3.82426 12.8542 3.82426ZM16.2294 13.4034C17.1856 12.6521 17.9084 13.0904 18.1702 13.6083C18.6142 14.519 18.1076 14.9573 16.9465 15.7142C15.9732 16.3346 14.63 16.5794 13.7478 16.6705L14.4877 17.4047L17.2026 20.1196C18.193 21.1385 16.5766 22.7264 15.5748 21.7475C14.8918 21.0531 13.8958 20.057 12.8599 19.0211L10.1449 21.7475C9.13749 22.7264 7.52673 21.1214 8.52847 20.1196L9.23994 19.4082C9.83187 18.8162 10.5263 18.1162 11.2434 17.4047L11.9777 16.6705C11.1011 16.5794 9.74081 16.346 8.75614 15.7142C7.60072 14.9573 7.08847 14.5247 7.53811 13.6083C7.79993 13.0904 8.52278 12.6521 9.47899 13.4034C9.47899 13.4034 10.771 14.4279 12.8542 14.4279C14.9373 14.4279 16.2294 13.4034 16.2294 13.4034Z"*/}
              {/*      fill="white"*/}
              {/*    />*/}
              {/*  </svg>*/}
              {/*</a>*/}
              {/*<a*/}
              {/*  href=""*/}
              {/*  id="footer_main_top_social_telegram"*/}
              {/*>*/}
              {/*  <svg*/}
              {/*    width="30"*/}
              {/*    height="30"*/}
              {/*    viewBox="0 0 30 30"*/}
              {/*    fill="none"*/}
              {/*    xmlns="http://www.w3.org/2000/svg"*/}
              {/*  >*/}
              {/*    <path*/}
              {/*      fillRule="evenodd"*/}
              {/*      clipRule="evenodd"*/}
              {/*      d="M5.00604 4.91253C7.66192 2.25489 11.2703 0.760376 15.0292 0.760376C18.7882 0.760376 22.3966 2.25489 25.0525 4.91253C27.7105 7.57017 29.2057 11.1785 29.2057 14.9368C29.2057 18.6952 27.7105 22.3035 25.0525 24.9611C22.3966 27.6188 18.7882 29.1133 15.0292 29.1133C11.2703 29.1133 7.66192 27.6188 5.00604 24.9611C2.34796 22.3035 0.852783 18.6952 0.852783 14.9368C0.85352 11.1769 2.34743 7.57123 5.00604 4.91253ZM15.5363 11.226C14.1585 11.7995 11.403 12.9866 7.26963 14.787C6.59846 15.0539 6.24626 15.3151 6.21525 15.5702C6.16071 16.0013 6.70057 16.1713 7.43413 16.4023C7.53475 16.434 7.639 16.4669 7.74587 16.5017C8.4702 16.7369 9.44483 17.0122 9.94987 17.0231C10.4106 17.0331 10.9223 16.8437 11.4871 16.4552C15.3502 13.8487 17.3416 12.5312 17.4678 12.5028C17.5564 12.4829 17.6783 12.4576 17.7602 12.5314C17.8444 12.6049 17.8355 12.7445 17.8267 12.7819C17.7744 13.0096 15.6618 14.9738 14.5624 15.9959C14.2168 16.3173 13.9713 16.5455 13.9215 16.5974C13.8102 16.713 13.6968 16.8223 13.5878 16.9274C12.9156 17.5754 12.4112 18.0615 13.6158 18.8552C14.1999 19.2399 14.6661 19.5575 15.132 19.8748C15.6327 20.2158 16.133 20.5566 16.7789 20.9803C16.9451 21.0892 17.1037 21.2023 17.2582 21.3124C17.8453 21.7309 18.3727 22.1069 19.025 22.0469C19.4038 22.0121 19.7959 21.6559 19.993 20.5936C20.4626 18.0828 21.3863 12.643 21.5989 10.4014C21.6189 10.2051 21.5945 9.9537 21.5768 9.84339C21.5568 9.73297 21.517 9.5757 21.3752 9.4594C21.2047 9.32152 20.9433 9.2925 20.8259 9.29438C20.292 9.30402 19.4747 9.58843 15.5363 11.226Z"*/}
              {/*      fill="white"*/}
              {/*    />*/}
              {/*  </svg>*/}
              {/*</a>*/}
            </div>
          </div>
          <div className="footer_main_top_text">
            <b>SPATIUM</b> - Combating Human Trafficking Through Research and
            Technology
          </div>

          <div className="footer_block_about_me_links">
            <LinkButton to="/about">About us</LinkButton>
            <LinkButton to="/projects">Projects</LinkButton>
          </div>
        </div>
      </div>

      {button == true ? (
        <Button
          onClick={scrollToTop}
          border="#333"
          border_radius="100px"
          id="footer_btn_scroll_up"
        >
          {t('footer.scroll_up')}
          <Icon
            type="arrow"
            rotate="-90"
            color="var(--theme_primary_color_black)"
            width="30px"
            height="30px"
          />
        </Button>
      ) : null}
    </div>
  );
};

export default Footer;
