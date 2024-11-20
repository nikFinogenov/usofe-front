import React from "react";
import SpinnerIcon from "./SpinnerIcon";
import ThumbsDownIcon from "./ThumbsDownIcon"; // Иконка для дизлайка

function DislikeButton({ disliked, isFetching, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold transition 
                ${disliked 
                    ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                    : "border-gray-400 text-gray-400 hover:border-red-500 hover:text-red-500"
                }`}
        >
            {isFetching ? <SpinnerIcon className="w-4 h-4" /> : <ThumbsDownIcon className="w-4 h-4" />}
            {disliked ? "" : "Dislike"}
        </button>
    );
}

export default DislikeButton;
