// sketch.js - purpose and description here
// Author: Marcus Williamson
// Date: 4/19/24

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  console.log(canvasContainer.width());
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

/* exported setup, draw */
let seed = 0;
const canvasHeight = 200;
const canvasWidth = 400;
const horizonLevel = canvasHeight * 3/5;

// Saturn variables
const saturnX = canvasWidth * 5/7;
const saturnDiameter = canvasHeight/1.3;
const ringCount = 30;
const ringRange = 15;
const ringMoveRange = 3;
const ringMoveRate = 0.6;
const ringOffset = [];
let ringsInitialized = false;

// Star variables
const starCount = 300;
const twinkleAmount = 200;
const twinkleRate = 5;
const darkestStar = 90;
let twinkleOffset = [];
let individualTwinkleRate = [];
let starsInitialized = false;

// Moon terrain variables
let terrain = [];
const terrainLeftBound = 0;
const terrainRightBound = canvasWidth;
const terrainTop = horizonLevel;
const terrainBottom = canvasHeight;
const terrainThreshold = 0.5;
const noiseLevel = 1;
const noiseScale = 0.015;
const scrunchAmount = 3;

function setup() {
  generateTerrain();

  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvas-container");
  
  // $(window).resize(function() {
  //   resizeScreen();
  // });
  //resizeScreen();
  generateNew();
  frameRate(60)
}

function generateNew() {
  seed++;
  generateTerrain();
}

// Generate ellipse at an angle (for Saturn rings)
function generateEllipse(cx, cy, rx, ry, angle, numPoints) {
  noFill();
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < numPoints; i++) {
    let t = (i / numPoints) * TWO_PI;
    let x = cx + rx * cos(t) * cos(angle) - ry * sin(t) * sin(angle);
    let y = cy + rx * cos(t) * sin(angle) + ry * sin(t) * cos(angle);
    let distance = dist(x, y, saturnX, horizonLevel) - saturnDiameter/2;
    if (y <= horizonLevel + 10 && (t < PI && distance > 0 || t > PI)) {
      vertex(x, y);
    }

    endShape();
  }
}

function generateTerrain() {
  // Terrain
  // Set the noise level and scale.
  noiseSeed(seed);

  // Iterate from top to bottom.
  for (let y = 0; y < terrainBottom - terrainTop; y += 1) {
    terrain[y] = []
    // Iterate from left to right.
    for (let x = 0; x < terrainRightBound - terrainLeftBound; x += 1) {
      // Scale the input coordinates.
      let nx = noiseScale * x;
      let ny = noiseScale * y;

      // Compute the noise value.
      let c = noiseLevel * noise(nx, scrunchAmount * ny);
      terrain[y][x] = c;
    }
  }
}

function draw() {
	randomSeed(seed);
  background('#20262f');

  // Stars
  for (let i = 0; i < starCount; i++) {
    let starX = width * random();
    let starY = horizonLevel * random();
    let fadeAmount = random() * (255 - darkestStar);
    
    if (!starsInitialized) {
      twinkleOffset[i] = random(-PI, PI);
      individualTwinkleRate[i] = random(0.5, 1);
    }
    let twinkle = twinkleAmount * sin(twinkleOffset[i] + (frameCount / 30 * twinkleRate * individualTwinkleRate[i]));
    let starColor = 255 - fadeAmount + twinkle;
    if(starColor < darkestStar) {
      starColor = darkestStar;
    }
    fill(starColor);
    stroke(starColor[0], starColor[1], starColor[2]);
    point(starX, starY);
  }
  starsInitialized = true;
  
  // Saturn body
  fill('#ddc7b6');
  stroke('#ddc7b6')
  circle(saturnX, horizonLevel, saturnDiameter);
  
  // Draw the rings of Saturn 
  for (let i = 0; i < ringCount; i++) {
    if (!ringsInitialized) {
      ringOffset[i] = random(-PI, PI);
    }
    let fadeAmount = random() * 20;
    let ringColor = [85 + fadeAmount, 80 + fadeAmount, 80 + fadeAmount];
    stroke(ringColor[0], ringColor[1], ringColor[2]);
    
    let ringBasePos = saturnX - saturnDiameter/10 + random() * ringRange;
    let moveAmount = ringMoveRange * sin(frameCount/30 + ringOffset[i] * ringMoveRate);
    generateEllipse(ringBasePos + moveAmount, horizonLevel, width * 3/8, height/4, PI*5/8, 130);
  }
  
  // Moon surface
  stroke('#315f6d');
  fill('#315f6d');
  line(0, horizonLevel, width, horizonLevel);
  rect(0, horizonLevel, width, height/2);
  
  // Terrain (read from terrain generated in generateNew)
  for (let y = 0; y < terrainBottom - terrainTop; y += 1) {
    for (let x = 0; x < terrainRightBound - terrainLeftBound; x += 1) {
      let val = terrain[y][x];
      stroke('#162633');
      
      if (val > terrainThreshold) {
        point(terrainLeftBound + x, terrainTop + y);
      }
    }
  }
}

document.getElementById("reimagine").addEventListener("click", generateNew);
