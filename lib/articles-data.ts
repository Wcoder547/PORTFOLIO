// lib/articles-data.ts
export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  content: string;
  tags: string[];
  tableOfContents: Array<{ id: string; title: string }>;
  featured?: boolean;
}

export const articlesData: Article[] = [
  {
    slug: "typescript-advanced-patterns",
    title: "Mastering TypeScript: Advanced Patterns for React Developers",
    excerpt:
      "Dive deep into advanced TypeScript patterns, generics, and type guards to write more maintainable and type-safe React applications.",
    image: "/images/articles/typescript-patterns.jpg",
    date: "Feb 10, 2026",
    readTime: "12 min read",
    category: "TypeScript",
    featured: true,
    author: {
      name: "Yash Kapure",
      avatar: "/images/avatar.jpg",
      bio: "Full-Stack Developer specializing in React, Next.js, and TypeScript",
    },
    content: `
## Introduction

TypeScript has become an essential tool for building scalable React applications. In this comprehensive guide, we'll explore advanced TypeScript patterns that will take your React development to the next level.

## Why Advanced TypeScript Matters

Type safety isn't just about catching bugs—it's about building robust, self-documenting code that scales with your team. Advanced TypeScript patterns help you:

- **Reduce runtime errors** by catching issues at compile time
- **Improve code maintainability** with clear type definitions
- **Enable better IDE support** with autocomplete and IntelliSense
- **Facilitate team collaboration** through self-documenting interfaces

## 1. Generic Components

Generic components allow you to create reusable UI elements while maintaining type safety. Here's a powerful pattern for building type-safe list components:

\`\`\`typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <div>
      {items.map((item) => (
        <div key={keyExtractor(item)}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
\`\`\`

## 2. Discriminated Unions

Discriminated unions are perfect for handling different states in your application with complete type safety:

\`\`\`typescript
type LoadingState = {
  status: 'loading';
};

type SuccessState<T> = {
  status: 'success';
  data: T;
};

type ErrorState = {
  status: 'error';
  error: Error;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;
\`\`\`

## 3. Utility Types and Type Transformations

TypeScript's utility types can help you derive new types from existing ones:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Pick<User, 'id' | 'name' | 'email'>;
type UserUpdate = Partial<User>;
type ImmutableUser = Readonly<User>;
type SafeUser = Omit<User, 'password'>;
\`\`\`

## Best Practices

1. **Start Simple**: Don't over-engineer your types. Add complexity only when needed.
2. **Use Inference**: Let TypeScript infer types when possible.
3. **Leverage Utility Types**: Use built-in utility types before creating custom ones.
4. **Document Complex Types**: Add JSDoc comments for complex type definitions.

## Conclusion

Mastering these advanced TypeScript patterns will significantly improve your React development workflow. They provide better tooling support, catch bugs early, and make your code more maintainable.

Happy coding! 🚀
    `,
    tags: ["TypeScript", "React", "Type Safety", "Advanced Patterns"],
    tableOfContents: [
      { id: "introduction", title: "Introduction" },
      {
        id: "why-advanced-typescript-matters",
        title: "Why Advanced TypeScript Matters",
      },
      { id: "1-generic-components", title: "1. Generic Components" },
      { id: "2-discriminated-unions", title: "2. Discriminated Unions" },
      {
        id: "3-utility-types-and-type-transformations",
        title: "3. Utility Types",
      },
      { id: "best-practices", title: "Best Practices" },
      { id: "conclusion", title: "Conclusion" },
    ],
  },
  {
    slug: "nextjs-server-components",
    title: "Building Scalable Next.js Applications with Server Components",
    excerpt:
      "Learn how to leverage Next.js 15 server components to build high-performance, scalable web applications with improved SEO and faster load times.",
    image: "/images/articles/nextjs-server-components.jpg",
    date: "Feb 15, 2026",
    readTime: "8 min read",
    category: "Next.js",
    featured: true,
    author: {
      name: "Yash Kapure",
      avatar: "/images/avatar.jpg",
      bio: "Full-Stack Developer specializing in React, Next.js, and TypeScript",
    },
    content: `
## Introduction

Next.js 15 brings revolutionary changes to how we build web applications. Server Components fundamentally change the way we think about rendering and data fetching in React applications.

## What Are Server Components?

Server Components are React components that run exclusively on the server. They enable:

- Zero JavaScript sent to the client
- Direct database access
- Improved security (API keys never exposed)
- Better SEO and faster initial page loads

## Your First Server Component

\`\`\`typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  );
}
\`\`\`

## Best Practices

1. **Default to Server Components**: Use client components only when needed
2. **Move Client Components Down**: Keep client components at the leaves
3. **Pass Server Data to Client Components**: Via props, not context

## Conclusion

Server Components are a game-changer for Next.js applications. Start building with them today! 🚀
    `,
    tags: ["Next.js", "Server Components", "React", "Performance"],
    tableOfContents: [
      { id: "introduction", title: "Introduction" },
      {
        id: "what-are-server-components",
        title: "What Are Server Components?",
      },
      {
        id: "your-first-server-component",
        title: "Your First Server Component",
      },
      { id: "best-practices", title: "Best Practices" },
      { id: "conclusion", title: "Conclusion" },
    ],
  },
  {
    slug: "ai-powered-web-development",
    title: "AI-Powered Web Development: Integrating OpenAI APIs",
    excerpt:
      "A comprehensive guide to integrating AI capabilities into your web applications using OpenAI APIs, RAG, and vector databases.",
    image: "/images/articles/ai-web-dev.jpg",
    date: "Feb 5, 2026",
    readTime: "15 min read",
    category: "AI",
    featured: true,
    author: {
      name: "Yash Kapure",
      avatar: "/images/avatar.jpg",
      bio: "Full-Stack Developer specializing in React, Next.js, and TypeScript",
    },
    content: `
## Introduction

AI is transforming web development. Learn how to integrate powerful AI features into your applications using modern tools and APIs.

## Getting Started with OpenAI

\`\`\`typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateText(prompt: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
  
  return completion.choices[0].message.content;
}
\`\`\`

## Building AI Features

1. **Chat Interfaces**: Create conversational UIs
2. **Content Generation**: Auto-generate content
3. **Smart Search**: Implement semantic search

## Conclusion

AI integration opens endless possibilities for modern web applications. Start experimenting today! 🤖
    `,
    tags: ["AI", "OpenAI", "Web Development", "APIs"],
    tableOfContents: [
      { id: "introduction", title: "Introduction" },
      {
        id: "getting-started-with-openai",
        title: "Getting Started with OpenAI",
      },
      { id: "building-ai-features", title: "Building AI Features" },
      { id: "conclusion", title: "Conclusion" },
    ],
  },
];

// Helper function to get article by slug
export function getArticleBySlug(slug: string): Article | undefined {
  return articlesData.find((article) => article.slug === slug);
}

// Helper function to get all articles
export function getAllArticles(): Article[] {
  return articlesData;
}

// Helper function to get featured articles
export function getFeaturedArticles(): Article[] {
  return articlesData.filter((article) => article.featured);
}
