import React from 'react';
import '../index.css';
import '../App.css';

function Footer() {
    return (
        <div className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 bg-blue-100 mt-8 border-t border-blue-200">
            <footer className="text-center text-sm text-gray-600 py-4">
                &copy; {new Date().getFullYear()} VNIT Gatepass Management System. All rights reserved.
            </footer>
        </div>
    );
}

export default Footer;
