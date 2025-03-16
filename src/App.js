import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SummaryApi from './common';
import { useEffect, useState } from 'react';
import Context from './context';
import { useDispatch, useSelector } from 'react-redux'
import { setUserDetails } from './store/userSlice';
import { setCountCartItems } from './store/countCartItemsSlide';
function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);  // Estado de carga
  const theme = useSelector((state) => state.theme.theme); // Obtiene el tema desde Redux

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark"); // Aplica en <html>
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]); // Se ejecuta cuando cambia el tema

  const fecthUserDetails = async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: 'include'
    })

    const dataApi = await dataResponse.json();
    console.log("data-user App.js", dataApi);


    if (dataApi.success) {
      dispatch(setUserDetails(dataApi.data))
    } else {
      dispatch(setUserDetails(null))
    }

    setLoading(false);  // Después de que se haya hecho la solicitud, quitar el loading
  }

  const fetchUserCountCartItems = async () => {
    const dataResponse = await fetch(SummaryApi.countAddToCartProduct.url, {
      method: SummaryApi.countAddToCartProduct.method,
      credentials: 'include'
    })

    const dataApi = await dataResponse.json()
    console.log("dataApi count cart: ", dataApi);

    if (dataApi.success) {
      dispatch(setCountCartItems(dataApi?.data?.count))
    } else {
      dispatch(setCountCartItems(0));
    }

  }

  useEffect(() => {
    /**user Details */
    fecthUserDetails()
    /**user Details cart product */
    fetchUserCountCartItems();
  }, [])

  if (loading) {
    return (
      <div>
        loading
      </div>
    );
  }

  return (
    <>
      <Context.Provider value={{
        fecthUserDetails,  //user detail fecth
        fetchUserCountCartItems
      }}>
        <ToastContainer
          position="bottom-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        {/* <ToastContainer /> */}

        <Header />
        {/* calcula la altura total de la ventana (el 100% de la altura del navegador) menos 100 píxeles. El resultado es la altura que tendrá el elemento. */}
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;
