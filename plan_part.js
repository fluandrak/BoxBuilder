class PlanPart {
  
  constructor(_parent, _id, _pos, _width, _height, _depth) {
    this.parent = _parent;
    this.id = _id;
    this.pos = _pos;
    
    this.widthMm = _width;
    this.width = mm2pix(_width);
    this.heightMm = _height;
    this.height = mm2pix(_height);
    this.depthMm = _depth;
    this.depth = mm2pix(_depth);
    
    this.color = [0, 100, 75]; // [0] set in plan/setPartColor()
    this.edgeColor = 0;
    this.edgeWeight = this.parent.part.edgeWeight;
    
    this.vertices = [];
    
    this.measureObjects = [];
    
    this.paddingTotal = null; // USED FOR [BOTTOM] PART WHICH HAS 2 MeasureObjects TO ACCOUNT FOR (PARTS [BOTTOM] & [NORTH]) - SO NEEDS THE SUM FOR BOTH
    this.moving = false;
    this.targetPos = createVector();
    this.velocity = createVector();
    this.boundary = mm2pix(7);
    this.maxSpeed = mm2pix(1.3);
    this.maxForce = mm2pix(0.3);
    
    // this.changing = false;
    // this.velocitySize = null;
    // this.boundarySize = mm2pix(5);
    // this.maxSpeedSize = mm2pix(3);
    // this.maxForceSize = mm2pix(2);
    
    this.animateKerfRemoval = false;
    this.animateKerfRemovalStartFrame = null;
    
    this.updateBuild();
  }
  
  
  
  updateBuild() {
    let part = this;
    
    part.boxJointBuild();
    

    
    let measureDimensions = [
      part.width,
      part.height,
      part.depth
    ]
    for (let dimension of measureDimensions) {
      let m = new Measurement(part, dimension);
      part.measureObjects.push(m);
    }
  }
  
  

  update() {
    this.updatePos();
  }
  
  
  
  updatePos() {
    let part = this;

    this.addPaddingForMeasureObject();

    let desired = p5.Vector.sub(this.targetPos, this.pos);
    if (desired.mag() > mm2pix(0.5)) {
      part.moving = true;
      
      let distance = desired.mag();
      let speed = this.maxSpeed;
      if (distance < this.boundary) {
        speed = map(distance, 0, this.boundary, 0, this.maxSpeed);
      }
      desired.setMag(speed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxForce);
      this.velocity.add(steer);
      this.pos.add(this.velocity);
    } else if (part.animateKerfRemoval) {
      part.moving = true;
    } else {
      part.moving = false;
    }

  }
  
  
  
  addPaddingForMeasureObject() {
    let part = this;
    
    // let totalHeight = 0; // UNUSED
    
    for (let mo of this.measureObjects) {
      let hData = mo.heightData.height;
      let wData = mo.widthData.height;
      if (! hData || ! wData) break;
      if (part.id === 'north') {
        plan.parts[2].paddingTotal += wData*-1; // ADD TO TOTAL PADDING FOR BOTTOM PART 
        // totalHeight += wData;
      } else if (part.id === 'bottom') {
        let highestData = hData**2 >= wData**2 ? hData : wData;
        part.paddingTotal += highestData;
        // totalHeight += highestData;
      } else if (part.id === 'west') {
        plan.parts[1].targetPos.y = -wData;
        // totalHeight += wData;
      }
    }
    
    if (part.id === 'bottom') {
      part.targetPos.z = part.paddingTotal;
      part.paddingTotal = 0; // RESET FOR NEXT FRAME/CALCULATION
    }

    // this.measureObjectsTotalHeight = totalHeight;
  }

  
  
  // updateSize() {
    
//     if (part.width !== part.targetWidth && part.targetWidth !== null) {
//       part.moving = true;
//       part.changing = true;
      
//       // part.width = part.targetWidth;
//       // part.height = part.targetHeight;
//       // part.depth = part.targetDepth;
      
//       let distance = part.targetWidth - part.width;
      
//       if (distance < mm2pix(0.1)) {
//         part.width = part.targetWidth;
//         casket.width = part.width;
//         this.vertices = [];
//         casket.updateBuild();
//         this.boxJointBuild();
//         part.moving = false;
//         part.changing = false;
//         // plan.updateBuild();
//       }
      
//       let speed = this.maxSpeedSize;
//       if (distance < this.boundarySize) {
//         speed = map(distance, 0, this.boundarySize, 0, this.maxSpeedSize);
//       }
//       distance = speed;
//       let steer = distance - this.velocitySize;
//       if (steer > this.maxForceSize) steer = this.maxForceSize;
//       this.velocitySize += steer;
//       if (distance < 0) this.velocitySize = this.velocitySize *-1;
//       this.width += this.velocitySize;
      
//     } else {
//       part.moving = false;
//       part.changing = false;
      
//         // casket.width = part.width;
//         // this.vertices = [];
//         // casket.updateBuild();
//         // this.boxJointBuild();
    // }
  // }
  
  
  
  draw() {
    let part = this;
    let parent = part.parent;
    let plan = parent;
    let measurements = this.measureObjects[0];
        
    // let camDist = cam.getDistance() * mm2pix(0.003);
    
    push();
    
let x = -part.width / 2; // ROTATE ALONG PART X-AXIS CENTER
    let y = 0;
    let targetPos = createVector(x, y);
    
    if (part.id == 'north') {
      // rotateY(180); // <<<<-----------------------
      plan.locations.bottom = targetPos.copy().add(0, part.height, 0);
      
    } else if (part.id == 'west') {
      targetPos.add(0, -part.height, 0);
      targetPos.add(0, -plan.rendering.parts.padding);
      // targetPos.add(0, -camDist, 0);
      
    } else if (part.id == 'bottom') {
      rotateX(90);
      let otherPartHeight = plan.locations.bottom.y;
      targetPos.add(0, 0, -otherPartHeight);
      targetPos.add(0, 0, -plan.rendering.parts.padding);
      // targetPos.add(0, 0, -camDist);
    }
    
    targetPos.add(part.pos);
    
    translate(targetPos);
    this.drawGeometry();
    measurements.draw();
    part.drawLabel();

    pop();
  }
  
  
  
  drawGeometry() {
    let part = this;
    let parent = this.parent;
    let plan = parent;
    
    // // DEBUG:
    // strokeWeight(mm2pix(0.5));
    // rect(0, 0, part.width, part.height);
    // strokeWeight(mm2pix(0.25));
    
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // PART FACES & EDGES >>>>>>>>>>>>>>>>>>>>>>>>>>>

    if (casket.joint.type === 'mitered' || part.id === 'bottom' || part.changing) {
      push();
      translate(part.width/2, part.height/2, -part.depth/2);
      box(part.width, part.height, part.depth);
      pop();
    }
    
    
    
    else if (casket.joint.type === 'box' && part.id !== 'bottom') {
      
      // BOX JOINT - WHOLE FACE PART & OUTER EDGES >>>>>
      let polarity;
      
      // WIDTH*HEIGHT - FRONT SIDE
      // push();
      // translate(part.width/2, 0);
      // polarity = -1;           // LEFT PART SIDE
      // noFill();
      // noStroke();
      // beginShape(TESS);
      // this.drawPartVertices(polarity);
      // endShape();
      // polarity = 1;           // RIGHT PART SIDE
      // beginShape(TESS);
      // this.drawPartVertices(polarity);
      // endShape();
      // pop();
      
      // WIDTH*HEIGHT - BACK SIDE
      push();
      noFill();
      translate(part.width/2, 0);
      translate(0, 0, -part.depth);
      polarity = -1;           // LEFT PART SIDE
      beginShape(); // (TESS)
      this.drawPartVertices(polarity);
      endShape();
      polarity = 1;           // RIGHT PART SIDE
      beginShape(); // (TESS)
      this.drawPartVertices(polarity);
      endShape();
      pop();

      // WIDTH*DEPTH & HEIGHT*DEPTH
      // SIDES
      polarity = -1;          // LEFT PART SIDE
      push();
      translate(part.width/2, 0);
      rotateY(180);
      this.drawPartVerticesZ(polarity);
      pop();
      polarity = 1;          // RIGHT PART SIDE
      push();
      translate(part.width/2, 0);
      this.drawPartVerticesZ(polarity);
      pop();
      // TOP & BOTTOM
      // push();
      // this.drawPartTopBottomPlane();
      // pop();
      
      
      
      // push();
      if (part.id === 'north') {
        polarity = 0;
        this.drawBoxPartsPinFirst(polarity);
        // polarity = 1;
        // if (casket.joint.numKerfsIsEven) {
        //   this.drawBoxPartsPinFirst(polarity);
        // } else {
        //   this.drawBoxPartsSocketFirst(polarity);
        // }
        
      }
      if (part.id === 'west') {
        polarity = 0;
        this.drawBoxPartsSocketFirst(polarity);
        // polarity = 1;
        // this.drawBoxPartsPinFirst(polarity);
      }
      // pop();
      // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< BOX JOINTS
    }
      
  }
  
  
  
  drawLabel() {
    let part = this;

    let label = part.id;
    if (part.id === 'north') {
      label = 'front';
    } else if (part.id === 'west') {
      label = 'side';
    }

    push();
    textSize(textSize()*0.8);
    // fill(part.color[0], part.color[1]-0, 30);
    fill(100);
    if (part.id === 'bottom') rotateX(90);
    textAlign(CENTER, CENTER);
    let textPosZ = 10;
    if (part.id === 'bottom') textPosZ = 2;
    translate(part.width/2, part.height/2-textSize()/5, textPosZ);
    text(label, 0, 0);
    pop();
  }

  
  
}



    











