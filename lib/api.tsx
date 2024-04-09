import { Thought } from "@/lib/types/thoughts";

async function sendThoughtToDatabase(
  token: string,
  body: string
): Promise<void> {
  const requestBody = {
    body,
  };
  try {
    await fetch("https://nimbus.pfiffer.org/api/thoughts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
    console.log("Thought sent successfully!");
  } catch (error) {
    console.error("Failed to send thought:", error);
  }
}

export { sendThoughtToDatabase };

// Function to request melds from the server
import axios, { AxiosResponse } from 'axios';
import { json } from "stream/consumers";
import { v4 as uuidv4 } from 'uuid';

const endpoint = (path: string): string => {
  let serverUrl = process.env.COMIND_SERVER_URL;

  if (!serverUrl) {
    serverUrl = 'https://nimbus.pfiffer.org';
    console.warn('COMIND_SERVER_URL is not set, falling back to https://nimbus.pfiffer.org');
  }

  return serverUrl + path;
};

const getBaseHeaders = (context: any): Record<string, string> => {
  const headers: Record<string, string> = {};

  const username = context.authProvider.username;
  headers['ComindUsername'] = username;

  const token = context.authProvider.token;
  headers['Authorization'] = `Bearer ${token}`;

  return headers;
};

export const fetchThoughts = async (context: any): Promise<Thought[]> => {
  const url = endpoint('/api/user-thoughts/cameron/');
  const headers = getBaseHeaders(context);
  headers['ComindPageNo'] = '0';
  headers['ComindLimit'] = '10';

  const response: AxiosResponse = await axios.get(url, { headers });

  if (response.status === 200) {
    const jsonResponse = response.data;
    return jsonResponse.map((thought: any) => new Thought(thought));
  } else {
    throw new Error(`Failed to load thoughts, status code: ${response.status} and body: ${response.data}`);
  }
};

export const saveQuickThought = async (
  context: any,
  body: string,
  isPublic: boolean,
  parentThoughtId?: string,
  childThoughtId?: string
): Promise<Thought> => {
  const url = endpoint('/api/thoughts/');
  const headers = getBaseHeaders(context);

  const bodyJson: Record<string, any> = {
    body,
    public: isPublic,
    synthetic: false,
    origin: 'app',
  };

  if (parentThoughtId) {
    bodyJson['parent_thought_id'] = parentThoughtId;
  }

  if (childThoughtId) {
    bodyJson['child_thought_id'] = childThoughtId;
  }

  const response: AxiosResponse = await axios.post(url, bodyJson, { headers });

  if (response.status !== 200) {
    throw new Error('Failed to save thought');
  }

  try {
    const jsonResponse = response.data;
    return new Thought(jsonResponse);
  } catch (e) {
    throw new Error('Failed to parse new thought as JSON');
  }
};

export const saveThought = async (context: any, thought: Thought, newThought?: boolean): Promise<void> => {
  const url = endpoint('/api/thoughts/');

  console.info(`{'location':'saveThought','new_id: ${thought.id}','sending_to':'${url}','body':'${thought.body}'}`);

  if (newThought === true) {
    const headers = getBaseHeaders(context);

    const body = JSON.stringify({
      id: thought.id,
      body: thought.body.trim(),
      public: thought.public,
      synthetic: false,
      origin: 'app',
      title: thought.title.trim(),
    });

    console.info('Sending thought with POST');
    console.info(`Body: ${body}`);

    const response: AxiosResponse = await axios.post(url, body, { headers });

    if (response.status !== 200) {
      throw new Error('Failed to save thought');
    }

    const jsonResponse = response.data;
    console.info(`saveThought response: ${JSON.stringify(jsonResponse)}`);
  } else {
    const headers = getBaseHeaders(context);
    headers['ComindThoughtId'] = thought.id;

    const body = JSON.stringify({
      body: thought.body,
      public: thought.public,
      synthetic: false,
      origin: 'app',
    });

    const response: AxiosResponse = await axios.patch(url, body, { headers });

    if (response.status !== 200) {
      throw new Error(`Failed to save thought. Status code: ${response.status} and body: ${response.data}`);
    }
  }
};

export const deleteThought = async (context: any, thoughtId: string): Promise<void> => {
  const url = endpoint('/api/thoughts/');
  const headers = getBaseHeaders(context);
  headers['ComindThoughtId'] = thoughtId;

  const response: AxiosResponse = await axios.delete(url, { headers });

  if (response.status !== 200) {
    throw new Error('Failed to delete thought');
  }
};

export const newUser = async (username: string, email: string, password: string): Promise<boolean> => {
  const url = endpoint('/api/new-user/');
  const headers = {
    'ComindUsername': username,
    'ComindHashedPassword': password,
    'ComindEmail': email,
  };

  await axios.post(url, null, { headers });

  return true;
};

export const userExists = async (username: string): Promise<boolean> => {
  const url = endpoint('/api/user-exists/');
  const headers = {
    'ComindUsername': username,
  };

  const response: AxiosResponse = await axios.get(url, { headers });

  if (response.status !== 200) {
    throw new Error('Failed to check if user exists');
  }

  const jsonResponse = response.data;
  return jsonResponse.exists;
};

export const emailExists = async (email: string): Promise<boolean> => {
  const url = endpoint('/api/email-taken/');
  const headers = {
    'ComindEmail': email,
  };

  const response: AxiosResponse = await axios.get(url, { headers });

  if (response.status !== 200) {
    throw new Error('Failed to check if email exists');
  }

  const jsonResponse = response.data;
  return jsonResponse.taken;
};

export class SearchResult {
  id: string;
  body: string;
  title: string;
  username: string;
  cosineSimilarity: number;
  numLinks?: number;
  linkedTo?: boolean;
  linkedFrom?: boolean;

  constructor({
    id,
    body,
    username,
    title,
    cosineSimilarity,
    numLinks = 0,
    linkedTo = false,
    linkedFrom = false,
  }: {
    id: string;
    body: string;
    username: string;
    title: string;
    cosineSimilarity: number;
    numLinks?: number;
    linkedTo?: boolean;
    linkedFrom?: boolean;
  }) {
    this.id = id;
    this.body = body;
    this.username = username;
    this.title = title;
    this.cosineSimilarity = cosineSimilarity;
    this.numLinks = numLinks;
    this.linkedTo = linkedTo;
    this.linkedFrom = linkedFrom;
  }

  static fromJson(json: any): SearchResult {
    return new SearchResult({
      id: json.id,
      body: json.body,
      username: json.username,
      title: json.title,
      cosineSimilarity: json.cosinesimilarity,
      numLinks: json.numlinks,
      linkedTo: json.linked_to,
      linkedFrom: json.linked_from,
    });
  }
}

export const searchThoughts = async (
  context: any,
  query: string,
  associatedId?: string
): Promise<Thought[]> => {
  const url = endpoint('/api/search/');
  const body = associatedId
    ? JSON.stringify({
        query,
        associated_id: associatedId,
        limit: 5,
        pageno: 0,
      })
    : JSON.stringify({
        query,
        limit: 5,
        pageno: 0,
      });

  const headers = getBaseHeaders(context);
  headers['Content-Type'] = 'application/json';
  headers['Content-Length'] = Buffer.byteLength(body).toString();

  const response: AxiosResponse = await axios.post(url, body, { headers });

  if (response.status === 200 && Array.isArray(response.data)) {
    const jsonResponse = response.data;
    const result = jsonResponse.map((thought: any) => new Thought(jsonResponse));

    result.sort((a, b) => b.cosine_similarity! - a.cosine_similarity!);

    return result;
  } else {
    throw new Error('Failed to search');
  }
};

export const fetchThought = async (context: any, id: string): Promise<Thought> => {
  const url = endpoint('/api/thoughts/');
  const headers = getBaseHeaders(context);
  headers['ComindThoughtId'] = id;
  headers['Content-Type'] = 'application/json';

  const response: AxiosResponse = await axios.get(url, { headers });

  if (response.status === 200) {
    const jsonResponse = response.data;
    return new Thought(jsonResponse);
  } else {
    throw new Error('Failed to load thought');
  }
};

export class LoginResponse {
  success: boolean;
  message?: string;
  token?: string;

  constructor({ success, token, message }: { success: boolean; token?: string; message?: string }) {
    this.success = success;
    this.token = token;
    this.message = message;
  }

  static fromJson(json: any): LoginResponse {
    return new LoginResponse({
      success: json.success,
      token: json.token,
      message: json.message,
    });
  }
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const url = endpoint('/api/login/');
  const body = JSON.stringify({ username, password });

  const response: AxiosResponse = await axios.post(url, body);

  if (response.status !== 200) {
    throw new Error('Failed to login');
  }

  const jsonResponse = response.data;
  return LoginResponse.fromJson(jsonResponse);
};

export const linkThoughts = async (context: any, fromId: string, toId: string): Promise<boolean> => {
  const url = endpoint('/api/link/');
  const headers = getBaseHeaders(context);
  headers['ComindFromId'] = fromId;
  headers['ComindToId'] = toId;

  const response: AxiosResponse = await axios.post(url, null, { headers });

  if (response.status === 200) {
    return true;
  } else {
    throw new Error('Failed to link thoughts');
  }
};

export const fetchChildren = async (context: any, thoughtId: string): Promise<Thought[]> => {
  const url = endpoint('/api/children/');
  const headers = getBaseHeaders(context);
  headers['ComindThoughtId'] = thoughtId;

  const response: AxiosResponse = await axios.get(url, { headers });

  console.log(`Children response: ${response.data}`);

  if (response.status === 200) {
    const jsonResponse = response.data;
    return jsonResponse.map((thought: any) => new Thought(jsonResponse));
  } else {
    throw new Error('Failed to load children');
  }
};

export const fetchParents = async (context: any, thoughtId: string): Promise<Thought[]> => {
  const url = endpoint('/api/parents/');
  const headers = getBaseHeaders(context);
  headers['ComindThoughtId'] = thoughtId;

  const response: AxiosResponse = await axios.get(url, { headers });

  console.log(`Parents response: ${response.data}`);

  if (response.status === 200) {
    const jsonResponse = response.data;
    if (Array.isArray(jsonResponse)) {
      return jsonResponse.map((thought: any) => new Thought(jsonResponse));
    } else {
      throw new Error('Decoded data is not a list');
    }
  } else {
    throw new Error('Failed to load parents');
  }
};

export const setPublic = async (context: any, thoughtId: string, isPublic: boolean): Promise<void> => {
  const url = endpoint('/api/thoughts/');
  const headers = getBaseHeaders(context);
  headers['ComindThoughtId'] = thoughtId;

  const body = JSON.stringify({ public: isPublic });

  const response: AxiosResponse = await axios.patch(url, body, { headers });

  if (response.status !== 200) {
    throw new Error('Failed to toggle public');
  }
};

export const getStream = async (context: any): Promise<Thought[]> => {
  const url = endpoint('/api/stream/');
  const headers = getBaseHeaders(context);
  headers['ComindPageNo'] = '0';
  headers['ComindLimit'] = '10';

  const response: AxiosResponse = await axios.get(url, { headers });

  if (response.status === 200) {
    const jsonResponse = response.data;
    return jsonResponse.map((thought: any) => new Thought(jsonResponse));
  } else {
    throw new Error('Failed to load public thoughts');
  }
};

export const updateTopOfMind = async (context: any, ids: string[]): Promise<Thought[]> => {
  const url = endpoint('/api/top-of-mind/');
  const headers = getBaseHeaders(context);

  const body = JSON.stringify({
    thought_ids: ids,
    date_updated: new Date().toISOString(),
  });

  const response: AxiosResponse = await axios.post(url, body, { headers });

  if (response.status !== 200) {
    throw new Error('Failed to update top of mind');
  } else {
    const jsonResponse = response.data;
    const newThoughts = jsonResponse.map((thought: any) => new Thought(jsonResponse));
    return newThoughts;
  }
};

// export const fetchConcepts = async (context: any): Promise<Concept[]> => {
//   const url = endpoint('/api/concepts/');
//   const headers = getBaseHeaders(context);
//   headers['ComindPageNo'] = '0';
//   headers['ComindLimit'] = '10';

//   const response: AxiosResponse = await axios.get(url, { headers });

//   if (response.status === 200) {
//     const jsonResponse = response.data;
//     return jsonResponse.map((concept: any) => Concept.fromJson(concept));
//   } else {
//     throw new Error('Failed to load concepts');
//   }
// };

// export const sendColors = async (context: any, currentColors: ComindColors): Promise<void> => {
//   const url = endpoint('/api/colors/');
//   const headers = getBaseHeaders(context);

//   const body = JSON.stringify({
//     primary: currentColors.primary.toString(16),
//     secondary: currentColors.secondary.toString(16),
//     tertiary: currentColors.tertiary.toString(16),
//     color_scheme: currentColors.colorMethod,
//   });

//   const response: AxiosResponse = await axios.post(url, body, { headers });

//   if (response.status !== 200) {
//     throw new Error('Failed to send colors');
//   }
// };

// export const fetchNotifications = async (context: any): Promise<ComindNotification[]> => {
//   const url = endpoint('/api/notifications/');
//   const headers = getBaseHeaders(context);
//   headers['ComindPageNo'] = '0';
//   headers['ComindLimit'] = '10';

//   const response: AxiosResponse = await axios.get(url, { headers });

//   if (response.status === 200) {
//     const jsonResponse = response.data;
//     return jsonResponse.map((notification: any) => ComindNotification.fromJson(notification));
//   } else {
//     throw new Error('Failed to load notifications');
//   }
// };

export const fetchStartPageThought = async (context: any): Promise<Thought> => {
  const url = endpoint('/api/start-page/');
  const headers = getBaseHeaders(context);

  const response: AxiosResponse = await axios.get(url, { headers });

  if (response.status === 200) {
    const jsonResponse = response.data;
    return new Thought(jsonResponse);
  } else {
    throw new Error('Failed to load start page thought');
  }
};

// Function to request user thoughts from the server using AuthContext for token.
// GET /api/user-thoughts/
// Authorization: Bearer {token from AuthContext}
async function getUserThoughts(context: any): Promise<Thought[]> {
  if (!context.token || !context.username) {
    throw new Error("Missing authentication details: token or username is undefined.");
  }

  try {
    const token = context.token; // Accessing token from context
    const username = context.username;
    const response = await fetch(`https://nimbus.pfiffer.org/api/user-thoughts/${username}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user thoughts. Server responded with status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user thoughts. Detailed error:", error);
    throw new Error(`An error occurred while fetching user thoughts: ${error.message}`);
  }
}
export { getUserThoughts };
