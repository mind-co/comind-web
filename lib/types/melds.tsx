interface Meld {
  title: string;
  description: string;
  user_id: string;
  group_id: string;
  meld_id: string;
  date_created: string;
  date_updated: string;
  color: string;
}

// Convert json message to Meld
function jsonToMeld(json: any): Meld {
  return {
    title: json.title,
    description: json.description,
    user_id: json.user_id,
    group_id: json.group_id,
    meld_id: json.meld_id,
    date_created: json.date_created,
    date_updated: json.date_updated,
    color: json.color,
  };
}

// Meld to json
function meldToJson(meld: Meld): any {
  return {
    title: meld.title,
    description: meld.description,
    user_id: meld.user_id,
    group_id: meld.group_id,
    meld_id: meld.meld_id,
    date_created: meld.date_created,
    date_updated: meld.date_updated,
    color: meld.color,
  };
}
v;

// Test meld
const testMeld: Meld = {
  title: "Test Meld",
  description: "This is a test meld.",
  user_id: "1",
  group_id: "1",
  meld_id: "1",
  date_created: "2021-08-06T00:00:00Z",
  date_updated: "2021-10-06T00:00:00Z",
  color: "#000000",
};
