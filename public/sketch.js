const tailleMercure = 4878;


const solarSystem = {
  centre: "soleil",
  child: [
    "mercure",
    "venus",
    "terre",
    "mars",
    "jupiter",
    "saturne",
    "uranus",
    "neptune"
  ]
};

const earthSystem = {
  centre: "terre",
  child: ["lune"]
}

const listSystem = [solarSystem, earthSystem];
var tempsComptr;
var oldTemps = 0;

var mainStar;
var studiedSystem;

var loopState = 1;
var temps = 0;

var windowCentreX;
var windowCentreY;

//VARIABLES GUI
var scaleFactor = 3;
var distFactor = 30;
var zoom = 1;
var vitesseTemps = 1;
var displayAllStar = true;

var scaleFactorMin = 1;
var scaleFactorMax = 10;

var distFactorMin = 5;
var distFactorMax = 60;

var zoomMin = 0.1;
var zoomMax = 30;
var zoomStep = 0.1;

var vitesseTempsMin = 0;
var vitesseTempsMax = 100;
var vitesseTempsStep = 1;

var gui;

function preload() {

  loadSoleil(solarSystem);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  imageMode(CENTER);

  windowCentreX = windowWidth / 2;
  windowCentreY = windowHeight / 2;

  // tempsComptr = setInterval(incrementTime, 100);
  incrementTime();
  // sliderRange(1, 100, 0.1);
  gui = createGui('slider-range-1');
  gui.addGlobals('scaleFactor', 'distFactor', 'zoom', 'vitesseTemps', 'displayAllStar');


}

function draw() {
  background(20, 20, 20);
  if (mainStar !== undefined)
    mainStar.draw();
}

function incrementTime() {
  temps += loopState;
  setTimeout(incrementTime, 1000 / vitesseTemps)
}

function loadSoleil(obj) {

  fetch('/planete/' + obj['centre']).then(function (response) {
    response.json().then(function (data) {
      mainStar = new Soleil(data['fields'])
      mainStar.loadPhoto();
    })
  })
  loadPlanets(obj);
}

function loadPlanets(obj) {
  obj['child'].map((item) => {
    fetch('/planete/' + item).then(function (response) {
      response.json().then(function (data) {
        var child = new Planete(data['fields'], null)
        mainStar.appendChild(child);
        child.loadPhoto();
      })
    })
  })
}

function mouseClicked() {
  mainStar.getChild().map(function (val) {
    if (val.isOn()) {
      var nom = val.getNom();
      var system = getSystemFromStar(nom);
      initStudiedSystem(system)
    }
  })
}

function getSystemFromStar(star) {
  listSystem.map(function (val) {
    if (val["centre"] === star)
      return val;
  })
  throw "Non développé !"
}

function keyPressed() {
  switch (keyCode) {
    case 32:
      tooglePause();
      break;
    case 37: //fleche gauche
      windowCentreX -= 5;
      break;
    case 38: //fleche haut
      windowCentreY += 5;
      break;
    case 39: //fleche droit
      windowCentreX += 5;
      break;
    case 40: //fleche bas
      windowCentreY -= 5;
      break;
  }
}

function tooglePause() {
  if (!loopState)
    loopState = !loopState
  else
    loopState = !loopState
}

var Astre = class {
  constructor(properties) {
    this.diametre = properties['diametre_a_l_equateur_km'] / tailleMercure * scaleFactor;
    this.nom = properties['empty'].toLowerCase();

    this.photo;
    this.posX;
    this.poxY;

    this.ready = false;

  }
  loadPhoto() {
    this.photo = loadImage('images/' + this.nom.toLowerCase() + '.png');
    this.setReady();
  }

  setReady() {
    this.ready = true;
  }

  getNom() {
    return this.nom;
  }

  isOn() {
    return dist(mouseX, mouseY, this.posX, this.posY) < this.diametre / 2
  }



}
var Planete = class extends Astre {
  constructor(properties, systemAssocie) {
    super(properties, systemAssocie);
    this.distanceParent = properties['distance_moyenne_du_soleil_ua'];
    this.revolution = properties['periode_de_revolution_an'];
    this.systemAssocie = systemAssocie;


  }

  draw() {
    if (!this.ready) {
      return 0;
    }
    strokeWeight(0);
    this.posX = windowCentreX + (zoom * this.distanceParent * distFactor * cos(temps * (TWO_PI / (this.revolution * 365))));
    this.posY = windowCentreY + (zoom * this.distanceParent * distFactor * sin(temps * (TWO_PI / (this.revolution * 365))));

    // ellipse(this.posX, this.posY, this.diametre, this.diametre);
    if (displayAllStar) {
      this.posX = constrain(this.posX, 0, windowWidth);
      this.posY = constrain(this.posY, 0, windowHeight);
    }

    if (this.isOn()) {
      strokeWeight(3);
      stroke(255);
      ellipse(this.posX, this.posY, zoom * this.diametre * scaleFactor * 0.2 + 2);
    }
    image(this.photo, this.posX, this.posY, zoom * this.diametre * scaleFactor * 0.5, zoom * this.diametre * scaleFactor * 0.5);
  }

}
var Soleil = class extends Astre {
  constructor(properties) {
    super(properties);
    this.child = [];
  }
  appendChild(child) {
    this.child.push(child);
  }

  getChild() {
    return this.child;
  }

  draw() {
    if (!this.ready) {
      return 0;
    }
    image(this.photo, windowCentreX, windowCentreY, windowWidth / 10, windowHeight / 10);
    this.drawChild();
  }

  drawChild() {
    this.child.map(function (val) {
      val.draw();
    });
  }
}

windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
  windowCentreX = windowWidth / 2;
  windowCentreY = windowHeight / 2;
  // background(20, 20, 20);
  draw();
}
