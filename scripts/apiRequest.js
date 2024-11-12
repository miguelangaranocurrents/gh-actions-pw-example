const fs = require("fs");
const https = require("https");

// Encode the projectId and ciBuildId to ensure any special characters are URL-safe
const projectId = encodeURIComponent(process.env.CURRENTS_PROJECT_ID);
const ciBuildId = encodeURIComponent(process.env.CI_BUILD_ID);

console.log("PROJ::", projectId, ciBuildId);

const options = {
  hostname: "api.currents.dev",
  path: `/v1/runs/previous?projectId=${projectId}&ciBuildId=${ciBuildId}&pwLastRun=true`,
  method: "GET",
  headers: {
    Authorization: `Bearer ${process.env.CURRENTS_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

console.log("OPTS::", options);

const req = https.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      fs.writeFileSync("scripts/.last-run.json", data.pwLastRun);
      console.log("Response saved to .last-run.json", data.pwLastRun);
    } catch (e) {
      console.log("ERR::", e);
    }
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.end();
