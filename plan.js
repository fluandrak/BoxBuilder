class Plan {
  constructor(_pos) {
    
    // OVERALL BUILD
    this.pos = _pos;
    this.posScreenCenterOffset = null;
    
    this.parts = [];
    
    // VISUAL
    this.part = {
      colors: [],
      edgeColor: 0,
      edgeWeight: mm2pix(0.09),
    }
    
    this.lights = {
      ambient: { mag: 100 },
      directional: [
        {
          hsb: { h: 50, s: 50, b: 0 },
          coord: { x: 0, y: mm2pix(casket.height*2.5), z: -mm2pix(casket.width) },
        },
        {
          hsb: { h: 0, s: 0, b: 40 },
          coord: { x: 0, y: -height*2.5, z: -mm2pix(casket.width) },
        }
      ]
    }
    
    this.rendering = {
      parts: {
        padding: mm2pix(20),
      },
    }
    
    this.locations = {
      bottomPart: createVector(0, 0, 0),
    }
    
    this.ongoingMovement = false;
    
    this.updateBuild();
  }
  
  
  
  updateBuild() {
    this.makeParts();
    this.setPartColor();
    
    // // MOVE PLAN A BIT TO THE LEFT TO MAKE ROOM FOR RIGHTMOST MEASUREMENTS
    // let posX = casket.width * casket.depth / mm2pix(50) / 18; // OLD
    // let posX = -casket.width * casket.depth / mm2pix(50) / 40; // OLD
    // this.pos.x = posX;

    // this.updateLocations();
    // casket.updateBuild();
  }
  
  
  
  update() {
    let plan = this;
    
    let ongoingMovement = false;
    for (let part of plan.parts) {
      part.update();
      if (part.moving) ongoingMovement = true;
    }
    plan.ongoingMovement = ongoingMovement;
  }
  

  
  draw() {
    let plan = this;
    
    plan.drawLights();
    
    shininess(2);
    stroke(this.part.edgeColor);
    strokeWeight(this.part.edgeWeight);
    
    // CENTER & ADJUST VIEW
    translate(plan.pos.x, -plan.parts[0].height*0.3);
    // translate(0, -plan.parts[0].height*0.3);
    // translate(0, -plan.measureObjectsTotalHeight / 2); // ****UNUSED****

    push();
    for (let part of plan.parts) {
      specularMaterial(part.color);
      part.draw();
    }
    pop();
  }
  
  
  
  drawLights() {
    ambientLight(this.lights.ambient.mag);
    for (let light of this.lights.directional) {
      let h = light.hsb;
      let c = light.coord;
      directionalLight(h.h, h.s, h.b, c.x, c.y, c.z);
    }
  }

  
  
  makeParts() {
    let plan = this;
    
    let uncutHeightMm; // HEIGHT PRE CUTTING APART BOX/LID
    if (casket.lid.display) {
      uncutHeightMm = casket.heightMm + casket.joint.kerfSizeMm*2;
    } else {
      uncutHeightMm = casket.box.heightMm;
    }
    
    let partsSizes = [
      // [NORTH]
      [casket.widthMm, // Width
       uncutHeightMm, // Height
       casket.thicknessMm], // Depth
      // [WEST]
      [casket.depthMm, 
       uncutHeightMm,
       casket.thicknessMm],
      // [BOTTOM]
      [casket.widthMm - casket.thicknessMm,
       casket.depthMm - casket.thicknessMm,
       casket.topBottomThicknessMm]
    ];

    let partIds = ['north', 'west', 'bottom'];

    // let prevPartsSizes = [];
    // if (plan.parts[0]) {
    //   for (let i = 0; i < plan.parts.length; i++) {
    //     let prevPart = plan.parts[i];
    //     let w = prevPart.width;
    //     let h = prevPart.height;
    //     let d = prevPart.depth;
    //     prevPartsSizes.push([]);
    //     prevPartsSizes[i] = [w, h, d];
    //   }
    // }
    
    let prevPartsPos = [];
    if (plan.parts[0]) {
      for (let i = 0; i < plan.parts.length; i++) {
        let prevPart = plan.parts[i];
        let pos = prevPart.pos;
        prevPartsPos.push(pos);
      }
    }

    plan.parts = [];
    this.compileParts(partsSizes, partIds, prevPartsPos);
    // this.compileParts(partsSizes, partIds);
    // this.compileParts(partsSizes, partIds, prevPartsSizes);
  }

  
  
  compileParts(partsSizes, partIds, prevPartsPos) {
    for (let i = 0; i < partsSizes.length; i++) {
      let pw = null;
      let ph = null;
      let pd = null;
      let w = partsSizes[i][0]; // PART WIDTH
      let h = partsSizes[i][1]; // PART HEIGHT
      let d = partsSizes[i][2]; // PART DEPTH (THICKNESS)
      let parent = this;
      let id = partIds[i];
      let part;
      
      let pos;
      if (prevPartsPos.length > 0) {
        pos = prevPartsPos[i];
      } else {
        pos = createVector();
      }
      
      // if (prevPartsSizes.length > 0) {
      //   pw = prevPartsSizes[i][0]; // PREVIOUS PART WIDTH
      //   ph = prevPartsSizes[i][1];
      //   pd = prevPartsSizes[i][2];
      //   part = new PlanPart(parent, id, pw, ph, pd, w, h, d);
      // } else {
        // part = new PlanPart(parent, id, w, h, d, null, null, null);
      // }
      
      part = new PlanPart(parent, id, pos, w, h, d);
      this.parts.push(part);
    }
  }

  
  
  setPartColor() {
    let numParts = this.parts.length;
    if (this.part.colors.length === 0) {
      let col = 0;
      for (let i = 0; i < numParts; i++) {
        this.part.colors.push(col);
        // col += 140;
        col += 110;
      }
    }
    for (let i = 0; i < numParts; i++) {
      this.parts[i].color[0] = this.part.colors[i];
    }
  }
  
  
  
}





      
      



















