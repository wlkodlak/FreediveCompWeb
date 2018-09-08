function GenerateUuid() {
  const randomHex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  const randomUuid =
    randomHex() + randomHex() + "-" +
    randomHex() + "-" +
    "4" + randomHex().substring(1) + "-" +
    "a" + randomHex().substring(1) + "-" +
    randomHex() + randomHex() + randomHex();
  return randomUuid;
}

export default GenerateUuid;
