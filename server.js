const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { ANIME } = require('@consumet/extensions');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const gogoanime = new ANIME.Gogoanime();

// 1. DATABASE SCHEMA (Tijori ka design)
const AnimeSchema = new mongoose.Schema({
    animeId: { type: String, unique: true, required: true },
    title: String,
    image: String,
    url: String,
    episodes: Array,
    lastUpdated: { type: Date, default: Date.now }
});

const Anime = mongoose.model('Anime', AnimeSchema);

// 2. CONNECT TO MONGOOSE DATABASE DIRECTLY
// Teri string ko sahi format me yahan daal diya hai
const MONGO_URI = "mongodb+srv://anandsingh373777_db_user:anandshankar2010@anand-anime-cluster.cw7pkjf.mongodb.net/anand_anime_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("🔒 ANAND Private Cluster Database Connected Successfully!"))
    .catch((err) => console.error("❌ Database connection failed:", err));


// 3. AUTOMATION SCRIPTER (Har 1 Ghante me naye anime automatic DB me daalega)
cron.schedule('0 * * * *', async () => {
    console.log("🔄 Automation Triggered: Fetching latest globally trending anime targets...");
    try {
        const topAiring = await gogoanime.fetchTopAiring();
        if (topAiring && topAiring.results) {
            for (let item of topAiring.results) {
                const existing = await Anime.findOne({ animeId: item.id });
                if (!existing) {
                    try {
                        const info = await gogoanime.fetchAnimeInfo(item.id);
                        await Anime.create({
                            animeId: item.id,
                            title: item.title,
                            image: item.image,
                            url: item.url,
                            episodes: info.episodes || []
                        });
                        console.log(`✅ Auto-Added to DB: ${item.title}`);
                    } catch (infoErr) {
                        console.log(`⚠️ Skipped detailed fetch for ${item.title}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error("❌ Automation Cron Engine Error:", error.message);
    }
});


// 4. API ROUTES

// Route A: Popular Anime List (Direct from DB)
app.get('/popular', async (req, res) => {
    try {
        const data = await Anime.find({}).limit(20);
        res.json({ success: true, results: data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route B: Search Anime Inside Your Database
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ success: false, error: "Query missing" });
        
        const data = await Anime.find({ title: { $regex: query, $options: 'i' } });
        res.json({ success: true, results: data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route C: Info Route (Fetch episodes stored inside your DB)
app.get('/info', async (req, res) => {
    try {
        const animeId = req.query.id;
        const target = await Anime.findOne({ animeId: animeId });
        if (!target) return res.status(404).json({ success: false, error: "Anime assets not indexed yet" });
        
        res.json({ success: true, episodes: target.episodes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route D: Watch Live Route
app.get('/watch', async (req, res) => {
    try {
        const episodeId = req.query.id;
        if (!episodeId) return res.status(400).json({ success: false, error: "Episode target invalid" });
        
        let finalEmbed = `https://s3taku.com/embedplus?id=${episodeId}`;
        res.json({ success: true, iframe: finalEmbed });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 ANAND Private Cluster Active on Port ${PORT}`);
});
