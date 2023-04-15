let drawPlanScene = () => {
  camState = cam.getState();
  if (camChanged(camState, prevCamState) ||
      plan.ongoingMovement) {
    background(100);
    plan.update();
    plan.draw();
  }
  // if (frameCount % 10 == 0) fpsAvgCalculate();
  // drawDebugText();
  
  cam.beginHUD();   // 'cam.begin-/endHUD()' = WORKAROUND FOR CAMSTATE COMPARISON CHECK ABOVE - FAILS OTHERWISE ON MOBILE/IPHONE FOR SOME REASON (IF NOT drawDebugText() IS ACTIVE - WHICH IN TURN USES begin-/endHUD)
  cam.endHUD();
  
  prevCamState = camState;
}



















