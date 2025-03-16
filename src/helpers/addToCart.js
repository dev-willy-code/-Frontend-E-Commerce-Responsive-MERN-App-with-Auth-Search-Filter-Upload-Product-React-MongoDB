import { toast } from 'react-toastify';
import SummaryApi from '../common';

const addToCart = async (e, id) => {
    //e?.stopPropagation();
    e?.preventDefault();

    try {
        const response = await fetch(SummaryApi.addToCartProduct.url, {
            method: SummaryApi.addToCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify(
                { productId: id }
            )
        });

        const responseData = await response.json()

        if (responseData.success) {
            toast.success(responseData.message)
            return true;
        }

        if (responseData.error) {
            toast.error(responseData.message)
            return false
        }

    } catch (error) {
        console.log("addToCart error: ", error);
        return false
    }

}

export default addToCart;