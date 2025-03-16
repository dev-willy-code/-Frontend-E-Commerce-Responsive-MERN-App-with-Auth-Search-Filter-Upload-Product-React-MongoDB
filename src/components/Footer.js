import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='bg-slate-200 dark:bg-gray-700'>
            <div className='container mx-auto p-4'>
                <p className='text-center font-bold dark:text-white' title={`All rights reserved ${currentYear}`}>
                    All rights reserved © {currentYear}
                </p>
            </div>
        </footer>
    )
}

export default Footer;
