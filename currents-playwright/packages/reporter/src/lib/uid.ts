import random from "randomstring";

export function randomId() {
  return random.generate({
    length: 5,
    capitalization: "lowercase",
  });
}
