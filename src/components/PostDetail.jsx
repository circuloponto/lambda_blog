import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { getPostBySlug } from '../data/posts';
import MDEditor from '@uiw/react-md-editor';
import TableOfContents from './TableOfContents';
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
        <div className="relative w-full">
            <div className="px-4 sm:px-6 lg:px-8">
                {/* Main content */}
                <div className="lg:pr-64">
                    <article className="max-w-2xl mx-auto">
                        <header className="mb-16">
                            <div className="mb-6 flex flex-wrap">
                                {post.tags && post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mr-2 mb-2"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 break-words">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 text-gray-500">
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
                            <div className="mb-16">
                                <div className="aspect-[2/1] overflow-hidden rounded-lg">
                                    <img
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="prose prose-lg mx-auto dark:prose-invert">
                            <MDEditor.Markdown 
                                source={post.content}
                                style={{ 
                                    backgroundColor: 'transparent',
                                    width: '100%',
                                    maxWidth: '100%'
                                }}
                                className="markdown-body"
                            />
                        </div>
                    </article>
                </div>

                {/* Table of Contents - Fixed on desktop, bottom on mobile */}
                <div className="lg:w-64 lg:fixed lg:top-24 lg:right-4 lg:bottom-0 lg:overflow-y-auto">
                    <div className="mt-8 lg:mt-0">
                        <TableOfContents currentPostId={post.isStatic ? post.slug : post.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
