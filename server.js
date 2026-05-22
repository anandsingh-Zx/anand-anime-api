const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Gogoanime base URL (change kar sakta hai agar block ho)
const BASE_URL = 'https://anitaku.to'; // ya https://gogoanime3.co

const axiosInstance = axios.create({
    timeout: 15000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0'
    }
});

// ========== 1. SEARCH ANIME ==========
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });

        const searchUrl = `${BASE_URL}/search.html?keyword=${encodeURIComponent(query)}`;
        const { data } = await axiosInstance.get(searchUrl);
        const $ = cheerio.load(data);

        const results = [];
        
        $('.last_episodes ul.items li').each((i, el) => {
            const title = $(el).find('.name a').attr('title') || '';
            const id = $(el).find('.name a').attr('href')?.replace('/category/', '') || '';
            const image = $(el).find('.img a img').attr('src') || '';
            const released = $(el).find('.released').text().trim() || '';

            if (title && id) {
                results.push({
                    id: id,
                    title: title,
                    image: image.startsWith('http') ? image : `${BASE_URL}${image}`,
                    released: released
                });
            }
        });

        res.json({
            success: true,
            query: query,
            results: results
        });

    } catch (err) {
        console.error('Search Error:', err.message);
        res.status(500).json({ 
            success: false, 
            error: "Search failed. Try again later.",
            details: err.message 
        });
    }
});

// ========== 2. ANIME INFO + EPISODES ==========
app.get('/info', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: "ID parameter is required" });

        const infoUrl = `${BASE_URL}/category/${id}`;
        const { data } = await axiosInstance.get(infoUrl);
        const $ = cheerio.load(data);

        // Basic info
        const title = $('.anime_info_body_bg h1').text().trim();
        const image = $('.anime_info_body_bg img').attr('src') || '';
        const type = $('.anime_info_body_bg .type').eq(0).text().replace('Type:', '').trim();
        const plot = $('.anime_info_body_bg .description').text().trim();
        const genre = [];
        $('.anime_info_body_bg .type a').each((i, el) => {
            genre.push($(el).text().trim());
        });

        // Total episodes
        const episodePage = $('#episode_page a').last().attr('ep_end');
        const totalEpisodes = episodePage ? parseInt(episodePage) : 0;

        // Episode list
        const episodes = [];
        for (let i = 1; i <= totalEpisodes; i++) {
            episodes.push({
                episodeNum: i,
                episodeId: `${id}-episode-${i}`
            });
        }

        res.json({
            success: true,
            id: id,
            title: title,
            image: image.startsWith('http') ? image : `${BASE_URL}${image}`,
            type: type,
            plot: plot,
            genre: genre,
            totalEpisodes: totalEpisodes,
            episodes: episodes
        });

    } catch (err) {
        console.error('Info Error:', err.message);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch anime info.",
            details: err.message 
        });
    }
});

// ========== 3. EPISODE SOURCES (WATCH LINKS) ==========
app.get('/watch', async (req, res) => {
    try {
        const episodeId = req.query.id;
        if (!episodeId) return res.status(400).json({ error: "Episode ID parameter 'id' is required" });

        const watchUrl = `${BASE_URL}/${episodeId}`;
        const { data } = await axiosInstance.get(watchUrl);
        const $ = cheerio.load(data);

        // Extract video iframe
        const iframeSrc = $('.play-video iframe').attr('src');
        
        if (!iframeSrc) {
            return res.status(404).json({ 
                success: false, 
                error: "Video source not found" 
            });
        }

        res.json({
            success: true,
            episodeId: episodeId,
            iframe: iframeSrc,
            headers: {
                referer: BASE_URL
            }
        });

    } catch (err) {
        console.error('Watch Error:', err.message);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch video source.",
            details: err.message 
        });
    }
});

// ========== 4. POPULAR ANIME (Homepage) ==========
app.get('/popular', async (req, res) => {
    try {
        const { data } = await axiosInstance.get(`${BASE_URL}/popular.html`);
        const $ = cheerio.load(data);

        const results = [];
        $('.last_episodes ul.items li').each((i, el) => {
            const title = $(el).find('.name a').attr('title') || '';
            const id = $(el).find('.name a').attr('href')?.replace('/category/', '') || '';
            const image = $(el).find('.img a img').attr('src') || '';

            if (title && id) {
                results.push({
                    id: id,
                    title: title,
                    image: image.startsWith('http') ? image : `${BASE_URL}${image}`
                });
            }
        });

        res.json({
            success: true,
            results: results
        });

    } catch (err) {
        console.error('Popular Error:', err.message);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch popular anime." 
        });
    }
});

// ========== HEALTH CHECK ==========
app.get('/', (req, res) => {
    res.json({
        status: "✅ API is running",
        endpoints: [
            "/search?q=naruto",
            "/info?id=naruto",
            "/watch?id=naruto-episode-1",
            "/popular"
        ],
        baseUrl: BASE_URL
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Anime API running on port ${PORT}`);
    console.log(`📡 Base URL: ${BASE_URL}`);
});
