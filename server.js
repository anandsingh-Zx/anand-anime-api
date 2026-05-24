const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// 1. DATABASE SCHEMA
const AnimeSchema = new mongoose.Schema({
    animeId: { type: String, unique: true, required: true },
    title: String,
    image: String,
    url: String,
    episodes: Array,
    lastUpdated: { type: Date, default: Date.now }
});

const Anime = mongoose.model('Anime', AnimeSchema);

// 2. CONNECT TO MONGOOSE DATABASE
const MONGO_URI = "mongodb+srv://anandsingh373777_db_user:anandshankar2010@anand-anime-cluster.cw7pkjf.mongodb.net/anand_anime_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("🔒 ANAND Private Cluster Database Connected Successfully!"))
    .catch((err) => console.error("❌ Database connection failed:", err));


// 3. SECRET ADMIN IMPORT ROUTE (Data bharne ka short-cut)
app.get('/import-global-anime', async (req, res) => {
    console.log("🚀 Starting Manual Data Injection to ANAND Cluster DB...");
    try {
        // Sabse stable public database API ko target kiya hai
        const response = await axios.get("https://api.consumet.org/anime/gogoanime/top-airing");
        const trendingList = response.data.results;

        let addedCount = 0;

        if (trendingList && trendingList.length > 0) {
            for (let item of trendingList) {
                // Check agar anime pehle se DB me hai ya nahi
                const existing = await Anime.findOne({ animeId: item.id });
                if (!existing) {
                    try {
                        // Us anime ke episodes ki details nikalna
                        const infoResponse = await axios.get(`https://api.consumet.org/anime/gogoanime/info/${item.id}`);
                        const infoData = infoResponse.data;

                        // Database me safe insert karna
                        await Anime.create({
                            animeId: item.id,
                            title: item.title,
                            image: item.image,
                            url: item.url,
                            episodes: infoData.episodes || []
                        });
                        addedCount++;
                        console.log(`✅ Imported: ${item.title}`);
                    } catch (infoErr) {
                        console.log(`⚠️ Skipped 1 item info fetch due to network timeout`);
                    }
                }
            }
            res.json({ success: true, message: `Bhai, ${addedCount} naye anime tere database me successfully bhar diye gaye hain!` });
        } else {
            res.json({ success: false, message: "Koshish ki par aage se koi data nahi mila." });
        }
    } catch (error) {
        console.error("❌ Import Route Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});


// 4. WEBSITE FRONTEND KE LIYE API ROUTES (Ab ye data direct tere DB se denge)

// Route A: Popular List (Direct from your fresh DB)
app.get('/popular', async (req, res) => {
    try {
        const data = await Anime.find({}).limit(20);
        res.json({ success: true, results: data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route B: Search Inside Your DB
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

// Route C: Info Route (Fetch stored episodes)
app.get('/info', async (req, res) => {
    try {
        const animeId = req.query.id;
        const target = await Anime.findOne({ animeId: animeId });
        if (!target) return res.status(404).json({ success: false, error: "Anime not found in DB" });
        
        res.json({ success: true, episodes: target.episodes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route D: Watch Live Route (Clean Embed Link)
app.get('/watch', async (req, res) => {
    try {
        const episodeId = req.query.id;
        if (!episodeId) return res.status(400).json({ success: false, error: "Episode ID missing" });
        
        let finalEmbed = `https://s3taku.com/embedplus?id=${episodeId}`;
        res.json({ success: true, iframe: finalEmbed });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 ANAND Private Cluster Active on Port ${PORT}`);
});
