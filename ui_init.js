let uiInit = () => {

  // NEW STYLE CONTROLS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  
//   // *ALL DIMENSION SELECTS* CONTAINER DIV
//   let dimDiv = createDiv();
//   dimDiv.class("dim-div");
//   dimDiv.id('dim-div');
  
//   let html;
  
//   // DIMENSION SELECT: WIDTH
//   let widthSelectWrapperDiv = createDiv();
//   widthSelectWrapperDiv.class('wrapper-div');
//   widthSelectWrapperDiv.id('width-wrapper-div');
//   widthSelectWrapperDiv.parent(dimDiv);
//   let widthFadeoutDiv = createDiv();
//   widthFadeoutDiv.class('fadeout-div');
//   widthFadeoutDiv.id('width-fadeout-div');
//   widthFadeoutDiv.parent(widthSelectWrapperDiv);
//   html = '<select id="widthSelectDiv">';
//   let widthSelectDiv = createDiv();
//   widthSelectDiv.parent(widthSelectWrapperDiv);
//   // widthSelectDiv.parent(dimDiv);
//   widthSelectDiv.class("custom-select");
//   widthSelectDiv.id("width-select");
//   for (let i = CASKET_WIDTH_MIN/10; i <= CASKET_WIDTH_MAX/10; i++) {
//     html += '<option ';
//     if (i*10 === CASKET_WIDTH_INIT) html += 'selected ';
//     html += 'value=' + i + '>' + i +'</option>';
//   }
//   html += '</select>';
//   widthSelectDiv.html(html);
  
//   // DIMENSION SELECT: DEPTH
//   let depthSelectWrapperDiv = createDiv();
//   depthSelectWrapperDiv.class('wrapper-div');
//   depthSelectWrapperDiv.id('depth-wrapper-div');
//   depthSelectWrapperDiv.parent(dimDiv);
//   let depthFadeoutDiv = createDiv();
//   depthFadeoutDiv.class('fadeout-div');
//   depthFadeoutDiv.id('depth-fadeout-div');
//   depthFadeoutDiv.parent(depthSelectWrapperDiv);
//   html = '<select id="depthSelectDiv">';
//   let depthSelectDiv = createDiv();
//   depthSelectDiv.parent(depthSelectWrapperDiv);
//   depthSelectDiv.class("custom-select");
//   depthSelectDiv.id("depth-select");
//   for (let i = CASKET_DEPTH_MIN/10; i <= CASKET_DEPTH_MAX/10; i++) {
//     html += '<option ';
//     if (i*10 === CASKET_DEPTH_INIT) html += 'selected ';
//     html += 'value=' + i + '>' + i +'</option>';
//   }
//   html += '</select>';
//   depthSelectDiv.html(html);
  
//   // DIMENSION SELECT: HEIGHT
//   let heightSelectWrapperDiv = createDiv();
//   heightSelectWrapperDiv.class('wrapper-div');
//   heightSelectWrapperDiv.id('height-wrapper-div');
//   heightSelectWrapperDiv.parent(dimDiv);
//   let heightFadeoutDiv = createDiv();
//   heightFadeoutDiv.class('fadeout-div');
//   heightFadeoutDiv.id('height-fadeout-div');
//   heightFadeoutDiv.parent(heightSelectWrapperDiv);
//   html = '<select id="heightSelectDiv">';
//   let heightSelectDiv = createDiv();
//   heightSelectDiv.parent(dimDiv);
//   heightSelectDiv.class("custom-select");
//   heightSelectDiv.id("height-select");
//   for (let i = CASKET_HEIGHT_MIN/10; i <= CASKET_HEIGHT_MAX/10; i++) {
//     html += '<option ';
//     if (i*10 === CASKET_HEIGHT_INIT) html += 'selected ';
//     html += 'value=' + i + '>' + i +'</option>';
//   }
//   html += '</select>';
//   heightSelectDiv.html(html);
  
//   // DIMENSION SELECT: THICKNESS
//   let thicknessSelectWrapperDiv = createDiv();
//   thicknessSelectWrapperDiv.class('wrapper-div');
//   thicknessSelectWrapperDiv.id('thickness-wrapper-div');
//   thicknessSelectWrapperDiv.parent(dimDiv);
//   let thicknessFadeoutDiv = createDiv();
//   thicknessFadeoutDiv.class('fadeout-div');
//   thicknessFadeoutDiv.id('thickness-fadeout-div');
//   thicknessFadeoutDiv.parent(thicknessSelectWrapperDiv);
//   html = '<select id="thickSelectDiv">';
//   let thickSelectDiv = createDiv();
//   thickSelectDiv.parent(dimDiv);
//   thickSelectDiv.class("custom-select");
//   thickSelectDiv.id("thickness-select");
//   for (let i = CASKET_THICKNESS_MIN; i <= CASKET_THICKNESS_MAX; i+=3) {
//     html += '<option ';
//     if (i === CASKET_THICKNESS_INIT) html += 'selected ';
//     html += 'value=' + i + '>' + i +'</option>';
//   }
//   html += '</select>';
//   thickSelectDiv.html(html);
  
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< NEW STYLE CONTROLS
  

  
  // OLD STYLE CONTROLS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  
  // SCENE TOGGLE
  drawPlanCheckbox = createCheckbox('', drawPlan);
  drawPlanCheckbox.style(`transform: scale(${UI_SCL*1.1}`);
  // drawPlanCheckbox.position(drawPlanCheckbox.height*UI_SCL/2.5, drawPlanCheckbox.height*UI_SCL/2);
  drawPlanCheckbox.position(drawPlanCheckbox.height*UI_SCL/2.5, height/2);
  drawPlanCheckbox.changed(drawPlanToggle);

  // LID DISPLAY TOGGLE
  lidCheckbox = createCheckbox('', casket.lid.display);
  lidCheckbox.style(`transform: scale(${UI_SCL*1.25}`);
  lidCheckbox.position(width/2, height-lidCheckbox.height-UI_PADDING*2.5);
  lidCheckbox.changed(casket.lidDisplayToggle);
  
  // RULER DISPLAY TOGGLE
  rulerCheckbox = createCheckbox('', ruler.display);
  rulerCheckbox.style(`transform: scale(${UI_SCL*1.1}`);
  rulerCheckbox.position(width-rulerCheckbox.height*UI_SCL, height/2 - rulerCheckbox.height*UI_SCL/2);
  rulerCheckbox.changed(ruler.displayToggle);
  
  // COIN DISPLAY TOGGLE
  coinCheckbox = createCheckbox('', coin.display);
  coinCheckbox.style(`transform: scale(${UI_SCL*1.1}`);
  coinCheckbox.position(width-coinCheckbox.height*UI_SCL, rulerCheckbox.y + coinCheckbox.height*UI_SCL);
  coinCheckbox.changed(coins[0][0].displayToggle);
  
  // MATERIAL
  materialSelect = createSelect();
  materialSelect.option('ash');
  materialSelect.option('birch');
  materialSelect.option('cherry');
  materialSelect.option('maple');
  materialSelect.option('olive');
  materialSelect.option('walnut');
  materialSelect.selected('walnut');
  materialSelect.style(`transform: scale(${UI_SCL}`);
  materialSelect.position(materialSelect.width*UI_SCL/2 + UI_PADDING*3, height - materialSelect.height - UI_PADDING*2);
  materialSelect.changed(casket.updateMaterial);
  
  //JOINT
  jointSelect = createSelect();
  jointSelect.html('id=jointSelect', true);
  jointSelect.option('box');
  jointSelect.option('mitered');
  // jointSelect.hide();
  jointSelect.position(width - jointSelect.width*2*UI_SCL - UI_PADDING*2, height - jointSelect.height - UI_PADDING*2);
  jointSelect.style(`transform: scale(${UI_SCL}`);
  jointSelect.changed(casket.updateJoint);
  
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<< OLD STYLE CONTROLS
}



let drawPlanToggle = () => {
  drawPlan = ! drawPlan;
  let pixDens = drawPlan ? PIX_DENS_INIT : PIX_DENS_MIN;
  pixelDensity(pixDens);
  camUpdate();
  // camNudge();
}



let defaultTextSetup = () => {
  textFont(textF);
  textAlign(CENTER);
  fill(casket.color);
  textSize(SCL*100);
}







/*
class UiControl {
  constructor(_id, _parent, _label, _options, _selected, _changed) {
    this.id = _id;
    this.parent = _parent;
    this.label = _label;
    this.options = _options;
    this.selected = _selected;
    this.changed = _changed;
  }
}

class UiPanel {
  constructor(_id, _pos, _size) {
    this.id = _id;
    this.pos = _pos;
    this.size = _size;
    this.controls = [];
  }
  
  initialize() {
    let controlData = [
      
    ]
  }
  
  draw() {
    cam.beginHUD();
    // ...........................
    // ...........................
    // ...........................
    cam.endHUD();
  }
}
*/


















