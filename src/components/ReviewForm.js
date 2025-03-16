import React, { useEffect } from 'react'
import { useState } from "react";
import RatingInput from "../components/StarRating";
const ReviewForm = ({ onSubmit, reviewdata = null, isClose }) => { // reviewdata = null: null le puse porque si se crea un review no hay reviewData, por default null
    const [data, setData] = useState({ rating: "", comment: "" });
    const [hover, setHover] = useState(0); //para las estrellas del rating


    //solo si se actuliza un producto
    useEffect(() => {
        if (reviewdata) {
            setData({
                _id: reviewdata._id || "",
                rating: reviewdata.rating || "",
                comment: reviewdata.comment || "",
            });
        }
    }, [reviewdata]); // Solo se ejecuta cuando reviewdata cambia

    //Errores del form
    const [errors, setErrors] = useState({ rating: "", comment: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = {
            rating: "",
            comment: "",
        };

        if (data.rating < 1 || data.rating > 5 || data.rating == "") {
            newErrors.rating = "Debes seleccionar una calificación valida entre 1 y 5.";
            valid = false;
        }

        if (!data.comment.trim()) {
            newErrors.comment = "Debes ingresar un comentario.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };
    console.log("data review form: ", data);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        await onSubmit(data);
    };


    return (
        <div className="p-4 border rounded bg-white dark:bg-slate-700 shadow-md mt-4">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Submit a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* esto esta comentado porque cammbie el raing de input a componenete aparte perosonalizado */}
                {/* <div>
                    <label className="block text-sm font-medium dark:text-slate-200 mb-2">Rating</label>
                    <input
                        type="number"
                        name="rating"
                        value={data.rating}
                        onChange={handleChange}
                        className="w-full p-2 border rounded dark:bg-slate-600 dark:text-white"
                    />
                    {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
                </div> */}

                <RatingInput data={data} setData={setData} errors={errors} />


                <div>
                    <label className="block text-sm font-medium dark:text-slate-200 mb-2">Comment</label>
                    <textarea
                        name="comment"
                        value={data.comment}
                        onChange={handleChange}
                        className="w-full p-2 border rounded dark:bg-slate-600 dark:text-white"
                    />
                    {errors.comment && <p className="text-red-500 text-sm">{errors.comment}</p>}
                </div>
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={isClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
