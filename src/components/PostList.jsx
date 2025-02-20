import { Link } from 'react-router-dom';
import { posts } from '../data/posts';

const PostList = () => {
    // Group posts by month
    const groupedPosts = posts.reduce((groups, post) => {
        const date = new Date(post.date);
        const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        if (!groups[monthYear]) {
            groups[monthYear] = [];
        }
        groups[monthYear].push(post);
        return groups;
    }, {});

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

            {Object.entries(groupedPosts).map(([monthYear, monthPosts]) => (
                <div key={monthYear} className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                        {monthYear}
                    </h2>
                    <div className="grid gap-12">
                        {monthPosts.map((post) => (
                            <article
                                key={post.id}
                                className="grid md:grid-cols-4 gap-8 items-start"
                            >
                                <div className="md:col-span-1">
                                    <time className="text-sm text-gray-500">
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </time>
                                </div>
                                <div className="md:col-span-3">
                                    <Link
                                        to={`/post/${post.slug}`}
                                        className="group block"
                                    >
                                        {post.featuredImage && (
                                            <div className="aspect-[2/1] overflow-hidden rounded-lg mb-4">
                                                <img
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-accent-600 transition duration-150">
                                            {post.title}
                                        </h3>
                                        <p className="mt-3 text-lg text-gray-500 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {post.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </Link>
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
