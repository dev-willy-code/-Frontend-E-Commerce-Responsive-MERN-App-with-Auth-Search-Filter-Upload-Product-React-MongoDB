const backendDomain = process.env.REACT_APP_BACKEND_URL
const SummaryApi = {

    // LOG IN - SIGNUP - LOLGOUT
    signUp: {
        url: `${backendDomain}/api/signup`,
        method: "post"
    },
    signIn: {
        url: `${backendDomain}/api/signin`,
        method: "post"
    },
    googleauth: {
        url: `${backendDomain}/api/google-auth`,
        method: "post"
    },
    logout_user: {
        url: `${backendDomain}/api/userLogout`,
        method: "get"
    },

    //User information
    current_user: {
        url: `${backendDomain}/api/user-details`,
        method: "get"
    },


    //Admin panel
    alluser: {
        url: `${backendDomain}/api/all-user`,
        method: "get"
    },
    updateUser: {
        url: `${backendDomain}/api/update-user`,
        method: "put"
    },
    deleteUser: {
        url: `${backendDomain}/api/delete-user`,
        method: "delete"
    },

    //Role-Permission
    getRolesPermissions: {
        url: `${backendDomain}/api/role-permissions`,
        method: "get"
    },
    updateRolesPermissions: {
        url: `${backendDomain}/api/role-permissions`,
        method: "put"
    },

    //profile
    updateProfile: {
        url: `${backendDomain}/api/update-profile`,
        method: "put"
    },
    deleteProfile: {
        url: `${backendDomain}/api/delete-profile`,
        method: "delete"
    },
    //Products
    uploadProduct: {
        url: `${backendDomain}/api/upload-product`,
        method: "post"
    },
    allProducts: {
        url: `${backendDomain}/api/get-products`,
        method: 'get'
    },
    updateProduct: {
        url: `${backendDomain}/api/update-product`,
        method: 'put'
    },
    deleteProduct: {
        url: `${backendDomain}/api/delete-product`,
        method: 'delete'
    },
    getOneProductByCategory: { //obtener un producto por cada categoria(Home page)
        url: `${backendDomain}/api/get-OneProductByCategory`,
        method: 'get'
    },
    getProductsByCategory: { // obtener todos los productos por categoria
        url: `${backendDomain}/api/get-productsByCategory`,
        method: 'get'
    },
    productDetails: { // obtener los detalles de un producto por su id(el id esta en la url(query))
        url: `${backendDomain}/api/product-details`,
        method: 'get'
    },
    searchProducts: { // busca productos en la barra de  arriba(header)
        url: `${backendDomain}/api/searchProducts`,
        method: 'get'
    },
    filterProducts: { // filtra productos segun categoria
        url: `${backendDomain}/api/filterProducts`,
        method: 'post'
    },
    productCategory: { // obtener categoria de los productos
        url: `${backendDomain}/api/productCategory`,
        method: 'get'
    },




    //Cart items
    addToCartProduct: {
        url: `${backendDomain}/api/addtocart`,
        method: 'post'
    },
    countAddToCartProduct: {
        url: `${backendDomain}/api/countAddToCartProduct`,
        method: 'get'
    },
    viewCartItems: {
        url: `${backendDomain}/api/viewCartItems`,
        method: 'get'
    },
    deleteCartItems: {
        url: `${backendDomain}/api/deleteCartItems`,
        method: 'post'
    },
    updateCartItems: {
        url: `${backendDomain}/api/updateCartItems`,
        method: 'post'
    },


    //Review Products
    createProductReview: {
        url: `${backendDomain}/api/createProductReview`,
        method: 'post'
    },
    getProductReview: { // para saber si colcoar si mostrar boton de crear o actualizar en productDetails
        url: `${backendDomain}/api/getProductReview`,
        method: 'get'
    },
    updateReview: { // actualiza un review
        url: `${backendDomain}/api/updateReview`,
        method: 'put'
    },
    getProductReviewAverage: { // saca el promedio de todos los reviews de un producto
        url: `${backendDomain}/api/getProductReviewAverage`,
        method: 'get'
    },
    deleteReview: { // elimina el review de un producto
        url: `${backendDomain}/api/deleteReview`,
        method: 'delete'
    },
    getProductReviews: { // obtiene todos los reviews de un producto
        url: `${backendDomain}/api/getProductReviews`,
        method: 'get'
    },


    //Orders
    checkout: { // para realizar el pago con stripe
        url: `${backendDomain}/api/checkout`,
        method: 'post'
    },
    orderList: { // para realizar el pago con stripe
        url: `${backendDomain}/api/order-list`,
        method: 'get'
    },






}

export default SummaryApi;