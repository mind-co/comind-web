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
