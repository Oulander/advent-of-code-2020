import { readFileSync } from "fs";
import { compact, mapValues } from "lodash";

const useSample = false;
const inputRaw = readFileSync(
  `${__dirname}/${useSample ? "input_sample" : "input"}.txt`,
  "utf8"
);
const inputList = inputRaw.split("\n");
const inputNumbers = inputList.map((str) => parseInt(str, 10));

const part1 = countDifferences(inputNumbers);
console.log(part1[1] * part1[3]);

const part2 = countArrangements(inputNumbers);
console.log(part2);

function countDifferences(adapters: number[]) {
  const sortedAdapters = adapters.sort((a, b) => a - b);
  const differences = {};

  sortedAdapters.forEach((adapter, index) => {
    const previousAdapter = index === 0 ? 0 : adapters[index - 1];
    const difference = adapter - previousAdapter;
    differences[difference] = differences[difference]
      ? differences[difference] + 1
      : 1;
  });

  differences[3] += 1;

  return differences;
}

// Had to check for some hints to make this one work
function countArrangements(adapters: number[]) {
  const ownDevice = Math.max(...adapters) + 3;
  const adaptersAndDevices = [0, ...adapters, ownDevice];

  function traverseBackwards(
    currentAdapter: number,
    adapters: number[],
    combined: { [location: number]: number }
  ) {
    if (combined[currentAdapter]) {
      return combined[currentAdapter];
    }
    if (currentAdapter === 0) {
      combined[currentAdapter] = 1;
      return 1;
    }
    if (currentAdapter < 0) {
      combined[currentAdapter] = 0;
      return 0;
    }
    if (!adapters.find((d) => d === currentAdapter)) {
      combined[currentAdapter] = 0;
      return 0;
    }
    combined[currentAdapter] =
      traverseBackwards(currentAdapter - 1, adapters, combined) +
      traverseBackwards(currentAdapter - 2, adapters, combined) +
      traverseBackwards(currentAdapter - 3, adapters, combined);
    return combined[currentAdapter];
  }
  const result = traverseBackwards(ownDevice, adaptersAndDevices, {});
  return result;
}
