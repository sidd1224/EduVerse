new p5((p) => {
  let dropletTimer = 0;
  let droplets = [];
  let dropletCount = 0;
  let font;
  let lightSlider;
  let resetButton;
  let stopButton;

  let graphData = [];
  let startTime;
  let isRunning = true;

  p.preload = () => {
    font = p.loadFont('/labs/fonts/myFont.ttf');
 // make sure this file is in public folder
  };

  p.setup = () => {
    p.createCanvas(1000, 600, p.WEBGL);

    lightSlider = p.createSlider(0, 100, 50);
    lightSlider.position(20, 20);
    lightSlider.style("width", "200px");

    resetButton = p.createButton("Reset");
    resetButton.position(230, 20);
    resetButton.mousePressed(resetSimulation);

    stopButton = p.createButton("Stop");
    stopButton.position(300, 20);
    stopButton.mousePressed(toggleSimulation);

    p.textFont(font);
    startTime = p.millis();
  };

  p.draw = () => {
    p.background(200, 230, 255);
    p.orbitControl();
    p.directionalLight(255, 255, 255, 0.5, 1, -0.5);
    p.ambientLight(100);

    let lightVal = lightSlider.value();

    drawSun(lightVal);
    drawSunRays(lightVal);
    drawGlassBox();

    drawPot();
    drawPlant();
    drawPlasticCover();
    drawDroplets();
    drawLabels();

    if (isRunning) {
      let rate1 = lightVal / 10;
      if (rate1 > 0 && p.millis() - dropletTimer > 1000 / rate1) {
        let x = p.random(-20, 20);
        let y = p.random(-80, -30);
        droplets.push({ x, y, z: p.random(-20, 20), size: 3 });
        dropletCount++;
        dropletTimer = p.millis();

        graphData.push({ time: p.millis() / 1000, count: dropletCount });
        if (graphData.length > 100) graphData.shift();
      }
    }

    displayText2D();
    drawGraph2D();
  };

  // ---------------- helpers ----------------

  function resetSimulation() {
    droplets = [];
    dropletCount = 0;
    graphData = [];
    startTime = p.millis();
    isRunning = true;
    stopButton.html("Stop");
  }

  function toggleSimulation() {
    isRunning = !isRunning;
    stopButton.html(isRunning ? "Stop" : "Resume");
  }

  function drawPot() {
    p.push();
    p.fill(139, 69, 19);
    p.noStroke();
    p.translate(0, 150, 0);
    p.cylinder(60, 40);
    p.pop();
  }

  function drawPlant() {
    p.push();
    p.translate(0, 80, 0);
    p.fill(34, 139, 34);
    p.cylinder(3, 60);

    let angleFactor = p.map(lightSlider.value(), 0, 100, 0, p.PI / 18);

    for (let i = 0; i < 6; i++) {
      p.push();
      let height = -i * 10;
      p.translate(0, height, 0);

      p.push();
      p.rotateZ(p.PI / 6 + angleFactor);
      p.translate(15, 0, 0);
      p.cylinder(1, 20);
      p.translate(0, -10, 0);
      drawLeaf();
      p.pop();

      p.push();
      p.rotateZ(-p.PI / 6 - angleFactor);
      p.translate(-15, 0, 0);
      p.cylinder(1, 20);
      p.translate(0, -10, 0);
      drawLeaf();
      p.pop();

      p.pop();
    }
    p.pop();
  }

  function drawLeaf() {
    p.fill(50, 205, 50);
    p.beginShape();
    p.vertex(0, 0, 0);
    p.bezierVertex(5, -5, 10, -10, 0, -20);
    p.bezierVertex(-10, -10, -5, -5, 0, 0);
    p.endShape(p.CLOSE);
  }

  function drawPlasticCover() {
    p.push();
    p.noFill();
    p.stroke(135, 206, 250, 100);
    p.strokeWeight(1);
    p.translate(0, 20, 0);
    p.scale(1, 1.5, 1);
    p.sphere(60, 24, 18);
    p.pop();
  }

  function drawDroplets() {
    p.push();
    p.fill(173, 216, 230, 180);
    p.noStroke();
    for (let i = droplets.length - 1; i >= 0; i--) {
      let d = droplets[i];
      p.push();
      p.translate(d.x, d.y, d.z);
      p.sphere(d.size);
      p.pop();
    }
    p.pop();
  }

  function drawLabels() {
    p.push();
    p.fill(0);
    p.textFont(font);
    p.textSize(12);
    p.textAlign(p.CENTER);

    p.push();
    p.translate(0, 180, 70);
    p.text("Pot", 0, 0);
    p.pop();

    p.push();
    p.translate(70, 60, 70);
    p.text("---------->Plant", 0, 0);
    p.pop();

    p.push();
    p.translate(-90, -40, 70);
    p.text("Plastic Cover --->", 0, 0);
    p.pop();

    p.push();
    p.translate(70, -45, 30);
    p.text("  --> Water Droplets", 0, 0);
    p.pop();

    p.pop();
  }

  function displayText2D() {
    p.resetMatrix();
    p.camera();
    p.fill(0);
    p.textSize(14);
    p.textFont(font);
    p.textAlign(p.LEFT);

    let lightVal = lightSlider.value();
    let elapsed = ((p.millis() - startTime) / 1000).toFixed(1);

    p.text("Light Intensity: " + lightVal + "%", -280, -240);
    p.text("Droplet Formation Rate: " + lightVal + "%", -280, -220);
    p.text("Total Droplets Formed: " + dropletCount, -280, -200);
    p.text("Time Elapsed: " + elapsed + "s", -280, -180);
    p.text("Experiment: Transpiration in Plants", -100, 240);
  }

  function drawGraph2D() {
    p.push();
    p.resetMatrix();
    p.camera();
    p.translate(300, 70);

    p.stroke(0);
    p.noFill();
    p.rect(0, 0, 300, 120);

    if (graphData.length > 1) {
      p.stroke(0, 100, 200);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < graphData.length; i++) {
        let x = p.map(i, 0, graphData.length - 1, 0, 300);
        let y = p.map(graphData[i].count, 0, Math.max(dropletCount, 1), 110, 10);
        p.vertex(x, y);
      }
      p.endShape();
    }

    p.fill(0);
    p.noStroke();
    p.textSize(12);
    p.text("Droplet Count Over Time", 60, -10);
    p.pop();
  }

  function drawSun(intensity) {
    p.push();
    let sunBrightness = p.map(intensity, 0, 100, 50, 255);
    p.translate(-300, -200, -300);
    p.fill(255, 255, 0, sunBrightness);
    p.noStroke();
    p.sphere(30);
    p.pop();
  }

  function drawSunRays(intensity) {
    p.push();
    p.stroke(255, 255, 0, p.map(intensity, 0, 100, 50, 100));
    p.strokeWeight(2);
    for (let i = -5; i <= 5; i++) {
      p.line(-300, -200, -300, i * 20, 100, 0);
    }
    p.pop();
  }

  function drawGlassBox() {
    p.push();
    p.noFill();
    p.stroke(100, 100, 255, 30);
    p.strokeWeight(1);
    p.box(300, 300, 300);
    p.pop();
  }
});
