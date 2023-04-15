class Ruler {
  constructor() {
    this.display = false;
    
    // DIMENSIONAL
    // Position ruler 5mm in front of casket bottom south west corner
    this.pos = this.calcPos();
    this.scale = mm2pix(-1); // Invert scale
    this.yRotation = 180;
    
    // VISUALS
    this.structure = {
      color: [250, 40, 30, 25],
      shininess: 100,
      model: rulerModelStructure
    }
    this.markings = {
      strokeWeight: SCL*2,
      color: 0,
      model: rulerModelMarkings
    }
    this.numbers = {
      pos: createVector(mm2pix(0), mm2pix(9), mm2pix(1.6)),
      xRotation: 98,
      spacing: mm2pix(10),
      textSize: mm2pix(4.9),
      align: CENTER,
      color: 0,
    }
  }
  
  
  
  update() {
    this.pos = this.calcPos();
  }
  
  
  
  calcPos() {
    return casket.locations.outerWestBottomSouth.copy().add(
        0, 0, mm2pix(5)
      );
  }
  
  
  
  draw() {
    
    push(); // *EVERYTHING RULER*

    translate(this.pos);

    // Draw the 2 ruler object models
    push();
    rotateY(this.yRotation);
    scale(this.scale);
    // Structure model
    noStroke();
    specularMaterial(this.structure.color);
    shininess(this.structure.shininess);
    model(this.structure.model);
    // Measurement line markings model
    stroke(this.markings.color);
    strokeWeight(this.markings.strokeWeight);
    fill(this.markings.color);
    model(this.markings.model);
    pop();

    // Number markings
    push();
    textSize(this.numbers.textSize);
    textAlign(this.numbers.align);
    fill(this.numbers.color);
    rotateX(this.numbers.xRotation);
    translate(this.numbers.pos);
    for (let i = 0; i < 21; i++) {
      text(i, 0, 0);
      translate(this.numbers.spacing, 0, 0);
    }
    pop();

    pop(); // *EVERYTHING RULER*
    
  }
  
  
  
  displayToggle() {
    ruler.display = !ruler.display;
    camNudge();
  }
  
}















