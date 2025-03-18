function dezimalToRoman(num) {
  let roman = "";
  const romanNumerals = [
    { value: 1000, symbol: "M" },
    { value: 900, symbol: "CM" },
    { value: 500, symbol: "D" },
    { value: 400, symbol: "CD" },
    { value: 100, symbol: "C" },
    { value: 90, symbol: "XC" },
    { value: 50, symbol: "L" },
    { value: 40, symbol: "XL" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 1, symbol: "I" }
  ];

  for (let i = 0; i < romanNumerals.length; i++) {
    while (num >= romanNumerals[i].value) {
        roman += romanNumerals[i].symbol;
        //console.log(roman);
        num -= romanNumerals[i].value;
        //console.log(num);
    }
  }

  return roman;
}

function romanToDezimal(roman) {
  const romanValues = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
  };

  let dezimal = 0;

  for (let i = 0; i < roman.length; i++) {
    const currentValue = romanValues[roman[i]];
    let nextValue = 0;
if (i + 1 < roman.length) {
  nextValue = romanValues[roman[i + 1]];
}
    if (currentValue < nextValue) {
      dezimal -= currentValue;
    } else {
      dezimal += currentValue;
    }
  }

  return dezimal;
}

function convertToRoman() {
    const num = document.getElementById('dezimalInput').value;
    const result = dezimalToRoman(num);
    document.getElementById('romanResult').innerText = result;
}

function convertToDezimal() {
    const roman = document.getElementById('romanInput').value;
    const result = romanToDezimal(roman);
    document.getElementById('dezimalResult').innerText = result;
}