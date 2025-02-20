import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { posts as staticPosts } from '../data/posts';

const PostList = () => {
    const [dynamicPosts, setDynamicPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Get signed URLs for all images
                const postsWithSignedUrls = await Promise.all(data.map(async (post) => {
                    if (!post.id) {
                        console.error('Post missing ID:', post);
                        return null;
                    }

                    if (post.image_url) {
                        try {
                            // Check if the image_url is already a full URL
                            if (post.image_url.startsWith('http')) {
                                return { ...post, image_url: post.image_url };
                            }

                            // If it's just a filename, get a signed URL
                            const { data: storageData } = await supabase
                                .storage
                                .from('blog-images')
                                .createSignedUrl(post.image_url, 60 * 60); // 1 hour expiry

                            console.log('Image data for post:', post.id, {
                                originalUrl: post.image_url,
                                signedUrl: storageData?.signedUrl
                            });

                            return { ...post, image_url: storageData?.signedUrl };
                        } catch (error) {
                            console.error('Error getting signed URL for post', post.id, error);
                            return post;
                        }
                    }
                    return post;
                }));

                // Filter out any null posts (those without IDs)
                setDynamicPosts(postsWithSignedUrls.filter(Boolean));
            } catch (error) {
                console.error('Error fetching posts:', error);
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
            isStatic: true,
            created_at: post.date,
            featuredImage: post.featuredImage
        })),
        ...dynamicPosts.map(post => ({
            ...post,
            isStatic: false,
            featuredImage: post.image_url // Use the signed URL we got from Supabase
        }))
    ];

    // Group all posts by month
    const groupedPosts = allPosts.reduce((groups, post) => {
        const date = new Date(post.created_at || post.date);
        const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        if (!groups[monthYear]) {
            groups[monthYear] = [];
        }
        groups[monthYear].push(post);
        return groups;
    }, {});

    // Sort months in reverse chronological order
    const sortedMonths = Object.keys(groupedPosts).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB - dateA;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                Error loading posts: {error}
            </div>
        );
    }

    if (allPosts.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                No posts available. Create your first post!
            </div>
        );
    }

    return (
        <div className="space-y-16">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Lambda Blog
                </h1>
                <p className="mt-4 text-xl text-gray-500">
                    Exploring the elegance of functional programming through theory and practice.
                </p>
            </div>

            {sortedMonths.map(monthYear => (
                <div key={monthYear} className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                        {monthYear}
                    </h2>
                    <div className="grid gap-12">
                        {groupedPosts[monthYear]
                            .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
                            .map((post) => (
                                <article
                                    key={post.isStatic ? post.slug : post.id}
                                    className="grid md:grid-cols-4 gap-8 items-start"
                                >
                                    <div className="md:col-span-1">
                                        <time className="text-sm text-gray-500">
                                            {new Date(post.created_at || post.date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </time>
                                    </div>
                                    <div className="md:col-span-3">
                                        <Link
                                            to={post.isStatic ? `/post/${post.slug}` : `/post/${post.id}`}
                                            className="group block"
                                        >
                                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                                                {post.title}
                                            </h3>
                                            <div className="mt-3 text-gray-500 line-clamp-3">
                                                {post.content.substring(0, 200)}...
                                            </div>
                                        </Link>
                                        {post.featuredImage && (
                                            <img 
                                                src={post.featuredImage}
                                                alt={post.title}
                                                className="mt-4 rounded-lg w-full max-w-2xl object-cover"
                                            />
                                        )}
                                    </div>
                                </article>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList;
