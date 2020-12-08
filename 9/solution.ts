import { readFileSync } from "fs";

const useSample = true;
const inputRaw = readFileSync(
  `${__dirname}/${useSample ? "input_sample" : "input"}.txt`,
  "utf8"
);
const inputList = inputRaw.split("\n");
