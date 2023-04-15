class Coin {
  constructor(_id, _scale, _display) {
    this.display = _display;
    this.id = _id;
    this.scale = _scale;
    this.pos = createVector(); // X & Z DEPENDENT ON # OF COINS AND PADDING SPACE - CALC AFTER OBJECT INIT
    // OLD Y-POS: Box Y-center = ((casket.height - 2*casket.lidHeight) / 2)
    this.rotationZ = random(-10, 10); // TILTS "NUMBER 1"-SYMBOL RANDOMLY
    this.angleInc = 0.1;
    this.angle = 45 + this.id*this.angleInc*1.5;
    this.angleCoeff = 0.5; // 0.5 = half the frequency
    this.yPositionSinMagnitude = mm2pix(2); // y pos sin mag/coefficient
    this.rotationSinMagnitude = mm2pix(1); // rotation mag/coeff
    this.pos.add(0, this.yPositionSinMagnitude*2, 0); // add sin max
  }
  
  
  
  draw() {
    let coin = this;
    
    let yPositionSin = Math.cos(coin.angle * coin.angleCoeff) * coin.yPositionSinMagnitude;
    
    let rotationSin1 = Math.sin(coin.angle) * coin.rotationSinMagnitude;
    let rotationSin2 = Math.sin(coin.angle + 90) * coin.rotationSinMagnitude; // ADD 90 DEGREES OFFSET COMP. TO rotSin1
    
    push();
    specularMaterial(49, 100, 55);
    shininess(50);
    noStroke();
    
    translate(coin.pos.x, coin.pos.y + yPositionSin, coin.pos.z);
    scale(coin.scale);
    rotateX(90);

    rotateX(rotationSin1);
    rotateY(rotationSin2);
    rotateZ(coin.rotationZ);
    
    model(coinModel);
    pop();

    coin.angle += coin.angleInc;
  }


  
  displayToggle() {
    if (coins.length) {
      if (coins[0].length) {
        coins[0][0].display = !coins[0][0].display;
        coin.display = coins[0][0].display;
        camNudge();
      }
    }
  }



}















