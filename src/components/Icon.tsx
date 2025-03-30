import React from 'react';

interface IconProps {
  type?: keyof typeof icons;
  size?: string;
  width?: string;
  height?: string;
  color?: string;
  rotate?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => Promise<void> | void;
}
export const icons = {
  ro: (
    <>
      <rect width="24" height="24" rx="12" fill="#F3F4F6" />
      <g clipPath="url(#clip0_3032_5696)">
        <rect
          x="3.75"
          y="3.75"
          width="16.5"
          height="16.5"
          rx="8.25"
          fill="#B3B3B3"
        />
        <rect x="3" y="3" width="6" height="18" fill="#0052B4" />
        <rect x="9" y="3" width="6" height="18" fill="#FFDA44" />
        <rect x="15" y="3" width="6" height="18" fill="#D80027" />
      </g>
      <defs>
        <clipPath id="clip0_3032_5696">
          <rect
            x="3.75"
            y="3.75"
            width="16.5"
            height="16.5"
            rx="8.25"
            fill="white"
          />
        </clipPath>
      </defs>
    </>
  ),
  ru: (
    <>
      <rect x="0.5" width="24" height="24" rx="12" fill="#F3F4F6" />
      <g clipPath="url(#clip0_3032_5703)">
        <rect
          x="4.25"
          y="3.75"
          width="16.5"
          height="16.5"
          rx="8.25"
          fill="#B3B3B3"
        />
        <rect
          x="3.5"
          y="21"
          width="6"
          height="18"
          transform="rotate(-90 3.5 21)"
          fill="#D80027"
        />
        <rect
          x="3.5"
          y="15"
          width="6"
          height="18"
          transform="rotate(-90 3.5 15)"
          fill="#0052B4"
        />
        <rect
          x="3.5"
          y="9"
          width="6"
          height="18"
          transform="rotate(-90 3.5 9)"
          fill="#F0F0F0"
        />
      </g>
      <defs>
        <clipPath id="clip0_3032_5703">
          <rect
            x="4.25"
            y="3.75"
            width="16.5"
            height="16.5"
            rx="8.25"
            fill="white"
          />
        </clipPath>
      </defs>
    </>
  ),
  en: (
    <>
      <rect width="24" height="24" rx="12" fill="#F3F4F6" />
      <g clipPath="url(#clip0_3032_5698)">
        <rect
          x="3.75"
          y="3.75"
          width="16.5"
          height="16.5"
          rx="8.25"
          fill="#0052B4"
        />
        <rect x="9.75" y="3.75" width="4.5" height="16.5" fill="#F0F0F0" />
        <rect
          x="3.75"
          y="14.25"
          width="4.5"
          height="16.5"
          transform="rotate(-90 3.75 14.25)"
          fill="#F0F0F0"
        />
        <rect
          x="4.5"
          y="6.84082"
          width="2.25"
          height="18.7371"
          transform="rotate(-45 4.5 6.84082)"
          fill="#F0F0F0"
        />
        <rect
          x="17.7491"
          y="4.5"
          width="2.25"
          height="18.7371"
          transform="rotate(45 17.7491 4.5)"
          fill="#F0F0F0"
        />
        <rect
          x="3.75"
          y="13.5"
          width="3"
          height="16.5"
          transform="rotate(-90 3.75 13.5)"
          fill="#D80027"
        />
        <rect
          x="5.34418"
          y="6.24951"
          width="0.75"
          height="18.0707"
          transform="rotate(-45 5.34418 6.24951)"
          fill="#D80027"
        />
        <rect
          x="18.0279"
          y="5.25"
          width="0.75"
          height="18.0707"
          transform="rotate(45 18.0279 5.25)"
          fill="#D80027"
        />
        <rect x="10.5" y="3.75" width="3" height="16.5" fill="#D80027" />
      </g>
      <defs>
        <clipPath id="clip0_3032_5698">
          <rect
            x="3.75"
            y="3.75"
            width="16.5"
            height="16.5"
            rx="8.25"
            fill="white"
          />
        </clipPath>
      </defs>
    </>
  ),
  plus: (
    <>
      <path
        d="M18.4993 13.4961H13.4993V18.4961C13.4993 18.7613 13.394 19.0157 13.2064 19.2032C13.0189 19.3907 12.7645 19.4961 12.4993 19.4961C12.2341 19.4961 11.9798 19.3907 11.7922 19.2032C11.6047 19.0157 11.4993 18.7613 11.4993 18.4961V13.4961H6.49933C6.23411 13.4961 5.97976 13.3907 5.79222 13.2032C5.60469 13.0157 5.49933 12.7613 5.49933 12.4961C5.49933 12.2309 5.60469 11.9765 5.79222 11.789C5.97976 11.6015 6.23411 11.4961 6.49933 11.4961H11.4993V6.49609C11.4993 6.23088 11.6047 5.97652 11.7922 5.78899C11.9798 5.60145 12.2341 5.49609 12.4993 5.49609C12.7645 5.49609 13.0189 5.60145 13.2064 5.78899C13.394 5.97652 13.4993 6.23088 13.4993 6.49609V11.4961H18.4993C18.7645 11.4961 19.0189 11.6015 19.2064 11.789C19.394 11.9765 19.4993 12.2309 19.4993 12.4961C19.4993 12.7613 19.394 13.0157 19.2064 13.2032C19.0189 13.3907 18.7645 13.4961 18.4993 13.4961Z"
        fill="currentColor"
      />
    </>
  ),
  arrow_right: (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.25 11.9998C5.25 11.8009 5.32902 11.6102 5.46967 11.4695C5.61032 11.3289 5.80109 11.2498 6 11.2498H16.19L13.47 8.52985C13.3375 8.38767 13.2654 8.19963 13.2688 8.00533C13.2722 7.81102 13.351 7.62564 13.4884 7.48822C13.6258 7.35081 13.8112 7.2721 14.0055 7.26867C14.1998 7.26524 14.3878 7.33737 14.53 7.46985L18.53 11.4698C18.6704 11.6105 18.7493 11.8011 18.7493 11.9998C18.7493 12.1986 18.6704 12.3892 18.53 12.5298L14.53 16.5298C14.3878 16.6623 14.1998 16.7344 14.0055 16.731C13.8112 16.7276 13.6258 16.6489 13.4884 16.5115C13.351 16.3741 13.2722 16.1887 13.2688 15.9944C13.2654 15.8001 13.3375 15.612 13.47 15.4698L16.19 12.7498H6C5.80109 12.7498 5.61032 12.6708 5.46967 12.5302C5.32902 12.3895 5.25 12.1988 5.25 11.9998Z"
        fill="currentColor"
      />
    </>
  ),
  menu: (
    <>
      <path
        d="M4 6C4 5.73478 4.10536 5.48043 4.29289 5.29289C4.48043 5.10536 4.73478 5 5 5H19C19.2652 5 19.5196 5.10536 19.7071 5.29289C19.8946 5.48043 20 5.73478 20 6C20 6.26522 19.8946 6.51957 19.7071 6.70711C19.5196 6.89464 19.2652 7 19 7H5C4.73478 7 4.48043 6.89464 4.29289 6.70711C4.10536 6.51957 4 6.26522 4 6ZM4 12C4 11.7348 4.10536 11.4804 4.29289 11.2929C4.48043 11.1054 4.73478 11 5 11H19C19.2652 11 19.5196 11.1054 19.7071 11.2929C19.8946 11.4804 20 11.7348 20 12C20 12.2652 19.8946 12.5196 19.7071 12.7071C19.5196 12.8946 19.2652 13 19 13H5C4.73478 13 4.48043 12.8946 4.29289 12.7071C4.10536 12.5196 4 12.2652 4 12ZM5 17C4.73478 17 4.48043 17.1054 4.29289 17.2929C4.10536 17.4804 4 17.7348 4 18C4 18.2652 4.10536 18.5196 4.29289 18.7071C4.48043 18.8946 4.73478 19 5 19H19C19.2652 19 19.5196 18.8946 19.7071 18.7071C19.8946 18.5196 20 18.2652 20 18C20 17.7348 19.8946 17.4804 19.7071 17.2929C19.5196 17.1054 19.2652 17 19 17H5Z"
        fill="currentColor"
      />
    </>
  ),
  empty: <></>,
};
const Icon: React.FC<IconProps> = ({
  type,
  size,
  width,
  height,
  color = 'var(--theme_primary_color_black)',
  rotate = '0',
  className = '',
  style,
  onClick,
}) => {
  const finalWidth = width || size || '24px';
  const finalHeight = height || size || '24px';

  return (
    <svg
      style={{
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
      onClick={onClick}
      className={className}
      width={finalWidth}
      height={finalHeight}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
    >
      {type && icons[type]}
    </svg>
  );
};

export default Icon;
