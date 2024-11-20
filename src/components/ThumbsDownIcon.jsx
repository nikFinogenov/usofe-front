import React from "react";

function ThumbsDownIcon({ className }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            width="24px" // Уменьшенный размер для кнопки
            height="24px"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                <path d="M30,16V9a7.0078,7.0078,0,0,0-7-7H2V16H8.4648l3.5774,5.3662.8453,5.9165A2.0094,2.0094,0,0,0,14.8672,29H17a3.0033,3.0033,0,0,0,3-3V20h6A4.0045,4.0045,0,0,0,30,16ZM8,14H4V4H8Zm20,2a2.0025,2.0025,0,0,1-2,2H18v8a1.0008,1.0008,0,0,1-1,1H14.8672l-.9094-6.3662L10,14.6973V4H23a5.0057,5.0057,0,0,1,5,5Z"></path>
                <rect fill="none" width="32" height="32"></rect>
            </g>
        </svg>
    );
}

export default ThumbsDownIcon;