const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// 🚀 CORS Completely Open For Your Frontend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

const PORT = process.env.PORT || 10000;
const BASE_URL = 'https://anitaku.to';

const axiosInstance = axios.create({
    timeout: 15000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
                    releaseDate: released,
                    subOrDub: id.includes('-dub') ? 'dub' : 'sub'
                });
            }
        });

        res.json({ success: true, results: results });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
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

        const title = $('.anime_info_body_bg h1').text().trim();
        const image = $('.anime_info_body_bg img').attr('src') || '';
        
        const episodePage = $('#episode_page a').last().attr('ep_end');
        const totalEpisodes = episodePage ? parseInt(episodePage) : 0;

        const episodes = [];
        for (let i = 1; i <= totalEpisodes; i++) {
            episodes.push({
                number: i,
                id: `${id}-episode-${i}` // Sync with frontend
            });
        }

        res.json({
            success: true,
            id: id,
            title: title,
            image: image.startsWith('http') ? image : `${BASE_URL}${image}`,
            episodes: episodes
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== 3. EPISODE SOURCES ==========
app.get('/watch', async (req, res) => {
    try {
        const episodeId = req.query.id;
        if (!episodeId) return res.status(400).json({ error: "ID required" });

        const watchUrl = `${BASE_URL}/${episodeId}`;
        const { data } = await axiosInstance.get(watchUrl);
        const $ = cheerio.load(data);

        let iframeSrc = $('.play-video iframe').attr('src');
        if (iframeSrc && iframeSrc.startsWith('//')) {
            iframeSrc = 'https:' + iframeSrc;
        }

        res.json({
            success: true,
            iframe: iframeSrc
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/', (req, res) => { res.json({ status: "✅ Core Live" }); });

app.listen(PORT, () => { console.log(`🚀 Server on port ${PORT}`); });
