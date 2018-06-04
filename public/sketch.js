const scaleFactor = 3;
const distFactor = 12;
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

let ready=false;
let mainStar;
let studiedSystem;
let orbiter = []
let vitesseTemps = 1;
let sliderTemps;
let loopState = true;
let temps = 0;
let tempsComptr;

function preload() {
  initStudiedSystem(solarSystem);

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  imageMode(CENTER);

  sliderTemps = createSlider(0, 1, 1, 0.02);
  sliderTemps.position(10, 10);
  sliderTemps.style('width', '80px');

  tempsComptr = setInterval(incrementTime, 1000);

}

function draw() {
  background(20, 20, 20);
  vitesseTemps = sliderTemps.value();
  // try {
  mainStar.draw();
  // } catch (e) {}
}

function incrementTime() {
  temps++;
  // console.log(temps);
}


function initStudiedSystem(obj) {
  var request = new XMLHttpRequest();
  request.open('GET', '/planete/' + obj["centre"], false);  // `false` makes the request synchronous
  request.send(null);

  if (request.status === 200) {
    let jsonarr = JSON.parse(request.responseText);
        mainStar = new Astre(jsonarr['fields'], null);
  }

  obj['child'].map((item) => {
    fetch('/planete/' + item).then(function(response) {
      response.json().then(function(data) {
        let child = new Astre(data['fields'], null)
        mainStar.appendChild(child);
        child.loadImage();
      })
    })
  })


}

function mouseClicked() {
  orbiter.map(function(val) {
    if (val.isOn()) {
      val.becomeCenter();

    }
  })
}

function keyPressed() {
  if (keyCode === 32) {
    if (!loopState) {
      noLoop();
      loopState = !loopState
    } else {
      loop();
      loopState = !loopState
    }
  }
}

function Astre(properties, systemAssocie) {
  this.diametre = properties['diametre_a_l_equateur_km'];
  console.log(this.diametre);
  this.distanceParent = properties['distance_moyenne_du_soleil_ua'];
  this.revolution = properties['periode_de_revolution_an'];
  this.nom = properties['empty'];

  // this.couleur = arrayCarac[3];

  // this.systemAssocie = systemAssocie;
  this.child = [];

  this.posX;
  this.poxY;

  this.loadImage = function() {
    this.photo = loadImage('images/' + this.nom.toLowerCase() + '.png');
  }


  this.appendChild = function(child) {
    this.child.push(child);
  }

  this.isOn = function() {
    return dist(mouseX, mouseY, this.posX, this.posY) < this.diametre / 2
  }

  this.draw = function() {
    strokeWeight(0);
    // fill(this.couleur);
    const pX = windowWidth / 2 + this.distanceParent * cos((millis() * vitesseTemps) * (TWO_PI / (1000 * this.revolution)))
    const pY = windowHeight / 2 + this.distanceParent * sin((millis() * vitesseTemps) * (TWO_PI / (1000 * this.revolution)))

    this.posX = constrain(pX, 0, windowWidth);
    this.posY = constrain(pY, 0, windowHeight);
    // ellipse(this.posX, this.posY, this.diametre, this.diametre);
    if (this.isOn()) {
      strokeWeight(3);
      stroke(255);
      ellipse(this.posX, this.posY, this.diametre + 2, this.diametre + 2);
    }
    image(this.photo, this.posX, this.posY, this.diametre, this.diametre);
    this.drawChild();
  }

  this.drawChild = function() {
    this.child.map(function(val) {
      val.draw();
    });
  }

  this.preloadChild = function() {
    this.child.map(function(val) {
      val.preload();
    });
  }

  this.becomeCenter = function() {
    studiedSystem = this.systemAssocie
    main = new Astre(studiedSystem.centre, this.systemAssocie);
    main.setCenter();

    studiedSystem.child.map(function(val) {
      orbiter.push(new Astre(val, null));
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
