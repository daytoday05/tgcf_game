// Configuración del canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let gameOver = false;

canvas.width = 720;
canvas.height = 680;

// Cargar imágenes
const playerImg = new Image();
playerImg.src = "assets/img/player.png";

const arrowImg = new Image();
arrowImg.src = "assets/img/arrow.png";

const enemyImg = new Image();
enemyImg.src = 'assets/img/enemy.png';

const bgImgList = [
"236x/bf/17/21/bf1721bf50ea3869f20f84a2b75320d4.jpg", 
"236x/de/c4/18/dec41882ef4b6a72670587cd688ef4f0.jpg", 
"736x/7f/a8/55/7fa855c65a97a4d43c8b25ee62c863a5.jpg"
];

const bgImg = new Image();
bgImg.src = `https://i.pinimg.com/${bgImgList[Math.round(Math.random() * (bgImgList.length - 1))]}`;

// Variables del jugador
const player = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 90,
    width: 100,
    height: 100,
    speed: 15,
    movingLeft: false,
    movingRight: false
};

// Variables de balas y enemigos
const arrows = [];
const enemies = [];
const arrowSpeed = 10;
const enemySpeed = 5;

// Controles del jugador
document.addEventListener("keydown", (event) => {
    if (event.key === "f") document.location.reload();
    if (event.key === "ArrowLeft") player.movingLeft = true;
    if (event.key === "ArrowRight") player.movingRight = true;
    if (event.key === " ") {
        arrows.push({
            x: player.x + player.width / 2 - 25,
            y: player.y,
            width: 90,
            height: 90
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
    arrows.forEach((arrow, index) => {
        arrow.y -= arrowSpeed;
        if (arrow.y < 0) arrows.splice(index, 1);
    });

    // Generar enemigos aleatorios
    if (Math.random() < 0.05) {
        enemies.push({
            x: Math.random() * (canvas.width - 60),
            y: 0,
            width: 100,
            height: 100
        });
    }

    // Mover enemigos
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) enemies.splice(index, 1);
    });

    // Colisiones de balas con enemigos
    arrows.forEach((arrow, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                arrow.x < enemy.x + enemy.width &&
                arrow.x + arrow.width > enemy.x &&
                arrow.y < enemy.y + enemy.height &&
                arrow.y + arrow.height > enemy.y
            ) {
                arrows.splice(bIndex, 1);
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
    
    arrows.forEach(arrow => {
        ctx.drawImage(arrowImg, arrow.x, arrow.y, arrow.width, arrow.height);
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
    draw();
    document.querySelector('#welcome').style.opacity = '0';
    setTimeout(() => {
      document.querySelector('#welcome').remove();
      gameLoop();
    }, 3000);
  }, 2000);
};
