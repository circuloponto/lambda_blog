import { Link } from 'react-router-dom';
import { useState } from 'react';

const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
                <div className="w-full px-4 sm:px-6 md:max-w-7xl md:mx-auto">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">λ</span>
                            <span className="text-lg sm:text-xl font-semibold text-gray-900">Lambda Blog</span>
                        </Link>
                        
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        {/* Desktop navigation */}
                        <div className="hidden md:flex space-x-8">
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                            >
                                Home
                            </Link>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                            >
                                GitHub
                            </a>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {isMenuOpen && (
                        <div className="md:hidden py-2 space-y-1">
                            <Link
                                to="/"
                                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                GitHub
                            </a>
                        </div>
                    )}
                </div>
            </nav>

            <main className="pt-16">
                <div className="w-full px-4 sm:px-6 md:max-w-7xl md:mx-auto py-4 sm:py-6 md:py-8">
                    {children}
                </div>
            </main>

            <footer className="bg-gray-50 border-t border-gray-100">
                <div className="w-full px-4 sm:px-6 md:max-w-7xl md:mx-auto py-8 sm:py-12">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                                About
                            </h3>
                            <p className="mt-4 text-sm sm:text-base text-gray-500">
                                Lambda Blog is dedicated to exploring functional programming concepts
                                and their practical applications in modern software development.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                                Links
                            </h3>
                            <ul className="mt-4 space-y-2 sm:space-y-4">
                                <li>
                                    <Link
                                        to="/"
                                        className="text-sm sm:text-base text-gray-500 hover:text-gray-900"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm sm:text-base text-gray-500 hover:text-gray-900"
                                    >
                                        GitHub
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="sm:col-span-2 md:col-span-1">
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                                Contact
                            </h3>
                            <ul className="mt-4 space-y-2 sm:space-y-4">
                                <li>
                                    <a
                                        href="mailto:contact@example.com"
                                        className="text-sm sm:text-base text-gray-500 hover:text-gray-900"
                                    >
                                        contact@example.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-200 pt-8">
                        <p className="text-base text-gray-400 text-center">
                            {new Date().getFullYear()} Lambda Blog. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
