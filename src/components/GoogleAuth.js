//aca va la utenticaciond de google.
//con esto los usuarios pueden registrarse o logerase con goole mas facil

import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import app from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { useContext } from "react";
import Context from "../context";

export default function GoogleAuth() {
    const dispatch = useDispatch(); // this is the hook that we use to dispatch actions to the store
    // Hooks for navigation (to redirect the user to another page)
    const navigate = useNavigate();
    const { fecthUserDetails, fetchUserCountCartItems } = useContext(Context)

    const auth = getAuth(app); // this is the auth object that we use to sign in with Google ,app is the firebase app that we imported from firebase.js
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider(); // this is the provider that we use to sign in with Google
        provider.setCustomParameters({ prompt: 'select_account' }); // this is the custom parameter that we use to prompt the user to select an account
        try {
            const result = await signInWithPopup(auth, provider); // this is the function that we use to sign in with Google
            console.log("result: ", result);
            const response = await fetch(SummaryApi.googleauth.url, {
                method: SummaryApi.googleauth.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    googlePhotoURL: result.user.photoURL,
                }),
                credentials: 'include'

            });
            const responseData = await response.json();
            if (responseData?.success) {
                fetchUserCountCartItems();
                fecthUserDetails();
                navigate('/');
            } else if (responseData.error) {
                toast.error(responseData.message);
            }

        } catch (error) {
            console.error('Error signing/signup in with Google: ', error);
        }
    }

    return (
        <button
            onClick={handleGoogleClick}
            className="border border-black dark:border-white text-black dark:text-white py-2 rounded w-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-600"
        >
            <AiFillGoogleCircle className='w-7 h-7 mr-2' />
            Continue with Google
        </button>
    )
}
