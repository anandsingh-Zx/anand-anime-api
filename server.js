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
    type: String,
    genres: Array,
    episodes: Array,
    lastUpdated: { type: Date, default: Date.now }
});

const Anime = mongoose.model('Anime', AnimeSchema);

// 2. CONNECT TO MONGOOSE DATABASE
const MONGO_URI = "mongodb+srv://anandsingh373777_db_user:anandshankar2010@anand-anime-cluster.cw7pkjf.mongodb.net/anand_anime_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("🔒 ANAND VIP Private Cluster Connected!"))
    .catch((err) => console.error("❌ DB Connection Failed:", err));


// 3. MASTER VIP DATA INJECTION ROUTE (100% Block-Proof Global Library)
app.get('/import-global-anime', async (req, res) => {
    console.log("🚀 Initializing VIP Bulk Import into ANAND Cluster...");
    try {
        // Global Open-Source Anime Master Backup GitHub Data JSON Link
        const response = await axios.get("https://raw.githubusercontent.com/riimuru/gogoanime/master/anime.json");
        const megaLibrary = response.data; // Isme hazaron animes ka pure data hai

        let addedCount = 0;
        // Pehle 500 top items ko ek sath load karte hain heavy load se bachne ke liye
        const batch = megaLibrary.slice(0, 500); 

        for (let item of batch) {
            const cleanId = item.id || item.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
            
            const existing = await Anime.findOne({ animeId: cleanId });
            if (!existing) {
                // Total episodes ki list array automatic generate karna
                let episodeArray = [];
                const totalEpisodes = parseInt(item.totalEpisodes) || 12; // Backup default 12 if missing
                
                for(let i = 1; i <= totalEpisodes; i++) {
                    episodeArray.push({
                        episodeNumber: i,
                        episodeId: `${cleanId}-episode-${i}`
                    });
                }

                await Anime.create({
                    animeId: cleanId,
                    title: item.title,
                    image: item.image,
                    type: item.type || "TV",
                    genres: item.genres || [],
                    episodes: episodeArray
                });
                addedCount++;
            }
        }

        res.json({ 
            success: true, 
            message: `Bhai VIP System Active! ${addedCount} Global Anime successfully tere cluster me load ho gaye bina kisi block ke!` 
        });

    } catch (error) {
        console.error("❌ VIP Bulk Import Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});


// 4. API ROUTES FOR WEB FRONTEND (Direct Player Routing)

// Route A: Popular List (Direct from DB)
app.get('/popular', async (req, res) => {
    try {
        const data = await Anime.find({}).limit(30);
        res.json({ success: true, results: data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route B: Search Global Database
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ success: false, error: "Query missing" });
        
        const data = await Anime.find({ title: { $regex: query, $options: 'i' } }).limit(20);
        res.json({ success: true, results: data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route C: Info Route (Get detailed Info & Episode List)
app.get('/info', async (req, res) => {
    try {
        const animeId = req.query.id;
        const target = await Anime.findOne({ animeId: animeId });
        if (!target) return res.status(404).json({ success: false, error: "Anime not indexed yet" });
        
        res.json({ success: true, title: target.title, image: target.image, genres: target.genres, episodes: target.episodes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route D: Watch Route (Generates embedded player link for your website's iframe)
app.get('/watch', async (req, res) => {
    try {
        const episodeId = req.query.id;
        if (!episodeId) return res.status(400).json({ success: false, error: "Episode ID missing" });
        
        // Clean dynamic clean embed layout link
        let cleanEmbedUrl = `https://s3taku.com/embedplus?id=${episodeId}`;
        
        res.json({ 
            success: true, 
            iframe: cleanEmbedUrl,
            note: "Is link ko direct apne frontend ke <iframe src='...'> me chalao, user teri site pe hi rahega."
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 ANAND VIP Cluster Engine Online on Port ${PORT}`);
});
