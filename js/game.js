// Configuración del canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let gameOver = false;

canvas.width = 680;
canvas.height = 560;

// Cargar imágenes
const playerImg = new Image();
playerImg.src = "./assets/player.png";

const bulletImg = new Image();
bulletImg.src = "./assets/bullet.png";

const enemyImg = new Image();
enemyImg.src = "./assets/enemy.png";

const backgroundImg = new Image();
backgroundImg.src = "./assets/background1.png";

// Variables del jugador
const player = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 70,
    width: 60,
    height: 60,
    speed: 15,
    movingLeft: false,
    movingRight: false
};

// Variables de balas y enemigos
const bullets = [];
const enemies = [];
const bulletSpeed = 10;
const enemySpeed = 5;

// Controles del jugador
document.addEventListener("keydown", (event) => {
    if (event.key === "f") document.location.reload();
    if (event.key === "ArrowLeft") player.movingLeft = true;
    if (event.key === "ArrowRight") player.movingRight = true;
    if (event.key === " ") {
        bullets.push({
            x: player.x + player.width / 2 - 25,
            y: player.y,
            width: 50,
            height: 50
        });
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") player.movingLeft = false;
    if (event.key === "ArrowRight") player.movingRight = false;
});

// Función para retrasar acciones del sistema
function sleep (milliSeconds = 500) {
  const limit = Date.now() + milliSeconds;
  while (Date.now() < limit);
};

// Función principal del juego
function update() {
    if (gameOver) return; // Detener la actualización si el jugador terminó

    // Mover jugador
    if (player.movingLeft && player.x > 0) player.x -= player.speed;
    if (player.movingRight && player.x + player.width < canvas.width) player.x += player.speed;

    // Mover balas
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    // Generar enemigos aleatorios
    if (Math.random() < 0.05) {
        enemies.push({
            x: Math.random() * (canvas.width - 60),
            y: 0,
            width: 60,
            height: 60
        });
    }

    // Mover enemigos
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) enemies.splice(index, 1);
    });

    // Colisiones de balas con enemigos
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
            }
        });
    });

    // Colisión entre jugador y enemigos (Fin del juego)
    enemies.forEach((enemy) => {
      if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameOver = true;
            document.querySelector('#game-over').style.display = 'flex';
        }
    });

    draw();
};

// Dibujar elementos en el canvas
function draw() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
    });

    enemies.forEach(enemy => {
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Bucle del juego
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

// Iniciar el juego cuando se carguen las imágenes
window.onload = () => {
    document.querySelector('#welcome').style.opacity = '0';
    setTimeout(() => {
      document.querySelector('#welcome').remove();
    }, 3000);
    gameLoop();
};
