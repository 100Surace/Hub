export function stringToArray(strValue = '', deliminator = ',') {
  const imageArray = strValue.split(deliminator);
  if (!imageArray[imageArray.lenght - 1]) {
    imageArray.pop();
  }
  return imageArray;
}

export function removeByValue(arr, value) {
  const index = arr.indexOf(value);
  if (index !== -1) {
    arr.splice(index, 1);
  }
  return arr;
}
