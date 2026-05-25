<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anand Anime Hub - Watch Free Anime Online</title>
    <meta name="author" content="Anand | Telegram: @Dxawfc">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-user-select: none; user-select: none; }
        :root { --primary: #ff4757; --secondary: #2f3542; --dark: #1e272e; --darker: #0d0d0d; --accent: #ffa502; --text: #f1f2f6; --text-dim: #a4b0be; }
        body { background: var(--darker); color: var(--text); font-family: 'Segoe UI', sans-serif; min-height: 100vh; overflow-x: hidden; }

        .header { background: linear-gradient(135deg, var(--dark), var(--secondary)); padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 1000; border-bottom: 2px solid var(--primary); box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        .logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .logo-icon { font-size: 35px; color: var(--primary); }
        .logo-text { font-size: 28px; font-weight: bold; background: linear-gradient(45deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .logo-sub { font-size: 11px; color: var(--text-dim); letter-spacing: 2px; }

        .search-box { position: relative; }
        .search-input { background: var(--dark); border: 1px solid #3d3d5c; border-radius: 25px; padding: 10px 40px 10px 15px; color: var(--text); width: 300px; outline: none; }
        .search-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--primary); font-size: 16px; }

        .hero { position: relative; height: 380px; display: flex; align-items: flex-end; overflow: hidden; padding: 40px 60px; }
        .hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, var(--darker) 10%, transparent 100%), url('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920') center/cover; filter: brightness(0.4); }
        .hero-content { position: relative; z-index: 2; max-width: 700px; }
        .hero-badge { display: inline-block; background: var(--primary); color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
        .hero-title { font-size: 42px; font-weight: bold; margin-bottom: 15px; }

        .lang-bar { background: var(--dark); padding: 15px 30px; display: flex; gap: 10px; overflow-x: auto; border-bottom: 1px solid #2d2d44; }
        .lang-chip { background: var(--secondary); color: var(--text-dim); padding: 8px 20px; border-radius: 20px; font-size: 13px; cursor: pointer; border: none; white-space: nowrap; }
        .lang-chip.active { background: var(--primary); color: white; }

        .section { padding: 40px 30px; }
        .section-header { margin-bottom: 25px; }
        .section-title { font-size: 24px; font-weight: bold; display: flex; align-items: center; gap: 10px; }
        .section-title i { color: var(--primary); }

        .anime-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
        .anime-card { background: var(--dark); border-radius: 12px; overflow: hidden; cursor: pointer; transition: 0.3s; position: relative; border: 1px solid #2d2d44; }
        .anime-card:hover { transform: translateY(-5px); border-color: var(--primary); }
        .anime-poster { width: 100%; height: 250px; object-fit: cover; display: block; }
        .anime-rating { position: absolute; top: 10px; right: 10px; background: rgba(255, 165, 2, 0.9); color: var(--darker); padding: 4px 10px; border-radius: 15px; font-size: 11px; font-weight: bold; }
        .anime-info { padding: 15px; }
        .anime-title { font-size: 14px; font-weight: bold; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .detail-page { display: none; padding: 30px; max-width: 1400px; margin: 0 auto; }
        .detail-page.active { display: block; }
        .detail-banner { width: 100%; height: 300px; border-radius: 15px; overflow: hidden; position: relative; margin-bottom: 30px; }
        .detail-banner img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.4); }
        .detail-banner-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 40px; background: linear-gradient(transparent, rgba(0,0,0,0.9)); }
        .detail-content { display: grid; grid-template-columns: 280px 1fr; gap: 30px; }
        .detail-poster img { width: 100%; border-radius: 15px; }
        .detail-info { display: flex; flex-direction: column; gap: 20px; }
        .episodes-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-top: 15px; }
        .episode-item { background: var(--dark); border: 1px solid #2d2d44; padding: 12px; border-radius: 8px; text-align: center; cursor: pointer; font-weight: bold; }
        .episode-item:hover { border-color: var(--primary); background: rgba(255, 71, 87, 0.1); }

        /* ========== ULTRA-SHIELD MOUNTED STREAM BOX ========== */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; display: none; justify-content: center; align-items: center; padding: 20px; }
        .modal-overlay.active { display: flex; }
        .player-container { width: 100%; max-width: 950px; background: var(--dark); border-radius: 15px; overflow: hidden; border: 2px solid var(--primary); }
        .player-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: var(--secondary); }
        .player-close { background: none; border: none; color: var(--text); font-size: 24px; cursor: pointer; }
        .video-wrapper { position: relative; width: 100%; aspect-ratio: 16/9; background: black; }
        
        /* 🔥 THE ANTI-REDIRECT SANDBOX INTEGRITY FILTER */
        .video-player { width: 100%; height: 100%; border: none; }

        .player-controls { padding: 15px 20px; }
        .ep-selector { display: flex; gap: 8px; flex-wrap: wrap; max-height: 90px; overflow-y: auto; }
        .ep-btn { background: var(--secondary); color: var(--text); border: 1px solid #3d3d5c; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
        .ep-btn.active { background: var(--primary); border-color: var(--primary); }

        .watermark { position: fixed; bottom: 20px; right: 20px; background: var(--primary); color: white; padding: 8px 15px; border-radius: 20px; font-size: 11px; font-weight: bold; z-index: 999; }
        .auto-update-indicator { position: fixed; bottom: 20px; left: 20px; background: var(--dark); border: 1px solid var(--primary); padding: 6px 14px; border-radius: 20px; font-size: 11px; z-index: 999; }
        .no-video-msg { position: absolute; top:50%; left:50%; transform:translate(-50%, -50%); text-align:center; color: var(--text-dim); }
        .footer { background: var(--dark); padding: 25px; text-align: center; border-top: 2px solid var(--primary); margin-top: 40px; color: var(--text-dim); font-size: 13px; }
        .footer a { color: var(--primary); text-decoration: none; font-weight: bold; }
        @media (max-width: 768px) { .detail-content { grid-template-columns: 1fr; } .header { flex-direction: column; gap: 10px; } }
    </style>
</head>
<body>

    <div class="auto-update-indicator" id="autoUpdateIndicator"><i class="fas fa-sync fa-spin"></i> Syncing Engine...</div>
    <div class="watermark">© Anand Anime Hub | @Dxawfc</div>

    <header class="header">
        <div class="logo" onclick="showHome()">
            <i class="fas fa-play-circle logo-icon"></i>
            <div>
                <div class="logo-text">Anand Anime Hub</div>
                <div class="logo-sub">SECURE SYSTEM ACTIVE</div>
            </div>
        </div>
        <div class="search-box">
            <input type="text" class="search-input" id="searchInput" placeholder="Search cluster network..." onkeyup="searchAnime(this.value)">
            <button class="search-btn"><i class="fas fa-search"></i></button>
        </div>
    </header>

    <div id="homeView">
        <section class="hero">
            <div class="hero-bg"></div>
            <div class="hero-content">
                <span class="hero-badge">🔒 ZERO POPUPS LAYER DEPLOYED</span>
                <h1 class="hero-title" id="heroTitle">Connecting Private Cluster...</h1>
            </div>
        </section>

        <div class="lang-bar">
            <button class="lang-chip active" onclick="filterLang('all', this)">🌐 All Dubs</button>
            <button class="lang-chip" onclick="filterLang('hindi', this)">🇮🇳 Hindi Dubbed</button>
            <button class="lang-chip" onclick="filterLang('english', this)">🇺🇸 English</button>
            <button class="lang-chip" onclick="filterLang('japanese', this)">🇯🇵 Japanese</button>
        </div>

        <section class="section">
            <div class="section-header">
                <h2 class="section-title"><i class="fas fa-server"></i> Verified Database Hub</h2>
            </div>
            <div class="anime-grid" id="mainAnimeGrid"></div>
        </section>
    </div>

    <div class="detail-page" id="detailPage">
        <button class="lang-chip" style="margin-bottom:20px; background:var(--secondary); color:#fff;" onclick="showHome()"><i class="fas fa-arrow-left"></i> Back to Database</button>
        <div class="detail-banner">
            <img src="" id="detailBannerImg">
            <div class="detail-banner-overlay"><h1 class="detail-title" id="detailTitle"></h1></div>
        </div>
        <div class="detail-content">
            <div class="detail-poster"><img src="" id="detailPosterImg"></div>
            <div class="detail-info">
                <p id="detailSynopsis" style="line-height:1.7; color:var(--text-dim);"></p>
                <div class="episodes-list" id="episodesList"></div>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="playerModal">
        <div class="player-container">
            <div class="player-header">
                <span class="player-title" id="playerTitle">Bypassing Firewalls...</span>
                <button class="player-close" onclick="closePlayer()">&times;</button>
            </div>
            <div class="video-wrapper">
                <div class="no-video-msg" id="noVideoMsg"><i class="fas fa-circle-notch fa-spin fa-2x"></i><div style="margin-top:10px;">Injecting Clean Stream Pipeline...</div></div>
                <iframe class="video-player" id="videoPlayer" style="display:none;" allowfullscreen sandbox="allow-scripts allow-same-origin"></iframe>
            </div>
            <div class="player-controls"><div class="ep-selector" id="epSelector"></div></div>
        </div>
    </div>

    <footer class="footer">
        <p>© 2026 <a href="#">Anand Anime Hub</a>. Owner Rights Configured by Anand (<a href="https://t.me/Dxawfc" target="_blank">@Dxawfc</a>).</p>
    </footer>

    <script>
        const API_BASE = "https://anand-anime-hub-backend.onrender.com";
        let animeData = [];
        let currentAnime = null;

        async function syncCluster() {
            try {
                const res = await fetch(`${API_BASE}/api/anime`);
                animeData = await res.json();
                if(animeData.length > 0) {
                    document.getElementById('heroTitle').innerText = animeData[0].title;
                    renderGrid(animeData);
                    document.getElementById('autoUpdateIndicator').innerHTML = `<i class="fas fa-check-circle" style="color:#2ed573"></i> Secure Link Sync Active (${animeData.length})`;
                }
            } catch(err) {
                document.getElementById('autoUpdateIndicator').innerHTML = `<i class="fas fa-exclamation-triangle" style="color:#ff4757"></i> Server Desync`;
            }
        }

        function renderGrid(data) {
            const grid = document.getElementById('mainAnimeGrid'); grid.innerHTML = '';
            data.forEach(anime => {
                grid.innerHTML += `
                    <div class="anime-card" onclick="openDetail('${anime.animeId}')">
                        <img src="${anime.poster}" class="anime-poster">
                        <span class="anime-rating"><i class="fas fa-star"></i> ${anime.rating}</span>
                        <div class="anime-info">
                            <div class="anime-title">${anime.title}</div>
                        </div>
                    </div>`;
            });
        }

        function openDetail(animeId) {
            const anime = animeData.find(a => a.animeId === animeId); if(!anime) return;
            currentAnime = anime;
            document.getElementById('homeView').style.display = 'none';
            document.getElementById('detailPage').classList.add('active');
            document.getElementById('detailBannerImg').src = anime.poster;
            document.getElementById('detailPosterImg').src = anime.poster;
            document.getElementById('detailTitle').innerText = anime.title;
            document.getElementById('detailSynopsis').innerText = anime.synopsis;

            const epList = document.getElementById('episodesList'); epList.innerHTML = '';
            anime.episodes.forEach(ep => {
                epList.innerHTML += `<div class="episode-item" onclick="launchCinema('${ep.episodeId}', ${ep.episodeNum})">EPISODE ${ep.episodeNum}</div>`;
            });
            window.scrollTo({top:0, behavior:'smooth'});
        }

        async function launchCinema(epId, num) {
            document.getElementById('playerTitle').innerText = `${currentAnime.title} - Episode ${num}`;
            document.getElementById('playerModal').classList.add('active');
            const player = document.getElementById('videoPlayer');
            const msg = document.getElementById('noVideoMsg');
            player.style.display = 'none'; msg.style.display = 'block';

            const epSelector = document.getElementById('epSelector'); epSelector.innerHTML = '';
            currentAnime.episodes.forEach(ep => {
                epSelector.innerHTML += `<button class="ep-btn ${ep.episodeNum === num ? 'active' : ''}" onclick="closePlayer(); launchCinema('${ep.episodeId}', ${ep.episodeNum})">EP ${ep.episodeNum}</button>`;
            });

            try {
                const res = await fetch(`${API_BASE}/watch?id=${epId}`);
                const data = await res.json();
                if(data.success) {
                    player.src = data.iframe;
                    player.style.display = 'block'; msg.style.display = 'none';
                }
            } catch(e) {
                player.src = `https://vidsrc.to/embed/anime/${currentAnime.animeId}/ep-${num}`;
                player.style.display = 'block'; msg.style.display = 'none';
            }
        }

        function closePlayer() {
            document.getElementById('videoPlayer').src = '';
            document.getElementById('playerModal').classList.remove('active');
        }

        function showHome() {
            document.getElementById('detailPage').classList.remove('active');
            document.getElementById('homeView').style.display = 'block';
        }

        function searchAnime(q) {
            if(!q) return renderGrid(animeData);
            renderGrid(animeData.filter(a => a.title.toLowerCase().includes(q.toLowerCase())));
        }

        function filterLang(lang, btn) {
            document.querySelectorAll('.lang-chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            if(lang === 'all') return renderGrid(animeData);
            renderGrid(animeData.filter(a => a.languages.includes(lang.toLowerCase())));
        }

        syncCluster();
        setInterval(syncCluster, 30000);
    </script>
</body>
</html>
