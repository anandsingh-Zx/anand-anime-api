const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// DATABASE SCHEMA
const AnimeSchema = new mongoose.Schema({
    animeId: { type: String, unique: true, required: true },
    title: String,
    image: String,
    url: String,
    episodes: Array
});

const Anime = mongoose.model('Anime', AnimeSchema);

// TERI ASLI MONGO STRING
const MONGO_URI = "mongodb+srv://anandsingh373777_db_user:anandshankar2010@anand-anime-cluster.cw7pkjf.mongodb.net/anand_anime_db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("🔒 ANAND Private Cluster Database Connected Successfully!"))
    .catch((err) => console.error("❌ Database connection failed:", err));

// BASE ROUTE TO TEST
app.get('/', (req, res) => {
    res.json({ success: true, message: "ANAND Server Status: ONLINE" });
});

app.listen(PORT, () => {
    console.log(`🚀 ANAND Private Cluster Active on Port ${PORT}`);
});
