const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "questionsAboutWater.json");
const questionsAboutWater = JSON.parse(fs.readFileSync(filePath, "utf8"));

const API_URL = "https://dkdaniz-katara.hf.space/api/predict";

async function postData(data) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: data }),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      console.error("Error in POST request:", response.status);
    }
  } catch (error) {
    console.error("Error in POST request:", error);
  }
}

function makePeriodicRequests(index = 0) {
  if (index >= questionsAboutWater.length) {
    console.log("All questions have been answered, going back to the first question...");
    return makePeriodicRequests(0);
  }
  // 10-minute interval in milliseconds
  const intervalInMilliseconds = 10 * 60 * 1000;
  const data = questionsAboutWater[index];

  console.log({data, index})
  postData(data)
    .then(() => {
      setTimeout(() => {
        makePeriodicRequests(index + 1);
      }, intervalInMilliseconds);
    })
    .catch(() => {
      setTimeout(() => {
        makePeriodicRequests(index);
      }, intervalInMilliseconds);
    });
}

makePeriodicRequests();