import React, { useState, useEffect } from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import useLoading from '../hooks/useLoading';
import { CiCircleAlert } from "react-icons/ci";
import SummaryApi from '../common';


const CreateRole = ({ onClose, callFunc }) => {
    const [data, setData] = useState({
        role: ""
    });
    const { loading, setLoading, dots } = useLoading();


    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => (
            { ...prev, [name]: value.toUpperCase() }
        ));
    };

    const handleSubmit = async () => {
        console.log("creating role...");

        try {
            setLoading(true);
            const response = await fetch(SummaryApi.createRole.url, {
                method: SummaryApi.createRole.method,
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const dataResponse = await response.json();
            if (dataResponse.success) {
                toast.success(dataResponse.message);
                callFunc();
                onClose();
            } else {
                toast.error(dataResponse.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-center items-center bg-gray-600 bg-opacity-90'>
            <div className='rounded-lg mx-auto bg-white dark:bg-slate-700 shadow-md p-4 w-full max-w-lg'>
                <button className='block ml-auto text-3xl dark:text-white' onClick={onClose}>
                    <IoCloseCircleOutline />
                </button>
                <h1 className='text-lg font-medium dark:text-slate-100 -mt-5'>Enter the role to create</h1>
                <div className='flex gap-1 mt-1'>
                    <CiCircleAlert className='dark:text-white w-6 h-6' />
                    <p className='dark:text-slate-400 pb-4 text-sm'>By default all permissions of the role created will be desactivated</p>
                </div>

                <input
                    type='text'
                    name='role'
                    value={data?.role}
                    onChange={handleOnChange}
                    placeholder='MANAGER'
                    maxLength={10}
                    className='border px-4 py-1 w-full dark:bg-slate-600 dark:text-slate-100'
                />
                <button
                    onClick={handleSubmit}
                    className='mt-4 w-full border rounded-lg py-2 px-4 bg-blue-500 text-white hover:bg-blue-700 transition-all duration-300'>
                    {loading ? `Processing${dots}` : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default CreateRole;
