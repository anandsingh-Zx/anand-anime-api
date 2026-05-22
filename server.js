const express = require('express');
const cors = require('cors');
// Naye version mein bilkul is tarike se import karna padta hai
const { ANIME } = require('@consumet/extensions');

const app = express();
app.use(cors());

// Yahan dhyan se dekh, naye version ka constructor syntax ye hai:
const gogoanime = new ANIME.Gogoanime();

const PORT = process.env.PORT || 10000;

// 1. Popular Route
app.get('/popular', async (req, res) => {
    try {
        const data = await gogoanime.fetchTopAiring();
        res.json({ success: true, results: data.results });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Search Route
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ success: false, error: "Query is required" });
        const data = await gogoanime.search(query);
        res.json({ success: true, results: data.results });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. Info Route
app.get('/info', async (req, res) => {
    try {
        const animeId = req.query.id;
        if (!animeId) return res.status(400).json({ success: false, error: "ID is required" });
        const data = await gogoanime.fetchAnimeInfo(animeId);
        res.json({ success: true, episodes: data.episodes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 4. Watch/Stream Route
app.get('/watch', async (req, res) => {
    try {
        const episodeId = req.query.id;
        if (!episodeId) return res.status(400).json({ success: false, error: "Episode ID is required" });
        const data = await gogoanime.fetchEpisodeSources(episodeId);
        
        // Sabse best streaming link ya iframe source nikalna
        let videoUrl = "";
        if (data.container && data.container.iframe) {
            videoUrl = data.container.iframe;
        } else if (data.sources && data.sources.length > 0) {
            // Find default or highest quality link
            const defaultSource = data.sources.find(s => s.quality === 'default') || data.sources[0];
            videoUrl = defaultSource.url;
        }

        res.json({ success: true, iframe: videoUrl });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`ANAND Premium API running on port ${PORT}`);
});
