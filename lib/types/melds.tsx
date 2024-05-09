import { Thought } from "./thoughts";

class Meld {
  title: string;
  description: string;
  user_id: string;
  group_id: string;
  meld_id: string;
  date_created: string;
  date_updated: string;
  color: string;
  thoughts: Thought[];
  thought_count: number | null;
  suggestions: { [index: string]: Thought[] };
  slug: string;

  constructor(json: any) {
    this.title = json.title;
    this.description = json.description;
    this.user_id = json.user_id;
    this.group_id = json.group_id;
    this.meld_id = json.meld_id;
    this.date_created = json.date_created;
    this.date_updated = json.date_updated;
    this.color = json.color;
    this.thoughts = json.thoughts;
    this.thought_count = json.thought_count;
    this.slug = json.slug;
    this.suggestions = json.suggestions || {};
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
      thoughts: this.thoughts,
      thought_count: this.thought_count,
      slug: this.slug,
      suggestions: this.suggestions || {},
    };
  }

  addThought(thought: Thought): void {
    // Check if the thought already exists in the meld
    const thoughtExists = this.thoughts.some((t) => t.id === thought.id);
    if (!thoughtExists) {
      this.thoughts.push(thought);
      this.thought_count = this.thoughts.length;
    }
  }

  addThoughts(thoughts: Thought[]): void {
    thoughts.forEach((thought) => {
      const thoughtExists = this.thoughts.some((t) => t.id === thought.id);
      if (!thoughtExists) {
        this.thoughts.push(thought);
      }
    });
    this.thought_count = this.thoughts.length;
  }

  addSuggestion(newSuggestion: Thought): void {
    // If there's no suggested_thought_id, throw an error.
    if (!newSuggestion.suggested_thought_id) {
      throw new Error("No suggested_thought_id provided");
    }

    // Add the suggestion to the suggestions list. If the thought id
    // does not exist in the suggestions list, add it.
    if (!this.suggestions[newSuggestion.suggested_thought_id]) {
      this.suggestions[newSuggestion.id] = [];
    }
    this.suggestions[newSuggestion.suggested_thought_id].push(newSuggestion);
  }

  addSuggestions(thoughts: Thought[], thoughtId: string): void {
    thoughts.forEach((thought) => {
      this.addSuggestion(thought);
    });
  }

  removeThought(thoughtId: string): void {
    this.thoughts = this.thoughts.filter((t) => t.id !== thoughtId);
    this.thought_count = this.thoughts.length;
  }

  static createRootMeld(userId: string): Meld {
    const { v4: uuidv4 } = require("uuid"); // Import UUID library to generate UUIDv4
    const rootMeldJson = {
      title: "Root Meld",
      description: "This is the root meld.",
      user_id: userId,
      group_id: "", // Assuming no group initially
      meld_id: uuidv4(), // Generate a UUIDv4 for the meld ID
      date_created: new Date().toISOString(),
      date_updated: new Date().toISOString(),
      color: "#FFFFFF", // Default white color for root
      thoughts: [],
      thought_count: 0,
      slug: `/root/${userId}`,
      suggestions: {},
    };
    return new Meld(rootMeldJson);
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
  thoughts: [],
  thought_count: null,
  slug: "test-meld",
  suggestions: {},
};

const testMeld = Meld.jsonToMeld(testMeldJson);

export { Meld, testMeld };
