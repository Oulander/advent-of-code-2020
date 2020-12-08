import { readFileSync } from "fs";

const useSample = false;
const inputRaw = readFileSync(
  `${__dirname}/${useSample ? "input_sample" : "input"}.txt`,
  "utf8"
);
const inputList = inputRaw.split("\n");

enum OperationType {
  NOP = "nop",
  JUMP = "jmp",
  ACCUMULATE = "acc",
}

interface Operation {
  type: OperationType;
  value: number;
}

const operations = inputList.map(parseOperation);

const indicesAdjusted: { [index: number]: boolean } = {};
const accumulatedBeforeFix = runUntilFixIsFound(operations);
console.log(accumulatedBeforeFix);

function parseOperation(operationRaw: string): Operation {
  const split = operationRaw.split(" ");
  const type = parseOperationType(split[0]);
  const value = parseInt(split[1], 10);
  return { type, value };
}

function parseOperationType(input: string): OperationType {
  switch (input) {
    case OperationType.NOP:
      return OperationType.NOP;
    case OperationType.JUMP:
      return OperationType.JUMP;
    case OperationType.ACCUMULATE:
      return OperationType.ACCUMULATE;
    default:
      throw Error();
  }
}

function runUntilFixIsFound(input: Operation[]) {
  let accumulated = undefined;
  let index = 0;
  while (accumulated === undefined && index < 1000000) {
    accumulated = accumulateAndSpotInfiniteLoop(input);
    index += 1;
  }
  return accumulated;
}

function accumulateAndSpotInfiniteLoop(input: Operation[]) {
  let accumulator = 0;
  let index = 0;
  const rowsVisited: { [row: number]: number } = {};
  let maxVisitedPerRow = 0;
  let doLoop = true;
  let indexAdjusted = false;

  while (doLoop) {
    const operation = input[index];

    const timesVisited = rowsVisited[index];
    const newVisited = timesVisited ? timesVisited + 1 : 1;

    rowsVisited[index] = newVisited;
    maxVisitedPerRow = Math.max(newVisited, maxVisitedPerRow);

    if (maxVisitedPerRow > 1) {
      doLoop = false;
      break;
    }

    switch (operation.type) {
      case OperationType.ACCUMULATE: {
        accumulator += operation.value;
        index += 1;
        break;
      }
      case OperationType.JUMP: {
        if (!indicesAdjusted[index] && !indexAdjusted) {
          indicesAdjusted[index] = true;
          indexAdjusted = true;
          index += 1;
        } else {
          index += operation.value;
        }
        break;
      }
      case OperationType.NOP: {
        if (!indicesAdjusted[index] && !indexAdjusted) {
          indicesAdjusted[index] = true;
          indexAdjusted = true;
          index += operation.value;
        } else {
          index += 1;
        }
        break;
      }
    }

    if (index === input.length) {
      doLoop = false;
      break;
    }
  }

  return maxVisitedPerRow > 1 ? undefined : accumulator;
}
