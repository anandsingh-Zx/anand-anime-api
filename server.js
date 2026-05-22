const express = require('express');
const cors = require('cors');
const { ANIME } = require('@consumet/extensions');

const app = express();
app.use(cors()); // Isse CORS error hamesha ke liye khatam!
const gogoanime = new ANIME.Gogoanime();

const PORT = process.env.PORT || 3000;

// 1. Search Endpoint
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: "Query missing" });
        const results = await gogoanime.search(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Info & Episodes Endpoint
app.get('/info', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: "ID missing" });
        const details = await gogoanime.fetchAnimeInfo(id);
        res.json(details);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Watch Links Endpoint (Direct Streaming Video URIs)
app.get('/watch', async (req, res) => {
    try {
        const episodeId = req.query.id;
        if (!episodeId) return res.status(400).json({ error: "Episode ID missing" });
        const sources = await gogoanime.fetchEpisodeSources(episodeId);
        res.json(sources);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server matrix active on port ${PORT}`);
});
