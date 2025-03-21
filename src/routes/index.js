import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassword from '../pages/ForgotPassword'
import SignUp from '../pages/SignUp'
import AdminPanel from '../pages/AdminPanel'
import AllUsers from '../pages/AllUsers'
import AllProducts from '../pages/AllProducts'
import UserProfile from '../pages/Profile'
import RolePermissionsEditor from '../pages/RolePermissionsEditor'
import ProfileDashboard from '../pages/ProfileDashboard'
import PermisosActuales from '../pages/PermisosActuales'
import ProductsByCategoryFiltered from '../pages/ProductsByCategoryFitered'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import SearchProduct from '../pages/SearchProduct'
import Success from '../pages/Success';
import Cancel from '../pages/Cancel';
import Order from '../pages/Order'
import AllOrder from '../pages/AllOrder'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "sign-up",
                element: <SignUp />
            },
            {
                path: "products-by-category-filtered",
                element: <ProductsByCategoryFiltered />
            },
            {
                path: "product/:id",
                element: <ProductDetails />
            },
            {
                path: 'cart',
                element: <Cart />
            },
            {
                path: 'success',
                element: <Success />
            },
            {
                path: 'cancel',
                element: <Cancel />
            },
            {
                path: "search",
                element: <SearchProduct />
            },
            {
                path: "order",
                element: <Order />
            },
            {
                path: "admin-panel",
                element: <AdminPanel />,
                children: [
                    {
                        path: "all-users",
                        element: <AllUsers />
                    },
                    {
                        path: "all-products",
                        element: <AllProducts />
                    },
                    {
                        path: "user-permissions",
                        element: <RolePermissionsEditor />
                    },
                    {
                        path: "all-order",
                        element: <AllOrder />
                    },
                ]
            },
            {
                path: "profile-dashboard",
                element: <ProfileDashboard />,
                children: [
                    {
                        path: "profile",
                        element: <UserProfile />
                    },
                    {
                        path: "permisos-actuales",
                        element: <PermisosActuales />
                    }
                ]
            },

        ]
    }
])

export default router