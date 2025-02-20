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
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-red-600 text-sm">Error loading posts</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm lg:shadow-md">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                All Posts
            </h3>
            <nav className="space-y-2 flex flex-col">
                {allPosts.map(post => (
                    <Link
                        key={post.isStatic ? post.slug : post.id}
                        to={post.isStatic ? `/post/${post.slug}` : `/post/${post.id}`}
                        className={`block text-sm py-2 transition-colors duration-150 ${
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
