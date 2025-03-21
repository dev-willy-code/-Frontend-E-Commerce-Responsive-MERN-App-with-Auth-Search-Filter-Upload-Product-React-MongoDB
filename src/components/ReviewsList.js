import { format, parseISO } from "date-fns";
import React from "react";

const ReviewsList = ({ reviews }) => {
    console.log("reviews: ", reviews);

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
            {reviews?.length == 0 && <p className="font-bold">0 reviews. Be the first to make a review</p>}
            {reviews?.length !== 0 &&
                <>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Reviews
                    </h2>
                    <ul className="space-y-4">
                        {reviews?.map((review) => {
                            const formattedDate = review.createdAt
                                ? format(parseISO(review.createdAt), "dd/MM/yyyy hh:mm aa")
                                : "Fecha desconocida";

                            return (
                                <li key={review._id} className="p-4 bg-gray-100 dark:bg-slate-700 rounded-lg shadow">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {review.userId?.name || "Usuario desconocido"}
                                        </h3>
                                        <span className="text-yellow-600 font-bold">{`⭐ ${review.rating}/5`}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm dark:text-gray-300">{formattedDate}</p>
                                    <p className="text-gray-700 dark:text-gray-300 mt-2">{review.comment || "Sin comentarios"}</p>
                                </li>
                            );
                        })}
                    </ul>
                </>
            }

        </div>
    );
};

export default ReviewsList;
