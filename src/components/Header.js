import React, { useContext, useState } from 'react'
//import Logo from './Logo'
import Logo from '../assest/logo.png'
import { IoSearch } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { FaMoon, FaSun } from 'react-icons/fa' // import the FaMoon and FaSun icons
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { Bounce, toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import Context from '../context';
import { setCountCartItems } from '../store/countCartItemsSlide';
import { toggleTheme } from '../store/themeSlice' // import the toggleTheme action for changing the theme
import { motion } from "framer-motion";


const Header = () => {
    const user = useSelector(state => state.user.user);
    const theme = useSelector((state) => state.theme.theme); // Obtiene el tema desde Redux
    const countCartItems = useSelector(state => state.countCartItems.count);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuDisplay, setMenuDisplay] = useState(false);
    const { fecthUserDetails } = useContext(Context)

    //Search
    const searchInput = useLocation()
    const URLSearch = new URLSearchParams(searchInput?.search)
    const searchQuery = URLSearch.getAll("q")
    const [search, setSearch] = useState(searchQuery)
    console.log(search);

    console.log("Header user", user);

    const handleLogout = async () => {
        const fecthData = await fetch(SummaryApi.logout_user.url, {
            method: SummaryApi.logout_user.method,
            credentials: 'include'
        })

        const data = await fecthData.json()
        console.log("fecthData Logout: ", fecthData);
        console.log("data Logout", data);
        if (data.success) {
            dispatch(setUserDetails(null)); //como aca solo se pune en mull, no es necesario hacer llamar a fecthUserDetails
            dispatch(setCountCartItems(0)); //como aca solo se pune en 0, no es necesario hacer llamar a fecthUserDetails
            toast.success(data.message, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            navigate("/");

        } else if (data.error) {
            toast.error(data.message, {
                position: "bottom-center",
                autoClose: 2000
            });
        }
    }

    const handleSearch = (e) => {
        const { value } = e.target
        setSearch(value);

        if (value) {
            navigate(`/search?q=${value}`)
        } else {
            navigate("/search")
        }
    }


    return (
        <header className='h-16 shadow-md bg-white dark:bg-gray-700 fixed w-full z-20'>
            <div className='h-full container mx-auto flex items-center px-4 justify-between'>
                {/* Logo */}
                <div className=''>
                    <Link to={"/"} onClick={fecthUserDetails}>
                        {/* <Logo w={90} h={50} /> */}
                        <img className=' w-36 h-full' src={Logo}></img>
                    </Link>
                </div>

                {/* SearchBar */}
                <div className='hidden lg:flex items-center w-full justify-between max-w-sm border border-gray-600 dark:border-white rounded-full focus-within:shadow-md pl-3'>
                    <input onChange={handleSearch} value={search} type="text" placeholder="search product here..." className='w-full outline-none bg-transparent dark:text-white' />
                    <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
                        <IoSearch />
                    </div>
                </div>



                {/* User-ShoppingCart-Login */}
                <div className='flex items-center gap-6'>
                    <button
                        className="w-20 h-10 bg-gray-300 dark:bg-gray-500 rounded-full hidden md:flex items-center px-1"
                        onClick={() => dispatch(toggleTheme())}
                    >
                        <motion.div
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                            initial={{ x: theme === "dark" ? 38 : 0 }} // Posición inicial
                            animate={{ x: theme === "dark" ? 38 : 0 }} // Mueve a la derecha o izquierda
                            transition={{ type: "spring", stiffness: 200, damping: 15 }} // Suaviza el movimiento
                        >
                            {theme === "light" ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-700" />}
                        </motion.div>
                    </button>

                    <div className='relative flex justify-center'>
                        <div className='text-3xl cursor-pointer'
                            onClick={() => setMenuDisplay(prev => !prev)}>
                            {
                                user?.profilePic ? (
                                    <div className="flex items-center justify-center ring-red-600 ring-offset-base-100 w-10 h-10 rounded-full ring-1 ring-offset-1">
                                        <img loading="lazy" alt={user?.name} className='w-10 h-10 rounded-full' src={user?.profilePic} />
                                    </div>

                                ) : (
                                    // 
                                    <div>
                                        <div className="ring-red-600 ring-offset-base-100 w-10 rounded-full ring-1 ring-offset-2 overflow-x-hidden">
                                            <FaCircleUser className='w-full h-full bg-white' />
                                        </div>
                                    </div>

                                )
                            }
                        </div>

                        {
                            menuDisplay && user ? (
                                <div className='absolute bg-white dark:bg-slate-500 bottom-0 top-11 h-fit p-2 shadow-lg rounded z-10'>

                                    <nav className='dark:text-white'>{user?.email}</nav>

                                    <nav className='mt-1 border-t border-gray-400'>
                                        <Link onClick={() => { setMenuDisplay(prev => !prev); fecthUserDetails() }} to={"/profile-dashboard/profile"} className=' block text-center whitespace-nowrap hover:bg-slate-100 dark:hover:bg-slate-700 p-1 dark:text-white'>Profile</Link>
                                    </nav>
                                    {
                                        user?.permisos.configuracion.puedeAbrirPanelAdmin &&
                                        <nav className='mt-1 border-t border-gray-400'>
                                            <Link onClick={() => { setMenuDisplay(prev => !prev); fecthUserDetails() }} to={"/admin-panel/all-users"} className='  text-center whitespace-nowrap hidden md:block hover:bg-slate-100 dark:hover:bg-slate-700 p-1 dark:text-white'>Admin Panel</Link>
                                        </nav>
                                    }
                                    <nav className='mt-1 border-t border-gray-400'>
                                        <Link onClick={() => { setMenuDisplay(prev => !prev) }} to={"/order"} className='block text-center whitespace-nowrap hover:bg-slate-100 dark:hover:bg-slate-700 p-1 dark:text-white'>Order</Link>
                                    </nav>


                                </div>
                            ) : (<></>)
                        }

                    </div>



                    <Link to={"/cart"} className='text-2xl relative'>
                        <span><FaCartShopping className='dark:text-white' /> </span>
                        <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                            <p className='text-sm pb-0.5'>{countCartItems}</p>
                        </div>
                    </Link>

                    <div>
                        {
                            user?._id ? (
                                <button onClick={() => { handleLogout(); setMenuDisplay(prev => prev ? false : prev) }} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Logout</button>
                            ) : (
                                <Link onClick={() => setMenuDisplay(prev => prev ? false : prev)} to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </header >
    )
}

export default Header
