import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { posts as staticPosts } from '../data/posts';

const TableOfContents = ({ currentPostId }) => {
    const [dynamicPosts, setDynamicPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('posts')
                    .select('id, title, created_at')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setDynamicPosts(data);
            } catch (error) {
                console.error('Error fetching posts for table of contents:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Combine static and dynamic posts
    const allPosts = [
        ...staticPosts.map(post => ({
            ...post,
            isStatic: true
        })),
        ...dynamicPosts.map(post => ({
            ...post,
            isStatic: false
        }))
    ];

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">
                <div className="animate-pulse space-y-3 sm:space-y-4">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-red-600">Error loading posts</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">
                All Posts
            </h3>
            <nav className="space-y-1 sm:space-y-2">
                {allPosts.map(post => (
                    <Link
                        key={post.isStatic ? post.slug : post.id}
                        to={post.isStatic ? `/post/${post.slug}` : `/post/${post.id}`}
                        className={`block text-xs sm:text-sm py-1.5 sm:py-2 transition-colors duration-150 ${
                            (post.isStatic ? post.slug === currentPostId : post.id === currentPostId)
                                ? 'text-blue-600 font-medium'
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
