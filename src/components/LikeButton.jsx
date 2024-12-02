import React from "react";
import HeartIcon from "./HeartIcon";

function LikeButton({ liked, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold transition-all duration-300 ease-in-out transform
                ${liked 
                    ? "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:scale-105"  
                    : "border-gray-400 text-gray-400 hover:border-red-500 hover:text-red-500 hover:scale-105"  
                }`}
        >
            <HeartIcon className="w-4 h-4" />
            {liked ? "" : "Like"}
        </button>
    );
};

export default LikeButton;
