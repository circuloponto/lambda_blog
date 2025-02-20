import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-white">
            <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-extrabold text-gray-900">λ</span>
                            <span className="text-xl font-semibold text-gray-900">Lambda Blog</span>
                        </Link>
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
                </div>
            </nav>

            <main className="pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>

            <footer className="bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                                About
                            </h3>
                            <p className="mt-4 text-base text-gray-500">
                                Lambda Blog is dedicated to exploring functional programming concepts
                                and their practical applications in modern software development.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                                Categories
                            </h3>
                            <ul className="mt-4 space-y-4">
                                <li>
                                    <Link to="/" className="text-base text-gray-500 hover:text-gray-900">
                                        Category Theory
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="text-base text-gray-500 hover:text-gray-900">
                                        Lambda Calculus
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="text-base text-gray-500 hover:text-gray-900">
                                        Functional JavaScript
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                                Follow Us
                            </h3>
                            <ul className="mt-4 space-y-4">
                                <li>
                                    <a
                                        href="https://twitter.com"
                                        className="text-base text-gray-500 hover:text-gray-900"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Twitter
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com"
                                        className="text-base text-gray-500 hover:text-gray-900"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        GitHub
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
