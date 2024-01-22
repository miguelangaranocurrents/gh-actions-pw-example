import execa from "execa";

export const runPW = async () => {
  const subprocess = execa("npm", ["run", "test:pw"], {
    all: true,
    reject: false,
  });

  // Print stdout in real-time
  subprocess?.stdout?.on("data", (chunk) => {
    process.stdout.write(chunk);
  });

  // Print stderr in real-time
  subprocess?.stderr?.on("data", (chunk) => {
    process.stderr.write(chunk);
  });

  return await subprocess;
};
