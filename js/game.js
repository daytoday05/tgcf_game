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
enemyImg.src = './assets/enemy.png';

const bgImgList = [
    "236x/3e/3e/29/3e3e29232bbf15b4a631065871848a28.jpg", "736x/54/45/0c/54450c72def5ee8ca4b9d4cd05a4b95d.jpg",
    "236x/f3/d2/92/f3d2924ae8e8616bd4454e30e56a3523.jpg", "736x/5e/95/f9/5e95f9e3b6e6a349711fa1b3af10e18d.jpg",
    "736x/d7/42/bc/d742bc0f332915b240648b266169b7f4.jpg", "736x/ce/d7/27/ced727a1582033c2b2e2f61bcb219e50.jpg",
    "736x/be/9b/3c/be9b3c72ede8af0e4303e4d260eb61af.jpg", "236x/3c/3e/25/3c3e255144c6a7b74917ff9de157743a.jpg",
    "736x/fc/ba/b0/fcbab08912dd415e554adc9f346034ea.jpg", "736x/1a/38/96/1a389653ad6eb905eb75db477b83e13b.jpg",
    "736x/7d/6f/db/7d6fdbe6acbcc25f4ddd79c3d9d22436.jpg", "736x/db/ec/6d/dbec6d532cab1bca96c2e7a7014ee9a0.jpg",
    "736x/d6/22/8a/d6228a93c009bd59130c9a99ae1e604d.jpg", "736x/05/47/b1/0547b111ece7404d5f179675b9ff7b0d.jpg",
    "236x/08/62/5d/08625dddcf25f7cc0eee8c8dce8ff680.jpg", "236x/14/3b/a0/143ba036b249a57e3aaae2276b759c63.jpg",
    "736x/99/76/6a/99766ab4457513b5a98b94177595c2f1.jpg", "736x/0e/bd/74/0ebd74aa0c1ca4aa625653d7d09aef10.jpg",
    "236x/b8/03/e1/b803e1eb15ffb0d8f7cc93842dafa881.jpg", "736x/d2/8c/cb/d28ccb13873d0edf278297137475cd6b.jpg"
];

const bgImg = new Image();
bgImg.src = `https://i.pinimg.com/${bgImgList[Math.round(Math.random() * (bgImgList.length - 1))]}`;

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
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
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
  setTimeout(() => {
    document.querySelector('#welcome').style.opacity = '0';
    setTimeout(() => {
      document.querySelector('#welcome').remove();
    }, 3000);
    gameLoop();
  }, 2000);
};
