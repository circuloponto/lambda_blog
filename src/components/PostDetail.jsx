import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../data/posts';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import RelatedPosts from './RelatedPosts';
import TableOfContents from './TableOfContents';

const PostDetail = () => {
    const { slug } = useParams();
    const post = getPostBySlug(slug);

    if (!post) {
        return (
            <div className="text-center py-16">
                <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <article>
                    <header className="mb-16">
                        <div className="mb-6">
                            {post.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mr-2"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                            {post.title}
                        </h1>
                        <div className="flex items-center space-x-4 text-gray-500">
                            <span>{post.author}</span>
                            <span>•</span>
                            <time dateTime={post.date}>
                                {new Date(post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>
                    </header>

                    {post.featuredImage && (
                        <div className="aspect-[2/1] overflow-hidden rounded-lg mb-16">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none">
                        <ReactMarkdown
                            components={{
                                code({node, inline, className, children, ...props}) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={atomDark}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500">Share this post:</span>
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    Twitter
                                </a>
                                <a
                                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                    </div>
                </article>

                <div className="mt-16 pt-8 border-t border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <RelatedPosts currentPostId={post.id} currentPostTags={post.tags} />
                    </div>
                </div>
            </div>

            <TableOfContents currentPostId={post.id} />
        </>
    );
};

export default PostDetail;
