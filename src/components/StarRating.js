import { useState } from "react";
import { MdOutlineStar } from "react-icons/md";
import { MdOutlineStarBorder } from "react-icons/md";

const StarRating = ({ value, onChange }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(star)}
                >
                    {(hover || value) >= star ? (
                        <MdOutlineStar size={24} className="text-yellow-400" />
                    ) : (
                        <MdOutlineStarBorder size={24} className="text-gray-400" />
                    )}
                </span>
            ))}
        </div>
    );
};

const RatingInput = ({ data, setData, errors }) => {
    const handleRatingChange = (rating) => {
        setData((prev) => ({ ...prev, rating }));
    };

    return (
        <div>
            <label className="block text-sm font-medium dark:text-slate-200 mb-2">Rating</label>
            <StarRating value={data.rating} onChange={handleRatingChange} />
            {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
        </div>
    );
};

export default RatingInput;
