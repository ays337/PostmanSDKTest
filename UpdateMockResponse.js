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

// Helper function to recursively find an item by name
function findItemByName(items, name) {
  for (const item of items) {
    if (item.name === name) return item;
    if (item.items && item.items.members.length > 0) {
      const found = findItemByName(item.items.members, name);
      if (found) return found;
    }
  }
  return null;
}

const item = findItemByName(collection.items.members, "[200] QBExport");

if (!item || !item.responses || item.responses.members.length === 0) {
  console.error("Could not find the item or response.");
  process.exit(1);
}

// Update the response body with the current date and time
const now = new Date().toISOString();
item.responses.members[0].body = JSON.stringify({ date: now });

// Save the updated collection
fs.writeFileSync(
  "PSG Financial Services DEV Mock.postman_collection.json",
  JSON.stringify(collection.toJSON(), null, 2)
);
console.log("Response updated successfully.");
