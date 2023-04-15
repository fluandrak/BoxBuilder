class Measurement {
  constructor(_parent, _dimension) {
    this.parent = _parent; // Parent PART
    this.dimension = _dimension;
    // this.pos = _pos;
    
    this.widthData = { height: null };
    this.heightData = { height: null };
    
    this.rendering = {
      padding: mm2pix(6.5),
      // color: [90, 100, 40],
      // weight: mm2pix(0.2),
      dimensionLine: {
        padding: mm2pix(0.6),
      },
      pointerLine: {
        color: [50, 100, 0], // B:50
        // brightness: 70,
        weight: mm2pix(0.3), // 0.25
        length: mm2pix(9),
        padding: mm2pix(6.8),
      },
      arrow: {
        // size: mm2pix(4.7),
        size: mm2pix(3.6),
      },
      text: {
        color: [50, 100, 0], // B:50
        // brightness: 60,
        sizeMin: mm2pix(8), // 9
        sizeMax: mm2pix(15), // 15
        sizeCamC: mm2pix(0.007),
      }
    }
  }
  
  
  
  draw() {
    let measure = this;
    let part = this.parent;
    
    let padding = measure.rendering.padding;
    let camDist = cam.getDistance();
    let tSize = measure.rendering.text.sizeCamC * camDist;
    let tSizeMin = measure.rendering.text.sizeMin;
    let tSizeMax = measure.rendering.text.sizeMax;
    tSize = tSize < tSizeMin ? tSize = tSizeMin : tSize;
    tSize = tSize > tSizeMax ? tSize = tSizeMax : tSize;
    textSize(tSize);

    let camX = cam.getPosition()[0] / camDist;
    let camY = cam.getPosition()[1] / camDist;
    let camZ = cam.getPosition()[2] / camDist;

    if (part.id === 'bottom') rotateX(-90);
    
    // [WEST] PART SLOT
    if (part.id === 'west' && casket.joint.type === 'box') {
      // ... Depth
      push();
      let overlayPadding = measure.rendering.pointerLine.weight/2; // AVOID CONFLICTING PLANES
      translate(part.width/2, casket.joint.kerfSize + overlayPadding, -part.depth/2 + overlayPadding);
      this.drawMeasureLine(part.depthMm/2, part.depth/2, 'slotDepth');
      pop();
      // ... Width
      push();
      translate(part.width, 0);
      this.drawMeasureLine(part.depthMm/2, part.depth/2, 'slotWidth');
      pop();
      // ... Height
      push();
      translate(part.depth, casket.joint.kerfSize + casket.topBottomThickness);
      rotateZ(-90);
      let maxRot = 0;
      let minRot = -90;
      let rot = -camX*90 + 10;
      rot = rot < minRot ? minRot : rot;
      rot = rot > maxRot ? maxRot : rot;
      rotateX(rot);
      this.drawMeasureLine(casket.topBottomThicknessMm, casket.topBottomThickness, 'slotHeight');
      pop();
    }
      
    // [NORTH] PART SLOT
    if (part.id === 'north' && casket.joint.type === 'box') {
      // ... Edge Distance
      push();
      translate(part.width, 0, -part.depth);
      rotateZ(90);
      let maxRot = 90;
      let minRot = 0;
      let rot = camX*90 - 20;
      rot = rot < minRot ? minRot : rot;
      rot = rot > maxRot ? maxRot : rot;
      rotateX(rot);
      this.drawMeasureLine(casket.joint.kerfSizeMm, casket.joint.kerfSize, 'slotEdgeDistance');
      pop();
    }
    
    // PART WIDTH
    push();
    if (part.id !== 'bottom') translate(0, part.height);
    this.drawMeasureLine(part.widthMm, part.width, 'width');
    pop();

    // PART HEIGHT
    push();
    rotateZ(-90);
    
    if (part.id !== 'bottom') {
      let maxRot = 0;
      let minRot = -90;
      let rot = -camX*90 + 10;
      rot = rot < minRot ? minRot : rot;
      rot = rot > maxRot ? maxRot : rot;
      push();
      rotateX(rot);
      translate(-part.height, 0);
      this.drawMeasureLine(part.heightMm, part.height, 'height');
      pop();

      // ADD CONDITIONAL SHORT POINTER LINE EXTENSION
      if (part.id === 'north' && casket.joint.type === 'box' && casket.joint.numKerfsIsEven) {
        push();
        stroke(measure.rendering.pointerLine.color);
        strokeWeight(measure.rendering.pointerLine.weight);
        translate(-part.height, 0);
        line(0, 0, 0, casket.thickness);
        pop();
      }
      
    } else if (part.id === 'bottom') {
      rotateY(90);
      let maxRot = 0;
      let minRot = -90;
      let rot = -camX*90 - camY*90 * 0.5;
      rot = rot < minRot ? minRot : rot;
      rot = rot > maxRot ? maxRot : rot;
      rotateX(rot);
      translate(-part.height, 0);
      this.drawMeasureLine(part.heightMm, part.height, 'height');
    }
    pop();

    if (part.id === 'west') return; // NO [WEST] DEPTH

    // PART DEPTH
    if (part.id !== 'bottom' && camX < 0.2) return;
    push();
    if (part.id === 'bottom') {
      translate(part.width, 0);
      rotateZ(90);
      let maxRot = 90;
      let minRot = 0;
      let rot = camX*90 - 20;
      rot = rot < minRot ? minRot : rot;
      rot = rot > maxRot ? maxRot : rot;
      rotateX(rot);
    } else {
      translate(part.width, part.height);
      rotateY(90);
    }

    this.drawMeasureLine(part.depthMm, part.depth, 'depth');
    pop();
  }
  
  
  
  drawMeasureLine(_dimensionMm, _dimension, _dimensionId) {
    let measure = this;
    let part = this.parent;
    let dimension = _dimension;
    let dimensionMm = _dimensionMm;
    let dimensionId = _dimensionId;
    let polarity = 1;
    
    let padding = measure.rendering.padding;
    let pLinePadding = measure.rendering.pointerLine.padding;
    let dLinePadding = measure.rendering.dimensionLine.padding;

    let camDist = cam.getDistance() * mm2pix(0.0022); //0.002

    let dimText = {
      text: (Number(dimensionMm).toFixed(1)).toString(),
      get width() { return this.text.length*textSize()/3 },
      y: null,
    }
    
    if ((part.id !== 'bottom' && dimensionId === 'width') || (part.id === 'north' && dimensionId === 'depth')) polarity = -1;

    let dimLine = {
      len: dimension/2 - dimText.width,
      y: (textSize()/4 - camDist - padding) * polarity,
    }
    
    dimText.y = dimLine.y;

    if (dimText.width > dimension*0.28) {
      dimLine.len = dimension/2;
      dimText.y -= textSize()/1.2 * polarity;
    }

    // SAVE MEASURE OBJECT DIMENSIONS FOR PARTS PADDING
    let measureObjectHeight = (dimText.y - textSize()/5);
    if (dimensionId === 'width') {
      this.widthData.height = measureObjectHeight;
    } else if (dimensionId === 'height') {
      this.heightData.height = measureObjectHeight;
    }
    
    // DON'T DRAW HEIGHT MEASUREMENT DATA FOR [WEST] PART (BECAUSE ALWAYS SAME AS [NORTH])
    if (part.id === 'west' && dimensionId === 'height') return;

    // POINTER LINES (CHANGE TO "STOP/END/... LINES"???)
    stroke(measure.rendering.pointerLine.color);
    strokeWeight(measure.rendering.pointerLine.weight);
    let pointStartY = 0;
    if (part.id !== 'bottom' && dimensionId !== 'height' && casket.joint.type === 'box') {
      // EXTEND POINTER LINES WITH BOTTOM KERF
      if (part.id === 'north' && casket.joint.numKerfsIsEven) {
        pointStartY = -casket.joint.bottomKerfHeight;
      } else if (part.id === 'west' && ! casket.joint.numKerfsIsEven) {
        pointStartY = -casket.joint.bottomKerfHeight;
        if (pointStartY === 0) pointStartY = -casket.joint.kerfSize;
      }
    }
    if (dimensionId === 'slotDepth') {
      line(-padding, 0, padding, 0);
      translate(0, 0, part.depth/2);
      line(-padding, 0, padding, 0);
    } else if (dimensionId === 'slotWidth') {
      let pLineLen = dimLine.y*1.6;
      translate(0, pLineLen - dimLine.y*1.6 + casket.joint.kerfSize);
      line(0, 0, 0, pLineLen);
      translate(-part.depth/2, 0, 0);
      line(0, 0, 0, pLineLen);
    } else if (dimensionId === 'slotHeight') {
      push();
      rotateZ(-90);
      line(0, 0, padding*1.5 + part.depth, 0);
      line(0, dimension, padding*1.5 + part.depth, dimension);
      pop();
    } else if (dimensionId === 'slotEdgeDistance' || (part.id === 'bottom' && dimensionId === 'depth')) {
      push();
      rotateZ(-90);
      line(0, 0, padding*1.5, 0);
      line(0, dimension, padding*1.5, dimension);
      pop();
    } else {
      line(0, pointStartY, 0, dimLine.y*1.6);
      line(dimension, pointStartY, dimension, dimLine.y*1.6);
    }

    // TEXT & - IF ANY - THE ASSOCIATED LEAD/TEXT LINE
    push();
    fill(measure.rendering.text.color);
    if (part.id === 'north' && dimensionId === 'depth') {
      textAlign(LEFT);
      if (part.id !== 'bottom') {
        // LEAD/TEXT LINE >>>>>>>>>>>>>>>>>>>>>>>
        translate(dimension, 0);
        let camX = cam.getPosition()[0] / cam.getDistance();
        let rot = camX*90 - 110;
        rotateY(rot);
        line(0, dimLine.y, padding, dimLine.y);
        // <<<<<<<<<<<<<<<<<<<<<<<<<<< LEAD/TEXT LINE
        // TRANSLATE FOR TEXT
        translate(0, dimLine.y + textSize()/3);
        translate(padding + dLinePadding, 0);
      // } else if (part.id === 'bottom' && dimensionId === 'depth') {
      //   // LEAD/TEXT LINE >>>>>>>>>>>>>>>>>>>>>>>
      //   push();
      //   translate(0, dimLine.y);
      //   line(0, 0, -textSize()/5, 0);
      //   pop();
      //   // <<<<<<<<<<<<<<<<<<<<<<<<<<< LEAD/TEXT LINE
      //   // TRANSLATE FOR TEXT
      //   rotateZ(-90);
      //   translate(0, dimLine.y);
      //   translate(0, textSize()/3);
      //   translate(-dimLine.y, 0);
      //   translate(-textSize()/3, 0);
      }
    } else if (dimensionId === ('slotDepth')) {
      // LEAD/TEXT LINE >>>>>>>>>>>>>>>>>>>>>>>
      let camX = cam.getPosition()[0] / cam.getDistance();
      let minRot = 0;
      let rot = camX*90 - 20;
      rot = rot < minRot ? minRot : rot;
      let camXc = camX;
      if (camXc < 0) camXc = 0;
      translate(0, 0, padding);
      line(0, 0, 0, -casket.joint.kerfSize - padding);
      translate(0, -casket.joint.kerfSize - padding);
      rotateY(rot);
      let leadLine = part.width/2 + padding/2;
      leadLine -= camXc * (part.width/2);
      if (leadLine < padding) leadLine = padding;
      line(0, 0, -leadLine, 0);
      // <<<<<<<<<<<<<<<<<<<<<<<<<<< LEAD/TEXT LINE
      // TRANSLATE FOR TEXT
      // textSize(textSize()/1.3);
      translate(0, textSize()/3);
      translate(-leadLine -dLinePadding, 0);
      textAlign(RIGHT);
      // dimText.text = 'slot d: ' + dimText.text;
    } else if (dimensionId === 'slotWidth') {
      // LEAD/TEXT LINE >>>>>>>>>>>>>>>>>>>>>>>
      translate(dimension, 0);
      let camX = cam.getPosition()[0] / cam.getDistance();
      let minRot = 0;
      let rot = camX*90 - 20;
      if (rot < minRot) rot = 0;
      rotateY(rot);
      line(0, dimLine.y, padding, dimLine.y);
      // <<<<<<<<<<<<<<<<<<<<<<<<<<< LEAD/TEXT LINE
      // TRANSLATE FOR TEXT
      // textSize(textSize()/1.3);
      translate(0, dimLine.y + textSize()/3);
      translate(padding + dLinePadding, 0);
      textAlign(LEFT);
      dimText.text = (dimText.text-0.1);
    } else if (dimensionId === 'slotHeight') {
      // LEAD/TEXT LINE >>>>>>>>>>>>>>>>>>>>>>>
      rotateZ(90);
      line(-part.depth - padding*1.5, 0, -part.depth - padding*1.5 + - pLinePadding/2, 0);
      // <<<<<<<<<<<<<<<<<<<<<<<<<<< LEAD/TEXT LINE
      // TRANSLATE FOR TEXT
      translate(0, textSize()/3);
      translate(-part.depth - padding*1.5 - dLinePadding - pLinePadding/2, 0);
      textAlign(RIGHT);
      dimText.text = Number(dimText.text)+0.1;
    } else if (dimensionId === 'slotEdgeDistance' || (part.id === 'bottom' && dimensionId === 'depth')) {
      // LEAD/TEXT LINE >>>>>>>>>>>>>>>>>>>>>>>
      // translate(0, dimension);
      rotateZ(-90);
      line(padding*1.5, 0, padding*1.5 + pLinePadding/2, 0);
      // <<<<<<<<<<<<<<<<<<<<<<<<<<< LEAD/TEXT LINE
      // TRANSLATE FOR TEXT
      translate(0, textSize()/3);
      translate(padding*1.5 + dLinePadding + pLinePadding/2, 0);
      textAlign(LEFT);
    } else {
      translate(dimension/2, 0);
      translate(0, dimText.y);
      translate(0, textSize()/3);
    }
    text(dimText.text, 0, 0);
    pop();

    // SET ARROW & DIMENSION LINE STROKE WEIGHT FOR DEPTH & SLOT MEASUREMENTS
    let sWeight = measure.rendering.pointerLine.weight;
    // let sWeightShortDim = sWeight / (1/part.depth*25); // ADJUST TO PART DEPTH
    let sWeightShortDim = sWeight / (1/pix2mm(dimension*0.25)); // ADJUST TO DIMENSION
    // strokeWeight(sWeightShortDim > sWeight ? sWeight : sWeightShortDim);
    strokeWeight(sWeight);
    
    // DIMENSIONAL MEASUREMENT LINES, EXCEPT [NORTH] DEPTH
    strokeWeight(measure.rendering.pointerLine.weight);
    push();
    if (part.id === 'north' && dimensionId === 'depth') {
      dimLine.len *= 2;
      line(dLinePadding, dimLine.y, dimLine.len - dLinePadding, dimLine.y);
    } else if (dimensionId === 'slotDepth') {
      sWeight /= 1.5;
      sWeightShortDim /= 1.5;
      strokeWeight(sWeightShortDim > sWeight ? sWeight : sWeightShortDim);
      rotateY(-90);
      translate(-part.depth/2, 0);
      line(dLinePadding, 0, part.depth/2 - dLinePadding, 0);
      strokeWeight(measure.rendering.pointerLine.weight);
      translate(part.depth/2, 0);
      line(0, 0, padding, 0);
    } else if (dimensionId === 'slotWidth') {
      sWeight /= 1.5;
      sWeightShortDim /= 1.5;
      strokeWeight(sWeightShortDim > sWeight ? sWeight : sWeightShortDim);
      dimLine.len *= 2;
      line(dLinePadding, dimLine.y, dimLine.len - dLinePadding, dimLine.y);
    } else if (dimensionId === 'slotHeight') {
      dimLine.len *= 2;
      line(dLinePadding, -part.depth - padding, dimLine.len - dLinePadding, -part.depth - padding);
    } else if (dimensionId === 'slotEdgeDistance' || (part.id === 'bottom' && dimensionId === 'depth')) {
      dimLine.len *= 2;
      line(dLinePadding, -padding, dimLine.len - dLinePadding, -padding);
    } else {
      line(dLinePadding, dimLine.y, dimLine.len, dimLine.y);
      line(dimension - dimLine.len, dimLine.y, dimension - dLinePadding, dimLine.y);
    }
    pop();

    // if (dimensionId === 'depth' || dimensionId.startsWith('slot')) return; // NO ARROWHEADS FOR DEPTH DIMENSION OR SLOT

    // ARROWS (ARROWHEADS)
    push();
    strokeWeight(sWeightShortDim > sWeight ? sWeight : sWeightShortDim);
    let arrowX = textSize()/1.8;
    let arrowY = arrowX/1.7;
    let arrowPadding = dLinePadding;
    if (part.id === 'north' && dimensionId === 'depth') {
      translate(0, dimLine.y);
    }
    if (dimensionId === ('slotDepth')) {
      rotateX(90);
      rotateZ(90);
      translate(-part.depth/2, 0);
    }
    if (dimensionId === 'slotWidth') {
      translate(0, dimLine.y);
    }
    if (dimensionId === 'slotHeight') {
      translate(0, -part.depth - padding);
    }
    if (dimensionId === 'slotEdgeDistance' || (part.id === 'bottom' && dimensionId === 'depth')) {
      translate(0, -padding);
    }
    if (dimensionId === 'depth' || dimensionId.startsWith('slot')) {
      // TEXTSIZE() ADJUSTS FOR DISTANCE
      let arrowXshortDim = textSize()/(1/pix2mm(dimension*0.04));
      let arrowXmin = mm2pix(1.2);
      let arrowXmax1 = arrowX*0.55; // ALWAYS SMALLER THAN LARGER DIMENSION ARROWS
      let arrowXmax2 = dimension*0.4; // ALWAYS SMALLER THAN ~HALF *dimension* - AVOIDS OVERLAPPING OPPOSITE ARROWHEADS
      arrowX = arrowXshortDim > arrowXmax1 ? arrowXmax1 : arrowXshortDim;
      if (arrowX > arrowXmax2) arrowX = arrowXmax2;
      if (arrowX < arrowXmin) arrowX = arrowXmin;
      arrowY = arrowX/2; // /2
      arrowPadding /= 1.5;
    } else {
      strokeWeight(measure.rendering.pointerLine.weight);
      translate(0, dimLine.y);
    }
    line(arrowPadding, 0, arrowX, arrowY);
    line(arrowPadding, 0, arrowX, -arrowY);
    line(dimension - arrowPadding, 0, dimension - arrowX, arrowY);
    line(dimension - arrowPadding, 0, dimension - arrowX, -arrowY);
    pop();
  }

  
  
}





















