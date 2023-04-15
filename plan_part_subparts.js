PlanPart.prototype.drawPartVertices = function(polarity) {
  let skipLastVertices = 0;
  if (casket.joint.bottomKerfHeight === 0) skipLastVertices = 1;
  for (let i = 0; i < this.vertices.length - skipLastVertices; i++) {
    let v = this.vertices[i];
    vertex(polarity * v.pos.x, v.pos.y);
  }
}
  
  

PlanPart.prototype.drawBoxPartsPinFirst = function(polarity) {
  let part = this;
  
  let kerfHeight = casket.joint.kerfSize; // KERF _WIDTH_ ON SAWBLADE
  let jointWidth = casket.thickness;
  let bottomKerfHeight = casket.joint.bottomKerfHeight;
  if (bottomKerfHeight === 0) bottomKerfHeight = kerfHeight;
  let numKerfs = casket.joint.numKerfs;
  
  push();
  
  noStroke();
  strokeWeight(plan.part.edgeWeight);
  
  translate(part.width/2, 0);

  rotateZ(polarity * 180);
  
  translate(0, polarity * (-part.height + bottomKerfHeight));
  // if (! casket.joint.numKerfsIsEven) translate(0, -kerfHeight);
  
  let w, h, prevH, d, x, y, z;
  let bottomPartDepth = casket.topBottomThickness; // (THICKNESS)
  
  // 1 - TOP "KERF"
  w = part.width;
  h = kerfHeight;
  d = part.depth;
  y = h/2;
  z = -d/2;
  // Faces
  translate(0, y, z);
  box(w, h, d);
  // Edges
  push();
  stroke(0);
  translate(0, 0, -z);
  rect(-w/2, -y, w, h);
  pop();
  
  // 2 - IRREGULAR KERF START / SLOT PART 1
  w = part.width - part.depth*2;
  h = kerfHeight;
  d = part.depth/2;
  y = h;
  z = -d/2;
  // Faces
  translate(0, y, z);
  box(w, h, d);
  // Inner Part Width Edge
  push();
  stroke(0);
  translate(-w/2, -h/2, -z);
  line(0, 0, w, 0);
  pop();
  // Height*Depth Side Edges
  // ...Left
  push();
  stroke(0);
  noFill();
  translate(-w/2, -h/2, -z);
  rotateY(90);
  rect(0, 0, d, h);
  // ... Right
  translate(0, 0, w);
  rect(0, 0, d, h);
  pop();
  
  // 3 - SLOT PART 2
  prevH = h;
  w = part.width;
  h = bottomPartDepth - prevH;
  d = part.depth/2;
  y = h/2 + prevH/2;
  // Faces
  translate(0, y, 0);
  box(w, h, d);
  // 3.5 - SLOT STOP "BUMPS"
  w = part.depth/2;
  x = part.width/2 - part.depth/4;
  z = d;
  // Faces Left
  push();
  translate(-x, 0, z);
  box(w, h, d);
  pop();
  // Faces Right
  push();
  translate(x, 0, z);
  box(w, h, d);
  pop();
  // Edge Left #1
  x = part.width/2 - part.depth/2;
  y = (bottomPartDepth - kerfHeight) / 2;
  z = part.depth/4 + part.depth/2;
  push();
  stroke(0);
  noFill();
  translate(-x, -y, z);
  rotateY(90);
  rect(0, 0, d, h);
  // Edges Slot Bottom
  push();
  translate(d, h, 0);
  rotateY(-90);
  rotateX(90);
  rect(0, 0, part.width-part.depth, d);
  pop();
  // Edge Left #2
  rotateY(-90);
  line(-d, 0, 0, 0);
  translate(0, 0, -part.depth/2);
  line(0, 0, d, 0);
  pop();
  // Edges Right
  push();
  stroke(0);
  noFill();
  translate(x, -y, z);
  rotateY(90);
  rect(0, 0, d, h);
  rotateY(-90);
  line(d, 0, 0, 0);
  translate(0, 0, -part.depth/2);
  line(-d, 0, 0, 0);
  pop();
  
  // 4 - IRREGULAR END
  prevH = h;
  w = part.width;
  h = kerfHeight - prevH;
  d = part.depth;
  y = h/2 + prevH/2;
  z = d/4;
  // Faces
  translate(0, y, z);
  box(w, h, d);
  
  // REPEATING COPIES
  prevH = h;
  w = part.width - part.depth*2;
  h = kerfHeight;
  d = part.depth;
  y = kerfHeight/2 + prevH/2;
  translate(0, y);
  box(w, h, d);
  for (let i = 0; i < numKerfs-2; i++) {
    let w = part.width;
    if (i % 2 === 0) w -= d*2;
    box(w, h, d);
    translate(0, kerfHeight);
  }
  
  translate(0, -kerfHeight); // Reset translate
  
  // BOTTOM KERF
  // if (bottomKerfHeight !== 0) {
  // Faces
  prevH = h;
  w = part.width
  if (numKerfs % 2 === 0) w -= part.depth*2;
  h = bottomKerfHeight;
  d = part.depth;
  y = h/2 + prevH/2;
  translate(0, y);
  box(w, h, d);
  // Edge
  push();
  stroke(0);
  translate(-w/2, -h/2 + bottomKerfHeight, d/2);
  line(0, 0, w, 0);
  pop();
  // }
  
  pop();
}
      


PlanPart.prototype.drawBoxPartsSocketFirst = function(polarity) {
  let part = this;
  
  let kerfHeight = casket.joint.kerfSize; // KERF _WIDTH_ ON SAWBLADE
  let jointWidth = casket.thickness;
  let bottomKerfHeight = casket.joint.bottomKerfHeight;
  if (bottomKerfHeight === 0) bottomKerfHeight = kerfHeight;
  let numKerfs = casket.joint.numKerfs;
  
  push();
  
  noStroke();
  strokeWeight(plan.part.edgeWeight);
  
  translate(part.width/2, 0);
  
  rotateZ(polarity * 180);
  translate(0, polarity * (-part.height + bottomKerfHeight));
  
let w, h, prevH, d, x, y, z;
  let bottomPartDepth = casket.topBottomThickness; // (THICKNESS)
  
  // 1 - TOP "KERF"
  w = part.width - part.depth*2;
  h = kerfHeight;
  d = part.depth;
  y = h/2;
  z = -d/2;
  // Faces
  translate(0, y, z);
  box(w, h, d);
  // Edges
  push();
  stroke(0);
  translate(d, 0, -z);
  rect(-w/2 - d, -y, w, h);
  pop();
  
  // 2 - IRREGULAR KERF START / SLOT PART 1
  w = part.width;
  h = kerfHeight;
  d = part.depth/2;
  y = h;
  z = -d/2;
  // Faces
  translate(0, y, z);
  box(w, h, d);
  // SLOT STOP BUMPS
  // ... Left Faces
  push();
  translate(-w/2 + d/2, 0, d);
  box(d, h, d);
  pop();
  // ... Right Faces
  push();
  translate(w/2 - d/2, 0, d);
  box(d, h, d);
  pop();
  // ... Left Edges
  push();
  stroke(0);
  noFill();
  translate(-w/2 + d, -h/2, part.depth/2 + d/2);
  rect(0, 0, -d, h);
  rotateY(-90);
  rect(0, 0, -d, h);
  pop();
  // ... Right Edges
  push();
  stroke(0);
  noFill();
  translate(w/2 - d, -h/2, part.depth/2 + d/2);
  rect(0, 0, d, h);
  rotateY(90);
  rect(0, 0, d, h);
  pop();
  // Inner Part Width Edge
  push();
  stroke(0);
  translate(-w/2 + d, -h/2, -z);
  line(0, 0, w - part.depth, 0);
  pop();
  // Kerf/"Slot Middle" Edges
  // ... Left
  push();
  stroke(0);
  translate(-w/2 + d, h/2, -z);
  line(0, 0, d, 0);
  line(d, 0, d, bottomPartDepth - h);
  push();
  rotateY(90);
  translate(0, -h/2, d);
  line(0, 0, d, 0);
  pop();
  // ... Right
  translate(w - part.depth, 0, 0);
  line(0, 0, -d, 0);
  line(-d, 0, -d, bottomPartDepth - h);
  push();
  rotateY(-90);
  translate(0, 0, d);
  line(0, 0, -d, 0);
  pop();
  pop();
  
  // 3 - SLOT PART 2
  prevH = h;
  w = part.width - part.depth*2;
  h = bottomPartDepth - prevH;
  d = part.depth/2;
  y = h/2 + prevH/2;
  // Faces
  translate(0, y, 0);
  box(w, h, d);
  // Slot Bottom Edges
  push();
  stroke(0);
  noFill();
  translate(-w/2, bottomPartDepth/2 - kerfHeight/2, d/2);
  rotateX(90);
  rect(0, 0, w, d);
  pop();
  
  // 4 - IRREGULAR END
  prevH = h;
  w = part.width - part.depth*2;
  h = kerfHeight - prevH;
  d = part.depth;
  y = h/2 + prevH/2;
  z = d/4;
  // Faces
  translate(0, y, z);
  box(w, h, d);
  // Side Vertical Front Edges
  push();
  stroke(0);
  // ... Left
  translate(-w/2, -h/2, d/2);
  line(0, 0, 0, h);
  // ... Right
  translate(w, 0, 0);
  line(0, 0, 0, h);
  pop();
  
  // REPEATING COPIES
  prevH = h;
  w = part.width - part.depth*2;
  h = kerfHeight;
  d = part.depth;
  y = kerfHeight/2 + prevH/2;
  translate(0, y);
  box(w, h, d);
  for (let i = 0; i < numKerfs-2; i++) {
    let w = part.width;
    if (i % 2 === 1) w -= d*2;
    box(w, h, d);
    translate(0, kerfHeight);
  }
  
  translate(0, -kerfHeight); // Reset translate
  
  // BOTTOM KERF
  // if (bottomKerfHeight !== 0) {
  prevH = h;
  w = part.width
  if (! casket.joint.numKerfsIsEven) w -= part.depth*2;
  h = bottomKerfHeight;
  d = part.depth;
  y = h/2 + prevH/2;
  translate(0, y);
  box(w, h, d);
  // Edge
  push();
  stroke(0);
  translate(-w/2, -h/2 + bottomKerfHeight, d/2);
  line(0, 0, w, 0);
  pop();
  // }

  pop();
}
      


PlanPart.prototype.drawPartVerticesZ = function(polarity) {
  let part = this;
  let depth = part.depth;
  
  let skipLastVertices = 2;

  if (part.id === 'north') {
    if (! casket.joint.numKerfsIsEven) skipLastVertices = 3;
    // if (casket.joint.bottomKerfHeight === 0) skipLastVertices = 4;

    // HEIGHT*DEPTH SIDE
    for (let i = 2; i < this.vertices.length-skipLastVertices; i++) {
      let v = this.vertices;
      let v1 = v[i].pos;
      let v2 = v[i+1].pos;
      
      let thisKerfHeight = v2.y - v1.y;
      if (part.animateKerfRemoval && i % 4 === 0) part.removeKerf(v1, thisKerfHeight, polarity);
      
      push();
      noFill();
      translate(v1.x, v1.y);
      if (! (i > 2 && i < 6)) { // SKIP FOR SLOT AREA
        
        if (i % 2 !== 0) {
          rotateX(-90);
          rect(0, 0,
               v2.x - v1.x,
               v2.y - v1.y + depth * polarity);
        } else {
          rotateY(90);
          rect(0, 0,
               v2.x - v1.x + depth * polarity,
               v2.y - v1.y);
        }
      }
      pop();
    }
    if (casket.joint.bottomKerfHeight === 0 && polarity === 1) { // 'POLARITY === 1' ENSURES ONLY 1 DRAW/FRAME (FUNCTION CALLED 2 TIMES PER FRAME)
      this.drawPartBottomPlane();
    }

  } else if (part.id === 'west') {
    if (casket.joint.numKerfsIsEven) skipLastVertices = 3;

    // HEIGHT*DEPTH SIDE
    for (let i = 1; i < this.vertices.length-skipLastVertices; i++) {
      
      let v = this.vertices;
      let v1 = v[i].pos;
      let v2 = v[i+1].pos;
      
      let thisKerfHeight = v2.y - v1.y;
      if (part.animateKerfRemoval && i % 4 === 1) part.removeKerf(v1, thisKerfHeight, polarity);
      
      push();
      noFill();
      translate(v1.x, v1.y);
      if (! (i > 1 && i < 6) || (i === 3)) { // SKIP FOR SLOT AREA
        
        if (i % 2 === 0) {
          rotateX(-90);
          rect(0, 0,
               v2.x - v1.x,
               v2.y - v1.y + depth * polarity);
        } else {
          rotateY(90);
          rect(0, 0,
               v2.x - v1.x + depth  * polarity,
               v2.y - v1.y);
        }
      }
      pop();
    }
    if (casket.joint.bottomKerfHeight === 0 && polarity === 1) { // 'POLARITY === 1' ENSURES ONLY 1 DRAW/FRAME (FUNCTION CALLED 2 TIMES PER FRAME)
      this.drawPartBottomPlane();
    }


  }
}
  
  
  
PlanPart.prototype.removeKerf = function(v, thisKerfHeight, polarity) {
  let part = this;

  push();
  let vBox = v.copy();
  let sinKerf = Math.abs(Math.sin((frameCount-part.animateKerfRemovalStartFrame)*0.02));
  sinKerf **= 2.5;
  let s = map(sinKerf, 0, 1, 0, 100);
  vBox.add(0, 0, -s * polarity);
  translate(vBox.x + casket.thickness/2, vBox.y + thisKerfHeight/2, vBox.z - polarity * casket.thickness/2);
  specularMaterial(part.color[0], part.color[1] - s*0.5, part.color[2], 90 - s);
  stroke(0, 100 - s*1.5);
  box(casket.thickness, thisKerfHeight, casket.thickness);
  pop();

  if (s > 99.9) part.animateKerfRemoval = false;
}



PlanPart.prototype.drawPartBottomPlane = function() {
// !!!!! ONLY CALLED IF bottomKerfHeight === 0 !!!!!
  let part = this;
  let depth = part.depth;

  let planeWidth = part.width;
  let planePosX = -planeWidth/2;

  if (part.id === 'west') {
    planeWidth -= 2*part.depth;
    planePosX = -planeWidth/2;
  }

  push();
  translate(planePosX, part.height, 0);
  rotateX(-90);
  rect(0, 0, planeWidth, part.depth);
  pop();
}
  
  
  
// PlanPart.prototype.drawPartTopBottomPlane = function() {
//   // translate(-part.width/2, -part.height * (polarity/2 - 0.5), 0); // SCHNYGG LR??

//   let part = this;
//   let depth = part.depth;

//   let planeWidth;
//   let planePosX;

//   if (part.id === 'north') {
//     // ...TOP
//     push();
//     rotateX(-90);
//     rect(0, 0, part.width, part.depth);
//     pop();

//     // ...BOTTOM
//     if (! casket.joint.numKerfsIsEven) {
//       planeWidth = part.width;
//       planePosX = 0;
//     } else {
//       planeWidth = part.width - 2*part.depth;
//       planePosX = part.depth;
//     }
//   } else if (part.id === 'west') {
//     // ...TOP
//     push();
//     rotateX(-90);
//     rect(part.depth, 0, part.width - 2*part.depth, part.depth);
//     pop();

//     // ...BOTTOM
//     if (casket.joint.numKerfsIsEven) {
//       planeWidth = part.width;
//       planePosX = 0;
//     } else {
//       planeWidth = part.width - 2*part.depth;
//       planePosX = part.depth;
//     }
//   }

//   push();
//   translate(planePosX, part.height, 0);
//   rotateX(-90);
//   rect(0, 0, planeWidth, part.depth);
//   pop();

// }
  
  
  
PlanPart.prototype.boxJointBuild = function() {
  let part = this;

  if (casket.joint.type == 'box' && part.id !== 'bottom') {
    // let planeWidth = part.width;
    // let planeHeight = part.height;
    // let kerfSize = casket.joint.kerfSize;
    // let kerfHeight = kerfSize; // KERF _WIDTH_ ON SAWBLADE
    // let jointWidth = casket.thickness;
    // let bottomKerfHeight = (planeHeight % kerfHeight);
    // // let numKerfs = (planeHeight - bottomKerfHeight) / kerfHeight; // UNUSED
    // let bottomKerfHeightMm = (pix2mm(bottomKerfHeight));
    // if (Math.abs(0 - bottomKerfHeightMm) < 0.000000001) {
    //   bottomKerfHeight = 0;
    //   // bottomKerfHeight = mm2pix(1.1);
    //   // bottomKerfHeight = kerfHeight;
    // }
    let planeWidth = part.width;
    let planeHeight = part.height;
    let kerfSize = casket.joint.kerfSize;
    let kerfHeight = kerfSize; // KERF _WIDTH_ ON SAWBLADE
    let jointWidth = casket.thickness;
    let bottomKerfHeight = casket.joint.bottomKerfHeight;
    if (bottomKerfHeight === 0) bottomKerfHeight = kerfHeight;

    this.makeBoxJointPart(part, planeHeight, planeWidth, kerfHeight, bottomKerfHeight, jointWidth);
  }
}



PlanPart.prototype.makeBoxJointPart = function(part, planeHeight, planeWidth, kerfHeight, bottomKerfHeight, jointWidth) {

  // 'skip'-variable: MOVE FIRST KERF DOWN FOR [NORTH] PART => TOP MOST JOINT-"FINGER" ON FRONT PART (FOR LOOKS)
  let skip = part.id === 'north' ? 0 : 1;

  let v = createVector(0, 0);
  this.saveV(v);
  v.add(planeWidth/2-jointWidth, 0);
  this.saveV(v);

  let kerfNum = 0;
  while (v.y < planeHeight - (kerfHeight + bottomKerfHeight)) {
    if (kerfNum % 2 == skip) {
      v.add(jointWidth, 0);
      this.saveV(v);
      v.add(0, kerfHeight);
      this.saveV(v);
      v.add(-jointWidth, 0);
      this.saveV(v, 'kerf');
    } else {
      v.add(0, kerfHeight);
      this.saveV(v, 'kerf');
    }
    kerfNum++;
  }

  if (v.y + kerfHeight === planeHeight) {
    if (kerfNum % 2 == skip) {
      v.add(jointWidth, 0);
      this.saveV(v);
      v.add(0, kerfHeight);
      this.saveV(v);
      v.add(-jointWidth, 0);
      this.saveV(v);
    } else {
      v.add(0, kerfHeight);
      this.saveV(v);
    }
  } else if (v.y + kerfHeight < planeHeight) {
    if (kerfNum % 2 == skip) {
      v.add(jointWidth, 0);
      this.saveV(v);
      v.add(0, kerfHeight);
      this.saveV(v);
      v.add(-jointWidth, 0);
      this.saveV(v);
    } else {
      v.add(0, kerfHeight);
      this.saveV(v);
      v.add(jointWidth, 0);
      this.saveV(v);
      // v.add(-jointWidth, 0);
      // this.saveV(v);
    }
    if (kerfNum % 2 == skip) {
      v.add(0, bottomKerfHeight);
      this.saveV(v);
    } else {
      // v.add(jointWidth, 0);
      // this.saveV(v);
      v.add(0, bottomKerfHeight);
      this.saveV(v);
      v.add(-jointWidth, 0);
      this.saveV(v);
    }
  } else {
    if (kerfNum % 2 == skip) {
      v.add(jointWidth, 0);
      this.saveV(v);
      v.add(0, bottomKerfHeight);
      this.saveV(v);
      v.add(-jointWidth, 0);
      this.saveV(v);
    } else {
      v.add(0, bottomKerfHeight);
      this.saveV(v);
    }
  }

  v.add(-planeWidth/2 + jointWidth, 0);
  this.saveV(v);
}
  
  

  
PlanPart.prototype.saveV = function(_pos, _id) {
  let vert = {
    id: _id,
    pos: _pos.copy(),
  }
  
  this.vertices.push(vert);
}























