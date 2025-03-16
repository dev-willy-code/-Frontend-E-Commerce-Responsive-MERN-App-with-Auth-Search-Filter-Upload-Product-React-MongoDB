import SummaryApi from '../common';
//----------------EJEMPLO CON BODY------------------------
// //aca se usa body pero mejor seria usar query porque la categoria no es dato sensible
// const fetchProductsByCategory = async (category) => {
//     const response = await fetch(SummaryApi.getProductsByCategory.url, {
//         method: SummaryApi.getProductsByCategory.method,
//         headers: {
//             "content-type": "application/json"
//         },
//         body: JSON.stringify({
//             category: category
//         })
//     })

//     const dataResponse = await response.json()

//     return dataResponse

// }

// export default fetchProductsByCategory



//----------EJEMPLO CON Query(Para este caso es mejor query porque categoria no es data sensible)
const fetchProductsByCategory = async (category) => {
    const url = `${SummaryApi.getProductsByCategory.url}?category=${encodeURIComponent(category)}`;
    console.log("url: ", url);
    const response = await fetch(url, {
        method: SummaryApi.getProductsByCategory.method,
        headers: {
            "content-type": "application/json"
        }
    });

    const dataResponse = await response.json();
    return dataResponse;
};

export default fetchProductsByCategory;
