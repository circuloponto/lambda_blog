import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

const RelatedPosts = ({ currentPostId }) => {
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedPosts = async () => {
            try {
                // Fetch recent posts excluding the current post
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .neq('id', currentPostId)
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (error) throw error;
                setRelatedPosts(data);
            } catch (error) {
                console.error('Error fetching related posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedPosts();
    }, [currentPostId]);

    if (loading) {
        return <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            ))}
        </div>;
    }

    return (
        <div className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-900">Related Posts</h3>
            <div className="space-y-6">
                {relatedPosts.map(post => (
                    <Link
                        key={post.id}
                        to={`/post/${post.id}`}
                        className="group block"
                    >
                        <article className="space-y-3">
                            {post.image_url && (
                                <div className="aspect-[2/1] overflow-hidden rounded-lg">
                                    <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition duration-150 line-clamp-2">
                                {post.title}
                            </h4>
                            <div className="text-sm text-gray-500">
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedPosts;
