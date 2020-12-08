import { readFileSync } from "fs";
const useSample = false;
const inputRaw = readFileSync(
  `${__dirname}/${useSample ? "input_sample" : "input"}.txt`,
  "utf8"
);
const inputList = inputRaw.split("\n");

interface PasswordWithRule {
  lower: number;
  higher: number;
  character: string;
  password: string;
}

const passwords = parseListToObjects(inputList);
const validatedPasswordsPart1 = passwords.filter(validatePasswordPart1);
const validatedPasswordsPart2 = passwords.filter(validatePasswordPart2);
console.log(validatedPasswordsPart1.length, validatedPasswordsPart2.length);

function parseListToObjects(list: string[]): PasswordWithRule[] {
  return list.map((row) => {
    const splitRow = row.split(" ");
    const limits = splitRow[0].split("-");
    const lower = parseInt(limits[0], 10);
    const higher = parseInt(limits[1], 10);

    const character = splitRow[1][0];
    const password = splitRow[2];
    return {
      lower,
      higher,
      character,
      password,
    };
  });
}

function countCharacterOccurencesPart1(
  character: string,
  stringToSearch: string
) {
  const count = stringToSearch.split("").filter((char) => char === character)
    .length;
  return count;
}

function validatePasswordPart1(passwordWithRule: PasswordWithRule) {
  const { lower, higher, character, password } = passwordWithRule;

  const characterCount = countCharacterOccurencesPart1(character, password);

  if (characterCount > higher || characterCount < lower) {
    return false;
  }
  return true;
}

function validatePasswordPart2(passwordWithRule: PasswordWithRule) {
  const { lower, higher, character, password } = passwordWithRule;

  const splitPassword = password.split("");
  const firstCharMatches = splitPassword[lower - 1] === character;
  const secondCharMatches = splitPassword[higher - 1] === character;

  if (firstCharMatches && secondCharMatches) {
    return false;
  }

  if (firstCharMatches || secondCharMatches) {
    return true;
  }

  return false;
}
