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
  return 'red';
};

const colors:{color: string, ppm: number, deg: number}[] = [
  {
    color: "rgb(250, 201, 250)",
    deg: 120,
    ppm: 1400,
  },
  {
    color: "rgb(255, 0, 255)",
    deg: 115,
    ppm: 1300,
  },
  {
    color: "rgb(255, 56, 130)",
    deg: 110,
    ppm: 1200,
  },
  {
    color: "rgb(255, 23, 54)",
    deg: 105,
    ppm: 1100,
  },
  {
    color: "rgb(255, 21, 0)",
    deg: 100,
    ppm: 1000,
  },
  {
    color: "rgb(255, 181, 0)",
    deg: 95,
    ppm: 1000,
  },
  {
    color: "rgb(241, 231, 0)",
    deg: 90,
    ppm: 900,
  },
  {
    color: "rgb(188, 255, 0)",
    deg: 85,
    ppm: 800,
  },
  {
    color: "rgb(0, 215, 0)",
    deg: 80,
    ppm: 700,
  },
  {
    color: "rgb(0, 170, 136)",
    deg: 75,
    ppm: 600,
  },
  {
    color: "rgb(0, 138, 221)",
    deg: 70,
    ppm: 400,
  },
  {
    color: "rgb(0, 47, 221)",
    deg: 65,
    ppm: 300,
  },
  {
    color: "rgb(0, 0, 177)",
    deg: 60,
    ppm: 200,
  },
  {
    color: "rgb(135, 0, 152)",
    deg: 55,
    ppm: 100,
  },
];

export { getCO2Color, getTempColor, getVOCColor, getHumidityColor, colors };
