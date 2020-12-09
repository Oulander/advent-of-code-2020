import { readFileSync } from "fs";

const useSample = false;
const inputRaw = readFileSync(
  `${__dirname}/${useSample ? "input_sample" : "input"}.txt`,
  "utf8"
);
const inputList = inputRaw.split("\n");
const inputNumbers = inputList.map((str) => parseInt(str, 10));

const num = findInvalidNumber(inputNumbers, 25);
const set = findContiguousSet(num, inputNumbers);
const [smallest, largest] = [Math.min(...set), Math.max(...set)];
console.log(smallest + largest);

function findInvalidNumber(numbers: number[], preambleSize: number) {
  let invalidNumber: number | undefined = undefined;

  for (let i = preambleSize; i < numbers.length; i++) {
    const preamble = numbers.slice(i - preambleSize, i);
    const number = numbers[i];
    let isValidNumber = false;
    for (const n of preamble) {
      for (const m of preamble) {
        if (n !== m && n + m === number) {
          isValidNumber = true;
          break;
        }
      }
    }
    if (!isValidNumber) {
      invalidNumber = number;
      break;
    }
  }
  return invalidNumber;
}

function findContiguousSet(invalidNumber: number, numbers: number[]) {
  const indexOfInvalidNumber = numbers.findIndex(
    (value) => value === invalidNumber
  );
  let i = indexOfInvalidNumber;

  for (i; i > 0; i--) {
    for (let j = 2; j < indexOfInvalidNumber; j++) {
      const numbersToSum = numbers.slice(i - j, i);
      const sum = numbersToSum.reduce((prev, curr) => prev + curr, 0);
      if (sum > invalidNumber) {
        break;
      }
      if (sum === invalidNumber) {
        return numbersToSum;
      }
    }
  }
  return undefined;
}
