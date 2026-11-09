import { GoogleGenerativeAI } from '@google/generative-ai';
import Listmodel from '../models/Listmodel.js';

export const chat = async (req, res) => {
    console.log("--> chat endpoint received body:", req.body);
    const { message, userId, userName } = req.body;

    if (!message || message.trim() === '') {
        return res.json({ success: false, message: 'Message is required' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("--> apiKey exists:", !!apiKey, "prefix:", apiKey ? apiKey.substring(0, 8) : "none");
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            return res.json({ success: false, message: 'Gemini API key is missing or not configured.' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        let prompt = '';
        let watchlistData = [];

        // ── Scenario 1: User is NOT logged in ──────────────────────────────
        if (!userId) {
            prompt = `
You are a friendly anime recommendation assistant for an anime streaming website.

The user is currently NOT logged in and has no watchlist data.

User's question: "${message}"

Instructions:
- Answer their question helpfully with general anime knowledge
- At the end, gently encourage them to login and add anime to their watchlist to get personalized recommendations
- Keep the answer concise and friendly
- Use emojis where appropriate
- Format your response clearly
            `.trim();
        } else {
            // ── Fetch user's watchlist from MongoDB ─────────────────────────
            const watchlistItems = await Listmodel.find({ userid: userId });
            watchlistData = watchlistItems.map(item => ({
                movieid: item.movieid,
                moviename: item.moviename,
                language: item.language,
            }));

            // ── Scenario 2: Logged in but EMPTY watchlist ───────────────────
            if (watchlistData.length === 0) {
                prompt = `
You are a friendly anime recommendation assistant for an anime streaming website.

The user "${userName || 'User'}" is logged in but their watchlist is EMPTY.

User's question: "${message}"

Instructions:
- Answer their question helpfully with general anime knowledge
- Encourage them to add anime they enjoy to their watchlist so you can give personalized recommendations next time
- Keep the answer concise and friendly
- Use emojis where appropriate
- Format your response clearly
                `.trim();
            }
            // ── Scenario 3: Logged in WITH watchlist ────────────────────────
            else {
                const watchlistText = watchlistData
                    .map((item, i) => `${i + 1}. ${item.moviename} (${item.language})`)
                    .join('\n');

                prompt = `
You are a friendly anime recommendation assistant for an anime streaming website.

The user "${userName || 'User'}" is logged in and has the following anime in their watchlist:
${watchlistText}

User's question: "${message}"

Instructions:
- Use the watchlist above to understand the user's taste and preferences
- Give a personalized answer based on what they've already watched/saved
- Recommend anime they haven't already added to their watchlist when suggesting new ones
- Keep the answer concise, accurate, and friendly
- Use emojis where appropriate
- Format your response clearly with line breaks
                `.trim();
            }
        }

        // ── Call Gemini (with automatic fallback models) ─────────────────────
        const candidateModels = [
            'gemini-3.5-flash-lite',
            'gemini-3.8-flash',
            'gemma-4-26b-a4b-it'
        ];

        let answer = '';
        let lastError = null;

        for (const modelName of candidateModels) {
            try {
                console.log(`--> Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                answer = result.response.text();
                console.log(`--> Success with ${modelName}!`);
                break;
            } catch (err) {
                console.warn(`--> Model ${modelName} failed:`, err.message);
                lastError = err;
            }
        }

        if (!answer) {
            throw lastError || new Error('No AI model responded.');
        }

        return res.json({
            success: true,
            answer,
            watchlistCount: watchlistData.length,
            isLoggedIn: !!userId,
        });

    } catch (error) {
        console.error('AI Controller Error:', error.message);
        return res.json({
            success: false,
            message: 'AI service error: ' + error.message,
        });
    }
};
