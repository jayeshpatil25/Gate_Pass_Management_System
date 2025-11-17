import React from 'react';
import '../index.css';
import '../App.css';

function Footer() {
    return (
        <footer className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-blue-100 text-center text-sm text-gray-600 py-4 mt-8 border-t border-blue-200">
            &copy; {new Date().getFullYear()} VNIT Gatepass Management System. &copy; All rights reserved.
        </footer>

    );
}

export default Footer;
