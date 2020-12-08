import { readFileSync } from "fs";
import { flatten } from "lodash";

const inputRaw = readFileSync(`${__dirname}/input.txt`, "utf8");
const documentsRaw = inputRaw.split("\n\n");

interface Document {
  byr?: string;
  iyr?: string;
  eyr?: string;
  hgt?: string;
  hcl?: string;
  ecl?: string;
  pid?: string;
  cid?: string;
}

interface ValidDocument extends Document {
  input: string;
  iyr: string;
  eyr: string;
  hgt: string;
  hcl: string;
  ecl: string;
  pid: string;
}

const documents: Document[] = documentsRaw.map(parseDocument);
const validDocuments = documents.filter(validateDocument);
console.log(validDocuments.length);

function parseDocument(documentRaw: string) {
  const fields = flatten(
    flatten(documentRaw.split(" ")).map((d) => d.split("\n"))
  );
  const document: Document = {};
  for (const field of fields) {
    const splitField = field.split(":");
    const key = splitField[0].trim();
    const value = splitField[1].trim();
    document[key] = value;
  }
  return document;
}

function validateDocument(document: Document) {
  const { byr, iyr, eyr, hgt, hcl, ecl, pid } = document;
  const validByr = validateByr(byr);
  const validIyr = validateIyr(iyr);
  const validEyr = validateEyr(eyr);
  const validHgt = validateHgt(hgt);
  const validHcl = validateHcl(hcl);
  const validEcl = validateEcl(ecl);
  const validPid = validatePid(pid);

  return (
    validByr &&
    validIyr &&
    validEyr &&
    validHgt &&
    validHcl &&
    validEcl &&
    validPid
  );
}

function validateByr(input: string | undefined) {
  const parsed = parseNumber(input);
  if (parsed === undefined) {
    return false;
  }
  return parsed <= 2002 && parsed >= 1920;
}

function validateIyr(input: string | undefined) {
  const parsed = parseNumber(input);
  if (parsed === undefined) {
    return false;
  }
  return parsed <= 2020 && parsed >= 2010;
}

function validateEyr(input: string | undefined) {
  const parsed = parseNumber(input);
  if (parsed === undefined) {
    return false;
  }
  return parsed <= 2030 && parsed >= 2020;
}

function validateHgt(input: string | undefined) {
  if (!input) {
    return false;
  }
  const unit = input.slice(-2);
  const allowedUnits = ["cm", "in"];

  if (!allowedUnits.includes(unit)) {
    return false;
  }

  const value = input.split(unit)[0];
  const valueNumber = parseNumber(value);
  if (valueNumber === undefined) {
    return false;
  }
  switch (unit) {
    case "cm":
      return valueNumber <= 193 && valueNumber >= 150;
    case "in":
      return valueNumber <= 76 && valueNumber >= 59;
  }
  return false;
}

function validateHcl(input: string | undefined) {
  if (!input || input[0] !== "#" || input.length !== 7) {
    return false;
  }
  const allowedChars = [
    "#",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];
  for (const char of input.split("")) {
    if (!allowedChars.includes(char)) {
      return false;
    }
  }
  return true;
}

function validateEcl(input: string | undefined) {
  const allowedColors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
  return allowedColors.includes(input);
}

function validatePid(input: string | undefined) {
  if (!input || input.length !== 9 || parseNumber(input) === undefined) {
    return false;
  }
  return true;
}

function parseNumber(input: string | undefined) {
  const asNumber = parseInt(input, 10);
  if (asNumber === undefined || asNumber === null || asNumber === NaN) {
    return undefined;
  }
  return asNumber;
}
