let doExperimental = () => {
  
  push(); // *EVERYTHING EXPERIMENT*
  // drawTestOverlay();
  // drawReferenceBox();
  // drawReferencePlane();
  pop(); // *EVERYTHING EXPERIMENT*

}



let drawTestOverlay = () => {
  cam.beginHUD();
  stroke(0);
  fill(100, 50);
  strokeWeight(mm2pix(0.5));
  rect(width*0.01, height*0.01, width*0.98, height*0.98);
  cam.endHUD();
}



let drawReferenceBox = () => {
  let box1 = {
    width: casket.innerWidth/2,
    height: casket.box.height - casket.topBottomThickness - casket.joint.kerfSize,
    depth: casket.innerDepth/2
  }
  let box2 = {
    width: mm2pix(10),
    height: mm2pix(10),
    depth: mm2pix(10)
  }
  
  strokeWeight(mm2pix(1));
  stroke(60, 100, 100);
  fill(60, 100, 100, 30);
  
  push();
  translate(casket.locations.innerEastBottomNorth);
  translate(-box1.width/2, -box1.height/2, box1.depth/2);
  box(box1.width, box1.height, box1.depth);
  pop();
  push();
  translate(casket.locations.innerWestBottomNorth);
  translate(box2.width/2, -box2.height/2, box2.depth/2);
  box(box2.width, box2.height, box2.depth);
  pop();
}



let drawReferencePlane = () => {
  push();
  rotateX(90);
  fill(60, 100, 100, 20);
  stroke(60, 100, 100);
  rect(0, 0, casket.width, casket.depth);
  pop();
}























