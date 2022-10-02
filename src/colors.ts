const getTempColor = (value: number) => {
  if (value <= 59) {
    return 'red';
  }
  if (value > 59 && value <= 65) {
    return 'orange';
  }
  if (value > 65 && value <= 72) {
    return 'green';
  }
  if (value > 72 && value <= 77) {
    return 'orange';
  }
  return 'red';
};

const getVOCColor = (value: number) => {
  if (value <= 100) {
    return 'green';
  }
  if (value > 100 && value <= 500) {
    return 'orange';
  }
  return 'red';
};

const getHumidityColor = (value: number) => {
  if (value <= 25) {
    return 'red';
  }
  if (value > 25 && value <= 30) {
    return 'orange';
  }
  if (value > 30 && value <= 55) {
    return 'green';
  }
  return 'red';
};

const getCO2Color = (value: number) => {
  if (value >= 1000) {
    return 'red';
  }
  if (value >= 650) {
    return 'orange';
  }
  if (value >= 390) {
    return 'green';
  }
  return 'black';
};

export { getCO2Color, getTempColor, getVOCColor, getHumidityColor };
