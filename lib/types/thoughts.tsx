import { v4 as uuidv4 } from "uuid";

interface Thought {
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
}

// A method that instiaties a new thought object from the auth provider.
// The auth provider contains user_id, color,
//
// id is UUID4, dates are ISO8601 strings for now, revision is 0,
// public is false, synthetic is false, origin is "web"
// color is the user's color
function newThought(title: string, body: string, auth: any): Thought {
  return {
    title,
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
  };
}

// A basic thought object that can be used for testing
const testThought: Thought = {
  title: "Test Thought",
  body: "# A test thought\n\nThis is a test thought. It has _markdown_ in it.\n\n- A list\n- Of items\n- In a list. \n\nHere's somehing **bold**.",
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
};

export type { Thought };
export { testThought, newThought };
