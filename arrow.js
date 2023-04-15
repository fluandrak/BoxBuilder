class Arrow {
  constructor() {
    this.display = false;
    
    // DIMENSIONAL
    this.pos = createVector();
    this.dimension = null;
    this.scaleLength = null;
    this.scaleLengthCoef = -0.0093;
    this.scaleHeight = mm2pix(-0.25);
    this.scaleWidthBase = mm2pix(0.8);
    this.scaleWidth = this.scaleWidthBase; //CALC IN UPDATE()
    this.scaleWidthCoef = 0.001;
    this.paddingBase = 0; // ARROW<>BOX SPACING
    this.padding = this.paddingBase; //CALC IN UPDATE()
    this.paddingCoef = 12;
    this.yRotation = null;
    this.zRotation = null;
    
    // VISUALS
    this.color = [165, 100, 41, 69];
    this.shininess = 100;
    this.model1head = arrow1headModel;
    this.model2heads = arrow2headsModel;
    
    // TEXT
    this.text = {
      pos: createVector(0,
                        null,
                        mm2pix(1.6)),
      textSizeBase: mm2pix(0),
      textSize: null, //CALC IN UPDATE()
      textSizeCoef: 8,
      align: CENTER,
      color: 0,
    }
    
    this.update();
  }
  
  
  
  update(_dimension) {
    let dim = _dimension;
    this.dimension = dim;
    this.text.textSize = this.text.textSizeBase;
    
    if (dim === 'width') {
      
      this.display = true;
      
      // SCALING
      this.scaleLength = this.scaleLengthCoef * casket.width;
      this.scaleWidth = this.scaleWidthBase + casket.width * this.scaleWidthCoef;
      
      this.padding = this.paddingBase + this.scaleWidth * this.paddingCoef;
    
      // ORIENTATION
      this.yRotation = 0;
      this.zRotation = 0;
      this.pos.x = 0;
      this.pos.z = casket.depth/2 + this.padding;
      this.pos.y = casket.box.height;

    } else if (dim === 'depth') {
      
      this.display = true;
      
      // SCALING
      this.scaleLength = this.scaleLengthCoef * casket.depth;
      this.scaleWidth = this.scaleWidthBase + casket.depth * this.scaleWidthCoef;
      
      this.padding = this.paddingBase + this.scaleWidth * this.paddingCoef;

      // ORIENTATION
      this.pos.x = -casket.width/2 - this.padding;
      this.pos.y = casket.box.height;
      this.pos.z = 0;
      this.yRotation = 90;
      this.zRotation = 0;
      
    } else if (dim === 'height') {
      
      this.display = true;
      
      // ORIENTATION & SCALING
      if (casket.lid.display) {
        this.pos.y = -casket.totalHeight/2;
        this.scaleLength = this.scaleLengthCoef * casket.height;
      } else {
        this.pos.y = -casket.totalHeight/2 - casket.posScreenCenterOffset.y/2;
        this.scaleLength = this.scaleLengthCoef*1.3 * casket.box.height;
        
      }
      this.scaleWidth = this.scaleWidthBase + casket.depth * this.scaleWidthCoef;
      this.padding = this.paddingBase + this.scaleWidth * this.paddingCoef;
      
      // ORIENTATION
      this.yRotation = 90;
      this.zRotation = 90;
      this.pos.x = -casket.width/2 - this.padding;
      this.pos.z = casket.depth/2;
      
    } else if (dim === 'thickness') {
      
      this.display = true;
      
      // SCALING
      this.scaleLength = -sqrt(sqrt(casket.width)) * 1.3;
      this.scaleWidth = this.scaleWidthBase + casket.depth * this.scaleWidthCoef;
      
      this.padding = this.paddingBase + this.scaleWidth * this.paddingCoef*0.1;
    
      // ORIENTATION
      this.yRotation = 180;
      this.zRotation = 0;
      this.pos.x = casket.width/2 - this.padding;
      this.pos.z = casket.depth/2 - casket.thickness - this.scaleWidth*15;
      this.pos.y = 0;
      
    }
    
    this.text.textSize = sqrt(-this.scaleLength * this.scaleWidth) * this.text.textSizeCoef;
    this.text.pos.y = this.text.textSize * 0.4;
    
    if (this.dimension !== 'thickness') {
      this.text.pos.x = 0;
    } else {
      this.text.textSize = sqrt(-this.scaleLength * this.scaleWidth) * this.text.textSizeCoef*0.8;
      this.text.pos.x = this.text.textSize*3 + this.scaleLength*45;
      this.text.pos.y = this.text.textSize * 0.4;
    }
    
  } // update() END
  
  
  
  draw() {
    
    if (! uiSelectActive || !this.display) return;
    
    push(); // *EVERYTHING ARROW (INCL. DIM. LABEL)*

    translate(this.pos);

    if (this.dimension === 'height') {
      translate(0, -casket.posScreenCenterOffset.y);
    }
    
    
    
    push(); // ARROW(S) >>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    rotateY(this.yRotation);
    rotateZ(this.zRotation);
    
    if (this.dimension === 'thickness') push(); // NON-THICKNESS DIMENSION POP - OTHER SCALING SETTINGS ETC.
    scale(this.scaleLength,
          this.scaleHeight,
          this.scaleWidth);
    
    noStroke();
    specularMaterial(this.color);
    shininess(this.shininess);
    if (this.dimension !== 'thickness') {
      model(this.model2heads);
    } else {
      pop(); // END NON-THICKNESS DIMENSION PUSH
      
      push(); // OUTER ARROW >>>>>>>>>>>
      translate(-this.padding*2, 0);
      scale(this.scaleLength, this.scaleHeight, this.scaleWidth);
      noStroke();
      specularMaterial(this.color);
      shininess(this.shininess);
      model(this.model1head);
      pop(); // <<<<<<<<<<<<<<<< OUTER ARROW
      
      push(); // INNER ARROW >>>>>>>>>>>>>
      rotateY(180);
      translate(-casket.thickness, 0);
      scale(this.scaleLength, this.scaleHeight, this.scaleWidth);
      noStroke();
      specularMaterial(this.color);
      shininess(this.shininess);
      model(this.model1head);
      pop(); // <<<<<<<<<<<<<<< INNER ARROW
    }
    
    pop(); // <<<<<<<<<<<<<<<<<<<<<<< ARROW(S)
    
    
    
    push(); // DIM. TEXT LABEL >>>>>>>>>>>>>>
    
    rotateX(90);
    let dimensionLabel;
    if (this.dimension === 'width') {
      dimensionLabel = 'length';
    } else if (this.dimension === 'depth') {
      rotateZ(90);
      dimensionLabel = 'width';
    } else if (this.dimension === 'height') {
      rotateZ(90);
      rotateY(90);
      translate(mm2pix(-2), 0);
      dimensionLabel = 'height';
    } else if (this.dimension === 'thickness') {
      // rotateZ(-90);
      rotateY(0);
      translate(mm2pix(-2), 0);
      dimensionLabel = 'thickness';
    }
    textSize(this.text.textSize);
    textAlign(this.text.align);
    fill(this.text.color);
    translate(this.text.pos);
    if (this.dimension === 'thickness') {
      
      // OUTER ARROW
      push();
      translate(-this.scaleLength*45*1.37 - this.padding, 0);
      text(dimensionLabel, 0, 0);
      pop();
      
      // INNER ARROW
      translate(-casket.thickness, 0);
    }
    text(dimensionLabel, 0, 0);
    
    pop(); // <<<<<<<<<<<<<<< DIM. TEXT LABEL
    
    
    
    pop(); // *EVERYTHING ARROW*
    
  }
  
  
  
  displayToggle() {
    arrow.display = !arrow.display;
    camNudge();
  }
  
}















