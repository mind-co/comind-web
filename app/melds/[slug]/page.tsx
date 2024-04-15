"use client";
import { Meld } from "@/lib/types/melds";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/authprovider";
import Nav from "../../nav";

interface MeldDisplayPageProps {
  // Add any additional props here
}

const MeldDisplayPage: React.FC<MeldDisplayPageProps> = () => {
  // Get the auth context
  const auth = useContext(AuthContext);
  console.log(auth.username);
  const [meld, setMeld] = useState<Meld | null>(null);

  useEffect(() => {
    const startClient = async () => {
      const username = "test";
      const password = "test";
      // const username = process.env.USERNAME || "test";
      // const password = process.env.PASSWORD || "test";

      console.log(
        `logging in with username ${username} and password ${password}`
      );

      try {
        const ws = new WebSocket("ws://localhost:2333/ws");

        ws.onopen = () => {
          ws.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            console.log(data);

            // Prepare our authentication message.
            const authMessage = JSON.stringify({
              username,
              password,
            });

            // Send the message and then wait for the server to respond.
            ws.send(authMessage);

            // Receive the server's response.
            ws.onmessage = async (event) => {
              const authInfo = JSON.parse(event.data);

              // Unpack some stuff. We get our token, a message,
              // our user_id, and the meld info.
              // const token = authInfo.token;
              const loginMessage = authInfo.message;
              // const userId = authInfo.user_id;
              const meldData = JSON.parse(authInfo.meld);

              // Logging
              console.log(`logged in as ${username}`);
              console.log(loginMessage);

              console.log("meld", meldData);

              // Set the meld state
              setMeld(meldData);

              ws.close();
            };
          };
        };
      } catch (error) {
        console.error("Error:", error);
      }

      console.log("client closed");
    };

    startClient();
  }, []);

  // Return early if no meld
  if (!meld) {
    return (
      <div className="comind-center-column">
        <Nav />
        ayo i'm loading the meld
      </div>
    );
  }

  // Return statement for debugging
  return (
    <div className="comind-center-column">
      <Nav />
      <div className="instruction">{meld.title}</div>
    </div>
  );
};

export default MeldDisplayPage;
