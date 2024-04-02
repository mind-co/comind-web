import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../authprovider";

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

// TODO #2 add strict typing for auth
function newThought(body: string, auth: any, title?: string): Thought {
  return {
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
  };
}

function coThought(body: string, title?: string): Thought {
  return {
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
  };
}

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
export { testThought, newThought, coThought };
