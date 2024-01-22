let i = 3;
describe("Flaky", function () {
  it(
    "Runs a flaky test with retries",
    {
      retries: 3,
    },
    function () {
      if (i > 1) {
        i--;
        throw new Error("oh!");
      }
      return;
    }
  );
});
