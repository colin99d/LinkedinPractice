//Reducing lines of code. Starting: 368 Before Consolidation: 350
const $container = document.querySelector(".game");
const menuPlay = document.querySelectorAll('.menuPlay')
const menuShop = document.querySelectorAll('.menuShop')

const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 20;

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
  upgrades: {
    health: {value: 1, cost: 2, name: "Health", upgradeAmt: 1.08},
    fire: {value: 1, cost: 2, name: "Reload", upgradeAmt: 0.9},
    speed: {value: 200, cost: 2, name: "Speed", upgradeAmt: 1.08},
    laserVelocity: {value: 300, cost: 2, name: "Velocity", upgradeAmt: 1.08}
  }
};

function rectsIntersect(r1, r2) {
  return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
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

function create(type, x, y, src) {
  const $element = document.createElement("img");
  $element.src = src;
  $element.className = "gameObject "+type
  $container.appendChild($element);
  setPosition($element, x, y)
  if(type == "player") {
    GAME_STATE.playerX = x
    GAME_STATE.playerY = y
  } else if (type == "laser") {
    GAME_STATE.lasers.push({x, y, $element })
    new Audio("sound/sfx-laser1.ogg").play();
  } else if (type == "enemy") {
    GAME_STATE.enemies.push({x, y, cooldown: rand(0.5, ENEMY_COOLDOWN), $element});
  } else if (type == "enemy-laser") {
    GAME_STATE.enemyLasers.push({x, y, $element })
  }
}

function destroyPlayer(player) {
  $container.removeChild(player);
  GAME_STATE.gameOver = true;
  new Audio("sound/sfx-lose.ogg").play();
}

function destroyLaser(laser) {
  $container.removeChild(laser.$element);
  laser.isDead = true;
}

function destroyEnemy(enemy) {
  GAME_STATE.coins += 1;
  document.querySelector(".coinsCounter").innerHTML = "Coins: " + GAME_STATE.coins;
  $container.removeChild(enemy.$element);
  enemy.isDead = true;
}

function updatePlayer(dt) {
  if (GAME_STATE.leftPressed) {
    GAME_STATE.playerX -= dt * GAME_STATE.upgrades.speed.value;
  }
  if (GAME_STATE.rightPressed) {
    GAME_STATE.playerX += dt * GAME_STATE.upgrades.speed.value;
  }

  GAME_STATE.playerX = clamp(
    GAME_STATE.playerX,
    PLAYER_WIDTH,
    GAME_WIDTH - PLAYER_WIDTH
  );

  if (GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
    create("laser", GAME_STATE.playerX, GAME_STATE.playerY, "img/laser-blue-1.png");
    GAME_STATE.playerCooldown = GAME_STATE.upgrades.fire.value;
  }
  if (GAME_STATE.playerCooldown > 0) {
    GAME_STATE.playerCooldown -= dt;
  }

  const player = document.querySelector(".player");
  setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function updateLasers(dt) {
  const lasers = GAME_STATE.lasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.y -= dt * GAME_STATE.upgrades.laserVelocity.value;
    if (laser.y < 0) {
      destroyLaser(laser);
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
        destroyEnemy(enemy);
        destroyLaser(laser);
        break;
      }
    }
  }
  GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
}

function updateEnemies(dt) {
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
      create("enemy-laser", x, y, "img/laser-red-5.png");
      enemy.cooldown = ENEMY_COOLDOWN;
    }
  }
  GAME_STATE.enemies = GAME_STATE.enemies.filter(e => !e.isDead);
}

function updateEnemyLasers(dt) {
  const lasers = GAME_STATE.enemyLasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.y += dt * GAME_STATE.upgrades.laserVelocity.value;
    if (laser.y > GAME_HEIGHT) {
      destroyLaser(laser);
    }
    setPosition(laser.$element, laser.x, laser.y);
    const r1 = laser.$element.getBoundingClientRect();
    const player = document.querySelector(".player");
    const r2 = player.getBoundingClientRect();
    if (rectsIntersect(r1, r2)) {
      // Player was hit
      destroyPlayer(player);
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
  create("player", GAME_WIDTH / 2, GAME_HEIGHT - 50, "img/player-blue-1.png");
  hardenEnemies();
  const enemySpacing = (GAME_WIDTH - ENEMY_HORIZONTAL_PADDING * 2) / (ENEMIES_PER_ROW - 1);
  for (let j = 0; j < ENEMIES_PER_COLUMN; j++) {
    const y = ENEMY_VERTICAL_PADDING + j * ENEMY_VERTICAL_SPACING;
    for (let i = 0; i < ENEMIES_PER_ROW; i++) {
      const x = i * enemySpacing + ENEMY_HORIZONTAL_PADDING;
      create("enemy", x, y, "img/enemy-blue-1.png");
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
  updatePlayer(dt);
  updateLasers(dt);
  updateEnemies(dt);
  updateEnemyLasers(dt);

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
  if (GAME_STATE.coins >= GAME_STATE.upgrades[attribute].cost) {
    GAME_STATE.coins -= GAME_STATE.upgrades[attribute].cost
    GAME_STATE.upgrades[attribute].cost+= 2
    GAME_STATE.upgrades[attribute].value *= GAME_STATE.upgrades[attribute].upgradeAmt
    document.querySelector(".coinsCounter").innerHTML = "Coins: " + GAME_STATE.coins;
    document.querySelector("."+attribute+"Frame").innerHTML = GAME_STATE.upgrades[attribute].value;
    document.querySelector("."+attribute+"Button").innerHTML = GAME_STATE.upgrades[attribute].cost;
  }
}

const shopDiv = document.querySelector(".purchaseItems")
Object.keys(GAME_STATE.upgrades).forEach(item => {
  var $element1 = document.createElement("div");
  $element1.className = "shopItem "+item
  var $element2 = document.createElement("p")
  $element2.innerHTML = GAME_STATE.upgrades[item].name
  var $element3 = document.createElement("button")
  $element3.addEventListener("click",() => shopHandler(item))
  $element3.innerHTML = GAME_STATE.upgrades[item].cost
  $element3.className = item+"Button"
  var $element4 = document.createElement("div");
  $element4.className = "displayFrame "+item+"Frame"
  $element4.innerHTML = GAME_STATE.upgrades[item].value
  shopDiv.appendChild($element1)
  $element1.appendChild($element2)
  $element1.appendChild($element3)
  $element1.appendChild($element4)
})

menuPlay.forEach(item => item.addEventListener("click", startGame));
menuShop.forEach(item => item.addEventListener("click", seeShop));