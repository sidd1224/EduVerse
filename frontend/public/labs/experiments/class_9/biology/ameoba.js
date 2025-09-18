new p5((p) => {
  let t = 0;
  let rBase = 80;
  let foodParticles = [];
  let amoebaPos;
  let font;
  let streamShift = 0;
  let showScene = false;
  let startButton, observeButton;
  let observing = false;

  p.preload = () => {
    font = p.loadFont("/labs/fonts/myFont.ttf");
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.textFont(font);
    p.textSize(14);
    amoebaPos = p.createVector(0, 0);

    for (let i = 0; i < 5; i++) {
      foodParticles.push(p.createVector(p.random(-150, 150), p.random(-150, 150)));
    }

    // ✅ Start Microscope button
    startButton = p.createButton("🔬 Start Microscope");
    startButton.position(20, 20);
    startButton.style("padding", "10px 20px");
    startButton.style("font-size", "16px");
    startButton.style("cursor", "pointer");
    startButton.mousePressed(() => {
      showScene = true;
      startButton.hide();
      observeButton.show();
    });

    // ✅ Observe Amoeba button (initially hidden)
    observeButton = p.createButton("👁️ Observe Amoeba");
    observeButton.position(180, 20);
    observeButton.style("padding", "10px 20px");
    observeButton.style("font-size", "16px");
    observeButton.style("cursor", "pointer");
    observeButton.hide();
    observeButton.mousePressed(() => {
      observing = !observing;
      observeButton.html(observing ? "🛑 Stop Observing" : "👁️ Observe Amoeba");
    });
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.background(0);
    p.orbitControl();
    p.lights();

    if (!showScene) {
      drawIntro();
      return;
    }

    drawMicroscopeScene();
  };

  function drawIntro() {
    p.resetMatrix();
    p.fill(255);
    p.textAlign(p.CENTER);
    p.textSize(Math.min(p.width, p.height) * 0.03);
    p.text("🧫 Amoeba Microscope Simulation", 0, -p.height / 2 + 100);
    p.textSize(Math.min(p.width, p.height) * 0.02);
    p.text("Click 'Start Microscope' to begin observing.", 0, -p.height / 2 + 140);
  }

  function drawMicroscopeScene() {
    drawFoodParticles();
    drawAmoeba();
    drawLabels();

    // microscope circular view
    p.resetMatrix();
    p.noFill();
    p.stroke(255);
    p.strokeWeight(4);
    p.ellipse(p.width / 2, p.height / 2, Math.min(p.width, p.height) * 0.5);

    t += 1;
    streamShift += 0.02;
  }

  function drawAmoeba() {
    let closestFood = null;
    let minDist = Infinity;
    for (let f of foodParticles) {
      let d = p.dist(amoebaPos.x, amoebaPos.y, f.x, f.y);
      if (d < minDist) {
        minDist = d;
        closestFood = f;
      }
    }

    if (closestFood && minDist > 20) {
      let dir = p5.Vector.sub(closestFood, amoebaPos).normalize().mult(0.5);
      amoebaPos.add(dir);
    } else if (closestFood && minDist <= 20) {
      foodParticles.splice(foodParticles.indexOf(closestFood), 1);
    }

    // Cytoplasmic streaming
    p.push();
    p.translate(amoebaPos.x, amoebaPos.y, -10);
    for (let i = 0; i < 500; i++) {
      let angle = p.noise(i * 0.1, streamShift) * p.TWO_PI * 2;
      let r = p.random(rBase * 0.6);
      let x = p.cos(angle) * r;
      let y = p.sin(angle) * r;
      p.stroke(150 + r, 200, 255, 40);
      p.point(x, y);
    }
    p.pop();

    // Outer amoeba body
    p.push();
    p.fill(100, 200, 220, observing ? 255 : 180);
    p.translate(amoebaPos.x, amoebaPos.y, -20);
    p.beginShape();
    let totalPoints = 40;
    for (let i = 0; i < totalPoints; i++) {
      let angle = p.map(i, 0, totalPoints, 0, p.TWO_PI);
      let r = rBase + 10 * p.sin(t * 0.05 + i * 0.8);
      let x = r * p.cos(angle);
      let y = r * p.sin(angle);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
    p.pop();

    // Nucleus
    p.push();
    p.fill(150, 100, 200, 220);
    p.translate(amoebaPos.x, amoebaPos.y, 10);
    p.sphere(15);
    p.pop();

    // Vacuole
    p.push();
    p.fill(255, 255, 200, 180);
    p.translate(amoebaPos.x + 25, amoebaPos.y + 15, 5);
    p.sphere(10);
    p.pop();
  }

  function drawFoodParticles() {
    for (let f of foodParticles) {
      p.push();
      p.translate(f.x, f.y, 0);
      p.fill(255, 150, 0);
      p.sphere(6);
      p.pop();
    }
  }

  function drawLabels() {
    p.resetMatrix();
    p.fill(255);
    p.textAlign(p.LEFT);
    p.textSize(Math.min(p.width, p.height) * 0.015);

    let x = -260;
    let y = -260;
    let gap = 20;

    p.text("🔬 Amoeba Under Microscope", x, y);
    p.text("🧠 Nucleus", x, y + gap);
    p.text("💧 Vacuole", x, y + gap * 2);
    p.text("🍕 Food Particle", x, y + gap * 3);
    p.text("🌊 Cytoplasmic Streaming", x, y + gap * 4);
    p.text("🦶 Pseudopodia Motion", x, y + gap * 5);
  }
});
