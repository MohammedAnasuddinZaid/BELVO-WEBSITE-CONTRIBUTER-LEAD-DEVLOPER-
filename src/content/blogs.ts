export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  thumbnail: string;
  pdfPath?: string;
  content: string;
};

export const BLOG_CATEGORIES = [
  "Marketing",
  "Branding",
  "Tech",
  "Agency Life",
  "Case Studies",
  "Startup Playbook",
  "Web Development",
  "SEO",
];

const markdownPosts = import.meta.glob("./blogs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function cleanValue(value: string) {
  return value.trim().replace(/^["']|["']$/g, "");
}

function parseMarkdownPost(path: string, raw: string): BlogPost | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return null;
  }

  const frontmatter = match[1].split(/\r?\n/).reduce<Record<string, string>>((acc, line) => {
    const separator = line.indexOf(":");

    if (separator === -1) {
      return acc;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1);

    if (key) {
      acc[key] = cleanValue(value);
    }

    return acc;
  }, {});

  if (frontmatter.published === "false") {
    return null;
  }

  const { title, date, category, excerpt, thumbnail, pdfPath } = frontmatter;

  if (!title || !date || !category || !excerpt || !thumbnail) {
    return null;
  }

  return {
    slug: path.split("/").pop()?.replace(/\.md$/, "") ?? title.toLowerCase().replace(/\s+/g, "-"),
    title,
    date,
    category,
    excerpt,
    thumbnail,
    pdfPath: pdfPath || undefined,
    content: match[2].trim(),
  };
}

export const blogPosts = Object.entries(markdownPosts)
  .map(([path, raw]) => parseMarkdownPost(path, raw))
  .filter((post): post is BlogPost => Boolean(post))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
