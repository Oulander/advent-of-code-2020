import { readFileSync } from "fs";

// Ported from a Jupyter notebook, hence ugly.

interface Contains {
  [bag: string]: number;
}

interface Rules {
  [bag: string]: Contains;
}

let inputRaw;
let rulesRaw;
const useSample = false;
inputRaw = readFileSync(
  `${__dirname}/${useSample ? "input_sample" : "input"}.txt`,
  "utf8"
);
rulesRaw = inputRaw.split("\n");

const rules: Rules = {};
let startColor = "shiny gold";
let getParentBags;
let parentBags = {};
let getChildBags;
let childBags = [];
let totalChildBags;

for (const ruleRaw of rulesRaw) {
  const withoutBags = ruleRaw.replace(/bags|bag|\./g, "");
  const split = withoutBags.split("contain");
  const [bagRaw, ...containsRaw] = split;
  const bag = bagRaw.trim();
  const containsList = containsRaw[0]
    .split(",")
    .map((str) => str.trim())
    .filter((str) => str !== "no other");
  const contains: Contains = {};
  for (const single of containsList) {
    const amount = parseInt(single.split(" ")[0], 10);
    const color = single.slice(2);
    contains[color] = amount;
  }
  rules[bag] = contains;
}

getParentBags = (bag: string, multiplier: number) => {
  const allColors = Object.keys(rules);
  const parentBagsOfCurrent = {};
  for (const color of allColors) {
    const includes = rules[color];
    const includedCount = includes[bag];
    if (includedCount) {
      parentBagsOfCurrent[color] = includedCount * multiplier;
    }
  }
  const parentBagColors = Object.keys(parentBagsOfCurrent);
  if (parentBagColors.length) {
    parentBags = { ...parentBags, ...parentBagsOfCurrent };
    parentBagColors.forEach((b) => getParentBags(b, parentBagsOfCurrent[b]));
  }
};
getParentBags(startColor, 1);

getChildBags = (current: string, multiplier: number) => {
  const childBagsOfCurrent = rules[current];
  const childBagColors = Object.keys(childBagsOfCurrent);
  if (childBagColors.length) {
    const multiplied = childBagColors.map((c) => ({
      [c]: childBagsOfCurrent[c] * multiplier,
    }));

    //childBags = [...childBags, ...multiplied];
    childBagColors.forEach((c) =>
      childBags.push(childBagsOfCurrent[c] * multiplier)
    );
    childBagColors.forEach((b) =>
      getChildBags(b, childBagsOfCurrent[b] * multiplier)
    );
  }
};
childBags = [];
getChildBags(startColor, 1);

const total = childBags.reduce((prev, curr) => prev + curr);

console.log(total);
