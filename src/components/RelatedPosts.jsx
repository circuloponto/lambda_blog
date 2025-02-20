import { Link } from 'react-router-dom';
import { posts } from '../data/posts';

const RelatedPosts = ({ currentPostId, currentPostTags }) => {
    // Find posts that share tags with the current post
    const relatedPosts = posts
        .filter(post => post.id !== currentPostId) // Exclude current post
        .map(post => ({
            ...post,
            // Calculate how many tags match
            relevanceScore: post.tags.filter(tag => 
                currentPostTags.includes(tag)
            ).length
        }))
        .filter(post => post.relevanceScore > 0) // Only include posts with matching tags
        .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by relevance
        .slice(0, 3); // Get top 3 related posts

    // If we don't have enough related posts by tags, add recent posts
    const recentPosts = posts
        .filter(post => 
            post.id !== currentPostId && 
            !relatedPosts.find(p => p.id === post.id)
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3 - relatedPosts.length);

    const sidebarPosts = [...relatedPosts, ...recentPosts];

    return (
        <div className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-900">Related Posts</h3>
            <div className="space-y-6">
                {sidebarPosts.map(post => (
                    <Link
                        key={post.id}
                        to={`/post/${post.slug}`}
                        className="group block"
                    >
                        <article className="space-y-3">
                            {post.featuredImage && (
                                <div className="aspect-[2/1] overflow-hidden rounded-lg">
                                    <img
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <h4 className="text-base font-semibold text-gray-900 group-hover:text-accent-600 transition duration-150 line-clamp-2">
                                {post.title}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500">
                                <time dateTime={post.date}>
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </time>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedPosts;
