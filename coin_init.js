let coinInit = (_coinDisplayStatus) => {
  let displayDefault = false;
  let coinDisplay = (_coinDisplayStatus === undefined) ? displayDefault : _coinDisplayStatus;
  
  let rawScale = 0.8; // Rescaled below according to pixels
  let coinScale = mm2pix(rawScale);
  let coinSize = mm2pix(30) * rawScale; // Model diameter: 30mm
  
  let minPadding = casket.thickness/2; // Minimum amount of padding
  let space;
  
  // POPULATE ROW AND COLUMN ARRAYS
  let numCoinsInRow = sumCoins(casket.innerWidth, coinSize, minPadding);
  let numRows = sumCoins(casket.innerDepth, coinSize, minPadding);
  
  let [zStart, zSpacing] = calcCoinSpacing(casket.innerDepth, numRows, coinSize);
  
  for (let row = 0; row < numRows; row++) {
    let z = zStart + row * zSpacing;
    coins.push([]);
    
    for (let coin = 0; coin < numCoinsInRow; coin++) {
      let id = (row+1)*coin;
      coins[row].push(new Coin(id, coinScale, coinDisplay));
    }
    
    // UPDATE COIN OBJECTS WITH COORDINATES
    let [xStart, xSpacing] = calcCoinSpacing(casket.innerWidth, numCoinsInRow, coinSize);

    for (let coin = 0; coin < coins[row].length; coin++) {
      let x = xStart + coin * xSpacing;
      let coinPosUpdate = createVector(x, 0, z);
      coins[row][coin].pos.add(coinPosUpdate);
    }
  }
  
  if (coins.length) {    // ANY COIN ROWS?
    if (coins[0].length) {    // ANY COINS IN ROW 0?
      coin = {
        display: coins[0][0].display,
      }
    }
  }
}



function calcCoinSpacing(space, numCoins, coinSize) {
  let numPaddings = numCoins + 1;
  let totPadding = space - numCoins * coinSize;
  let padding = totPadding / numPaddings;
  let spacing = padding + coinSize;
  let axisStart = -space/2 - coinSize/2;
  axisStart += padding + coinSize;
  
  return [axisStart, spacing];
}



function sumCoins(space, coinSize, minPadding) {
  space -= minPadding;
  let numCoins = 0;
  let maxCoins = 1000; // SAFETY LIMIT - MAX # OF TRIES IN WHILE LOOP

  while (space / coinSize > 1 && numCoins < maxCoins) {
    space -= (minPadding + coinSize);
    numCoins++;
  }

  return numCoins;
}



















