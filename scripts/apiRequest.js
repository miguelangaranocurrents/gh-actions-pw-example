const fs = require("fs");
const https = require("https");

// Encode the projectId and ciBuildId to ensure any special characters are URL-safe
const projectId = encodeURIComponent(process.env.CURRENTS_PROJECT_ID);
const ciBuildId = process.env.CI_BUILD_ID.replace(/ /g, "+");

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

const req = https.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      fs.writeFileSync("scripts/.last-run.json", data);
      console.log("Response saved to .last-run.json", data);
    } catch (e) {
      console.log("ERR::", e);
    }
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.end();
