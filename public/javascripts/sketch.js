const scaleFactor = 3;
const distFactor = 0.5;
//
// voyager1 = [0, 1, 12570];
// farthestOut = voyager1[2];
//
//

var main;
var studiedSystem;
var orbiter = []
var vitesseTemps = 1;
var sliderTemps;

function setup() {
  // const sunCarac = [285.1 * scaleFactor / 10, 0, 1, color(240, 195, 0)]; //radius, avg. dist from sun, periode de revolution, color
  // const mercury = [1 * scaleFactor, 45.49, 0.241, color(110, 11, 20)]; //xpos, radius, avg. dist from sun
  // const venus = [2.4806 * scaleFactor, 71.85, 0.615, color(211, 113, 0)]; //xpos, radius, avg. dist from sun
  // const earth = [2.6099 * scaleFactor, 101.6, 1, color(127, 208, 255)]; //xpos, radius, avg. dist from sun
  // const mars = [1.388 * scaleFactor, 150.4, 1.881, color(231, 133, 0)]; //xpos, radius, avg. dist from sun
  // const jupiter = [28.353 * scaleFactor, 512.2, 11.862, color(188, 136, 84)]; //xpos, radius, avg. dist from sun
  // const saturn = [23.393 * scaleFactor, 985.2, 29.452, color(214, 163, 61)]; //xpos, radius, avg. dist from sun
  // const uranus = [10.356 * scaleFactor, 2007, 84.323, color(127, 208, 255)]; //xpos, radius, avg. dist from sun
  // const neptune = [10.094 * scaleFactor, 3004, 164.882, color(100, 100, 255)]; //xpos, radius, avg. dist from sun

  const sun = [285.1 * scaleFactor / 10, 0, 1, color(240, 195, 0)]; //radius, avg. dist from sun, periode de revolution, color
  const mercury = [1 * scaleFactor, distFactor * 45.49, 0.241, color(110, 11, 20)]; //radius, avg. dist from sun
  const venus = [2.4806 * scaleFactor, distFactor * 71.85, 0.615, color(211, 113, 0)]; //radius, avg. dist from sun
  const earth = [2.6099 * scaleFactor, distFactor * 101.6, 1, color(127, 208, 255)]; //radius, avg. dist from sun
  const mars = [1.388 * scaleFactor, distFactor * 150.4, 1.881, color(231, 133, 0)]; //radius, avg. dist from sun
  const jupiter = [28.353 * scaleFactor, distFactor * 512.2, 11.862, color(188, 136, 84)]; //radius, avg. dist from sun
  const saturn = [23.393 * scaleFactor, distFactor * 985.2, 29.452, color(214, 163, 61)]; //radius, avg. dist from sun
  const uranus = [10.356 * scaleFactor, distFactor * 2007, 84.323, color(127, 208, 255)]; //radius, avg. dist from sun
  const neptune = [10.094 * scaleFactor, distFactor * 3004, 164.882, color(100, 100, 255)]; //radius, avg. dist from sun

  const moon = [1.5 * scaleFactor, distFactor * 80, 0.02, color(255, 208, 255)]

  const solarSystem = {
    centre: sun,
    child: [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune]
  };

  const earthSystem = {
    centre: earth,
    child: [moon]
  }

  studiedSystem = solarSystem

  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  main = new Astre(studiedSystem.centre, solarSystem);
  main.setCenter();

  studiedSystem.child.map(function(val) {
    orbiter.push(new Astre(val, earthSystem));
    main.appendChild(orbiter[orbiter.length - 1])

  })


  sliderTemps = createSlider(0, 2, 0, 0.02);
  sliderTemps.position(10, 10);
  sliderTemps.style('width', '80px');

}

function draw() {
  background(20, 20, 20);
  vitesseTemps = sliderTemps.value();
  main.draw();
}

function mouseClicked() {
  orbiter.map(function(val) {
    if (val.isOn()) {
      val.becomeCenter();

    }
  })
}


function Astre(arrayCarac, systemAssocie) {
  this.diametre = arrayCarac[0];
  this.distanceParent = arrayCarac[1];
  this.revolution = arrayCarac[2];
  this.couleur = arrayCarac[3];
  this.systemAssocie = systemAssocie;
  this.child = [];

  this.posX;
  this.poxY;

  this.setCenter = function() {
    this.distanceParent = 0;
  }

  this.appendChild = function(child) {
    this.child.push(child);
  }

  this.isOn = function() {
    return dist(mouseX, mouseY, this.posX, this.posY) < this.diametre / 2
  }

  this.draw = function() {
    strokeWeight(0);
    fill(this.couleur);
    this.posX = windowWidth / 2 + this.distanceParent * cos((millis() * vitesseTemps) * (TWO_PI / (1000 * this.revolution)))
    this.posY = windowHeight / 2 + this.distanceParent * sin((millis() * vitesseTemps) * (TWO_PI / (1000 * this.revolution)))
    ellipse(this.posX, this.posY, this.diametre, this.diametre);
    if (this.isOn()) {
      strokeWeight(3);
      stroke(255);
      ellipse(this.posX, this.posY, this.diametre, this.diametre);

    }
    this.drawChild();
  }

  this.drawChild = function() {
    this.child.map(function(val) {
      val.draw();
    });
  }

  this.becomeCenter = function() {
    studiedSystem = this.systemAssocie
    main = new Astre(studiedSystem.centre, this.systemAssocie);
    main.setCenter();

    studiedSystem.child.map(function(val) {
      orbiter.push(new Astre(val, null));
      console.log("bonjour");
      main.appendChild(orbiter[orbiter.length - 1])
    })
  }
}


windowResized = function() {
  resizeCanvas(windowWidth, windowHeight);
  background(20, 20, 20);
  draw();
  // easycam.setViewport([0,0,sketch.windowWidth, sketch.windowHeight]);
}
