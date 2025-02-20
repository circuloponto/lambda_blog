import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { getPostBySlug } from '../data/posts';
import TableOfContents from './TableOfContents';
import ReactMarkdown from 'react-markdown';
import '../styles/markdown.css';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PostDetail = () => {
    const { id: postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                if (!postId) {
                    console.error('No post ID provided');
                    navigate('/404');
                    return;
                }

                // First check if it's a static post (slug)
                const staticPost = getPostBySlug(postId);
                if (staticPost) {
                    console.log('Found static post:', staticPost);
                    setPost({
                        ...staticPost,
                        isStatic: true,
                        created_at: staticPost.date,
                        featuredImage: staticPost.featuredImage
                    });
                    setLoading(false);
                    return;
                }

                // If not a static post, validate UUID
                if (!UUID_REGEX.test(postId)) {
                    console.error('Invalid UUID format:', postId);
                    navigate('/404');
                    return;
                }

                console.log('Fetching dynamic post with ID:', postId);

                // Fetch from Supabase using the UUID
                const { data, error: fetchError } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', postId)
                    .single();

                if (fetchError) {
                    console.error('Supabase fetch error:', fetchError);
                    throw fetchError;
                }

                if (!data) {
                    console.error('No post found with ID:', postId);
                    navigate('/404');
                    return;
                }

                console.log('Found dynamic post:', data);

                // Get signed URL for the image if it exists
                let imageUrl = null;
                if (data.image_url) {
                    try {
                        // Check if the image_url is already a full URL
                        if (data.image_url.startsWith('http')) {
                            imageUrl = data.image_url;
                        } else {
                            // If it's just a filename, get a signed URL
                            const { data: storageData } = await supabase
                                .storage
                                .from('blog-images')
                                .createSignedUrl(data.image_url, 60 * 60); // 1 hour expiry

                            console.log('Image data:', {
                                originalUrl: data.image_url,
                                signedUrl: storageData?.signedUrl
                            });

                            imageUrl = storageData?.signedUrl;
                        }
                    } catch (imageError) {
                        console.error('Error getting signed URL:', imageError);
                        // Don't throw, just log the error and continue without the image
                    }
                }

                setPost({
                    ...data,
                    isStatic: false,
                    featuredImage: imageUrl
                });
            } catch (error) {
                console.error('Error fetching post:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="text-center text-red-600 p-4">
                {error || 'Post not found'}
            </div>
        );
    }

    return (
        <div className="w-full">
            <article className="px-4 sm:px-6 md:px-8">
                <div className="w-full md:max-w-2xl mx-auto">
                    <header className="mb-8 sm:mb-12">
                        <div className="mb-4 sm:mb-6 flex flex-wrap">
                            {post.tags && post.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800 mr-2 mb-2"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 break-words">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-500">
                            <span>{post.author}</span>
                            <span>•</span>
                            <time dateTime={post.created_at || post.date}>
                                {new Date(post.created_at || post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>
                    </header>

                    {post.featuredImage && (
                        <div className="mb-8 sm:mb-12">
                            <div className="w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden">
                                <img
                                    src={post.featuredImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <div className="prose prose-sm sm:prose lg:prose-lg mx-auto">
                        <ReactMarkdown className="markdown-body">
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>

            {/* Table of Contents - Bottom on mobile, sidebar on desktop */}
            <div className="mt-8 px-4 sm:px-6 md:px-0 md:w-64 md:fixed md:top-24 md:right-4 md:bottom-0 md:overflow-y-auto">
                <div className="border-t md:border-t-0 pt-4 md:pt-0">
                    <TableOfContents currentPostId={post.isStatic ? post.slug : post.id} />
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
