class Casket {
  constructor(_pos, _widthMm, _heightMm, _depthMm, _thicknessMm, _color, _material) {
    
    // OVERALL BUILD
    this.pos = _pos;
    this.posScreenCenterOffset = null; // OFFSET FROM SCREEN CENTER (to where it looks good) - SET IN updateBuild();
    
    this.widthMm = _widthMm;
    this.heightMm = _heightMm;
    this.depthMm = _depthMm;
    this.thicknessMm = _thicknessMm; // SIDE PARTS THICKNESS
    this.topBottomThicknessMm = 4;
    this.totalHeightMm = null;

    this.width = mm2pix(_widthMm);
    this.height = mm2pix(_heightMm);
    this.depth = mm2pix(_depthMm);
    this.thickness = mm2pix(_thicknessMm);
    this.topBottomThickness = mm2pix(4);
    this.totalHeight = null;

    this.innerWidth = null; // SET IN this.updateBuild()
    this.innerHeight = null;
    this.innerDepth = null;
    this.volDeciliter = null;
    
    this.joint = {
      type: 'box', // DEFAULT JOINT
      kerfSizeMm: 2.8,
      kerfSize: mm2pix(2.8),
      numKerfs: null,
      numKerfsIsEven: null,
      bottomKerfHeight: null, // SET IN this.updateBuild()
      bottomKerfHeightMm: null,
    }
    
    // UNIT SPECIFIC (box/lid)
    this.lid2boxRatio = 0.25; // 0.25
    this.lidGap = mm2pix(0.2);
    
    this.lid = {    // OBJECT PROPERTIES SET IN updateBuild()
      display: true,
      closed: true,
      dynamic: true, // ANIMATE UPON USER INPUT
      pos: null,
      heightMm: this.calcLidHeight(true),
      height: this.calcLidHeight(false),
      parts: [],
      rotation: {
        rotation: 0,
        min: 0,
        max: 120,
        direction: 1, // POSITIVE=OPENING, NEG.=CLOSING
        speed: mm2pix(0.01),
        static: true,
        startFrame: null,
      }
    };
    this.box = {
      pos: null,
      heightMm: this.calcBoxHeight(false),
      height: this.calcBoxHeight(true),
      parts: [],
    };
    
    // VISUAL
    this.material = _material;
    this.color = _color;
    this.lightEdgeColor = [this.color[0], this.color[1]*0.3, this.color[2]*1.5, 30];
    this.darkEdgeColor = [this.color[0], this.color[1]*0.4, this.color[2]*0.5];
    this.lightEdgeWeight = mm2pix(0.025);
    this.darkEdgeWeight = mm2pix(0.025);
    
    // RENDERING
    this.render = {
      // assembled: true,
      reflections: true,
      onlyVisibleGeometry: true, // *VISIBLE FROM CAM PERSPECTIVE
      animateDimension: {
        dimension: null,
        startFrame: null,
      }
    }
    
    // INFO TEXT
    this.infoText = {
      pos: null,
      sizeC: SCL * 13,
      size: null,
      text1: null,
      text2: null,
      strokeWeight: SCL*200,
      strokeColor: BACKGROUND_COLOR, // 'STROKE' NOT WORKING IN WEBGL
      fillColor: [this.color[0], this.color[1], this.color[2], 70]
    }
    
    // this.bounds = [];
    // this.setBounds();
    
    this.locations = {}; // SET IN updateBuild()
    this.updateBuild();
  }
  
  
  
  updateBuild() {
    let casket = this;
    
    if (! casket.render.animateDimension.dimension) {
      // DON'T RECALCULATE/RESIZE LID WHEN ANIMATING DIMENSION
      casket.lid.height = casket.calcLidHeight(false);
      casket.lid.heightMm = casket.calcLidHeight(true);
    }
    casket.box.height = casket.calcBoxHeight(false);
    casket.box.heightMm = casket.calcBoxHeight(true);
    casket.lid.pos = createVector(0, -casket.lid.height - casket.lidGap);
    casket.lid.parts = []; // RESET PARTS ARRAY
    casket.box.pos = createVector(0, 0, 0);
    casket.box.parts = [];
    casket.posScreenCenterOffset = createVector(0, -casket.box.height/3, 0);
    
    casket.joint.bottomKerfHeightMm = Number((casket.heightMm % casket.joint.kerfSizeMm).toFixed(5));
    casket.joint.bottomKerfHeight = Number((casket.height % casket.joint.kerfSize).toFixed(5));
    
    let totalHeightMm = casket.box.heightMm;
    totalHeightMm += casket.lid.display ? casket.lid.heightMm : 0;
    casket.totalHeightMm = totalHeightMm;
    let numKerfs = floor(totalHeightMm / casket.joint.kerfSizeMm);
    if (casket.joint.bottomKerfHeightMm > 0) numKerfs++;
    if (! casket.lid.display) numKerfs -= 2;
    casket.joint.numKerfs = numKerfs;
    casket.joint.numKerfsIsEven = numKerfs % 2 === 0 ? true : false;
      
    casket.updateLocations();
    casket.updateVolume();
    casket.makeParts();
    
    camNudge();
  }

  
  
  update() {
    this.updateLidRotation();
    this.animateDimension();
  }
  
  
  
  draw() {
    let casket = this;
    translate(casket.pos);
    translate(casket.posScreenCenterOffset);
    noStroke();

    push();
    // BOX UNIT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    for (let part of casket.box.parts) {
      part.draw('box', casket.box.pos);
    }
    // LID UNIT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    if (casket.lid.display) {
      translate(0, 0, -casket.depth/2); // SHIFT LID DRAW POSITION TO CASKET EDGE (depth/2) BEFORE ROTATION - FOR HINGED EFFECT
      let lidRot = casket.lid.rotation.rotation;
      if (lidRot !== 0) rotateX(lidRot);
      translate(0, 0, casket.depth/2); // RESTORE PREVIOUS (ROTATION) TRANSLATION BEFORE DRAW
      for (let part of casket.lid.parts) {
        part.draw('lid', casket.lid.pos);
      }
    }
    pop();
  }
  
  
  
  makeParts() {
    let casket = this;
    
    let units = [
      'box',
      'lid'
    ];
    
    for (let unit of units) {
      
      let unitHeightMm;
      if (unit == 'box') {
        unitHeightMm = casket.heightMm - casket.lid.heightMm;
      } else if (unit == 'lid') {
        unitHeightMm = casket.lid.heightMm;
      }
      
      let partsSizes = [
        // NORTH/SOUTH
        [casket.widthMm, // Width
         unitHeightMm, // Height
         casket.thicknessMm], // Depth(thickness)

        // EAST/WEST
        [casket.depthMm,
         unitHeightMm,
         casket.thicknessMm],

        // BOTTOM/TOP
        [casket.widthMm - casket.thicknessMm,
         casket.depthMm - casket.thicknessMm,
         casket.topBottomThicknessMm]
      ];
      
      let id;
      if (unit == 'box') {
        id = 'bottom';
      } else if (unit == 'lid') {
        id = 'top';
      }

      // PARTS POSITION RELATIVE TO EACHOTHER, WITHIN UNIT
      let partsPos = [
        // NORTH/SOUTH
        [0,
         0,
         casket.depth/2],
        
        // EAST/WEST
        [0,
         0,
         casket.width/2],
        
        // BOTTOM/TOP
        [0,
         -casket.depth/2 + casket.thickness/2,
         id == 'top' ? -casket.joint.kerfSize : mm2pix(unitHeightMm) - casket.joint.kerfSize]
      ]
      
      let partIds = [
        ['north', 'south'],
        ['east', 'west'],
        [id]
      ];
      
      this.compileUnitParts(unit, partsSizes, partsPos, partIds);
    }
  }

  
  
  compileUnitParts(unit, partsSizes, partsPos, partIds) {
    for (let i = 0; i < partsSizes.length; i++) {
      for (let j = 0; j < partIds[i].length; j++) {
        let w = partsSizes[i][0]; // PART WIDTH
        let h = partsSizes[i][1]; // PART HEIGHT
        let d = partsSizes[i][2]; // PART DEPTH (THICKNESS)
        let x = partsPos[i][0];
        let y = partsPos[i][1];
        let z = partsPos[i][2];
        let pos = createVector(x, y, z);
        let id = partIds[i][j];
        let parent = this;
        let material = this.material;
        // if (id == 'top') material = ashTexture;
        let part = new CasketPart(parent, id, pos, w, h, d, this.color, material);
        if (unit === 'box') {
          this.box.parts.push(part);
        } else {
          this.lid.parts.push(part);
        }
      }
    }
  }

  
  
  calcLidHeight(unitIsMm) {
    let height = this.lid2boxRatio * this.heightMm;
    let kerfSize = this.joint.kerfSizeMm;
    let wholeKerfs = floor(height / kerfSize);
    if (wholeKerfs % 2 != 0) wholeKerfs += 1;
    let lidHeight = kerfSize * wholeKerfs;
    if (! unitIsMm) lidHeight = mm2pix(lidHeight);
    return lidHeight;
  }

  
  
  calcBoxHeight(unitIsMm) {
    let height = this.heightMm - this.lid.heightMm;
    if (! unitIsMm) height = mm2pix(height);
    return height;
  }

  
  
  updateSize() {
    let widthSelect = document.getElementById('widthSelectDiv');
    let casketWidth = widthSelect.options[widthSelect.selectedIndex].value * 10;
    let heightSelect = document.getElementById('heightSelectDiv');
    let casketHeight = heightSelect.options[heightSelect.selectedIndex].value * 10;
    let depthSelect = document.getElementById('depthSelectDiv');
    let casketDepth = depthSelect.options[depthSelect.selectedIndex].value * 10;
    let thicknessSelect = document.getElementById('thicknessSelectDiv');
    let casketThickness = thicknessSelect.options[thicknessSelect.selectedIndex].value;
    
    
    casket.width = mm2pix(casketWidth);
    casket.height = mm2pix(casketHeight);
    casket.depth = mm2pix(casketDepth);
    casket.thickness = mm2pix(casketThickness);
    
    casket.widthMm = casketWidth;
    casket.heightMm = casketHeight;
    casket.depthMm = casketDepth;
    casket.thicknessMm = casketThickness;
    
    casket.updateBuild();
    plan.updateBuild();
    camUpdate();
    
    let coinDisplayStatus = coin.display;
    coins = [];
    coinInit(coinDisplayStatus);
  }

  

  updateVolume() {
    let casket = this;
    
    // CALCULATE INNER DIMENSIONS
    let innerHeight = casket.height - 2*casket.topBottomThickness - 2*casket.joint.kerfSize;
    if (! casket.lid.display) innerHeight -= (casket.lid.height - casket.topBottomThickness - casket.joint.kerfSize);
    let innerWidth = casket.width - 2*casket.thickness;
    let innerDepth = casket.depth - 2*casket.thickness;
    
    this.innerWidth = innerWidth;
    this.innerHeight = innerHeight;
    this.innerDepth = innerDepth;

    // CALCULATE VOLUME
    let innerW = pix2mm(casket.innerWidth);
    let innerH = pix2mm(casket.innerHeight);
    let innerD = pix2mm(casket.innerDepth);
    let volCubicCm = innerW/10 * innerH/10 * innerD/10;
    this.volDeciliter = Number(Number(volCubicCm/100).toFixed(1));
    
    // FORMAT CASKET INFOTEXT
    let volUnitText = ' dL';
    let vol = casket.volDeciliter;

    if (vol > 9.99) {
      vol /= 10;
      vol = vol.toFixed(1);
      volUnitText = ' liter';
    }
    
    let dimensionsText = floor(innerW) + '*' + floor(innerD) + '*' + floor(innerH);
    let volumeText = + vol + volUnitText;
    casket.infoText.text1 = volumeText;
    casket.infoText.text2 = '(' + dimensionsText + ' mm)';
  
    let boxHeightMm = pix2mm(casket.box.height); // <= _BOX_height
    let casketHeightMm = pix2mm(casket.height);
    let casketDepthMm = pix2mm(casket.depth);
    casket.infoText.size = casket.infoText.sizeC * sqrt(sqrt(boxHeightMm * casketHeightMm*casketDepthMm*0.4));
    casket.infoText.pos = createVector(0, casket.height + casket.infoText.size, casket.depth/2);
  }
  
  

  updateMaterial() {
    let material = materialSelect.value();
    if (material === 'walnut') {
      casket.material = walnutTexture;
      casket.color = [31, 95, 50];
    } else if (material === 'cherry' ) {
      casket.material = cherryTexture;
      casket.color = [31, 95, 50];
    } else if (material === 'ash' ) {
      casket.material = ashTexture;
      casket.color = [31, 50, 90];
    } else if (material === 'olive' ) {
      casket.material = oliveTexture;
      casket.color = [31, 50, 90];
    } else if (material === 'maple' ) {
      casket.material = mapleTexture;
      casket.color = [31, 50, 90];
    } else if (material === 'birch' ) {
      casket.material = birchTexture;
      casket.color = [31, 50, 90];
    }
    casket.updateBuild();
  }
  
  
  
  updateJoint() {
    casket.joint.type = jointSelect.value();
    casket.updateBuild();
    plan.updateBuild();
    
    if (jointSelect.value() === 'box') {
      plan.parts[0].animateKerfRemoval = true;
      plan.parts[0].animateKerfRemovalStartFrame = frameCount;
      plan.parts[1].animateKerfRemoval = true;
      plan.parts[1].animateKerfRemovalStartFrame = frameCount;
    }
  }

  
  
  lidDisplayToggle() {
    casket.lid.display = !casket.lid.display;
    casket.updateBuild();
    plan.updateBuild();
  }
  
  
  
  lidOpen() {
    return ! (this.lid.display && this.lid.closed);
  }
  
  
  
  updateLidRotation() {
    let casket = this;
    
    if (casket.lid.display && ! casket.lid.rotation.static) {
      
      let speed = casket.lid.rotation.speed;
      if (fpsAvg < 45) speed += (45-fpsAvg)*mm2pix(0.0007);
      
      let a = Math.abs(Math.sin((frameCount-casket.lid.rotation.startFrame)*speed))**1.5;
      let rotationSin = map(a, 0, 1, 0, casket.lid.rotation.max);

      if (rotationSin >= casket.lid.rotation.max*0.98 && casket.lid.rotation.direction == 1) {
        casket.lid.rotation.static = true;
        casket.lid.rotation.direction = -1;
        casket.lid.rotation.rotation = casket.lid.rotation.max;
        casket.lid.rotation.startFrame = frameCount;
        
      } else if (rotationSin >= casket.lid.rotation.max*0.98 && casket.lid.rotation.direction == -1) {
        casket.lid.rotation.static = true;
        casket.lid.rotation.direction = 1;
        casket.lid.rotation.rotation = casket.lid.rotation.min;
        casket.lid.rotation.startFrame = frameCount;
        casket.lid.closed = true;
      }

      if (! casket.lid.rotation.static && casket.lid.rotation.direction == 1) {
        casket.lid.closed = false;
        casket.lid.rotation.rotation = rotationSin;
      } else if (!casket.lid.rotation.static) {
        casket.lid.rotation.rotation = casket.lid.rotation.max - rotationSin;
      }
      
      return rotationSin;
    }
  }

  

  animateDimension() {
    // ANIMATE DIMENSION UPON UI SELECTOR ACTIVATION
    let animDim = this.render.animateDimension.dimension;
    let startFrame = this.render.animateDimension.startFrame;
    if (animDim && frameCount > startFrame + CAM_TRANSITION_TIME/8) {   // DELAY ANIMATION UNTIL CAM HAS BEEN RESET & INITIAL VIEW IS RESTORED
      let s = Math.sin((frameCount-startFrame)*0.1) * 0.45;
      let thicknessSelect = document.getElementById('thicknessSelectDiv');
      let casketThickness = thicknessSelect.options[thicknessSelect.selectedIndex].value;
      
      if (animDim === 'width') {
        casket.width += mm2pix(s);
        casket.widthMm += s;
      } else if (animDim === 'height') {
        casket.height += mm2pix(s);
        casket.heightMm += s;
      } else if (animDim === 'depth') {
        casket.depth += mm2pix(s);
        casket.depthMm += s;
      } else if (animDim === 'thickness') {
        casket.thickness = mm2pix(casketThickness*1.2) - mm2pix(s*4);
        casket.thicknessMm = casketThickness*1.2 - s*4;
      }
      casket.updateBuild();
    }
  }
  
  
  
  animateDimensionToggle(dimension) {
    let currAnimDim = casket.render.animateDimension.dimension;
    if (dimension && dimension !== currAnimDim) { // IF OTHER THAN null
      // START ANIMATION
      this.render.animateDimension.dimension = dimension;
      this.render.animateDimension.startFrame = frameCount;
      // CLOSE LID IF OPENED & DIMENSION = HEIGHT (FOR ESTHETICS/CLARITY)
      if (
        (dimension === 'height' && ! casket.lid.closed) ||
        (dimension === 'thickness' && casket.lid.closed)
        ) {
        casket.lid.rotation.static = ! casket.lid.rotation.static;
        casket.lid.rotation.startFrame = frameCount;
      }
      // casket.updateSize();
    } else {
      // STOP ANIMATION & RESET DIMENSION(S)
      casket.render.animateDimension.dimension = false;
      casket.updateSize();
      uiSelectJustClosed = frameCount;
    }
  }
  
  
  
  updateLocations() {
    // LOCATIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    this.locations = {
      // Outer West Bottom South corner
      outerWestBottomSouth: createVector(-this.width/2, this.box.height, this.depth/2),
      // Outer West Bottom North corner
      outerWestBottomNorth: createVector(-this.width/2,  this.box.height, -this.depth/2),
      // Outer East Bottom North corner
      outerEastBottomNorth: createVector(this.width/2,  this.box.height, -this.depth/2)
    };
    
    // BELOW LOCATIONS REFERS TO 'locations' OBJECT ABOVE AND MUST BE ADDED AFTER 'locations' OBJECT HAS INITIALIZED
    
    // Inner West Bottom North corner
    this.locations.innerWestBottomNorth =
      // Ref: Outer West Bottom North corner
      this.locations.outerWestBottomNorth.copy().add(
        // Adjust for casket parts dimensions
        this.thickness, -this.topBottomThickness, this.thickness).add(
          // Adjust for casket Bottom-part position
          0, -this.joint.kerfSize, 0);
    
    // Inner East Bottom North corner
    this.locations.innerEastBottomNorth =
      // Ref: Outer West Bottom North corner
      this.locations.outerEastBottomNorth.copy().add(
        // Adjust for casket parts dimensions
        -this.thickness, -this.topBottomThickness, this.thickness).add(
          // Adjust for casket Bottom-part position
          0, -this.joint.kerfSize, 0);
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< LOCATIONS
  }
    


//   setBounds() {
//     for (let z = 0; z < 2; z++) {
//       for (let y = 0; y < 2; y++) {
//         for (let x = 0; x < 2; x++) {
//           let v = createVector(this.width * x, this.height * y, this.depth * z);
//           this.bounds.push(v);
//         }
//       }
//     }
//   }
  
  
  
//   renderBounds(anim) {
//     push();
//     translate(-this.width/2, -this.height/2, -this.depth/2);
// noFill();
//     stroke(this.color[0], this.color[1]-30, this.color[2]-40);
//     strokeWeight(SCL*0.6);
    
//     for (let i = 0; i < this.bounds.length; i++) {
//       let v = this.bounds[i];
//       let x = v.x;
//       let y = v.y;
//       let z = v.z;

//       push();
//       translate(x, y, z);
//       sphere(this.thickness*0.3 + anim**1.1, 16, 16);

//       // COORDINATES TEXT
//       // textFont(textF);
//       // textSize(scl*31);
//       // textAlign(CENTER, TOP);
    
//       // fill(30);
//       // let textY = -textSize()*2.5 + int(textSize()*4.5 * (y/y));
//       // translate(0, textY);
//       // text(floor(x) + ',' + floor(y) + ',' + floor(z), 0, 0);
//       pop();
//     }
//     pop();
//   }
  
  
  
}



      
      



















