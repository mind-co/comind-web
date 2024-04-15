class Meld {
  title: string;
  description: string;
  user_id: string;
  group_id: string;
  meld_id: string;
  date_created: string;
  date_updated: string;
  color: string;

  constructor(json: any) {
    this.title = json.title;
    this.description = json.description;
    this.user_id = json.user_id;
    this.group_id = json.group_id;
    this.meld_id = json.meld_id;
    this.date_created = json.date_created;
    this.date_updated = json.date_updated;
    this.color = json.color;
  }

  static jsonToMeld(json: any): Meld {
    return new Meld(json);
  }

  meldToJson(): any {
    return {
      title: this.title,
      description: this.description,
      user_id: this.user_id,
      group_id: this.group_id,
      meld_id: this.meld_id,
      date_created: this.date_created,
      date_updated: this.date_updated,
      color: this.color,
    };
  }
}

// Test meld
const testMeldJson = {
  title: "Test Meld",
  description: "This is a test meld.",
  user_id: "1",
  group_id: "1",
  meld_id: "1",
  date_created: "2021-08-06T00:00:00Z",
  date_updated: "2021-10-06T00:00:00Z",
  color: "#000000",
};

const testMeld = Meld.jsonToMeld(testMeldJson);

export { Meld, testMeld };
