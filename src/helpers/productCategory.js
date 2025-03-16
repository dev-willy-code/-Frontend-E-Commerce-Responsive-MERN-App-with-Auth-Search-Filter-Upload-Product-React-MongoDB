//Esto pronto estara en base de datos como "ProductCategory"
// const productCategory = [
//     { id: 1, label: "Airpods", value: "airpods" },
//     { id: 2, label: "Camera", value: "camera" },
//     { id: 3, label: "Earphones", value: "earphones" },
//     { id: 4, label: "Mobiles", value: "mobiles" },
//     { id: 5, label: "Mouse", value: "mouse" },
//     { id: 6, label: "Printers", value: "printers" },
//     { id: 7, label: "Processor", value: "processor" },
//     { id: 8, label: "Refrigerator", value: "refrigerator" },
//     { id: 9, label: "Speakers", value: "speakers" },
//     { id: 10, label: "Trimmers", value: "trimmers" },
//     { id: 11, label: "Televisions", value: "televisions" },
//     { id: 12, label: "Watches", value: "watches" },

// ]

// export default productCategory







import { toast } from 'react-toastify';
import SummaryApi from '../common';

const fetchCategories = async () => {
    try {
        const response = await fetch(SummaryApi.productCategory.url, {
            method: SummaryApi.productCategory.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            }
        });

        const responseData = await response.json();

        if (responseData.success) {
            return responseData.data; // Retorna las categorías obtenidas
        }

        if (responseData.error) {
            toast.error(responseData.message);
            return [];
        }

    } catch (error) {
        console.log("fetchCategories error: ", error);
        toast.error("Error fetching categories. Try again later.");
        return [];
    }
}

export default fetchCategories;

