process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;
const MOCK_SERVER_ID = process.env.MOCK_SERVER_ID;
const ENDPOINT_URL =
  `https://${MOCK_SERVER_ID}.mock.pstmn.io/psg-financials-service/invoices/search?dateStart=2022-12-06&dateEnd=2022-12-07`; // e.g. https://your-mock-server-url/psg-financials-service/invoices/search?dateStart=2022-12-06&dateEnd=2022-12-07
const TIMER_MS = 0; // Set your desired delay here

// Helper to get call logs with query params
async function getCallLogs(params = {}) {
  const res = await axios.get(
    `https://api.getpostman.com/mocks/${MOCK_SERVER_ID}/call-logs`,
    {
      headers: { "X-Api-Key": POSTMAN_API_KEY },
      params,
    }
  );
  const logs = res.data["call-logs"] || [];
  // Filter for your endpoint and method
  const filtered = logs.filter(
    (log) =>
      log.request.method === "GET" &&
      log.request.path ===
        "/psg-financials-service/invoices/search?dateStart=2022-12-06&dateEnd=2022-12-07"
  );
  // Sort by servedAt descending
  filtered.sort((a, b) => new Date(b.servedAt) - new Date(a.servedAt));
  return {
    length: filtered.length,
    logs: filtered,
    mostRecent: filtered.length ? filtered[0] : null,
  };
}

// Helper to get most recent log for your endpoint
async function getMostRecentLog(params = {}) {
  const res = await axios.get(
    `https://api.getpostman.com/mocks/${MOCK_SERVER_ID}/call-logs`,
    {
      headers: { "X-Api-Key": POSTMAN_API_KEY },
      params,
    }
  );
  const logs = res.data["call-logs"] || [];
  const filtered = logs.filter(
    (log) =>
      log.request.method === "GET" &&
      log.request.path ===
        "/psg-financials-service/invoices/search?dateStart=2022-12-06&dateEnd=2022-12-07"
  );
  filtered.sort((a, b) => new Date(b.servedAt) - new Date(a.servedAt));
  return filtered[0] || null;
}

async function main() {
  // Example usage: get logs from the last minute, sorted by servedAt desc
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000).toISOString();

  const params = {
    since: oneMinuteAgo,
    sort: "servedAt",
    direction: "desc",
    limit: 10,
  };

  const logs = await getCallLogs(params);
  console.log("Recent logs:", logs);

  // Usage:
  const before = await getMostRecentLog();
  console.log("Before request:", before);

  // Start the GET request but don't await it yet
  const requestPromise = axios.get(ENDPOINT_URL, {
    headers: {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJFUTBNVVE1TjBOQ1JUSkVNemszTTBVMVJrTkRRMFUwUTBNMVJFRkJSamhETWpkRU5VRkJRZyJ9.eyJpc3MiOiJodHRwczovL2ZpZG0uZ2lneWEuY29tL2p3dC8zX2tZcXJTOWtiNjljUHFTbTRnOWNJb3Q3djlhODlvREhxS2xXdGFnNlI5MTFCTDdQQm9FV2I2eHVxY0I5VF8yMTMvIiwiYXBpS2V5IjoiM19rWXFyUzlrYjY5Y1BxU200ZzljSW90N3Y5YTg5b0RIcUtsV3RhZzZSOTExQkw3UEJvRVdiNnh1cWNCOVRfMjEzIiwiaWF0IjoxNzUzMTI0ODUwLCJleHAiOjE3NTMxMjUxNTAsInN1YiI6ImJkOTJiYjcyZjAwMDRkOTE4NDJiNWM5NzY0NzA5M2MyIn0.lYx_9WmjOjhhUAv9WYadDzHc9ohT1Nm5Y4ylob-_v3HEmmZHPLAtCC1BTxgGdMc-ToBtfRecESgvJkCxG98w1qrSJgQaRAYQu7JhoM9nhYbG_bz-QCyNqUiPPZu5iWGNZ4Z1PxNKeryV_2FhoCwDte7iur9gLW1996p4CAOCjDu3LwAUAHLdaNt9mhMpAM0rd8B5SDLJuPHWRaIC2_9iBuiCMig0K0rFGfzMnuVSHuSubIpXaV9ZT6vlaG-rhE7fxwYDFtHcSFG18_nP-PAdxibV-Sp9kGgdLuVUWc_XJOPKUzn-MLal0wUp0HI9rCZypMN4cS0kB5B-ZRMdigl_Lw",
      Accept: "application/vnd.financials.api-v1+json",
      "Account-Number": "674599972",
      "x-api-key": POSTMAN_API_KEY,
    },
  });

  // Poll logs every 100ms until a new log appears
  let halfway = null;
  const pollInterval = 100;
  const maxPollTime = 5000; // 5 seconds max
  const startTime = Date.now();

  while (Date.now() - startTime < maxPollTime) {
    halfway = await getMostRecentLog();
    if (halfway && (!before || halfway.id !== before.id)) {
      console.log("Halfway (log appeared before response):", halfway);
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  // Now wait for the response
  const response = await requestPromise;
  console.log("Response received:", response.status);

  // Wait a buffer before getting logs after response
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const after = await getMostRecentLog();
  console.log("After response:", after);
}

main().catch(console.error);
