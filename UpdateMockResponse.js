const { Collection } = require("postman-collection");
const fs = require("fs");

// Load the collection
const collectionJson = JSON.parse(
  fs.readFileSync(
    "PSG Financial Services DEV Mock.postman_collection.json",
    "utf8"
  )
);
const collection = new Collection(collectionJson);

// Find the item by name
const item = collection.items.find((i) => i.name === "[200] QBExport");

// Find the response you want to update (by name or index)
const response = item.responses.one("Response Name"); // or use item.responses.members[0] for the first response

// Update the response body with the current date and time
const now = new Date().toISOString();
response.body = JSON.stringify({ date: now });

// Save the updated collection
fs.writeFileSync(
  "PSG Financial Services DEV Mock.postman_collection.json",
  JSON.stringify(collection.toJSON(), null, 2)
);
console.log("Response updated successfully.");
