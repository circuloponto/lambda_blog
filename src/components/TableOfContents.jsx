import { Link } from 'react-router-dom';
import { posts } from '../data/posts';

const TableOfContents = ({ currentPostId }) => {
    return (
        <div className="fixed top-24 right-8 w-64 bg-white p-6 border-l border-gray-100">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                All Posts
            </h3>
            <nav className="space-y-2">
                {posts.map(post => (
                    <Link
                        key={post.id}
                        to={`/post/${post.slug}`}
                        className={`block text-sm transition-colors duration-150 ${
                            post.id === currentPostId
                                ? 'text-accent-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {post.title}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default TableOfContents;
