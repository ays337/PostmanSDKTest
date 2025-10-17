process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;
const MOCK_SERVER_ID = process.env.MOCK_SERVER_ID;
const ENDPOINT_URL =
  `https://${MOCK_SERVER_ID}.mock.pstmn.io/psg-financials-service/invoices/qbexport?dateStart=2022-12-06&dateEnd=2022-12-07`;
const body2 = [
  {
    _id: "Brew",
    age: 40,
    eyeColor: "blue",
    name: "Padilla Bolton",
    greeting: "Hello, Padilla Bolton! You have 4 unread messages.",
    time: new Date().toLocaleString(),
  },
];

async function main() {
  axios({
    method: "get",
    url: ENDPOINT_URL,
    headers: {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJFUTBNVVE1TjBOQ1JUSkVNemszTTBVMVJrTkRRMFUwUTBNMVJFRkJSamhETWpkRU5VRkJRZyJ9.eyJpc3MiOiJodHRwczovL2ZpZG0uZ2lneWEuY29tL2p3dC8zX2tZcXJTOWtiNjljUHFTbTRnOWNJb3Q3djlhODlvREhxS2xXdGFnNlI5MTFCTDdQQm9FV2I2eHVxY0I5VF8yMTMvIiwiYXBpS2V5IjoiM19rWXFyUzlrYjY5Y1BxU200ZzljSW90N3Y5YTg5b0RIcUtsV3RhZzZSOTExQkw3UEJvRVdiNnh1cWNCOVRfMjEzIiwiaWF0IjoxNzUzMTI0ODUwLCJleHAiOjE3NTMxMjUxNTAsInN1YiI6ImJkOTJiYjcyZjAwMDRkOTE4NDJiNWM5NzY0NzA5M2MyIn0.lYx_9WmjOjhhUAv9WYadDzHc9ohT1Nm5Y4ylob-_v3HEmmZHPLAtCC1BTxgGdMc-ToBtfRecESgvJkCxG98w1qrSJgQaRAYQu7JhoM9nhYbG_bz-QCyNqUiPPZu5iWGNZ4Z1PxNKeryV_2FhoCwDte7iur9gLW1996p4CAOCjDu3LwAUAHLdaNt9mhMpAM0rd8B5SDLJuPHWRaIC2_9iBuiCMig0K0rFGfzMnuVSHuSubIpXaV9ZT6vlaG-rhE7fxwYDFtHcSFG18_nP-PAdxibV-Sp9kGgdLuVUWc_XJOPKUzn-MLal0wUp0HI9rCZypMN4cS0kB5B-ZRMdigl_Lw",
      Accept: "application/vnd.financials.api-v1+json",
      "Account-Number": "674599972",
      "x-api-key": POSTMAN_API_KEY,
      "x-mock-response-id": "36524844-aff6dbfd-0628-407d-8ae9-473287bb1f6c",
      "Content-Type": "application/json",
    },
    data: JSON.stringify(body2),
  })
    .then((res) => {
      console.log("Response body:", res.data);
    })
    .catch((err) => {
      console.error("Request failed:", err.message);
    });
}

main();
