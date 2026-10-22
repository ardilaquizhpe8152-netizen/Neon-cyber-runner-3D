<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Neon Cyber Runner 3D</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;700&display=swap" rel="stylesheet">
    <!-- Three.js CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

    <style>
        * {
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
        }

        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: 'Rajdhani', sans-serif;
            background-color: #030014;
            color: #fff;
        }

        .font-neon {
            font-family: 'Orbitron', sans-serif;
        }

        .glow-text {
            text-shadow: 0 0 10px rgba(0, 243, 255, 0.8), 0 0 20px rgba(0, 243, 255, 0.4);
        }

        .glow-pink {
            text-shadow: 0 0 10px rgba(255, 0, 127, 0.8), 0 0 20px rgba(255, 0, 127, 0.4);
        }

        .cyber-box {
            background: rgba(10, 10, 26, 0.75);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(0, 243, 255, 0.3);
            box-shadow: 0 0 20px rgba(0, 243, 255, 0.15), inset 0 0 15px rgba(0, 243, 255, 0.05);
        }

        .cyber-btn {
            position: relative;
            background: linear-gradient(135deg, rgba(0, 243, 255, 0.2), rgba(255, 0, 127, 0.2));
            border: 1px solid #00f3ff;
            box-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
            transition: all 0.2s ease;
        }

        .cyber-btn:hover {
            background: linear-gradient(135deg, rgba(0, 243, 255, 0.4), rgba(255, 0, 127, 0.4));
            box-shadow: 0 0 25px rgba(0, 243, 255, 0.8);
            transform: scale(1.03);
        }

        .cyber-btn:active {
            transform: scale(0.97);
        }

        #canvas-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .hud-item {
            background: rgba(5, 5, 16, 0.6);
            border: 1px solid rgba(0, 243, 255, 0.2);
            backdrop-filter: blur(8px);
        }
    </style>
</head>
<body class="relative w-screen h-screen overflow-hidden">

    <!-- Canvas Container for 3D Scene -->
    <div id="canvas-container"></div>

    <!-- HUD Overlay (Visible during gameplay) -->
    <div id="hud" class="absolute top-0 left-0 w-full p-4 md:p-6 z-10 flex justify-between items-start pointer-events-none opacity-0 transition-opacity duration-500">
        <!-- Score & Gems -->
        <div class="flex flex-col gap-2">
            <div class="hud-item px-4 py-2 rounded-xl flex items-center gap-3">
                <i class="fa-solid fa-bolt text-cyan-400 text-lg"></i>
                <div class="flex flex-col">
                    <span class="text-[10px] text-cyan-300/70 font-bold uppercase tracking-wider">Distancia</span>
                    <span id="hud-score" class="text-2xl md:text-3xl font-neon text-cyan-400 font-bold">0m</span>
                </div>
            </div>
            <div class="hud-item px-4 py-2 rounded-xl flex items-center gap-3">
                <i class="fa-solid fa-gem text-pink-500 text-lg"></i>
                <div class="flex flex-col">
                    <span class="text-[10px] text-pink-300/70 font-bold uppercase tracking-wider">Gemas</span>
                    <span id="hud-gems" class="text-xl md:text-2xl font-neon text-pink-400 font-bold">0</span>
                </div>
            </div>
        </div>

        <!-- Speed / Multiplier -->
        <div class="hud-item px-4 py-2 rounded-xl flex flex-col items-end">
            <span class="text-[10px] text-yellow-300/70 font-bold uppercase tracking-wider">Velocidad</span>
            <span id="hud-speed" class="text-xl md:text-2xl font-neon text-yellow-400 font-bold">1.0x</span>
        </div>
    </div>

    <!-- UI Overlay Screens -->
    <div id="ui-overlay" class="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300">
        
        <!-- Start Screen -->
        <div id="start-screen" class="cyber-box w-full max-w-md p-6 md:p-8 rounded-2xl flex flex-col items-center text-center">
            <div class="w-16 h-16 mb-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 text-3xl shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                <i class="fa-solid fa-cube"></i>
            </div>
            <h1 class="text-3xl md:text-4xl font-extrabold font-neon glow-text text-cyan-400 tracking-wider mb-1">
                CYBER RUNNER 3D
            </h1>
            <p class="text-xs md:text-sm text-pink-400 font-semibold tracking-widest uppercase mb-6 glow-pink">
                Edición Neón Synthwave
            </p>

            <div class="w-full bg-slate-900/60 rounded-xl p-3 border border-slate-800 mb-6 flex justify-around text-center">
                <div>
                    <span class="block text-[10px] text-gray-400 uppercase">Récord Distancia</span>
                    <span id="best-score" class="text-lg font-neon text-cyan-300">0m</span>
                </div>
                <div class="w-px bg-slate-800"></div>
                <div>
                    <span class="block text-[10px] text-gray-400 uppercase">Gemas Totales</span>
                    <span id="total-gems" class="text-lg font-neon text-pink-400">0</span>
                </div>
            </div>

            <button onclick="startGame()" class="cyber-btn w-full py-4 rounded-xl text-cyan-300 font-neon text-lg font-bold tracking-widest uppercase mb-4 flex items-center justify-center gap-2 cursor-pointer">
                <i class="fa-solid fa-play"></i> INICIAR JUEGO
            </button>

            <!-- Audio Toggle -->
            <button onclick="toggleAudio()" class="text-xs text-gray-400 hover:text-cyan-300 flex items-center gap-2">
                <i id="sound-icon" class="fa-solid fa-volume-high text-cyan-400"></i>
                <span id="sound-text">Sonido: ACTIVADO</span>
            </button>
        </div>

        <!-- Game Over Screen -->
        <div id="gameover-screen" class="cyber-box w-full max-w-md p-6 md:p-8 rounded-2xl flex flex-col items-center text-center hidden">
            <h2 class="text-3xl md:text-4xl font-extrabold font-neon text-pink-500 glow-pink mb-2">
                SISTEMA COLAPSADO
            </h2>
            <p class="text-xs text-gray-300 uppercase tracking-widest mb-6">Has chocado contra un obstáculo</p>

            <div class="w-full grid grid-cols-2 gap-3 mb-6">
                <div class="bg-slate-900/80 p-3 rounded-xl border border-cyan-500/30">
                    <span class="block text-[10px] text-cyan-300/70 uppercase font-bold">Distancia Recorrida</span>
                    <span id="final-score" class="text-2xl font-neon text-cyan-400 font-bold">0m</span>
                </div>
                <div class="bg-slate-900/80 p-3 rounded-xl border border-pink-500/30">
                    <span class="block text-[10px] text-pink-300/70 uppercase font-bold">Gemas Recogidas</span>
                    <span id="final-gems" class="text-2xl font-neon text-pink-400 font-bold">0</span>
                </div>
            </div>

            <button onclick="restartGame()" class="cyber-btn w-full py-4 rounded-xl text-pink-300 border-pink-500 font-neon text-lg font-bold tracking-widest uppercase cursor-pointer mb-3 flex items-center justify-center gap-2">
                <i class="fa-solid fa-rotate-right"></i> REINTENTAR
            </button>
        </div>

    </div>

    <!-- On-Screen Mobile Touch Controls -->
    <div id="mobile-controls" class="absolute bottom-6 left-0 w-full px-6 z-10 flex justify-between items-center md:hidden pointer-events-none">
        <!-- Left / Right Lane Switches -->
        <div class="flex gap-3 pointer-events-auto">
            <button ontouchstart="handleTouchInput('LEFT', event)" class="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 text-cyan-400 text-2xl flex items-center justify-center active:bg-cyan-500/40 active:scale-95 transition-transform backdrop-blur">
                <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button ontouchstart="handleTouchInput('RIGHT', event)" class="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 text-cyan-400 text-2xl flex items-center justify-center active:bg-cyan-500/40 active:scale-95 transition-transform backdrop-blur">
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        </div>

        <!-- Jump Button -->
        <div class="pointer-events-auto">
            <button ontouchstart="handleTouchInput('JUMP', event)" class="w-20 h-20 rounded-2xl bg-pink-950/60 border border-pink-400/40 text-pink-400 text-2xl flex items-center justify-center active:bg-pink-500/40 active:scale-95 transition-transform backdrop-blur">
                <i class="fa-solid fa-angles-up"></i>
            </button>
        </div>
    </div>

    <!-- Three.js Game Logic -->
    <script>
        // --- WEB AUDIO SYNTHESIS SYSTEM ---
        class SoundFX {
            constructor() {
                this.ctx = null;
                this.enabled = true;
            }

            init() {
                if (!this.ctx) {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    this.ctx = new AudioCtx();
                }
            }

            playGem() {
                if (!this.enabled || !this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
                osc.frequency.exponentialRampToValueAtTime(1174.66, this.ctx.currentTime + 0.15); // D6

                gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.15);
            }

            playJump() {
                if (!this.enabled || !this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.2);

                gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.2);
            }

            playCrash() {
                if (!this.enabled || !this.ctx) return;
                // Noise buffer for crash explosion sound
                const bufferSize = this.ctx.sampleRate * 0.4;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const output = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }

                const whiteNoise = this.ctx.createBufferSource();
                whiteNoise.buffer = buffer;

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, this.ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.4);

                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

                whiteNoise.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                whiteNoise.start();
                whiteNoise.stop(this.ctx.currentTime + 0.4);
            }
        }

        const soundFX = new SoundFX();

        function toggleAudio() {
            soundFX.enabled = !soundFX.enabled;
            document.getElementById('sound-text').innerText = `Sonido: ${soundFX.enabled ? 'ACTIVADO' : 'DESACTIVADO'}`;
            document.getElementById('sound-icon').className = soundFX.enabled ? 'fa-solid fa-volume-high text-cyan-400' : 'fa-solid fa-volume-xmark text-gray-500';
        }

        // --- GAME CONSTANTS & GLOBALS ---
        const LANES = [-2.5, 0, 2.5]; // 3 Lanes along X axis
        let currentLane = 1; // Middle lane index
        let scene, camera, renderer;
        let playerMesh, playerGlow;
        let obstacles = [];
        let gems = [];
        let particleSystems = [];

        // Game State Variables
        let isPlaying = false;
        let distance = 0;
        let gemsCollected = 0;
        let speed = 0.35;
        const baseSpeed = 0.35;
        let maxSpeed = 0.9;
        let isJumping = false;
        let jumpVelocity = 0;
        const gravity = -0.018;

        // Stats Storage
        let bestDistance = localStorage.getItem('cyber_best_dist') || 0;
        let totalGemsSaved = localStorage.getItem('cyber_total_gems') || 0;

        document.getElementById('best-score').innerText = `${Math.floor(bestDistance)}m`;
        document.getElementById('total-gems').innerText = totalGemsSaved;

        // Floor / Track Elements
        let gridHelper;
        let trackSegmentLength = 100;
        let trackSegments = [];

        // --- THREE.JS INITIALIZATION ---
        function initThree() {
            const container = document.getElementById('canvas-container');

            // 1. Scene setup
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x030014);
            scene.fog = new THREE.FogExp2(0x030014, 0.018); // Atmospheric Cyber Fog

            // 2. Camera setup
            camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 3.5, 7);
            camera.lookAt(0, 1, -5);

            // 3. Renderer setup
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            container.appendChild(renderer.domElement);

            // 4. Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0x00f3ff, 0.8);
            dirLight.position.set(5, 15, 10);
            dirLight.castShadow = true;
            dirLight.shadow.mapSize.width = 1024;
            dirLight.shadow.mapSize.height = 1024;
            scene.add(dirLight);

            // Pink Rim/Back Light
            const backLight = new THREE.DirectionalLight(0xff007f, 0.6);
            backLight.position.set(-5, 5, -20);
            scene.add(backLight);

            // 5. Build Player Mesh (Glowing Cyber Sphere/Orb)
            const playerGeo = new THREE.SphereGeometry(0.6, 32, 32);
            const playerMat = new THREE.MeshStandardMaterial({
                color: 0x00f3ff,
                emissive: 0x00f3ff,
                emissiveIntensity: 0.6,
                roughness: 0.2,
                metalness: 0.8
            });
            playerMesh = new THREE.Mesh(playerGeo, playerMat);
            playerMesh.position.set(LANES[currentLane], 0.6, 0);
            playerMesh.castShadow = true;
            scene.add(playerMesh);

            // Inner core glow light for player
            const playerLight = new THREE.PointLight(0x00f3ff, 2, 6);
            playerMesh.add(playerLight);

            // 6. Build Initial Track Grid
            createTrack();

            // Resize Event
            window.addEventListener('resize', onWindowResize);
        }

        function createTrack() {
            // Infinite Grid Floor
            const gridGeo = new THREE.PlaneGeometry(12, 120, 24, 120);
            const gridMat = new THREE.MeshBasicMaterial({
                color: 0x00f3ff,
                wireframe: true,
                transparent: true,
                opacity: 0.15
            });
            gridHelper = new THREE.Mesh(gridGeo, gridMat);
            gridHelper.rotation.x = -Math.PI / 2;
            gridHelper.position.z = -50;
            scene.add(gridHelper);

            // Track Borders (Glowing Side Rails)
            const railGeo = new THREE.BoxGeometry(0.2, 0.4, 120);
            const railMat = new THREE.MeshStandardMaterial({
                color: 0xff007f,
                emissive: 0xff007f,
                emissiveIntensity: 0.8
            });

            const leftRail = new THREE.Mesh(railGeo, railMat);
            leftRail.position.set(-4.2, 0.2, -50);
            scene.add(leftRail);

            const rightRail = new THREE.Mesh(railGeo, railMat);
            rightRail.position.set(4.2, 0.2, -50);
            scene.add(rightRail);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // --- PROCEDURAL GENERATION ---
        function spawnObstacle(zPos) {
            const laneIndex = Math.floor(Math.random() * 3);
            const laneX = LANES[laneIndex];

            // Random type: Box or Pyramid
            const isPyramid = Math.random() > 0.5;
            let geo = isPyramid ? new THREE.ConeGeometry(0.7, 1.4, 4) : new THREE.BoxGeometry(1.2, 1.2, 1.2);
            
            const mat = new THREE.MeshStandardMaterial({
                color: 0xff0055,
                emissive: 0xff0033,
                emissiveIntensity: 0.5,
                roughness: 0.3,
                metalness: 0.7
            });

            const obstacle = new THREE.Mesh(geo, mat);
            obstacle.position.set(laneX, isPyramid ? 0.7 : 0.6, zPos);
            obstacle.castShadow = true;
            obstacle.userData = { lane: laneIndex, type: 'obstacle' };

            scene.add(obstacle);
            obstacles.push(obstacle);
        }

        function spawnGem(zPos) {
            const laneIndex = Math.floor(Math.random() * 3);
            const laneX = LANES[laneIndex];

            // Octahedron Gem Geometry
            const geo = new THREE.OctahedronGeometry(0.45);
            const mat = new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                emissive: 0x00ffff,
                emissiveIntensity: 0.9,
                roughness: 0.1,
                metalness: 0.9
            });

            const gem = new THREE.Mesh(geo, mat);
            gem.position.set(laneX, 0.8, zPos);
            gem.userData = { lane: laneIndex, type: 'gem' };

            scene.add(gem);
            gems.push(gem);
        }

        function createExplosion(pos, colorHex) {
            const count = 20;
            const geo = new THREE.BufferGeometry();
            const positions = [];
            const velocities = [];

            for (let i = 0; i < count; i++) {
                positions.push(pos.x, pos.y, pos.z);
                velocities.push(
                    (Math.random() - 0.5) * 0.3,
                    Math.random() * 0.3 + 0.1,
                    (Math.random() - 0.5) * 0.3
                );
            }

            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            const mat = new THREE.PointsMaterial({
                color: colorHex,
                size: 0.15,
                transparent: true,
                opacity: 1
            });

            const pSystem = new THREE.Points(geo, mat);
            pSystem.userData = { velocities: velocities, life: 1.0 };
            scene.add(pSystem);
            particleSystems.push(pSystem);
        }

        // --- GAME CONTROLS ---
        function moveLeft() {
            if (!isPlaying) return;
            if (currentLane > 0) {
                currentLane--;
            }
        }

        function moveRight() {
            if (!isPlaying) return;
            if (currentLane < LANES.length - 1) {
                currentLane++;
            }
        }

        function jump() {
            if (!isPlaying) return;
            if (!isJumping) {
                isJumping = true;
                jumpVelocity = 0.32;
                soundFX.playJump();
            }
        }

        function handleTouchInput(action, event) {
            if (event) event.preventDefault();
            soundFX.init();
            if (action === 'LEFT') moveLeft();
            if (action === 'RIGHT') moveRight();
            if (action === 'JUMP') jump();
        }

        window.addEventListener('keydown', (e) => {
            soundFX.init();
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft();
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight();
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') jump();
        });

        // --- GAME LOOP & UPDATES ---
        function updateGame() {
            if (!isPlaying) return;

            // 1. Update Distance & Speed
            distance += speed;
            speed = Math.min(maxSpeed, baseSpeed + (distance / 3000));
            
            document.getElementById('hud-score').innerText = `${Math.floor(distance)}m`;
            document.getElementById('hud-gems').innerText = gemsCollected;
            document.getElementById('hud-speed').innerText = `${(speed / baseSpeed).toFixed(1)}x`;

            // 2. Smooth Lane Movement for Player
            const targetX = LANES[currentLane];
            playerMesh.position.x += (targetX - playerMesh.position.x) * 0.2;

            // 3. Handle Jump Mechanics
            if (isJumping) {
                playerMesh.position.y += jumpVelocity;
                jumpVelocity += gravity;
                if (playerMesh.position.y <= 0.6) {
                    playerMesh.position.y = 0.6;
                    isJumping = false;
                }
            }

            // Continuous rotation for visual flare
            playerMesh.rotation.x += speed * 0.5;

            // 4. Move Grid Floor to simulate motion
            gridHelper.position.z += speed;
            if (gridHelper.position.z >= 0) {
                gridHelper.position.z = -50;
            }

            // 5. Spawn Spawner Pipeline
            if (Math.random() < 0.05) {
                const zSpawn = -80 - Math.random() * 20;
                if (Math.random() > 0.35) {
                    spawnObstacle(zSpawn);
                } else {
                    spawnGem(zSpawn);
                }
            }

            // 6. Update Obstacles & Check Collision
            for (let i = obstacles.length - 1; i >= 0; i--) {
                const obs = obstacles[i];
                obs.position.z += speed;
                obs.rotation.y += 0.02;

                // Collision Check
                const dz = Math.abs(obs.position.z - playerMesh.position.z);
                const dx = Math.abs(obs.position.x - playerMesh.position.x);
                const dy = Math.abs(obs.position.y - obs.position.y);

                if (dz < 0.8 && dx < 0.8 && playerMesh.position.y < 1.1) {
                    createExplosion(playerMesh.position, 0xff0055);
                    soundFX.playCrash();
                    gameOver();
                    return;
                }

                // Despawn behind camera
                if (obs.position.z > 10) {
                    scene.remove(obs);
                    obstacles.splice(i, 1);
                }
            }

            // 7. Update Gems & Check Collection
            for (let i = gems.length - 1; i >= 0; i--) {
                const gem = gems[i];
                gem.position.z += speed;
                gem.rotation.y += 0.05;

                // Collection Check
                const dz = Math.abs(gem.position.z - playerMesh.position.z);
                const dx = Math.abs(gem.position.x - playerMesh.position.x);
                const dy = Math.abs(gem.position.y - playerMesh.position.y);

                if (dz < 0.9 && dx < 0.8 && dy < 1.0) {
                    gemsCollected++;
                    createExplosion(gem.position, 0x00ffff);
                    soundFX.playGem();
                    scene.remove(gem);
                    gems.splice(i, 1);
                    continue;
                }

                // Despawn
                if (gem.position.z > 10) {
                    scene.remove(gem);
                    gems.splice(i, 1);
                }
            }

            // 8. Update Particle Explosions
            for (let i = particleSystems.length - 1; i >= 0; i--) {
                const pSystem = particleSystems[i];
                const positions = pSystem.geometry.attributes.position.array;
                const vels = pSystem.userData.velocities;

                for (let j = 0; j < vels.length / 3; j++) {
                    positions[j * 3] += vels[j * 3];
                    positions[j * 3 + 1] += vels[j * 3 + 1];
                    positions[j * 3 + 2] += vels[j * 3 + 2];
                }

                pSystem.geometry.attributes.position.needsUpdate = true;
                pSystem.userData.life -= 0.03;
                pSystem.material.opacity = pSystem.userData.life;

                if (pSystem.userData.life <= 0) {
                    scene.remove(pSystem);
                    particleSystems.splice(i, 1);
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            updateGame();
            renderer.render(scene, camera);
        }

        // --- GAME FLOW MANAGERS ---
        function startGame() {
            soundFX.init();
            
            // Clear existing elements
            obstacles.forEach(o => scene.remove(o));
            gems.forEach(g => scene.remove(g));
            particleSystems.forEach(p => scene.remove(p));
            obstacles = [];
            gems = [];
            particleSystems = [];

            // Reset States
            currentLane = 1;
            playerMesh.position.set(LANES[currentLane], 0.6, 0);
            distance = 0;
            gemsCollected = 0;
            speed = baseSpeed;
            isJumping = false;
            isPlaying = true;

            // UI Adjustments
            document.getElementById('ui-overlay').classList.add('opacity-0', 'pointer-events-none');
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('gameover-screen').classList.add('hidden');
            document.getElementById('hud').classList.remove('opacity-0');
        }

        function gameOver() {
            isPlaying = false;

            // Update High Score & Gems Total
            if (distance > bestDistance) {
                bestDistance = distance;
                localStorage.setItem('cyber_best_dist', bestDistance);
            }
            
            totalGemsSaved = parseInt(totalGemsSaved) + gemsCollected;
            localStorage.setItem('cyber_total_gems', totalGemsSaved);

            // Update UI
            document.getElementById('final-score').innerText = `${Math.floor(distance)}m`;
            document.getElementById('final-gems').innerText = gemsCollected;
            document.getElementById('best-score').innerText = `${Math.floor(bestDistance)}m`;
            document.getElementById('total-gems').innerText = totalGemsSaved;

            document.getElementById('hud').classList.add('opacity-0');
            document.getElementById('ui-overlay').classList.remove('opacity-0', 'pointer-events-none');
            document.getElementById('gameover-screen').classList.remove('hidden');
        }

        function restartGame() {
            startGame();
        }

        // Initialize 3D Engine on Window Load
        window.onload = () => {
            initThree();
            animate();
        };
    </script>
</body>
</html>