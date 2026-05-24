const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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


// 3. MASTER INJECTION DATA (Direct inside code - No Third Party dependency)
const MASTER_ANIME_DATA = [
    { id: "naruto", title: "Naruto", image: "https://gogocdn.net/images/anime/N/naruto.jpg", genres: ["Action", "Ninja", "Shounen"], totalEpisodes: 220 },
    { id: "naruto-shippuden", title: "Naruto Shippuden", image: "https://gogocdn.net/cover/naruto-shippuden.png", genres: ["Action", "Super Power", "Shounen"], totalEpisodes: 500 },
    { id: "one-piece", title: "One Piece", image: "https://gogocdn.net/cover/one-piece-tv.png", genres: ["Action", "Adventure", "Fantasy"], totalEpisodes: 1100 },
    { id: "jujutsu-kaisen", title: "Jujutsu Kaisen", image: "https://gogocdn.net/cover/jujutsu-kaisen-tv.png", genres: ["Action", "Demons", "Supernatural"], totalEpisodes: 24 },
    { id: "jujutsu-kaisen-2nd-season", title: "Jujutsu Kaisen 2nd Season", image: "https://gogocdn.net/cover/jujutsu-kaisen-2nd-season.png", genres: ["Action", "Supernatural"], totalEpisodes: 23 },
    { id: "demon-slayer-kimetsu-no-yaiba", title: "Demon Slayer", image: "https://gogocdn.net/cover/kimetsu-no-yaiba.png", genres: ["Action", "Demons", "Historical"], totalEpisodes: 26 },
    { id: "attack-on-titan", title: "Attack on Titan", image: "https://gogocdn.net/images/anime/shingeki-no-kyojin.jpg", genres: ["Action", "Military", "Fantasy"], totalEpisodes: 25 },
    { id: "my-hero-academia", title: "My Hero Academia", image: "https://gogocdn.net/cover/boku-no-hero-academia.png", genres: ["Action", "Comedy", "Super Power"], totalEpisodes: 13 },
    { id: "black-clover", title: "Black Clover", image: "https://gogocdn.net/cover/black-clover.png", genres: ["Action", "Comedy", "Fantasy"], totalEpisodes: 170 },
    { id: "hunter-x-hunter-2011", title: "Hunter x Hunter (2011)", image: "https://gogocdn.net/cover/hunter-x-hunter-2011.png", genres: ["Action", "Adventure", "Shounen"], totalEpisodes: 148 },
    { id: "death-note", title: "Death Note", image: "https://gogocdn.net/images/anime/D/death-note.jpg", genres: ["Mystery", "Psychological", "Thriller"], totalEpisodes: 37 },
    { id: "tokyo-ghoul", title: "Tokyo Ghoul", image: "https://gogocdn.net/cover/tokyo-ghoul.png", genres: ["Action", "Mystery", "Horror"], totalEpisodes: 12 },
    { id: "one-punch-man", title: "One Punch Man", image: "https://gogocdn.net/cover/one-punch-man-tv.png", genres: ["Action", "Comedy", "Sci-Fi"], totalEpisodes: 12 },
    { id: "chainsaw-man", title: "Chainsaw Man", image: "https://gogocdn.net/cover/chainsaw-man.png", genres: ["Action", "Adventure", "Gore"], totalEpisodes: 12 },
    { id: "solo-leveling", title: "Solo Leveling", image: "https://gogocdn.net/cover/solo-leveling.png", genres: ["Action", "Adventure", "Fantasy"], totalEpisodes: 12 }
];

// SECRET COOPERATIVE IMPORT ROUTE
app.get('/import-global-anime', async (req, res) => {
    console.log("🚀 Injecting Solid Core Anime Database...");
    try {
        let addedCount = 0;

        for (let item of MASTER_ANIME_DATA) {
            const existing = await Anime.findOne({ animeId: item.id });
            if (!existing) {
                let episodeArray = [];
                for(let i = 1; i <= item.totalEpisodes; i++) {
                    episodeArray.push({
                        episodeNumber: i,
                        episodeId: `${item.id}-episode-${i}`
                    });
                }

                await Anime.create({
                    animeId: item.id,
                    title: item.title,
                    image: item.image,
                    type: "TV",
                    genres: item.genres,
                    episodes: episodeArray
                });
                addedCount++;
            }
        }

        res.json({ 
            success: true, 
            message: `Bhai VIP System Active! ${addedCount} Blockbuster Anime tere database me direct bina kisi internet API ke load ho gaye!` 
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// 4. API ROUTES FOR WEB FRONTEND
app.get('/popular', async (req, res) => {
    try {
        const data = await Anime.find({}).limit(30);
        res.json({ success: true, results: data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

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

app.get('/info', async (req, res) => {
    try {
        const animeId = req.query.id;
        const target = await Anime.findOne({ animeId: animeId });
        if (!target) return res.status(404).json({ success: false, error: "Anime not found" });
        
        res.json({ success: true, title: target.title, image: target.image, genres: target.genres, episodes: target.episodes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/watch', async (req, res) => {
    try {
        const episodeId = req.query.id;
        if (!episodeId) return res.status(400).json({ success: false, error: "Episode ID missing" });
        
        let cleanEmbedUrl = `https://s3taku.com/embedplus?id=${episodeId}`;
        res.json({ success: true, iframe: cleanEmbedUrl });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 ANAND VIP Cluster Engine Online on Port ${PORT}`);
});
