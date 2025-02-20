import post1 from './post1';
import post2 from './post2';
import post3 from './post3';
import post4 from './post4';
import post5 from './post5';

export const posts = [post1, post2, post3, post4, post5];

// Helper function to get post by slug
export const getPostBySlug = (slug) => {
    return posts.find(post => post.slug === slug);
};
