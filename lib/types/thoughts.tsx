import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../authprovider";

class Thought {
  title: string;
  body: string;
  user_id: string;
  username: string;
  date_created: string;
  date_updated: string;
  revision: number;
  id: string;
  public: boolean;
  synthetic: boolean;
  origin: string;
  color: string;
  cosine_similarity: number | null;
  embedding: number[] | null;

  // Suggested thought ID is a string associated with a specific thought --
  // i.e. we have some thought A and some thought B, and A is suggested
  // for B. In this case, suggested_thought_id would be the ID of A.
  // TODO: #9 make the server send thoughts with suggested_thought_id
  suggested_thought_id: string | null;

  constructor(json: any) {
    this.title = json?.title || "";
    this.body = json?.body || "";
    this.user_id = json?.user_id || "";
    this.username = json?.username || "";
    this.date_created = json?.date_created || new Date().toISOString();
    this.date_updated = json?.date_updated || new Date().toISOString();
    this.revision = json?.revision || 0;
    this.id = json?.id || uuidv4();
    this.public = json?.public || false;
    this.synthetic = json?.synthetic || false;
    this.origin = json?.origin || "web";
    this.color = json?.color || "";
    this.cosine_similarity = json?.cosine_similarity || null;
    this.embedding = json?.embedding || null;
    this.suggested_thought_id = json?.suggested_thought_id || null;
  }

  static newThought(body: string, auth: any, title?: string): Thought {
    return new Thought({
      title: title || "",
      body,
      user_id: auth.userId,
      username: auth.username,
      date_created: new Date().toISOString(),
      date_updated: new Date().toISOString(),
      revision: 0,
      id: uuidv4(),
      public: false,
      synthetic: false,
      origin: "web",
      color: auth.color,
      cosine_similarity: null,
      embedding: null,
      suggested_thought_id: null,
    });
  }

  static coThought(body: string, title?: string): Thought {
    return new Thought({
      title: title || "",
      body,
      user_id: "ceaa2177-9c94-4b58-aa97-b01b7ad11374",
      username: "co",
      date_created: new Date().toISOString(),
      date_updated: new Date().toISOString(),
      revision: 0,
      id: uuidv4(),
      public: false,
      synthetic: false,
      origin: "web",
      color: "",
      cosine_similarity: null,
      embedding: null,
      suggested_thought_id: null,
    });
  }

  static testThought(): Thought {
    return new Thought({
      title: "Test Thought",
      body: "# A test thought\n\nThis is a test thought. It has _markdown_ in it.\n\n- A list\n- Of items\n- In a list. \n\nHere's something **bold**.",
      user_id: "test",
      username: "test",
      date_created: new Date().toISOString(),
      date_updated: new Date().toISOString(),
      revision: 0,
      id: uuidv4(),
      public: false,
      synthetic: false,
      origin: "web",
      color: "red",
      cosine_similarity: null,
      embedding: null,
      suggested_thought_id: null,
    });
  }
}

export { Thought };
