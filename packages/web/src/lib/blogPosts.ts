// This file now serves as a backward-compatible re-export for the refactored modular blog structure.
export type { BlogPost, BlogCategory } from './blog/types';
export { blogCategories } from './blog/types';

export {
	blogPosts,
	getPostBySlug,
	getPostsByCategory,
	getAllTags,
	getPostsByTag,
} from './blog';
