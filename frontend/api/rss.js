/**
 * Vercel Serverless Function: /api/rss
 *
 * Connects directly to MongoDB Atlas (bypassing Render entirely),
 * fetches all Published blogs, and returns a live RSS 2.0 XML feed.
 *
 * URL: https://www.sickykumar.in/api/rss
 *
 * IMPORTANT: Set MONGODB_URI in your Vercel project environment variables
 * (same URI as your backend/.env → Project Settings → Environment Variables)
 */

import { MongoClient } from 'mongodb';

const SITE_URL = 'https://www.sickykumar.in';

// Connection cache for warm serverless re-invocations
let cachedClient = null;

async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is not set in Vercel.');

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    await cachedClient.connect();
  }
  return cachedClient.db(); // uses the DB name from the connection string
}

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const blogs = await db
      .collection('blogs')
      .find({ status: 'Published' })
      .sort({ createdAt: -1 })
      .toArray();

    const items = blogs
      .map(blog => `
    <item>
      <title><![CDATA[${blog.title || ''}]]></title>
      <link>${SITE_URL}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${blog.slug}</guid>
      <description><![CDATA[${blog.description || ''}]]></description>
      <category><![CDATA[${blog.category || ''}]]></category>
      <pubDate>${new Date(blog.createdAt).toUTCString()}</pubDate>
    </item>`)
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sicky Kumar | SaaS Engineering Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Latest engineering posts on Web Development, DevOps, and MERN stack architectures by Sicky Kumar.</description>
    <language>en-us</language>
    <managingEditor>sickykumar01@gmail.com (Sicky Kumar)</managingEditor>
    <webMaster>sickykumar01@gmail.com (Sicky Kumar)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml" />
${items}

  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).send(xml);
  } catch (err) {
    console.error('[RSS Function Error]', err.message);
    return res.status(500).send(`<?xml version="1.0"?><error>${err.message}</error>`);
  }
}
