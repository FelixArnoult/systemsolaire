const tailleMercure = 4878;
//
// voyager1 = [0, 1, 12570];
// farthestOut = voyager1[2];
//
//

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

var mainStar;
var studiedSystem;

var loopState = 1;
var temps = 0;

var windowCentreX;
var windowCentreY;

//VARIABLES GUI
var scaleFactor = 3;
var distFactor = 12;
var zoom = 1;
var vitesseTemps = 1;
var scaleFactorMin = 1;
var scaleFactorMax = 10;

var vitesseT = {};
vitesseT['var'] = vitesseTemps;

var distFactorMin = 5;
var distFactorMax = 30;

var zoomMin = 0.1;
var zoomMax = 30;
var zoomStep = 0.1;

var vitesseTempsMin = 0;
var vitesseTempsMax = 365;
var vitesseTempsStep = 10;

var gui;

function preload() {
  initStudiedSystem(solarSystem);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  imageMode(CENTER);

  windowCentreX = windowWidth / 2;
  windowCentreY = windowHeight / 2;

  tempsComptr = setInterval(incrementTime, 100);
  // sliderRange(1, 100, 0.1);
  gui = createGui('slider-range-1');
  gui.addGlobals('scaleFactor', 'distFactor', 'zoom', 'vitesseTemps');

  vitesseT.watch('var', function(id, oldval, newval) {
    console.log('o.' + id + ' changed from ' + oldval + ' to ' + newval);
    return newval;
  });

}

function draw() {
  console.log(vitesseT['var']);
  background(20, 20, 20);
  mainStar.draw();
}

function incrementTime() {
  temps += vitesseTemps * loopState;
}

function initStudiedSystem(obj) {
  // background(20, 20, 20);
  var request = new XMLHttpRequest();
  request.open('GET', '/planete/' + obj["centre"], false); // `false` makes the request synchronous
  request.send(null);

  if (request.status === 200) {
    let jsonarr = JSON.parse(request.responseText);
    mainStar = new Astre(jsonarr['fields'], null);
    mainStar.loadPhoto();
  }

  obj['child'].map((item) => {
    fetch('/planete/' + item).then(function(response) {
      response.json().then(function(data) {
        var child = new Astre(data['fields'], null)
        mainStar.appendChild(child);
        child.loadPhoto();
      })
    })
  })
}

function mouseClicked() {
  mainStar.getChild().map(function(val) {
    if (val.isOn()) {
      var nom = val.getNom();
      var system = getSystemFromStar(nom);
      initStudiedSystem(system)
    }
  })
}

function getSystemFromStar(star) {
  listSystem.map(function(val) {
    if (val["centre"] === star)
      return val;
    }
  )
  throw "Non développé !"
}

function keyPressed() {
  switch (keyCode) {
    case 32:
      tooglePause();
      break;
    case 37: //fleche gauche
      windowCentreX--;
      break;
    case 38: //fleche haut
      windowCentreY++;
      break;
    case 39: //fleche droit
      windowCentreX++;
      break;
    case 40: //fleche bas
      windowCentreY--;
      break;
  }
}

function tooglePause() {
  if (!loopState)
    loopState = !loopState
  else
    loopState = !loopState
}

function Astre(properties, systemAssocie) {
  this.diametre = properties['diametre_a_l_equateur_km'] / tailleMercure * scaleFactor;
  this.distanceParent = properties['distance_moyenne_du_soleil_ua'];
  this.revolution = properties['periode_de_revolution_an'];
  this.nom = properties['empty'].toLowerCase();

  this.child = [];
  this.photo;
  this.posX;
  this.poxY;

  this.loadPhoto = function() {
    this.photo = loadImage('images/' + this.nom.toLowerCase() + '.png');
  }

  this.appendChild = function(child) {
    this.child.push(child);
  }

  this.getChild = function() {
    return this.child;
  }

  this.getNom = function() {
    return this.nom;
  }

  this.isOn = function() {
    return dist(mouseX, mouseY, this.posX, this.posY) < this.diametre / 2
  }

  this.draw = function() {

    strokeWeight(0);
    const pX = windowCentreX + (zoom * this.distanceParent * distFactor * cos(temps * (TWO_PI / (this.revolution * 3650))));
    const pY = windowCentreY + (zoom * this.distanceParent * distFactor * sin(temps * (TWO_PI / (this.revolution * 3650))));

    // ellipse(this.posX, this.posY, this.diametre, this.diametre);

    this.posX = constrain(pX, 0, windowWidth);
    this.posY = constrain(pY, 0, windowHeight);

    if (this.isOn()) {
      strokeWeight(3);
      stroke(255);
      ellipse(this.posX, this.posY, zoom * this.diametre * scaleFactor * 0.2 + 2);
    }
    image(this.photo, this.posX, this.posY, zoom * this.diametre * scaleFactor * 0.5, zoom * this.diametre * scaleFactor * 0.5);
    this.drawChild();
  }

  this.drawChild = function() {
    this.child.map(function(val) {
      val.draw();
    });
  }
}

windowResized = function() {
  resizeCanvas(windowWidth, windowHeight);
  windowCentreX = windowWidth / 2;
  windowCentreY = windowHeight / 2;
  // background(20, 20, 20);
  draw();
}
