let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

// Ensure canvas size is set
canvas.width = 400;
canvas.height = 400;

// Snake axis
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 8;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;
let appleX = 5;
let appleY = 5;
let inputsXVelocity = 0;
let inputsYVelocity = 0;
let xVelocity = 0;
let yVelocity = 0;
let score = 0;
let currentSnakeColor = "yellow";
let coin = 0;
let gameOver = false;
let purchasedColors = new Set(["yellow"]);

// Lives system variables
let deaths = 0;
let totalScore = 0; // Persistent score across deaths
let totalCoins = 0; // Persistent coins across deaths
let currentRoundScore = 0; // Score for current round only
let highScore = 0; // Best score achieved in any single round
let newHighScore = false; // Flag for new high score achievement

// "You are dying" message variables
let dyingMessage = "";
let dyingMessageTimer = 0;

let currentLang = null;
let gameStarted = false;

// Size achievement tracking
let achievementsUnlocked = new Set();

// Black Mamba Mode tracking
let blackMambaActivated = false;

// Cheat code tracking
let cheatCodeSequence = [];
let cheatCodeUsed = false;
const cheatCodePattern = [38, 40, 37, 39, 38, 40]; // Up, Down, Left, Right, Up, Down
let cheatCodeActivated = false;
let miniSnakeDeath = false;


const translations = {
  en: {
    start: "Start Game",
    restart: "Restart",
    tryAgain: "Try Again",
    score: "Score",
    coins: "Coins",
    size: "Size",
    lives: "Lives",
    totalScore: "Total Score",
    highScore: "High Score",
    noMoney: "Not enough coins!",
    gameOverMsg: "ouch",
    youAreDone: "You are done!",
    newHighScore: "NEW HIGH SCORE!",
    confirmPurchase: "Confirm purchase?",
    backTo: (color) => `Switched to ${color}!`,
    youAreDying: "you are dying",
    buyLife: "Buy Life",
    maxLivesReached: "You already have 5 lives!",
    achievement: {
      medium: "",
      large: "Anaconda",
      giant: "Oroboros"
    },
    colors: {
      yellow: "Yellow",
      brown: "Brown",
      green: "Green",
      orange: "Orange",
      white: "White",
      purple: "Purple",
      cyan: "Cyan",
      pink: "Pink",
      red: "Red",
      blue: "Blue",
      black: "Black",
      gray: "Gray",
    }
  },
  es: {
    start: "Iniciar Juego",
    restart: "Reiniciar",
    tryAgain: "Intentar de Nuevo",
    score: "Puntaje",
    coins: "Plata",
    size: "Tamaño",
    lives: "Vidas",
    totalScore: "Puntaje Total",
    highScore: "Max Puntaje",
    noMoney: "¡No hay diñero!",
    gameOverMsg: "ay",
    youAreDone: "¡Ya terminaste!",
    newHighScore: "¡NUEVO RÉCORD!",
    confirmPurchase: "¿Confirmar compra?",
    backTo: (color) => `¡Cambiado a ${color}!`,
    youAreDying: "te estás muriendo",
    buyLife: "Comprar Vida",
    maxLivesReached: "¡Ya tienes 5 vidas!",
    achievement: {
      medium: " ",
      large: "¡ANACONDA! ",
      giant: "¡OROBOROS!"
    },
    colors: {
      yellow: "Amarilla",
      brown: "Marrón",
      green: "Verde",
      orange: "Naranja",
      white: "Blanca",
      purple: "Morada",
      cyan: "Cian",
      pink: "Rosa",
      red: "Roja",
      blue: "Azul",
      black: "Negra",
      gray: "Gris",
    }
  },
  zh: {
    start: "开始游戏",
    restart: "重新开始",
    tryAgain: "再试一次",
    score: "得分",
    coins: "金币",
    size: "蛇长度",
    lives: "生命",
    totalScore: "总分",
    highScore: "最高分",
    noMoney: "金币不足！",
    gameOverMsg: "死", 
    youAreDone: "你完了！",
    newHighScore: "新纪录！",
    confirmPurchase: "确认购买？",
    backTo: (color) => `切换到${color}！`,
    youAreDying: "你快死了",
    buyLife: "购买生命",
    maxLivesReached: "你活得夠多了",
    achievement: {
      medium: "",
      large: "蚺蛇🐍",
      giant: "銜尾蛇🐍"
    },
    colors: {
      yellow: "黄色",
      brown: "棕色",
      green: "绿色",
      orange: "橙色",
      white: "白色",
      purple: "紫色",
      cyan: "青色",
      pink: "粉色",
      red: "红色",
      blue: "蓝色",
      black: "黑色",
      gray: "灰色",
    }
  }
};

const colorMap = {
  yellow: { code: "#FFFF00", price: 0 },
  brown: { code: "#5C4033", price: 2 },
  green: { code: "#013220", price: 4 },
  orange: { code: "#cf651e", price: 4 },
  white: { code: "#ffffff", price: 2 },
  purple: { code: "#A020F0", price: 5 },
  cyan: { code: "#00FFFF", price: 7 },
  pink: { code: "#FFC0CB", price: 8 },
  red: { code: "#ff0000", price: 8 },
  blue: { code: "#000080", price: 2 },
  black: { code: "#0e1111", price: 2 },
  gray: { code: "#808080", price: 1 },
};

let gulpSound = new Audio("https://audio.jukehost.co.uk/MMuzqTKuVWoswVMIO18gtEVdULxa9feY");
gulpSound.preload = "auto";

let gameOverSound = new Audio("https://audio.jukehost.co.uk/ACFYJIIhcsTI0zYIWsTpH1DbRmHQPAcF");
gameOverSound.preload = "auto";

let coinSound = new Audio("https://audio.jukehost.co.uk/M55wIUN3dYnSmOl8EwySD6HZxBHla6Lr");
coinSound.preload = "auto";

// Achievement display variables
let achievementMessage = "";
let achievementTimer = 0;

// Language Selector UI
const langDiv = document.createElement("div");
langDiv.id = "langSelector";
langDiv.style.textAlign = "center";
langDiv.style.marginBottom = "10px";
langDiv.innerHTML = `
  <h3>Select Language / Selecciona idioma / 选择语言</h3>
  <button onclick="setLanguage('en')">🇺🇸 English</button>
  <button onclick="setLanguage('es')">🇲🇽 Español</button>
  <button onclick="setLanguage('zh')">🇨🇳 中文</button>
`;
document.body.insertBefore(langDiv, canvas);

function applyTranslations() {
  const t = translations[currentLang] || translations["en"];
  const restartButton = document.getElementById("restartButton");
  
  // Update button text based on deaths
  if (deaths >= 4) {
    restartButton.textContent = t.restart;
  } else {
    restartButton.textContent = t.tryAgain;
  }
}

function setLanguage(lang) {
  currentLang = lang;
  langDiv.style.display = "none";
  gameStarted = true;
  applyTranslations();
  renderStoreButtons();
  drawGame();
}

// Get HTML elements
const restartButton = document.getElementById("restartButton");
const storeDiv = document.getElementById("store");

function getColorLabel(color) {
  const t = translations[currentLang] || translations["en"];
  return t.colors?.[color] || color.charAt(0).toUpperCase() + color.slice(1);
}

function renderStoreButtons() {
  storeDiv.innerHTML = "";
  const t = translations[currentLang] || translations["en"];

  // Add life purchase button
  const lifeButton = document.createElement("button");
  lifeButton.textContent = `🐍 ${t.buyLife} (5 ${t.coins})`;
  lifeButton.style.backgroundColor = "#ff6b6b";
  lifeButton.style.color = "white";
  lifeButton.style.marginBottom = "5px";
  lifeButton.style.display = "block";
  lifeButton.onclick = () => buyLife();
  storeDiv.appendChild(lifeButton);

  // Add color buttons
  for (const [color, { code, price }] of Object.entries(colorMap)) {
    const button = document.createElement("button");
    button.textContent = `${getColorLabel(color)} (${price} ${t.coins})`;
    button.style.backgroundColor = code;
    button.style.color = getContrastTextColor(code);

    if (color === "cyan") {
      button.style.color = "black"; // force override for cyan
    }

    button.onclick = () => buySkin(color, price);
    storeDiv.appendChild(button);
  }
}

function buyLife() {
  const t = translations[currentLang] || translations["en"];
  const price = 5;

  const livesLeft = 5 - deaths;
  if (livesLeft >= 5) {
    alert(t.maxLivesReached || "You already have 5 lives!"); // Already full lives
    return;
  }

  const confirmMsg = `🐍 ${t.buyLife} - ${price} ${t.coins}\n${t.confirmPurchase || "Confirm purchase?"}`;
  const confirmed = confirm(confirmMsg);

  if (confirmed) {
    if (totalCoins >= price) {
      totalCoins -= price;
      deaths = Math.max(0, deaths - 1); // Gain a life
      drawScore();

      // Reset dying message if not on last life
      if (deaths < 4) {
        dyingMessage = "";
        dyingMessageTimer = 0;
      }
    } else {
      alert(t.noMoney);
    }
  }
}


function buySkin(color, price) {
  const t = translations[currentLang] || translations["en"];
  const translatedColor = getColorLabel(color);

  // If already purchased, just apply the color
  if (purchasedColors.has(color)) {
    currentSnakeColor = colorMap[color].code;
    alert(t.backTo(translatedColor));
    drawScore();
    return;
  }

  // Confirm before buying
  const confirmMsg = `${translatedColor} - ${price} ${t.coins}\n${t.confirmPurchase || "Confirm purchase?"}`;
  const confirmed = confirm(confirmMsg);

  if (confirmed) {
    // Use totalCoins for purchases
    if (totalCoins >= price) {
      totalCoins -= price;
      purchasedColors.add(color);
      currentSnakeColor = colorMap[color].code;
      drawScore();
    } else {
      alert(t.noMoney);
    }
  }
}

function getContrastTextColor(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  return luminance > 186 ? "black" : "white";
}

// Calculate size bonus for rewards
function calculateSizeBonus() {
  if (tailLength >= 30) return 3; // Extra bonus for very large snake
  if (tailLength >= 20) return 2; // Bonus for large snake
  if (tailLength >= 10) return 2; // Bonus for medium snake
  return 1; // Default coin reward
}

// Check cheat code sequence
function checkCheatCode(keyCode) {
  cheatCodeSequence.push(keyCode);
  
  // Keep only the last 8 keys
  if (cheatCodeSequence.length > cheatCodePattern.length) {
    cheatCodeSequence.shift();
  }
  
  // Check if the sequence matches the pattern
  if (cheatCodeSequence.length === cheatCodePattern.length) {
    let matches = true;
    for (let i = 0; i < cheatCodePattern.length; i++) {
      if (cheatCodeSequence[i] !== cheatCodePattern[i]) {
        matches = false;
        break;
      }
    }
    
    if (matches && !cheatCodeUsed) {
      activateCheatCode();
    }
  }
}

// Activate cheat code
function activateCheatCode() {
  if (tailLength < 4) {
    // Snake too small, kill it with Mini-snake message
    miniSnakeDeath = true;
    gameOver = true;
    console.log("Mini-snake death activated!");
    
    // Trigger the game over sequence immediately
    gameOverSound.currentTime = 0.6;
    gameOverSound.play();

    ctx.fillStyle = "red";
    ctx.font = "25px Verdana";
    ctx.fillText("Mini-snake", canvas.width / 3 - 20, canvas.height / 2);
    
    setTimeout(() => {
      clearScreen();
      restartButton.style.display = "block";
    }, 400);
    
    return;
  }
  
  // Apply cheat code effects
  totalCoins += 5; // Add to total coins
  tailLength -= 2;
  cheatCodeUsed = true;
  cheatCodeActivated = true;
  
  showAchievement("cheat activated");
  console.log("Cheat code activated! +5 coins, -2 size");
  // Clear the sequence
  cheatCodeSequence = [];
}

// Check for size achievements
function checkSizeAchievements() {
  const t = translations[currentLang] || translations["en"];
  
  // Check for Black Mamba Mode (no translation needed)
  if (tailLength === 25 && currentSnakeColor === "#0e1111" && !blackMambaActivated) {
    blackMambaActivated = true;
    showAchievement("BLACK MAMBA MODE");
    
    // Give bonus: 3 points in size and 2 extra coins
    tailLength += 3;
    totalCoins += 2; // Add to total coins
    
    console.log("BLACK MAMBA MODE ACTIVATED!");
  }
  
  if (tailLength === 10 && !achievementsUnlocked.has("medium")) {
    achievementsUnlocked.add("medium");
    showAchievement(t.achievement.medium);
  } else if (tailLength === 20 && !achievementsUnlocked.has("large")) {
    achievementsUnlocked.add("large");
    showAchievement(t.achievement.large);
  } else if (tailLength === 30 && !achievementsUnlocked.has("giant")) {
    achievementsUnlocked.add("giant");
    showAchievement(t.achievement.giant);
  }
}

// Show achievement message on screen
function showAchievement(message) {
  achievementMessage = message;
  achievementTimer = 10; // Show for about half a second
}

// Show "you are dying" message
function showDyingMessage() {
  const t = translations[currentLang] || translations["en"];
  dyingMessage = t.youAreDying;
  dyingMessageTimer = 10; // Show for about half a second
}

// Draw achievement message
function drawAchievement() {
  if (achievementTimer > 0) {
    ctx.fillStyle = "red";
    ctx.font = "16px Verdana";
    ctx.textAlign = "center";
    ctx.fillText(achievementMessage, canvas.width / 2, canvas.height / 2 - 30);
    ctx.textAlign = "left"; // Reset text alignment
    achievementTimer--;
  }
}

// Draw "you are dying" message
function drawDyingMessage() {
  if (dyingMessageTimer > 0) {
    ctx.fillStyle = "red";
    ctx.font = "14px Verdana";
    ctx.textAlign = "center";
    ctx.fillText(dyingMessage, canvas.width / 2, canvas.height / 2 + 50);
    ctx.textAlign = "left"; // Reset text alignment
    dyingMessageTimer--;
  }
}

// Get current snake size
function getSnakeSize() {
  return tailLength;
}

// Get actual visual snake parts count
function getActualSnakePartsCount() {
  return snakeParts.length;
}

// Try again function (for deaths 1-4)
function tryAgain() {
  gameOver = false;
  snakeParts = [];
  tailLength = 2;
  headX = 10;
  headY = 10;
  appleX = 5;
  appleY = 5;
  currentRoundScore = 0; // Reset current round score
  xVelocity = 0;
  yVelocity = 0;
  inputsXVelocity = 0;
  inputsYVelocity = 0;
  speed = 8;
  achievementsUnlocked.clear(); // Reset achievements for new round
  achievementMessage = ""; // Clear achievement message
  achievementTimer = 0; // Reset achievement timer
  dyingMessage = ""; // Clear dying message
  dyingMessageTimer = 0; // Reset dying message timer
  blackMambaActivated = false; // Reset Black Mamba mode
  cheatCodeUsed = false; // Reset cheat code usage
  cheatCodeSequence = []; // Clear cheat code sequence
  cheatCodeActivated = false; // Reset cheat code activation
  miniSnakeDeath = false; // Reset mini-snake death flag
  newHighScore = false; // Reset new high score flag
  restartButton.style.display = "none";
  drawGame();
}

// Full restart function (for 5th death)
function resetGame() {
  deaths = 0;
  totalScore = 0;
  totalCoins = 0;
  highScore = 0;
  newHighScore = false;
  tryAgain(); // Also reset the current round
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  const t = translations[currentLang] || translations["en"];
  const livesLeft = 5 - deaths;
  const snakeEmojis = "🐍".repeat(livesLeft);
  
  // First row
  ctx.fillText(`${t.score}: ${currentRoundScore}`, 10, 15);
  ctx.fillText(`${t.size}: ${tailLength}`, canvas.width / 2 - 30, 15);
  ctx.fillText(`${t.coins}: ${totalCoins}`, canvas.width - 80, 15);
  
  
  // Second row - Lives with snake emoji
  ctx.fillText(`${t.totalScore}: ${totalScore}`, 10, 30);
  ctx.fillText(snakeEmojis, canvas.width / 2 - 25, 30);
  ctx.fillText(`${t.highScore}: ${highScore}`, canvas.width - 80, 30);
}

// Enhanced speed calculation based on score and size
function updateGameSpeed() {
  let newSpeed = 8; // Base speed
  
  // Speed increase based on score
  if (currentRoundScore > 5) newSpeed = 10;
  if (currentRoundScore > 10) newSpeed = 12;
  
  // Additional speed increase based on snake size
  if (tailLength > 10) newSpeed += 2;
  if (tailLength > 20) newSpeed += 4;
  if (tailLength > 30) newSpeed += 6;
  
  // Reduce speed by 3 when on last life
  const livesLeft = 5 - deaths;
  if (livesLeft === 1) {
    newSpeed = Math.max(4, newSpeed - 4); // Ensure minimum speed of 4
    
    // Show "you are dying" message periodically
    if (Math.random() < 0.1) { // 10% chance each frame to show message
      showDyingMessage();
    }
  }
  
  speed = newSpeed;
}

function drawGame() {
  if (!gameStarted || gameOver) return;

  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  if (isGameOver()) {
    gameOverSound.play();
    return;
  }

  clearScreen();
  checkAppleCollision();
  checkSizeAchievements();
  drawApple();
  drawSnake();
  drawScore();
  drawAchievement();
  drawDyingMessage();

  updateGameSpeed();

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  if (yVelocity === 0 && xVelocity === 0) return false;

  if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
    gameOver = true;
  }

  for (let part of snakeParts) {
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    console.log("you are a dead snake");
    
    // Update scores and check for high score
    totalScore += currentRoundScore;
    if (currentRoundScore > highScore) {
      highScore = currentRoundScore;
      newHighScore = true;
    }
    
    deaths++;
    
    gameOverSound.currentTime = 0.6;
    gameOverSound.play();

    ctx.fillStyle = "red";
    ctx.font = "25px Verdana";
    
    // Check if it's a mini-snake death
    if (miniSnakeDeath) {
      ctx.fillText("Mini-snake", canvas.width / 3 - 20, canvas.height / 2);
    } else {
      const t = translations[currentLang] || translations["en"];
      if (deaths === 5) {
        ctx.fillText(t.youAreDone, canvas.width / 3 - 30, canvas.height / 2);
      } else {
        ctx.fillText(t.gameOverMsg, canvas.width / 3, canvas.height / 2);
      }
    }
    
    // Show new high score message if achieved
    if (newHighScore && !miniSnakeDeath) {
      ctx.fillStyle = "gold";
      ctx.font = "16px Verdana";
      const t = translations[currentLang] || translations["en"];
      ctx.fillText(t.newHighScore, canvas.width / 3 - 40, canvas.height / 2 + 30);
    }
    
    setTimeout(() => {
      clearScreen();
      applyTranslations(); // Update button text
      restartButton.style.display = "block";
    }, 1000);
  }

  return gameOver;
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = currentSnakeColor;
  for (let part of snakeParts) {
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY));
  while (snakeParts.length > tailLength) {
    snakeParts.shift();
  }

  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
  drawSnakeEyes();
}

function drawSnakeEyes() {
  const eyeSize = tileSize / 5;
  const eyeOffsetX = tileSize / 4;
  const eyeOffsetY = tileSize / 4;

  let eyeColor = "black";
  if (currentSnakeColor === "#0e1111") eyeColor = "white";
  else if (currentSnakeColor === "#ffffff") eyeColor = "red";

  ctx.fillStyle = eyeColor;

  ctx.beginPath();
  ctx.arc(headX * tileCount + eyeOffsetX, headY * tileCount + eyeOffsetY, eyeSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(headX * tileCount + tileSize - eyeOffsetX, headY * tileCount + eyeOffsetY, eyeSize, 0, Math.PI * 2);
  ctx.fill();
}

function changeSnakePosition() {
  headX += xVelocity;
  headY += yVelocity;
}

function drawApple() {
  ctx.fillStyle = "#39FF14";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    const sizeBonus = calculateSizeBonus();
    
    if (currentRoundScore % 3 === 0) {
      coinSound.currentTime = 0;
      coinSound.play();
      totalCoins += sizeBonus; // Add to total coins
    } else {
      gulpSound.currentTime = 2;
      gulpSound.play();
    }

    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    currentRoundScore++; // Increment current round score
    
    // Optional: Log snake size for debugging
    console.log(`Snake size: ${tailLength}, Actual parts: ${snakeParts.length}, Size bonus: ${sizeBonus}`);
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  // Check cheat code first
  checkCheatCode(event.keyCode);
  
  if (event.keyCode == 38 || event.keyCode == 87) {
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }
  if (event.keyCode == 40 || event.keyCode == 83) {
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }
  if (event.keyCode == 37 || event.keyCode == 65) {
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }
  if (event.keyCode == 39 || event.keyCode == 68) {
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}

// Update restart button event listener to handle both try again and restart
restartButton.addEventListener("click", () => {
  if (deaths >= 5) {
    resetGame(); // Full restart on 5th death
  } else {
    tryAgain(); // Try again for deaths 1-4
  }
});