import { readFileSync } from "fs";
const useSample = false;
const inputRaw = readFileSync(
  `${__dirname}/${useSample ? "input_sample" : "input"}.txt`,
  "utf8"
);

const forest = inputRaw.split("\n");

interface Slope {
  right: number;
  down: number;
}

const slopes: Slope[] = [
  { right: 1, down: 1 },
  { right: 3, down: 1 },
  { right: 5, down: 1 },
  { right: 7, down: 1 },
  { right: 1, down: 2 },
];

const results = slopes.map((slope) => countTreesHit(forest, slope));
console.log(results);

const multiplied = results.reduce((prev, curr) => prev * curr, 1);
console.log(multiplied);

function countTreesHit(forest: string[], slope: Slope): number {
  const rowsWithTreeHit = forest.filter((row, index) =>
    hitsATreeOnRow(row, index, slope)
  );
  return rowsWithTreeHit.length;
}

function hitsATreeOnRow(row: string, index: number, slope: Slope): boolean {
  if (index % slope.down !== 0) {
    return false;
  }
  const splitRow = row.split("");
  const position = determineXPosition(index, splitRow.length, slope);
  if (splitRow[position] === "#") {
    return true;
  }
  return false;
}

function determineXPosition(
  index: number,
  rowLength: number,
  slope: Slope
): number {
  const positionRaw = Math.floor(index / slope.down) * slope.right;
  const timesOverRowLength = Math.floor(positionRaw / rowLength);
  const position = positionRaw - rowLength * timesOverRowLength;
  return position;
}
