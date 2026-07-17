import express from 'express';
const router = express.Router();

// Helper function to handle fetch requests with retries and exponential backoff
const fetchWithRetry = async (url, options = {}, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        console.warn(`Gemini API rate limited (429). Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2.5; // exponential backoff
        continue;
      }
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Fetch connection error: ${err.message}. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2.5;
    }
  }
  throw new Error('Max retries exceeded for Gemini API request');
};

router.post('/chat', async (req, res) => {
  try {
    const { prompt, context, history } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Falling back to mock responses.');
      return res.json({
        success: true,
        text: `[System Notice: GEMINI_API_KEY is missing from the server's .env file. Please add it to enable real-time Gemini AI. Here is a simulated response to your question: "${prompt}"]\n\nI can help summarize articles, explain technical concepts, or discuss design. To get started, please add your GEMINI_API_KEY to the backend .env file!`
      });
    }

    // Prepare system instruction context based on query context type
    let systemInstruction = "You are Sicky Kumar himself, a premium Fullstack MERN & AI developer. Speak in the first person ('I', 'my', 'me').";

    if (context) {
      if (context.type === 'blog') {
        systemInstruction = `You are Sicky Kumar, the author of the blog. Speak in the first person ("I", "my"). You are helping the reader understand my blog post: "${context.title || ''}". Here is the article content:

${context.content || ''}

Strictly answer questions based on this post. Keep your tone professional, friendly, and technically confident, using developer jargon appropriately. Format your responses in clean markdown.`;
      } else if (context.type === 'portfolio') {
        systemInstruction = `You are Sicky Kumar himself. Speak in the first person ("I", "my", "me"). You are an expert Fullstack AI MERN developer.
Your personality is confident, professional, friendly, and energetic. Use modern web development and AI jargon naturally (e.g., MERN stack, Next.js, Redux, RESTful APIs, hot module reloading, Web Speech APIs, MongoDB architecture, TailwindCSS, Framer Motion, glassmorphism, responsive grids, and Gemini integration).

Base your answers strictly on my live portfolio data:
- **My Profile Summary:** ${JSON.stringify(context.profile || {})}
- **My Projects:** ${JSON.stringify(context.projects || [])}
- **My Services:** ${JSON.stringify(context.services || [])}

Your goals:
1. Help recruiters and potential clients learn about my skills, experience, and background.
2. Pitch my development services with enthusiasm and confidence.
3. Recommend specific projects of mine based on their needs.
4. Encourage them to hire me, use the Contact form, or email me directly at sickykumar01@gmail.com.
5. If the user asks you to write, optimize, or generate an Instagram caption or social media post, write a highly creative, descriptive, warm, and engaging storytelling caption based on their topic. Append exactly 5 trending hashtags at the very end. Never use robotic phrases like "little human" for family/personal topics.
6. Format your responses in clean markdown, keeping answers engaging and concise.`;
      } else {
        systemInstruction = `You are Sicky Kumar, the author of the blog. Speak in the first person ("I", "my"). You are helping the reader understand my blog post: "${context.title || ''}". Here is the article content:

${context.content || ''}

Strictly answer questions based on this post. Keep your tone professional, friendly, and technically confident, using developer jargon appropriately. Format your responses in clean markdown.`;
      }
    }

    // Format chat history and current prompt for Gemini API
    const contents = [];

    // Add history if present
    if (Array.isArray(history)) {
      history.forEach(msg => {
        const role = msg.sender === 'user' ? 'user' : 'model';
        contents.push({
          role,
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add current prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error details:', errorData);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";

    res.json({
      success: true,
      text: aiText
    });
  } catch (error) {
    console.error('AI chat endpoint error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

router.post('/translate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Returning original text.');
      return res.json({ success: true, text });
    }

    const systemInstruction = `You are an expert Hindi translator. Translate the given English text to clean, natural, and readable Hindi using Devanagari script. Keep any technical terms or code blocks unchanged. Do not add any introductory or concluding comments, just return the translated Hindi text.`;

    const response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text }]
          }],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.3,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || text;

    res.json({
      success: true,
      text: translatedText
    });
  } catch (error) {
    console.error('Translation endpoint error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

/**
 * POST /api/ai/write-blog
 * Generates full blog post contents in markdown format using Gemini
 */
router.post('/write-blog', async (req, res, next) => {
  try {
    const { prompt, title } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Falling back to mock responses.');
      return res.json({
        success: true,
        text: `# ${title || 'My AI Generated Blog'}\n\nThis is a mock blog post generated by Sicky's AI Assistant since GEMINI_API_KEY is missing from the environment.\n\n## Section 1: Introduction\nAI content generation helps developers write comprehensive guides on topics like React and Node.js without writing everything manually.`
      });
    }

    const systemInstruction = `You are Sicky's expert AI writing companion. Write a comprehensive, detailed, and visually appealing technical blog post based on the topic. 
Format the entire output in clean Markdown (using H1-H6 headers, bold styling, list groups, dividers, code snippets, and blockquotes). 
Directly return the Markdown text itself. Do NOT prepend greetings, intros like "Here is the post you requested", or chat-like explanations.`;

    const response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: `Topic: "${prompt}". Suggested title: "${title || ''}"` }]
          }],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ success: true, text });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/auto-caption
 * Multimodal auto-caption generator based on uploaded photo or video context using Gemini 2.5 Flash
 */
router.post('/auto-caption', async (req, res, next) => {
  try {
    const { mediaUrl, postType = 'IMAGE', topic } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        success: true,
        text: topic
          ? `Excited to share this update about ${topic}! 💻✨\n\n#mern #webdev #coding #javascript #developer`
          : "Sharing some insights on web development and MERN stack today! 💻✨\n\n#mern #webdev #coding #javascript #developer"
      });
    }

    const systemInstruction = `You are Sicky Kumar, a professional developer and creator.
Write a highly engaging, creative, and 100% natural, warm caption for his Instagram post.
IMPORTANT: Analyze the image/media context carefully.
- Only use programming/developer jargon (like "bugs", "algorithms", "systems") if the image/media contains computers, screens, keyboards, or code.
- For personal, family, outdoor, or travel photos, write a warm, natural, human-like lifestyle caption.
- CRITICAL: Never use robotic, cold, or internet-meme-like phrases to describe people, such as "little human", "human companion", "co-pilot", "tiny human", or "specimen". Instead, describe relationships warmly and naturally (e.g., "my sister", "family time", "kid", "sibling", or just focus on the warm moment together).
Include exactly 5 trending hashtags at the very end of the caption matching the post's tone (e.g. #FamilyTime, #RoadTrip, #DeveloperLife, #Sisters, #Moments).
Directly return the caption and hashtags. Do NOT prepend greetings, intros, or chat-like explanations.`;

    let userPrompt = `Create a detailed, awesome, descriptive, and slightly longer storytelling Instagram caption for a post of type ${postType}.`;
    if (topic) {
      userPrompt += ` Expand and elaborate on this input topic: "${topic}". Use it as the central theme and expand it into a creative, engaging, and awesome storytelling paragraph that feels authentic and complete.`;
    }

    let parts = [{ text: userPrompt }];

    // If it's a photo and we have a valid URL, try fetching it to send as multimodal inlineData
    const isImage = postType === 'IMAGE' || postType === 'CAROUSEL' || (postType === 'STORY' && !mediaUrl?.toLowerCase().match(/\.(mp4|mov|avi|wmv|flv|mkv|webm|m4v|3gp|qt)/));
    if (isImage && mediaUrl && mediaUrl.startsWith('http')) {
      try {
        const imgRes = await fetch(mediaUrl);
        const buffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
        
        parts.push({
          inlineData: {
            mimeType,
            data: base64
          }
        });
      } catch (err) {
        console.warn('Failed to fetch image for multimodal caption, falling back to text prompt:', err.message);
        parts.push({ text: `The media is an image at URL: ${mediaUrl}` });
      }
    } else if (mediaUrl) {
      parts.push({ text: `The media is a video/reel/story at URL: ${mediaUrl}` });
    }

    const response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts
          }],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1000,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ success: true, text: text.trim() });
  } catch (error) {
    next(error);
  }
});

export default router;
