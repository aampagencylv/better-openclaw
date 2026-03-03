export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	date: string;
	readTime: string;
	category: string;
	tags: string[];
	content: string;
}

export const blogCategories = [
	"All",
	"AI Agents",
	"Docker",
	"Homelab",
	"DevOps",
	"Tutorials",
	"Comparisons",
	"Top Lists",
] as const;

export type BlogCategory = (typeof blogCategories)[number];
