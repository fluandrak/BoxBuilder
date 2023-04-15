class CasketPart {
  constructor(_parent, _id, _pos, _width, _height, _depth, _color, _material) {
    this.parent = _parent;
    this.id = _id;
    this.pos = _pos;
    
    this.widthMm = _width;
    this.width = mm2pix(_width);
    this.heightMm = _height;
    this.height = mm2pix(_height);
    this.depthMm = _depth;
    this.depth = mm2pix(_depth);
    
    this.color = _color;
    this.material = _material;
  }
  
  
  
  draw(_unit, _unitPos) {
    let unit = _unit;
    let inheritPos = _unitPos;
    let part = this;
    let parent = part.parent;
    let casket = parent;
    
    push();
    
    let x = -part.width / 2; // ROTATE ALONG PART X-AXIS CENTER
    let y = 0;
    let targetPos = createVector(x, y);

    if (part.id == 'north') {
      targetPos.add(inheritPos);
      rotateY(180);
      
    } else if (part.id == 'south') {
      targetPos.add(inheritPos);
      rotateY(0);
      
    } else if (part.id == 'west') {
      targetPos.add(inheritPos);
      rotateY(-90);
      
    } else if (part.id == 'east') {
      targetPos.add(inheritPos);
      rotateY(90);
      
    } else if (part.id == 'top') {
      targetPos.z -= inheritPos.y;  // SHIFT AXIS FOR INHERIT POS
      rotateX(90);
      
    } else if (part.id == 'bottom') {
      // targetPos.z += inheritPos.y; // SHIFT AXIS FOR INHERIT POS
      rotateX(-90);
      
    }
    
    if (part.material) texture(part.material);
    
    targetPos.add(part.pos);
    targetPos.add(0, 0, 0.1); // AVOIDS CONFLICTING FACES
    translate(targetPos);
    
    this.drawGeometry(unit, part);
    
    pop();
  }
  
  
    
  drawGeometry(_unit, _part) {
    let unit = _unit;
    let part = _part;
    let parent = this.parent;
    
    // IS PART VISIBLE BY CAM AND NEEDED TO BE DRAWN?
    let onlyVisible = parent.render.onlyVisibleGeometry;
    
    let camX = cam.getPosition()[0];
    let camY = cam.getPosition()[1];
    let camZ = cam.getPosition()[2];

    if (onlyVisible) {
      if(
        (
          (part.id == 'top')                     &&
          (camY > 0)                             &&
          (casket.hasLid && casket.lidClosed)
        ) ||
        (
          (part.id == 'bottom')                  &&
          (camY < 0)                             &&
          (casket.hasLid && casket.lidClosed)
        )
        )
          {
            return;
          }
    }

    
    // ====================================================
    // ====================================================

    
      
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // PART FACES & EDGES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    
    let planeWidth = part.width;
    let planeHeight = part.height;
       

       
    // "WIDTH*HEIGHT" - [ALL PARTS] - OUTER/INNER FACES
       
    // 🧱Outer face
    if(
      ! (onlyVisible && part.id == 'north' && camZ > 0)    &&
      ! (onlyVisible && part.id == 'west' && camX > 0)     &&
      ! (onlyVisible && part.id == 'east' && camX < 0)     
      )
    {
      rect(0, 0, planeWidth, planeHeight);
      this.addLightLayer(planeWidth, planeHeight);
    }
    // 🧱Inner face
    if(
      ! (
          (onlyVisible && part.id == 'top') ||
          (onlyVisible && part.id == 'bottom')
        ) ||
      ! (casket.hasLid && casket.lidClosed)
      )
    {
      push();
      translate(0, 0, -part.depth);
      noStroke();
      rect(0, 0, planeWidth, planeHeight);
      this.addLightLayer(planeWidth, planeHeight);
      pop();
    }


    
    
    // "WIDTH*HEIGHT" - [NSWE] - EDGES
       
    if (part.id != 'top' && part.id != 'bottom') {
      push();
      // 🧱Light Outer Edges - light "roundover effect"
      noFill();
      stroke(casket.lightEdgeColor);
      strokeWeight(casket.lightEdgeWeight*2);
      rect(0, 0, planeWidth, planeHeight);
      
      // 🧱Dark """Inner Edge""" (dividing line where perpendicular _side_ parts (NSWE) meet - i.e. at the inside of corner joint)
      stroke(casket.darkEdgeColor);
      strokeWeight(casket.darkEdgeWeight);
      fill(casket.darkEdgeWeight);
      translate(casket.thickness, 0, -casket.thickness);
      line(0, 0, 0, planeHeight);
      pop();
    }


       
    // "WIDTH*DEPTH" - [ALL PARTS] - FACES & EDGES

    planeWidth = part.width;
    planeHeight = part.depth;

    let shortenFace = 0; // AVOIDS BOX JOINT OVERLAP
    let shortenEdge = 0;
    if (part.id == 'east' || part.id == 'west') {
      shortenFace = part.depth;
    } else {
      shortenEdge = part.depth;
    }
    planeWidth -= shortenFace*2;

    // TOP-side for [NSWE] / BACK-side for [Top/Bottom] >>>>>>
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // !! [Top/Bottom] BACK not visible when "box assembled" !!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (part.id != 'top' && part.id != 'bottom') {
      push();
      // 🧱Face
      rotateX(90);
      translate(shortenFace, -part.depth);
      rect(0, 0, planeWidth, planeHeight);
      this.addLightLayer(planeWidth, planeHeight);

      // 🧱Light Topmost Edge
      stroke(casket.lightEdgeColor);
      fill(casket.lightEdgeColor);
      strokeWeight(casket.lightEdgeWeight);
      line(shortenEdge, 0, planeWidth - shortenEdge*2, 0);

      // 🧱Dark BOX-JOINT/"joint-line" Edge
      stroke(casket.darkEdgeColor);
      strokeWeight(casket.darkEdgeWeight);
      fill(casket.darkEdgeWeight);
      push();
      translate(0, 0);
      line(0, 0, shortenEdge, 0);
      pop();
      translate(planeWidth-shortenEdge, 0);
      line(0, 0, shortenEdge, 0);
      pop();
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TOP/BACK

    // BOTTOM-side for [NSWE] / FRONT-side for [Top/Bottom] >>>
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // !! [Top/Bottom] FRONT not visible when "box assembled" !!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // 🧱Face
    if(
      (part.id != 'top' && part.id != 'bottom') &&
      (onlyVisible && camY > 0 && unit != 'lid') || 
      ! (casket.hasLid && casket.lidClosed)
      )
    {
      push();
      rotateX(90);
      translate(shortenFace, -part.depth, -part.height);
      rect(0, 0, planeWidth, planeHeight);
      this.addLightLayer(planeWidth, planeHeight);
      pop();
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< BOTTOM

       
       
    // // "DEPTH*HEIGHT" - [ALL PARTS] - FACES >>>>>>>>>>>>>>>>
    // // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // // !!!!!!! NOT VISIBLE WHEN "BOX ASSEMBLED" !!!!!!
    // // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
       
    // planeWidth = part.depth;
    // planeHeight = part.height;
       
    // push();
    // // 🧱Sides Faces
    // rotateY(90);
    // rect(0, 0, planeWidth, planeHeight);
    // this.addLightLayer(planeWidth, planeHeight);
    // pop();
    // push();
    // translate(part.width, 0);
    // rotateY(90);
    // rect(0, 0, planeWidth, planeHeight);
    // this.addLightLayer(planeWidth, planeHeight);
    // pop();
    // // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

       
       
    // COSMETIC: EDGES FOR SIDE PARTS SLOTS (WHERE TOP PART GOES)
       
    if (part.id == 'top') {
      planeWidth = part.width - casket.thickness;
      planeHeight = part.height - casket.thickness;
      push();
      translate(casket.thickness/2, casket.thickness/2);
      noFill();
      stroke(casket.darkEdgeColor);
      strokeWeight(casket.darkEdgeWeight);
      rect(0, 0, planeWidth, planeHeight);
      pop();
    }

       
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PARTS FACES & EDGES

       
       
    // ===================================================
    // ===================================================



    // BOX JOINTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
       
    if (casket.joint.type == 'box' && part.id != 'bottom' && part.id != 'top') {
      texture(endgrainTexture);
      strokeWeight(SCL*0.5);
      stroke(this.color[0], this.color[1], this.color[2]*0.4);

      let kerfSize = casket.joint.kerfSize;
      let lastKerfSize = part.height % kerfSize;
      let kerfs = (part.height - lastKerfSize) / kerfSize;

      let skip = 0; // MOVE KERF DOWN FRONT/BACK PARTS
      if (part.id == 'north' || part.id == 'south') skip = 1;

      for (let l = 0; l <= kerfs; l++) {
        if (l % 2 == skip) {
          for (let m = 0; m < 2; m++) { // ADDS RIGHT SIDE 
            push();
            translate(0, 0, 0.1);
            rect(m * part.width - m * casket.thickness,
                 l * kerfSize,
                 casket.thickness,
                 (l + 1) * kerfSize <= part.height ? kerfSize : lastKerfSize);
            pop(); 
          }
        }
      }
    }
       
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< BOX JOINTS



//     // LID GAP/DIVIDER LINE >>>>>>>>>>>>>>>>>>>>>>>>
//     if (part.id != 'bottom' && part.id != 'top') {
//       push();
//       translate(0, 0, 0.11);
//       blendMode(MULTIPLY);

//       let lidY = casket.lidHeight;

//       // Gap
//       fill(30);
//       rect(0, lidY, part.width, casket.lidGap);

//       // Gap upper edge (roundover) shadow
//       fill(50);
//       rect(0, lidY - casket.lidGap, part.width, casket.lidGap);

//       // Gap lower edge (roundover) light
//       blendMode(SCREEN);
//       fill(32);
//       rect(0, lidY + casket.lidGap, part.width, casket.lidGap);

//       blendMode(BLEND); // RESET BLEND MODE
//       pop();
//     }
//     // <<<<<<<<<<<<<<<<<<<<<<<< LID GAP/DIVIDER LINE


  }



  // CREATES TRANSPARENT OUTMOST LAYER ENABLING LIGHTING EFFECTS OVER TEXTURE
  addLightLayer(w, h) {
    if (! this.parent.render.reflections) return;
    push();
    translate(0, 0, 0.05);
    specularMaterial(10, 13);
    shininess(7);
    // specularMaterial(50, 50); // TEST/DEBUG
    // shininess(99); // TEST/DEBUG
    rect(0, 0, w, h);
    pop();
  }


}














