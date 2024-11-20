import React from "react";
import ThumbsDownIcon from "./ThumbsDownIcon"; // Иконка для дизлайка

function DislikeButton({ disliked, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold transition-all duration-300 ease-in-out transform
                ${disliked 
                    ? "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:scale-105"  // Scale up when disliked
                    : "border-gray-400 text-gray-400 hover:border-red-500 hover:text-red-500 hover:scale-105"  // Scale up on hover
                }`}
        >
            <ThumbsDownIcon className="w-4 h-4" />
            {disliked ? "" : "Dislike"}
        </button>
    );
}

export default DislikeButton;
