import { useParams, Navigate } from 'react-router-dom';
import { getPostBySlug } from '../data/posts';
import ReactMarkdown from 'react-markdown';

const PostView = () => {
    const { slug } = useParams();
    const post = getPostBySlug(slug);

    if (!post) {
        return <Navigate to="/" />;
    }

    return (
        <article className="max-w-4xl mx-auto">
            {post.featuredImage && (
                <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {post.title}
                </h1>
                <div className="flex items-center space-x-2 text-gray-500">
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

            <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <footer className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-accent-50 text-accent-600 rounded-full text-sm"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </footer>
        </article>
    );
};

export default PostView;
