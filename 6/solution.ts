import { readFileSync } from "fs";

// Ported from a Jupyter notebook, hence ugly.

let inputRaw;
let groups;
let rightAnswerCounts;
let total;

const useSample = true;
inputRaw = readFileSync(
  `${__dirname}/${useSample ? "input_sample" : "input"}.txt`,
  "utf8"
);
groups = inputRaw.split("\n\n").map((group) => group.split("\n"));

rightAnswerCounts = groups.map((group) => {
  const rightAnswers = {};
  for (const person of group) {
    const splitAnswers = person.split("");
    for (const answer of splitAnswers) {
      rightAnswers[answer] = rightAnswers[answer]
        ? rightAnswers[answer] + 1
        : 1;
    }
  }

  return Object.values(rightAnswers).filter((value) => value === group.length)
    .length;
});

total = rightAnswerCounts.reduce(
  (prev, curr) => parseInt(prev, 10) + parseInt(curr, 10),
  [0]
);

console.log(total);
