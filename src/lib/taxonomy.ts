import { getCollection, type CollectionEntry } from 'astro:content';

export function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export async function getSortedPosts(): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog');
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getAllTags(): Promise<{ tag: string; slug: string; count: number }[]> {
	const posts = await getSortedPosts();
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags ?? []) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}
	return [...counts.entries()]
		.map(([tag, count]) => ({ tag, slug: slugify(tag), count }))
		.sort((a, b) => a.tag.localeCompare(b.tag));
}

export async function getAllSeries(): Promise<{ series: string; slug: string; count: number }[]> {
	const posts = await getSortedPosts();
	const counts = new Map<string, number>();
	for (const post of posts) {
		if (!post.data.series) continue;
		counts.set(post.data.series, (counts.get(post.data.series) ?? 0) + 1);
	}
	return [...counts.entries()]
		.map(([series, count]) => ({ series, slug: slugify(series), count }))
		.sort((a, b) => a.series.localeCompare(b.series));
}
