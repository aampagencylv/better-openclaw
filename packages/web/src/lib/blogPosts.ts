// This file now serves as a backward-compatible re-export for the refactored modular blog structure.

export {
	blogPosts,
	getAllTags,
	getPostBySlug,
	getPostsByCategory,
	getPostsByTag,
} from "./blog";
export type { BlogCategory, BlogPost } from "./blog/types";
export { blogCategories } from "./blog/types";
