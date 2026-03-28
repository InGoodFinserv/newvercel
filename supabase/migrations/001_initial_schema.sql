-- Lumina Press Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE content_type AS ENUM ('blog', 'press', 'page');
CREATE TYPE content_status AS ENUM ('draft', 'published');

-- Create contents table
CREATE TABLE IF NOT EXISTS contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type content_type NOT NULL,
  title TEXT NOT NULL,
  custom_slug TEXT NOT NULL UNIQUE,
  image TEXT,
  body TEXT NOT NULL DEFAULT '',
  metadata JSONB DEFAULT '{}',
  status content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
CREATE INDEX IF NOT EXISTS idx_contents_status ON contents(status);
CREATE INDEX IF NOT EXISTS idx_contents_slug ON contents(custom_slug);
CREATE INDEX IF NOT EXISTS idx_contents_created_at ON contents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contents_type_status ON contents(type, status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_contents_updated_at ON contents;
CREATE TRIGGER update_contents_updated_at
  BEFORE UPDATE ON contents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published content
CREATE POLICY "Public can read published content"
  ON contents FOR SELECT
  USING (status = 'published');

-- Policy: Authenticated users can read all content
CREATE POLICY "Authenticated can read all content"
  ON contents FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert content
CREATE POLICY "Authenticated can insert content"
  ON contents FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update content
CREATE POLICY "Authenticated can update content"
  ON contents FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Authenticated users can delete content
CREATE POLICY "Authenticated can delete content"
  ON contents FOR DELETE
  TO authenticated
  USING (true);

-- Seed data: Blog posts
INSERT INTO contents (type, title, custom_slug, image, body, metadata, status) VALUES
(
  'blog',
  'The Future of AI in Creative Industries',
  'future-of-ai-in-creative-industries',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
  '<p>Artificial intelligence is rapidly transforming the creative landscape. From generating artwork to composing music, AI tools are becoming indispensable partners for creators worldwide.</p><h2>The Rise of Generative AI</h2><p>Generative AI models like DALL-E, Midjourney, and GPT-4 have demonstrated remarkable capabilities in producing creative content. These tools are not replacing human creativity but augmenting it, enabling artists to explore new frontiers of expression.</p><h2>Impact on Design Workflows</h2><p>Design professionals are integrating AI into their workflows at an unprecedented pace. Automated prototyping, intelligent color suggestions, and AI-powered layout optimization are becoming standard features in design tools.</p><h2>Looking Ahead</h2><p>As AI continues to evolve, we can expect even deeper integration into creative processes. The key will be maintaining the human element while leveraging AI''s computational power to push creative boundaries further than ever before.</p>',
  '{"description": "Exploring how artificial intelligence is reshaping creative workflows and opening new possibilities for artists and designers.", "keywords": ["AI", "creativity", "technology", "design"]}',
  'published'
),
(
  'blog',
  'Building Scalable Web Applications with Modern Frameworks',
  'building-scalable-web-applications',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200',
  '<p>The landscape of web development has evolved dramatically. Modern frameworks provide unprecedented capabilities for building fast, scalable, and maintainable applications.</p><h2>React and the Component Revolution</h2><p>React''s component-based architecture has fundamentally changed how we think about building user interfaces. By breaking down complex UIs into reusable components, developers can create more maintainable and testable codebases.</p><h2>Server-Side Rendering Renaissance</h2><p>Frameworks like Next.js and Remix have brought server-side rendering back into the spotlight. The benefits for SEO, performance, and user experience are compelling reasons to adopt these patterns.</p><h2>The Edge Computing Frontier</h2><p>Edge computing is pushing application logic closer to users, reducing latency and improving performance. Platforms like Vercel and Cloudflare Workers are making edge deployment accessible to all developers.</p>',
  '{"description": "A deep dive into modern web development frameworks and best practices for building production-ready applications.", "keywords": ["web development", "React", "Next.js", "scalability"]}',
  'published'
),
(
  'blog',
  'The Art of Digital Storytelling',
  'the-art-of-digital-storytelling',
  'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=1200',
  '<p>In an age of information overload, the ability to tell compelling digital stories has become more valuable than ever. Great storytelling cuts through the noise and creates lasting connections with audiences.</p><h2>Visual Narrative Techniques</h2><p>Combining imagery with narrative structure creates powerful emotional experiences. From interactive documentaries to animated explainers, visual storytelling continues to evolve with new technologies.</p><h2>Data-Driven Stories</h2><p>Data visualization and interactive infographics transform complex information into engaging narratives. The best data stories reveal patterns and insights that would otherwise remain hidden in spreadsheets.</p><h2>Authenticity in the Digital Age</h2><p>As audiences become more sophisticated, authenticity has become the cornerstone of effective digital storytelling. Brands and creators who embrace genuine narratives build stronger, more loyal communities.</p>',
  '{"description": "How to craft compelling narratives in the digital age using modern tools and techniques.", "keywords": ["storytelling", "content", "digital media", "narrative"]}',
  'published'
),
(
  'blog',
  'Understanding Modern Design Systems',
  'understanding-modern-design-systems',
  'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200',
  '<p>Design systems have become essential infrastructure for organizations building digital products at scale. They provide a shared language and consistent foundation for design and development teams.</p><h2>Core Components</h2><p>A robust design system includes typography scales, color palettes, spacing systems, and a library of reusable UI components. These elements work together to create cohesive user experiences across products.</p><h2>Documentation and Governance</h2><p>The best design systems are well-documented and actively maintained. Clear guidelines for usage, contribution processes, and version management ensure long-term success.</p><h2>Measuring Impact</h2><p>Organizations with mature design systems report faster development cycles, improved consistency, and better collaboration between design and engineering teams. The investment in building a design system pays dividends over time.</p>',
  '{"description": "A comprehensive guide to building and maintaining design systems for modern digital products.", "keywords": ["design systems", "UI", "UX", "components"]}',
  'published'
);

-- Seed data: Press releases
INSERT INTO contents (type, title, custom_slug, image, body, metadata, status) VALUES
(
  'press',
  'Lumina Press Launches Next-Generation Content Platform',
  'lumina-press-launches-next-gen-platform',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200',
  '<p><strong>SAN FRANCISCO, CA</strong> — Lumina Press today announced the launch of its next-generation digital content platform, designed to empower creators and organizations with powerful publishing tools.</p><p>The new platform features a sleek, modern interface with real-time content management, advanced analytics, and seamless integration with popular development frameworks.</p><p>"We''ve built this platform from the ground up with creators in mind," said the Lumina Press team. "Our goal is to make professional publishing accessible to everyone."</p><p>Key features include:</p><ul><li>Rich text editing with live preview</li><li>Slug-based routing for clean URLs</li><li>Full CRUD operations via an intuitive admin dashboard</li><li>Responsive design optimized for all devices</li><li>Supabase-powered persistence and authentication</li></ul><p>The platform is available immediately for early adopters.</p>',
  '{"description": "Lumina Press announces the launch of its next-generation digital content platform.", "keywords": ["launch", "platform", "announcement"], "external_url": "https://luminapress.com"}',
  'published'
),
(
  'press',
  'New Partnership Brings AI-Powered Content Tools to Publishers',
  'new-partnership-ai-powered-content-tools',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200',
  '<p><strong>NEW YORK, NY</strong> — Lumina Press today announced a strategic partnership to bring advanced AI-powered content creation and optimization tools to publishers worldwide.</p><p>The partnership will integrate cutting-edge artificial intelligence capabilities directly into the Lumina Press platform, enabling publishers to:</p><ul><li>Generate content drafts and outlines with AI assistance</li><li>Optimize headlines and metadata for search engines</li><li>Analyze content performance with intelligent insights</li><li>Automate content scheduling and distribution</li></ul><p>"This partnership represents a significant milestone in our mission to democratize professional publishing," said the Lumina Press team. "AI tools will help publishers work more efficiently while maintaining their unique voice."</p><p>The new AI features are expected to roll out in phases over the coming months.</p>',
  '{"description": "Lumina Press announces strategic partnership to bring AI-powered content tools to publishers.", "keywords": ["partnership", "AI", "publishing", "tools"], "external_url": "https://luminapress.com/partners"}',
  'published'
);

-- Seed data: Static pages
INSERT INTO contents (type, title, custom_slug, image, body, metadata, status) VALUES
(
  'page',
  'About Lumina Press',
  'about',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
  '<h2>Our Mission</h2><p>Lumina Press is a next-generation digital media platform dedicated to delivering high-quality content that informs, inspires, and empowers our readers.</p><h2>What We Do</h2><p>We publish insightful blog posts, official press releases, and comprehensive resources covering technology, creativity, and innovation. Our content is crafted by experts and delivered through a sleek, modern platform built with cutting-edge web technologies.</p><h2>Our Technology</h2><p>Built with React, TypeScript, and Supabase, Lumina Press represents the future of digital publishing. Our platform features real-time content management, responsive design, and a powerful admin dashboard for seamless content operations.</p><h2>Connect With Us</h2><p>We''re always looking for talented writers, creators, and technologists to join our community. Reach out to learn more about contributing to Lumina Press.</p>',
  '{"description": "Learn about Lumina Press — a next-generation digital media platform for blogs, press releases, and more.", "keywords": ["about", "lumina press", "digital media"]}',
  'published'
),
(
  'page',
  'Contact Us',
  'contact',
  'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200',
  '<h2>Get in Touch</h2><p>We''d love to hear from you. Whether you have questions about our content, want to collaborate, or just want to say hello, feel free to reach out.</p><h2>Email</h2><p>For general inquiries: <strong>hello@luminapress.com</strong></p><p>For press inquiries: <strong>press@luminapress.com</strong></p><p>For technical support: <strong>support@luminapress.com</strong></p><h2>Social Media</h2><p>Follow us on social media for the latest updates and behind-the-scenes content.</p><h2>Office</h2><p>Lumina Press Headquarters<br>San Francisco, CA</p>',
  '{"description": "Contact Lumina Press for inquiries, collaborations, and support.", "keywords": ["contact", "email", "support"]}',
  'published'
);
