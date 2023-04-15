function ui() {
  // *ALL UI DIMENSION SELECTS* CONTAINER DIV
  
  let uiDimDiv = createDiv();
  uiDimDiv.class('ui-dim-div');
  uiDimDiv.id('ui-dim-div');
  
  let uiDimensionSelects = {
    width: [CASKET_WIDTH_MIN/10,  // MIN SIZE
            CASKET_WIDTH_MAX/10,  // MAX SIZE
            CASKET_WIDTH_INIT,    // INIT SIZE
            1],                   // STEP SIZE
    depth: [CASKET_DEPTH_MIN/10,
            CASKET_DEPTH_MAX/10,
            CASKET_DEPTH_INIT,
            1],
    height: [CASKET_HEIGHT_MIN/10,
             CASKET_HEIGHT_MAX/10,
             CASKET_HEIGHT_INIT,
             1],
    thickness: [CASKET_THICKNESS_MIN,
                CASKET_THICKNESS_MAX,
                CASKET_THICKNESS_INIT,
                1]
  }
  
  let dimDiv; // dim = dimension
  let dimWrapperDiv;
  let html;
  for (let [dimension, value] of Object.entries(uiDimensionSelects)) {
    dimWrapperDiv = createDiv();
    dimWrapperDiv.class('dim-wrapper-div');
    dimWrapperDiv.id(dimension+'-wrapper-div');
    dimWrapperDiv.parent(uiDimDiv);
    dimDiv = createDiv();
    dimDiv.class('custom-select');
    dimDiv.id(dimension+'-select');
    dimDiv.parent(dimWrapperDiv);
    html = '<select id="' + dimension + 'SelectDiv">';
    for (let i = value[0]; i < value[1]+1; i+=value[3]) {
      html += '<option ';
      if (i*10 === value[2] || i === value[2]) html += 'selected ';
      html += 'value=' + i + '>' + i +'</option>';
    }
    html += '</select>';
    dimDiv.html(html);
  }
  
  
  
  let customSelect;
  let customSelectLen;
  let customSelectIndex;
  let selectElement;
  let selectElementLen;
  let optionIndex;

  let selectSelectedDiv;
  let selectItemsDiv;
  let selectItemsWrapperDiv;
  let topFadeoutDiv;
  let bottomFadeoutDiv;
  let selectOptionDiv;
  let bottomSelectSpaceDiv;
  
  let dimensionLabel;
  let dimensionUnit = '';
  let selectItemsWrapperId;
  let dimWrapperId;
  let topFadeoutId;
  let bottomFadeoutId;
  
  /* Look for any elements with the class "custom-select": */
  customSelect = document.getElementsByClassName("custom-select");
  customSelectLen = customSelect.length;
  
  for (customSelectIndex = 0; customSelectIndex < customSelectLen; customSelectIndex++) {
    selectElement = customSelect[customSelectIndex].getElementsByTagName("select")[0];
    selectElementLen = selectElement.length;
    /* For each element, create a new DIV that will act as the selected item: */
    let [dimension, dimensionLabel, dimensionUnit] = setDimLabelAndUnit(selectElement.id);
    let dimensionValue = selectElement.options[selectElement.selectedIndex].innerHTML;
    
    let dimensionValueAndUnitDiv = document.createElement('div');
    dimensionValueAndUnitDiv.setAttribute('class', 'select-selected-dimension-value-and-unit-div');
    let dimensionValueDiv = document.createElement('div');
    dimensionValueDiv.setAttribute('class', 'select-selected-dimension-value');
    dimensionValueDiv.innerHTML = dimensionValue;
    let dimensionUnitDiv = document.createElement('div');
    dimensionUnitDiv.setAttribute('class', 'select-selected-dimension-unit');
    dimensionUnitDiv.innerHTML = dimensionUnit;
    let dimensionLabelDiv = document.createElement('div');
    dimensionLabelDiv.setAttribute('class', 'select-selected-dimension-label');
    dimensionLabelDiv.innerHTML = dimensionLabel;
    selectSelectedDiv = document.createElement('div');
    selectSelectedDiv.setAttribute('class', 'select-selected');
    
    dimensionValueAndUnitDiv.appendChild(dimensionValueDiv);
    dimensionValueAndUnitDiv.appendChild(dimensionUnitDiv);
    selectSelectedDiv.appendChild(dimensionValueAndUnitDiv);
    selectSelectedDiv.appendChild(dimensionLabelDiv);    customSelect[customSelectIndex].appendChild(selectSelectedDiv);
    
    

    /* For each element, create a new DIV that will contain the option list: */
    selectItemsWrapperDiv = document.createElement('div');
    selectItemsWrapperDiv.setAttribute('class', 'select-items-wrapper-div select-hide');
    selectItemsWrapperId = dimension + '-select-items-wrapper-div';
    selectItemsWrapperDiv.setAttribute('id', selectItemsWrapperId);
    selectItemsDiv = document.createElement('div');
    selectItemsDiv.setAttribute('class', 'select-items');

    for (optionIndex = 0; optionIndex < selectElementLen; optionIndex++) {
      /* For each option in the original select element,
      create a new DIV that will act as an option item: */
      selectOptionDiv = document.createElement('div');
      selectOptionDiv.innerHTML =  selectElement.options[optionIndex].innerHTML;
      let optionValue = Number(selectOptionDiv.innerHTML);
      if (
        (dimension === 'width' && optionValue === casket.widthMm/10) || 
        (dimension === 'height' && optionValue === casket.heightMm/10) || 
        (dimension === 'depth' && optionValue === casket.depthMm/10) || 
        (dimension === 'thickness' && optionValue === casket.thicknessMm)
      ) {
          selectOptionDiv.setAttribute('class', 'same-as-selected');
      }
      
      
      
      selectOptionDiv.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box, and the selected item: */
        
        let originalSelect;
        let originalSelectLen;
        let originalSelectIndex;
        let sameAsSelected;
        let sameAsSelectedLen;
        let sameAsSelectedIndex;
        let previousSibling;
        
        originalSelect = this.parentNode.parentNode.parentNode.getElementsByTagName("select")[0];
        originalSelectLen = originalSelect.length;
        previousSibling = this.parentNode.parentNode.previousSibling;
        for (originalSelectIndex = 0; originalSelectIndex < originalSelectLen; originalSelectIndex++) {
          if (originalSelect.options[originalSelectIndex].innerHTML == this.innerHTML) {
            originalSelect.selectedIndex = originalSelectIndex;

            let [dimension, dimensionLabel, dimensionUnit] = setDimLabelAndUnit(originalSelect.id);
            let dimensionValue = this.innerHTML;
            
            previousSibling.children[0].children[0].innerHTML = dimensionValue;
            
            sameAsSelected = this.parentNode.getElementsByClassName('same-as-selected');
            sameAsSelectedLen = sameAsSelected.length;
            for (sameAsSelectedIndex = 0; sameAsSelectedIndex < sameAsSelectedLen; sameAsSelectedIndex++) {
              sameAsSelected[sameAsSelectedIndex].removeAttribute('class');
            }
            this.setAttribute('class', 'same-as-selected');
            break;
          }
        }
        previousSibling.click();
      });
      selectItemsDiv.appendChild(selectOptionDiv);
      selectItemsWrapperDiv.appendChild(selectItemsDiv);
    }
    
    topFadeoutId = dimension + '-top-fadeout-div';
    bottomFadeoutId = dimension + '-bottom-fadeout-div';
    
    bottomFadeoutDiv = document.createElement('div');
    bottomFadeoutDiv.setAttribute('class', 'bottom-fadeout-div');
    bottomFadeoutDiv.setAttribute('id', bottomFadeoutId);
    topFadeoutDiv = document.createElement('div');
    topFadeoutDiv.setAttribute('class', 'top-fadeout-div');
    topFadeoutDiv.setAttribute('id', topFadeoutId);
    
    dimWrapperId = dimension + '-wrapper-div';
    let dimWrapperElement = document.getElementById(dimWrapperId);
    dimWrapperElement.appendChild(topFadeoutDiv);
    dimWrapperElement.appendChild(bottomFadeoutDiv);
    customSelect[customSelectIndex].appendChild(selectItemsWrapperDiv);
    
    // let dimensionLabelVerticalDiv = document.createElement('div');
    // dimensionLabelVerticalDiv.setAttribute('class', 'select-selected-dimension-label-vertical');
    // dimensionLabelVerticalDiv.innerHTML = dimension;
    // customSelect[customSelectIndex].appendChild(dimensionLabelVerticalDiv);    
    


    selectSelectedDiv.addEventListener("click", function(e) {
      /* When the select box is clicked, close any other select boxes, and open/close the current select box: */
      uiSelectActive = true;
      camUpdate();
      e.stopPropagation();
      closeAllSelect(this, customSelect);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
      
      
      
      toggleUiDimensionSelect(dimension, true);
    });
    
    /*
    selectItemsWrapperElement = document.getElementById(selectItemsWrapperId);
    let dimFadeoutId = dimension + '-fadeout-div';
    let dimFadeoutElement = document.getElementById(dimFadeoutId);
    
    let container = selectItemsWrapperElement;
    let fadeout = dimFadeoutElement;
    let numOptions = container.getElementsByClassName('select-items')[0].children.length;
    
    container.addEventListener("scroll", function(e) {
      
      // let scrollPosRatio = scrollPos / container.clientHeight;
      
      let scrollPos = container.scrollTop / 2;
      let rowHeight = container.clientHeight / numOptions;
      let threshold = container.clientHeight - rowHeight;
      
      if (scrollPos > threshold) {
        let opacity = 1 - scrollPos / container.clientHeight;
        fadeout.style.opacity = opacity;
      }
      
    });
    */
    
  } // END OF 'CUSTOM SELECT' CREATION (FOR LOOP)


  
  /* If the user clicks anywhere outsilet select box,
  then close all select boxes: */
  document.addEventListener("click", closeAllSelect);
}





function closeAllSelect(elmnt, x) {
  
  /* A function that will close all select boxes in the document, except the current select box: */
  let y, i, xl, yl, arrNo = [];
  let customSel, customSelDiv
  x = document.getElementsByClassName("select-items-wrapper-div");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  
    for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
  
  
  
  // IDENTIFY ACTIVE MENU & INIT uiCloseEvents()
  let animDimension = null;
  try {    // IS OBJECT AN HTML ELEMENT?
    if (elmnt.classList) {
      animDimension = elmnt.parentNode.id.replace('-select','');
    }
  } catch (error) {}
  uiCloseEvents(animDimension);
}



uiCloseEvents = (dimension) => {
  
  // TOGGLE CASKET DIMENSIONAL/RESIZING ANIMATION
  if (dimension || casket.render.animateDimension.dimension) casket.animateDimensionToggle(dimension);
  
  // SET DIRECTIONAL ARROW TO SELECTED DIMENSION (IF ANY)
  arrow.update(dimension);
  
  // SET CAM ROTATION TO MATCH SELECTED DIMENSION (IF ANY - OTHERWISE RESET TO INITIAL ROTATION)
  let state = cam.getState();
  let rot = CAM_ROTATION_INIT;
  if (dimension === 'width') {
    rot = [1, -0.35, 0.150, 0];
  } else if (dimension === 'depth') {
    rot = [1, -0.5, 0.4, -0.2];
  } else if (dimension === 'height') {
    rot = [1, -0.2, 0.35, 0];
  } else if (dimension === 'thickness') {
    rot = [1, -0.45, -0.25, 0];
  }
  state.rotation = rot;
  if (dimension && ! drawPlan) camUpdate(rot);
  
  
    
  toggleUiDimensionSelect(dimension, false);
}



setDimLabelAndUnit = (selectElementId) => {
  let dimension = selectElementId.replace('SelectDiv', '');
  let dimensionLabel = dimension.toUpperCase();
  if (dimension === 'width') {
    dimensionLabel = 'LENGTH';
  } else if (dimension === 'depth') {
    dimensionLabel = 'WIDTH';
  }
  let dimensionUnit = "cm";
  if (dimension === 'thickness') dimensionUnit = 'mm';
  return [dimension, dimensionLabel, dimensionUnit];
}



toggleUiDimensionSelect = (dimension, doUpdateCam) => {
  // TOGGLE (HIDDEN) SELECT DIV _HEIGHT_ TO AVOID INTERFERENCE WITH BOX MOUSE/TOUCH 3D-NAVIGATION & INTERACTION
  
  let selectItemsWrapperId = dimension + '-select-items-wrapper-div'
  let dimTopFadeoutId = dimension + '-top-fadeout-div';
  let dimBottomFadeoutId = dimension + '-bottom-fadeout-div';
  let selectActive = document.getElementsByClassName('select-arrow-active').length;
  let uiDimElement = document.getElementById('ui-dim-div');

  if(selectActive) {
    uiSelectActive = true;

    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    fontSize =  parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);
    uiDimElement.style.height = (fontSize*14.5).toString() + "px"; //'30vh';
    selectItemsWrapperElement = document.getElementById(selectItemsWrapperId);
    if (selectItemsWrapperElement.scrollHeight > selectItemsWrapperElement.clientHeight) {
      document.getElementById(dimTopFadeoutId).style.display = 'block';
      document.getElementById(dimBottomFadeoutId).style.display = 'block';
    }
  } else {
    uiSelectActive = false;
    uiDimElement.style.height = '';
    let topFadeoutDivElements = document.getElementsByClassName('top-fadeout-div');
    let bottomFadeoutDivElements = document.getElementsByClassName('bottom-fadeout-div');
    for (let i = 0; i < topFadeoutDivElements.length; i++) {
      topFadeoutDivElements[i].style.display = 'none';
    }
    for (let i = 0; i < bottomFadeoutDivElements.length; i++) {
      bottomFadeoutDivElements[i].style.display = 'none';
    }
    if (doUpdateCam) camUpdate(); // DON'T RUN WHEN INVOKED BY uiCloseEvents() !!
  }

}
















