import React from "react";
import { PiStar, PiStarFill } from "react-icons/pi";

function FavButton({ favourited, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center p-2 hover:scale-110"
        >
            {favourited ? (
                <PiStarFill
                    size={24}
                    color="#FACC15" // Жёлтый цвет (Tailwind yellow-400)
                />
            ) : (
                <PiStar
                    size={24}
                />
            )}
        </button>
    );
}

export default FavButton;
