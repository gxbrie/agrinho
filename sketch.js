let farmerX = 50; // Posição inicial do fazendeiro no eixo X
let farmerY = 300; // Posição inicial do fazendeiro no eixo Y
let seeds = []; // Array para armazenar as sementes
let watered = 0; // Contador de sementes regadas
let speed = 10; // Velocidade de movimentação do fazendeiro
let totalSeeds = 20; // Número total de sementes a serem regadas
let timeLimit = 30 * 1000; // Limite de tempo (30 segundos em milissegundos)
let startTime; // Momento em que o jogo começa
let gameOver = false; // Flag de game over
let gameWon = false; // Flag de vitória
let minDistance = 40; // Distância mínima entre as sementes

function setup() {
  createCanvas(600, 400);
  startTime = millis(); // Marca o tempo de início do jogo
  background(100, 200, 100); // Fundo do jardim
}

function draw() {
  if (gameOver) {
    gameOverScreen();
    return;
  }
  
  if (gameWon) {
    winScreen();
    return;
  }

  background(100, 200, 100); // Atualiza o fundo

  // Desenha o fazendeiro
  drawFarmer(farmerX, farmerY);

  // Desenha as sementes
  for (let i = 0; i < seeds.length; i++) {
    drawSeed(seeds[i]);
  }

  // Desenha a barra de progresso
  drawProgressBar();

  // Verifica se o tempo acabou
  if (millis() - startTime >= timeLimit) {
    gameOver = true; // Se o tempo esgotar, você perde
  }
}

// Função para desenhar o fazendeiro
function drawFarmer(x, y) {
  fill(255, 0, 0);
  rect(x, y - 20, 20, 40); // Corpo do fazendeiro
  fill(255, 224, 189);
  ellipse(x + 10, y - 30, 20, 20); // Cabeça do fazendeiro
}

// Função para desenhar uma semente
function drawSeed(seed) {
  if (seed.watered) {
    // Se regada, a semente cresce
    fill(34, 139, 34); // Verde para planta
    ellipse(seed.x, seed.y, seed.size, seed.size); // Planta maior
  } else {
    // Se não regada, ela é uma semente pequena
    fill(139, 69, 19); // Marrom para a semente
    ellipse(seed.x, seed.y, seed.size, seed.size); // Tamanho pequeno da semente
  }
}

// Função para desenhar a barra de progresso
function drawProgressBar() {
  // Barra de fundo
  fill(200);
  rect(50, 20, 500, 30);

  // Barra de progresso
  let progress = map(watered, 0, totalSeeds, 0, 500);
  fill(34, 139, 34);
  rect(50, 20, progress, 30);

  // Texto com o número de sementes regadas
  fill(0);
  textSize(16);
  text("Sementes Regadas: " + watered + " / " + totalSeeds, 50, 70);
}

// Tela de Game Over
function gameOverScreen() {
  background(255, 0, 0); // Fundo vermelho
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Você Perdeu!", width / 2, height / 2);
}

// Tela de Vitória
function winScreen() {
  background(0, 255, 0); // Fundo verde
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Parabéns! Você Regou Todas as Sementes!", width / 2, height / 2);
}

// Função para plantar uma semente no local do fazendeiro
function keyPressed() {
  // Movimenta o fazendeiro com as teclas W, A, S, D
  if (key === 'W' || key === 'w') {
    farmerY -= speed; // Movimenta para cima
  } else if (key === 'S' || key === 's') {
    farmerY += speed; // Movimenta para baixo
  } else if (key === 'A' || key === 'a') {
    farmerX -= speed; // Movimenta para a esquerda
  } else if (key === 'D' || key === 'd') {
    farmerX += speed; // Movimenta para a direita
  }
  
  // Planta uma semente quando a tecla 'I' for pressionada
  if (key === 'I' || key === 'i') {
    if (seeds.length < totalSeeds) {
      // Verifica se a semente está suficientemente distante de outras
      let canPlant = true;
      for (let i = 0; i < seeds.length; i++) {
        let d = dist(farmerX, farmerY, seeds[i].x, seeds[i].y);
        if (d < minDistance) {
          canPlant = false; // A semente não pode ser plantada muito perto de outra
          break;
        }
      }

      if (canPlant) {
        let seed = {
          x: farmerX,
          y: farmerY,
          watered: false, // Semente ainda não regada
          size: 10 // Tamanho inicial da semente
        };
        seeds.push(seed); // Adiciona a semente na lista de sementes
      }
    }
  }
  
  // Regar as sementes quando a tecla 'P' for pressionada
  if (key === 'P' || key === 'p') {
    // Verifica se o fazendeiro está perto de alguma semente para regá-la
    for (let i = 0; i < seeds.length; i++) {
      let d = dist(farmerX, farmerY, seeds[i].x, seeds[i].y);
      if (d < 20 && !seeds[i].watered) { // A semente deve estar dentro de um alcance de 20 pixels
        seeds[i].watered = true;
        seeds[i].size = 30; // A planta cresce
        watered++;
        
        // Se todas as sementes forem regadas, você ganha
        if (watered === totalSeeds) {
          gameWon = true;
        }
      }
    }
  }
}
