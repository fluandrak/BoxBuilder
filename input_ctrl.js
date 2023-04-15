let inputControl = () => {
  if (casket.lid.dynamic) {
    
    let timeElapsed = millis() - tapTime;
    let threshold = 280;
    if (timeElapsed > threshold) {

      if (tapPos && numTaps < 15) {
        let ox = tapPos.x;
        let oy = tapPos.y;
        let x = cam.mouse.curr[0]
        let y = cam.mouse.curr[1];
        d = dist(ox, oy, x, y);
        // let mousePixel = get(x, y);
        // let mousePsum = mousePixel[0] + mousePixel[1] + mousePixel[2] + mousePixel[3];

        if (d < SCL*10 && (camReset == null || tapTime > camReset)) {       // && mousePsum !== 1020) {
          let selectActive = document.getElementsByClassName("select-arrow-active").length;
          // window.alert(frameCount + " - " + uiSelectJustClosed)
          if (casket.lid.display && casket.lid.rotation.static && frameCount > uiSelectJustClosed + 300) {
            casket.lid.rotation.static = ! casket.lid.rotation.static;
            casket.lid.rotation.startFrame = frameCount;
          }
          uiSelectJustClosed = null;
          closeAllSelect(); // CLOSE ALL SELECT BOXES
        }
      }

      numTaps = 0;
      tapPos = null;
    }

    if (cam.mouse.isPressed) {
      if (!tapPos) {
        let x = cam.mouse.curr[0]
        let y = cam.mouse.curr[1];
        tapPos = createVector(x, y);
      }

      numTaps++; // REALLY NOT NUMBER OF TAPS, MORE LIKE "TIME PRESSED"
      tapTime = millis();
      let x = cam.mouse.curr[0]
      let y = cam.mouse.curr[1];
    } 

  }
}












