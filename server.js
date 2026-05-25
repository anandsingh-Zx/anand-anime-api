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
    poster: String,
    banner: String,
    synopsis: String,
    rating: Number,
    type: String,
    status: String,
    genres: Array,
    languages: Array,
    episodes: Array,
    lastUpdated: { type: Date, default: Date.now }
});

const Anime = mongoose.model('Anime', AnimeSchema);

// 2. MONGOOSE CONNECTION CONFIGURE
const MONGO_URI = "mongodb+srv://anandsingh373777_db_user:anandshankar2010@anand-anime-cluster.cw7pkjf.mongodb.net/anand_anime_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("🔒 Private Cluster Connected!"))
    .catch((err) => console.error("❌ DB Connection Error:", err));

// MASTER DATA FOR 15 PACKAGES
const MASTER_ANIME_DATA = [
    { id: "naruto", title: "Naruto", poster: "https://gogocdn.net/images/anime/N/naruto.jpg", genres: ["Action", "Ninja", "Shounen"], totalEpisodes: 220, rating: 8.4 },
    { id: "naruto-shippuden", title: "Naruto Shippuden", poster: "https://gogocdn.net/cover/naruto-shippuden.png", genres: ["Action", "Super Power", "Shounen"], totalEpisodes: 500, rating: 8.7 },
    { id: "one-piece", title: "One Piece", poster: "https://gogocdn.net/cover/one-piece-tv.png", genres: ["Action", "Adventure", "Fantasy"], totalEpisodes: 1100, rating: 8.9 },
    { id: "jujutsu-kaisen", title: "Jujutsu Kaisen", poster: "https://gogocdn.net/cover/jujutsu-kaisen-tv.png", genres: ["Action", "Demons", "Supernatural"], totalEpisodes: 24, rating: 8.6 },
    { id: "jujutsu-kaisen-2nd-season", title: "Jujutsu Kaisen 2nd Season", poster: "https://gogocdn.net/cover/jujutsu-kaisen-2nd-season.png", genres: ["Action", "Supernatural"], totalEpisodes: 23, rating: 8.8 },
    { id: "demon-slayer-kimetsu-no-yaiba", title: "Demon Slayer", poster: "https://gogocdn.net/cover/kimetsu-no-yaiba.png", genres: ["Action", "Demons", "Historical"], totalEpisodes: 26, rating: 8.5 },
    { id: "attack-on-titan", title: "Attack on Titan", poster: "https://gogocdn.net/images/anime/shingeki-no-kyojin.jpg", genres: ["Action", "Military", "Fantasy"], totalEpisodes: 25, rating: 9.1 },
    { id: "my-hero-academia", title: "My Hero Academia", poster: "https://gogocdn.net/cover/boku-no-hero-academia.png", genres: ["Action", "Comedy", "Super Power"], totalEpisodes: 13, rating: 7.9 },
    { id: "black-clover", title: "Black Clover", poster: "https://gogocdn.net/cover/black-clover.png", genres: ["Action", "Comedy", "Fantasy"], totalEpisodes: 170, rating: 8.1 },
    { id: "hunter-x-hunter-2011", title: "Hunter x Hunter (2011)", poster: "https://gogocdn.net/cover/hunter-x-hunter-2011.png", genres: ["Action", "Adventure", "Shounen"], totalEpisodes: 148, rating: 9.0 },
    { id: "death-note", title: "Death Note", poster: "https://gogocdn.net/images/anime/D/death-note.jpg", genres: ["Mystery", "Psychological", "Thriller"], totalEpisodes: 37, rating: 8.6 },
    { id: "tokyo-ghoul", title: "Tokyo Ghoul", poster: "https://gogocdn.net/cover/tokyo-ghoul.png", genres: ["Action", "Mystery", "Horror"], totalEpisodes: 12, rating: 7.8 },
    { id: "one-punch-man", title: "One Punch Man", poster: "https://gogocdn.net/cover/one-punch-man-tv.png", genres: ["Action", "Comedy", "Sci-Fi"], totalEpisodes: 12, rating: 8.5 },
    { id: "chainsaw-man", title: "Chainsaw Man", poster: "https://gogocdn.net/cover/chainsaw-man.png", genres: ["Action", "Adventure", "Gore"], totalEpisodes: 12, rating: 8.4 },
    { id: "solo-leveling", title: "Solo Leveling", poster: "https://gogocdn.net/cover/solo-leveling.png", genres: ["Action", "Adventure", "Fantasy"], totalEpisodes: 12, rating: 8.5 }
];

// RE-SEED ENGINE
app.get('/import-global-anime', async (req, res) => {
    try {
        let addedCount = 0;
        for (let item of MASTER_ANIME_DATA) {
            const existing = await Anime.findOne({ animeId: item.id });
            if (!existing) {
                let episodeArray = [];
                for(let i = 1; i <= item.totalEpisodes; i++) {
                    episodeArray.push({ episodeNum: i, episodeId: `${item.id}-episode-${i}` });
                }
                await Anime.create({
                    animeId: item.id,
                    title: item.title,
                    poster: item.poster,
                    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920",
                    synopsis: `Watch premium high-speed video streams for ${item.title} inside Anand Anime Hub secure cloud cluster. No ads layout enabled.`,
                    rating: item.rating,
                    type: "TV",
                    status: "Ongoing",
                    genres: item.genres,
                    languages: ["hindi", "english", "japanese"],
                    episodes: episodeArray
                });
                addedCount++;
            }
        }
        res.json({ success: true, message: `Anand VIP System Synced! Loaded ${addedCount} packages.` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET LIBRARY LIST
app.get('/api/anime', async (req, res) => {
    try {
        const data = await Anime.find({});
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔥 CLEAN AD-LESS VIDEO URL GENERATOR (100% ANTI-REDIRECT TERMINAL)
app.get('/watch', async (req, res) => {
    try {
        const episodeId = req.query.id;
        if (!episodeId) return res.status(400).json({ success: false, error: "Episode ID missing" });
        
        let parts = episodeId.split('-episode-');
        let baseAnimeId = parts[0];
        let epNum = parts[1] || "1";

        // Gogoanime server base dynamic source mapping to bypass redirect walls entirely
        let finalStreamLink = `https://vidsrc.to/embed/anime/${baseAnimeId}/ep-${epNum}`;
        res.json({ success: true, iframe: finalStreamLink });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Secure Cluster Online on Port ${PORT}`);
});
