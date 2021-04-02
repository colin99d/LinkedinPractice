const menuPlay = document.querySelectorAll('.menuPlay')
const menuShop = document.querySelectorAll('.menuShop')

const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

var PLAYER_LIVES = 1;
const PLAYER_WIDTH = 20;
var PLAYER_MAX_SPEED = 200.0;
const LASER_MAX_SPEED = 300.0;
var LASER_COOLDOWN = 1;

var ENEMIES_PER_ROW = 2;
var ENEMIES_PER_COLUMN = 2;
const ENEMY_HORIZONTAL_PADDING = 80;
const ENEMY_VERTICAL_PADDING = 70;
const ENEMY_VERTICAL_SPACING = 80;
var ENEMY_COOLDOWN = 5.0;

const GAME_STATE = {
  round: 1,
  coins: 0,
  lastTime: Date.now(),
  leftPressed: false,
  rightPressed: false,
  spacePressed: false,
  playerX: 0,
  playerY: 0,
  playerCooldown: 0,
  lasers: [],
  enemies: [],
  enemyLasers: [],
  gameOver: false,
  costs: {"speed": 2, "fire": 2, "health": 2}
};

function rectsIntersect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

function setPosition(el, x, y) {
  el.style.transform = `translate(${x}px, ${y}px)`;
}

function clamp(v, min, max) {
  if (v < min) {
    return min;
  } else if (v > max) {
    return max;
  } else {
    return v;
  }
}

function rand(min, max) {
  if (min === undefined) min = 0;
  if (max === undefined) max = 1;
  return min + Math.random() * (max - min);
}

function createPlayer($container) {
  GAME_STATE.playerX = GAME_WIDTH / 2;
  GAME_STATE.playerY = GAME_HEIGHT - 50;
  const $player = document.createElement("img");
  $player.src = "img/player-blue-1.png";
  $player.className = "player gameObject";
  $container.appendChild($player);
  setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function destroyPlayer($container, player) {
  $container.removeChild(player);
  GAME_STATE.gameOver = true;
  const audio = new Audio("sound/sfx-lose.ogg");
  //audio.play();
}

function updatePlayer(dt, $container) {
  if (GAME_STATE.leftPressed) {
    GAME_STATE.playerX -= dt * PLAYER_MAX_SPEED;
  }
  if (GAME_STATE.rightPressed) {
    GAME_STATE.playerX += dt * PLAYER_MAX_SPEED;
  }

  GAME_STATE.playerX = clamp(
    GAME_STATE.playerX,
    PLAYER_WIDTH,
    GAME_WIDTH - PLAYER_WIDTH
  );

  if (GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
    createLaser($container, GAME_STATE.playerX, GAME_STATE.playerY);
    GAME_STATE.playerCooldown = LASER_COOLDOWN;
  }
  if (GAME_STATE.playerCooldown > 0) {
    GAME_STATE.playerCooldown -= dt;
  }

  const player = document.querySelector(".player");
  setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function createLaser($container, x, y) {
  const $element = document.createElement("img");
  $element.src = "img/laser-blue-1.png";
  $element.className = "laser gameObject";
  $container.appendChild($element);
  const laser = { x, y, $element };
  GAME_STATE.lasers.push(laser);
  const audio = new Audio("sound/sfx-laser1.ogg");
  audio.play();
  setPosition($element, x, y);
}

function updateLasers(dt, $container) {
  const lasers = GAME_STATE.lasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.y -= dt * LASER_MAX_SPEED;
    if (laser.y < 0) {
      destroyLaser($container, laser);
    }
    setPosition(laser.$element, laser.x, laser.y);
    const r1 = laser.$element.getBoundingClientRect();
    const enemies = GAME_STATE.enemies;
    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];
      if (enemy.isDead) continue;
      const r2 = enemy.$element.getBoundingClientRect();
      if (rectsIntersect(r1, r2)) {
        // Enemy was hit
        destroyEnemy($container, enemy);
        destroyLaser($container, laser);
        break;
      }
    }
  }
  GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
}

function destroyLaser($container, laser) {
  $container.removeChild(laser.$element);
  laser.isDead = true;
}

function createEnemy($container, x, y) {
  const $element = document.createElement("img");
  $element.src = "img/enemy-blue-1.png";
  $element.className = "enemy gameObject";
  $container.appendChild($element);
  const enemy = {
    x,
    y,
    cooldown: rand(0.5, ENEMY_COOLDOWN),
    $element
  };
  GAME_STATE.enemies.push(enemy);
  setPosition($element, x, y);
}

function updateEnemies(dt, $container) {
  const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
  const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;

  const enemies = GAME_STATE.enemies;
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const x = enemy.x + dx;
    const y = enemy.y + dy;
    setPosition(enemy.$element, x, y);
    enemy.cooldown -= dt;
    if (enemy.cooldown <= 0) {
      createEnemyLaser($container, x, y);
      enemy.cooldown = ENEMY_COOLDOWN;
    }
  }
  GAME_STATE.enemies = GAME_STATE.enemies.filter(e => !e.isDead);
}

function destroyEnemy($container, enemy) {
  GAME_STATE.coins += 1;
  document.querySelector(".coinsCounter").innerHTML = "Coins: " + GAME_STATE.coins;
  $container.removeChild(enemy.$element);
  enemy.isDead = true;
}

function createEnemyLaser($container, x, y) {
  const $element = document.createElement("img");
  $element.src = "img/laser-red-5.png";
  $element.className = "enemy-laser gameObject";
  $container.appendChild($element);
  const laser = { x, y, $element };
  GAME_STATE.enemyLasers.push(laser);
  setPosition($element, x, y);
}

function updateEnemyLasers(dt, $container) {
  const lasers = GAME_STATE.enemyLasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.y += dt * LASER_MAX_SPEED;
    if (laser.y > GAME_HEIGHT) {
      destroyLaser($container, laser);
    }
    setPosition(laser.$element, laser.x, laser.y);
    const r1 = laser.$element.getBoundingClientRect();
    const player = document.querySelector(".player");
    const r2 = player.getBoundingClientRect();
    if (rectsIntersect(r1, r2)) {
      // Player was hit
      destroyPlayer($container, player);
      break;
    }
  }
  GAME_STATE.enemyLasers = GAME_STATE.enemyLasers.filter(e => !e.isDead);
}
function hardenEnemies() {
  if(GAME_STATE.round % 5 == 0) {
    ENEMIES_PER_COLUMN += 1
  } else if (GAME_STATE.round % 3 == 0) {
    ENEMIES_PER_ROW += 1
  } else {
    ENEMY_COOLDOWN *= 0.9
  }
}

function init() {
  document.querySelector(".roundCounter").innerHTML = "Round: " + GAME_STATE.round;
  const $container = document.querySelector(".game");
  createPlayer($container);
  hardenEnemies();
  console.log(ENEMY_COOLDOWN);
  const enemySpacing = (GAME_WIDTH - ENEMY_HORIZONTAL_PADDING * 2) / (ENEMIES_PER_ROW - 1);
  for (let j = 0; j < ENEMIES_PER_COLUMN; j++) {
    const y = ENEMY_VERTICAL_PADDING + j * ENEMY_VERTICAL_SPACING;
    for (let i = 0; i < ENEMIES_PER_ROW; i++) {
      const x = i * enemySpacing + ENEMY_HORIZONTAL_PADDING;
      createEnemy($container, x, y);
    }
  }
}

function update() {
  const currentTime = Date.now();
  const dt = (currentTime - GAME_STATE.lastTime) / 1000.0;
  if (GAME_STATE.gameOver) {
    endGame()
    round = 1;
    ENEMIES_PER_COLUMN = 2;
    ENEMIES_PER_ROW = 2;
    ENEMY_COOLDOWN = 5;
    document.querySelector(".menu").style.display = "block";
    return;
  }

  if (GAME_STATE.enemies.length === 0) {
    endGame()
    GAME_STATE.round += 1;
    document.querySelector(".congratulations").style.display = "block";
    return;
  }
  const $container = document.querySelector(".game");
  updatePlayer(dt, $container);
  updateLasers(dt, $container);
  updateEnemies(dt, $container);
  updateEnemyLasers(dt, $container);

  GAME_STATE.lastTime = currentTime;
  window.requestAnimationFrame(update);
}

function onKey(e) {
  var action = e.type
  if (e.keyCode === KEY_CODE_LEFT) {
    GAME_STATE.leftPressed = action=="keydown";
  } else if (e.keyCode === KEY_CODE_RIGHT) {
    GAME_STATE.rightPressed = action=="keydown";
  } else if (e.keyCode === KEY_CODE_SPACE) {
    GAME_STATE.spacePressed = action=="keydown";
  }
}

//The below code focuses on functions outside of the actual game
function startGame() {
  document.querySelector(".congratulations").style.display = "none";
  document.querySelector(".shop").style.display = "none";
  document.querySelector(".menu").style.display = "none";
  init();
  window.requestAnimationFrame(update);
  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", onKey);
}

function endGame() {
  GAME_STATE.gameOver = false;
  window.cancelAnimationFrame(update);
  window.removeEventListener("keydown", onKey);
  window.removeEventListener("keyup", onKey);
  const $container = document.querySelector(".game");
  var destroyObjects = document.querySelectorAll(".gameObject")
  for (let i=0 ; i < destroyObjects.length; i++) {
    $container.removeChild(destroyObjects[i])
  }
  GAME_STATE.lasers = [];
  GAME_STATE.enemies = [];
  GAME_STATE.enemyLasers = [];
  GAME_STATE.leftPressed = false;
  GAME_STATE.rightPressed = false;
  GAME_STATE.spacePressed = false;
}

function seeShop() {
  document.querySelector(".menu").style.display = "none";
  document.querySelector(".shop").style.display = "block";
}

function shopHandler(attribute) {
  if (GAME_STATE.coins >= GAME_STATE.costs[attribute]) {
    GAME_STATE.coins -= GAME_STATE.costs[attribute]
    GAME_STATE.costs[attribute] += 2
    console.log(GAME_STATE.costs[attribute])

    if (attribute == "speed") {
      PLAYER_MAX_SPEED += 30;
      document.querySelector(".speedFrame").innerHTML = PLAYER_MAX_SPEED;
      document.querySelector(".speedButton").innerHTML = GAME_STATE.costs.speed;
      document.querySelector(".coinsCounter").innerHTML = "Coins: " + GAME_STATE.coins;
    } else if (attribute == "fire") {
      if (LASER_COOLDOWN > 0.1) {
        LASER_COOLDOWN -= 0.1
        document.querySelector(".fireFrame").innerHTML = LASER_COOLDOWN;
        document.querySelector(".fireButton").innerHTML = GAME_STATE.costs.fire;
        document.querySelector(".coinsCounter").innerHTML = "Coins: " + GAME_STATE.coins;
      }
    } else if (attribute == "health") {
      PLAYER_LIVES += 1
      document.querySelector(".healthFrame").innerHTML = PLAYER_LIVES
      document.querySelector(".healthButton").innerHTML = GAME_STATE.costs.health;
      document.querySelector(".coinsCounter").innerHTML = "Coins: " + GAME_STATE.coins;
    }
  }
}

document.querySelector(".speedButton").addEventListener("click",() => shopHandler("speed"))
document.querySelector(".speedButton").innerHTML = GAME_STATE.costs.speed
document.querySelector(".fireButton").addEventListener("click",() => shopHandler("fire"))
document.querySelector(".fireButton").innerHTML = GAME_STATE.costs.fire
document.querySelector(".healthButton").addEventListener("click",() => shopHandler("health"))
document.querySelector(".healthButton").innerHTML = GAME_STATE.costs.health

document.querySelector(".speedFrame").innerHTML = PLAYER_MAX_SPEED;
document.querySelector(".fireFrame").innerHTML = LASER_COOLDOWN;
document.querySelector(".healthFrame").innerHTML = PLAYER_LIVES;

document.querySelector(".menu").style.display = "block";
menuPlay.forEach(item => item.addEventListener("click", startGame));
menuShop.forEach(item => item.addEventListener("click", seeShop));


