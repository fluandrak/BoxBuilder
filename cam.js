let camUpdate = (_rotation) => {
  // let distance = sqrt(sqrt(casket.width*casket.depth*casket.height))*17; // CHANGED FROM '...*15' 22-02-07
  
  let volume, distanceC, rotation;
  volume = casket.width*casket.depth*casket.height;
  
  
  
  // let distance;
  let distanceMinC;
  
  if (drawPlan) {
    
    let a = casket.width;
    let b = casket.depth;
    let c = casket.height * 2;
    volume = (a + b + c)**1.6;
    
    rotation = PLAN_CAM_ROTATION_INIT
    distanceC = 90;
    distanceMinC = 0.1;
    
    // distanceC = 200;
    // let wSpaceWidth = width - casket.width;
    // let wSpaceDepth = width - casket.depth;
    // let hSpace = height - casket.height;
    // let adjustTo;
    // if (wSpace > hSpace) {
    //   // adjustTo = hSpace;
    //   adjustTo = casket.height;
    // } else {
    //   // adjustTo = wSpace;
    //   adjustTo = casket.width;
    // }
    // distance = log(adjustTo) * distanceC;
    
  } else {
    rotation = CAM_ROTATION_INIT;
    distanceC = 17;
    distanceMinC = 0.4;
    // distance = sqrt(sqrt(volume))*distanceC;
  }
  
  let distance = sqrt(sqrt(volume))*distanceC;
  
  let state = cam.getState();
  state.distance = distance;
  state.rotation = rotation;
  if (_rotation) state.rotation = _rotation;
  state.center = [0, 0, 0];
  
  // let selectActive = document.getElementsByClassName("select-arrow-active").length;
  // print(selectActive);

  // if (uiSelectActive) {
  //   print(frameCount)
  //   // cam.setRotation([1, -1, 0.259, 0], CAM_TRANSITION_TIME)
  //   state.rotation = [1, -1, 0.259, 0];
  // }
  
  // print(state.rotation);
  // cam.setDistanceMin(mm2pix(distance*0.13));
  // cam.setDistanceMax(mm2pix(distance*0.45));
  cam.setDistanceMin(distance*distanceMinC);
  cam.setDistanceMax(distance*1.5);
  cam.state_reset = state;
  cam.reset(CAM_TRANSITION_TIME);
}



let camNudge = () => {    // FORCES CAM "LIGHT UPDATE"
  if (cam) {
    let state = cam.getState();
    state.distance += 0.0000001; // ADDED 2 DECIMALS 220212
    cam.setState(state);
    cam.update();
    camNudged = true;
  }
}



let camChanged = (camState, prevCamState) => {
  return (   
      camState.distance != prevCamState.distance       ||
      camState.rotation[0] != prevCamState.rotation[0] ||
      camState.rotation[1] != prevCamState.rotation[1] ||
      camState.rotation[2] != prevCamState.rotation[2] ||
      camState.rotation[3] != prevCamState.rotation[3]
    );
}













