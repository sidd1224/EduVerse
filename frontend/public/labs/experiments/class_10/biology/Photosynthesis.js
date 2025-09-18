new p5((p) => {
  let lightSlider, co2Slider, tempSlider;
  let bubbleTimer = 0;
  let bubbles = [];
  let font;

  p.preload = function () {
    font = p.loadFont('/labs/fonts/myFont.ttf');
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);

    lightSlider = p.createSlider(0, 100, 50);
    lightSlider.position(20, 20).style('width', `${Math.min(300, p.windowWidth * 0.3)}px`);

    co2Slider = p.createSlider(0, 100, 50);
    co2Slider.position(20, 60).style('width', `${Math.min(300, p.windowWidth * 0.3)}px`);

    tempSlider = p.createSlider(0, 50, 25);
    tempSlider.position(20, 100).style('width', `${Math.min(300, p.windowWidth * 0.3)}px`);

    p.textFont(font);
  };

  p.draw = function () {
    p.background(200, 230, 255);
    p.orbitControl();
    p.directionalLight(255, 255, 255, 0.5, 1, -0.5);
    p.ambientLight(100);

    drawBeaker();
    drawWater();
    drawPlant();
    drawBubbles();
    drawSunlight();
    drawLightRays();

    let bubbleRate = getPhotosynthesisRate();
    if (p.millis() - bubbleTimer > 1000 / bubbleRate) {
      let plantTipX = p.random(-40, 40);
      bubbles.push({ x: plantTipX, y: 50 });
      bubbleTimer = p.millis();
    }

    displayText2D(bubbleRate);
  };

  // --- helper functions ---
  function drawBeaker() {
    p.push();
    p.noFill();
    p.stroke(0);
    p.strokeWeight(2);
    p.translate(0, 100, 0);
    p.box(200, 200, 200);
    p.pop();
  }

  function drawWater() {
    p.push();
    p.fill(173, 216, 230, 150);
    p.noStroke();
    p.translate(0, 150, 0);
    p.box(200, 100, 200);
    p.pop();
  }

  function drawPlant() {
    p.push();
    p.translate(0, 180, 0);
    p.stroke(34, 139, 34);
    p.fill(34, 139, 34);

    let stemCount = 5;
    for (let i = -40; i <= 40; i += 80 / (stemCount - 1)) {
      p.push();
      p.translate(i, 0, 0);
      p.rotateZ(p.radians(Math.sin(p.frameCount * 0.02 + i) * 5));

      let height = 90;
      for (let j = 0; j < height; j += 10) {
        p.push();
        p.translate(0, -j, 0);
        p.cylinder(1.5, 10);
        p.strokeWeight(0.5);
        for (let angle = 0; angle < p.TWO_PI; angle += p.PI / 2) {
          let x = 10 * Math.cos(angle);
          let z = 10 * Math.sin(angle);
          p.line(0, 0, 0, x, -2, z);
        }
        p.pop();
      }
      p.pop();
    }
    p.pop();
  }

  function drawBubbles() {
    p.push();
    p.noStroke();
    p.fill(255);
    for (let i = bubbles.length - 1; i >= 0; i--) {
      let b = bubbles[i];
      p.push();
      p.translate(b.x, b.y, 0);
      p.sphere(5);
      p.pop();
      b.y -= 1;
      if (b.y < -50) bubbles.splice(i, 1);
    }
    p.pop();
  }

  function drawSunlight() {
    p.push();
    p.translate(250, -250, 0);
    p.ambientLight(255, 255, 100);
    p.fill(255, 255, 0);
    p.noStroke();
    p.sphere(30);

    for (let i = 0; i < 100; i++) {
      p.push();
      p.rotateY(p.random(p.TWO_PI));
      p.rotateX(p.random(p.TWO_PI));
      p.fill(255, 255, 0, 20);
      p.sphere(1 + p.random(10));
      p.pop();
    }
    p.pop();
  }

  function drawLightRays() {
    p.push();
    p.stroke(255, 255, 0, 100);
    for (let i = -80; i <= 80; i += 20) {
      p.line(250, -250, i, 0, 150, 0);
    }
    p.pop();
  }

  function getPhotosynthesisRate() {
    let light = lightSlider.value();
    let co2 = co2Slider.value();
    let temp = tempSlider.value();
    let tempFactor = 1 - Math.abs(temp - 25) / 25;
    return Math.max(0.5, (light * co2 * tempFactor) / 2000 * 10);
  }

  function displayText2D(bubbleRate) {
    p.resetMatrix();
    p.camera();
    p.fill(0);
    p.textSize(14);
    p.textFont(font);
    p.textAlign(p.LEFT);
    p.text(`Light Intensity: ${lightSlider.value()}%`, -590, -315);
    p.text(`CO₂ Level: ${co2Slider.value()}%`, -590, -272);
    p.text(`Temperature: ${tempSlider.value()} °C`, -590, -230);
    p.text(`= Bubble Rate: ${bubbleRate.toFixed(1)} bubbles/sec`, -590, -205);
    p.text("Photosynthesis Experiment - Hydrilla Oxygen Release", -175, 250);
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    let sliderWidth = Math.min(300, p.windowWidth * 0.3);
    lightSlider.style('width', `${sliderWidth}px`);
    co2Slider.style('width', `${sliderWidth}px`);
    tempSlider.style('width', `${sliderWidth}px`);
  };
});
