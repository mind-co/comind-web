"use client";
import { Meld } from "@/lib/types/melds";
import { getUserMelds } from "@/lib/api";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/authprovider";
import MeldDisplay from "@/lib/display/meld_display";
import { addMeld } from "@/lib/api";
import Shell from "../Shell";
import {
  ActionIcon,
  ActionIconGroup,
  Button,
  Container,
  Divider,
  Space,
  TextInput,
  Textarea,
  Loader,
  Center,
  Alert,
} from "@mantine/core";
import {
  IconBulb,
  IconLoader,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";
import Loading from "@/lib/loading";

interface MeldPageProps {
  // Add any additional props here
}

const MeldPage: React.FC<MeldPageProps> = () => {
  const auth = useContext(AuthContext);

  // TODO First check if the user is logged in.
  // this is causing an issue with server/client mismatches.
  // Not sure how to fix

  const [melds, setMelds] = useState<Meld[]>([]);
  const token = auth.token;

  const [newMeldTitle, setNewMeldTitle] = useState("");
  const [newMeldDescription, setNewMeldDescription] = useState("");

  const handleAddMeldClick = async () => {
    if (newMeldTitle.trim() !== "") {
      try {
        const newMeld = {
          title: newMeldTitle,
          description: newMeldDescription,
        };
        const newMeldReceipt = await addMeld(auth, newMeld);
        setMelds([...melds, newMeldReceipt]);
        setNewMeldTitle("");
        setNewMeldDescription("");
      } catch (error) {
        console.error("Error adding meld:", error);
      }
    }
  };

  const fetchMelds = async () => {
    const userMelds = await getUserMelds(auth);
    setMelds(userMelds);
  };

  const handleRefreshClick = async () => {
    fetchMelds();
  };

  useEffect(() => {
    // Fetch melds from the API and update the state
    // Ensure this runs only on the client side
    if (typeof window !== "undefined" && auth.token) {
      fetchMelds();
    }
  }, [auth]);

  return (
    <Shell>
      <Container size="sm">
        <TextInput
          placeholder="title"
          label="new meld"
          value={newMeldTitle}
          onChange={(e) => setNewMeldTitle(e.target.value)}
        />
        <Space h={"xs"} />
        <Textarea
          placeholder="description (optional)"
          value={newMeldDescription}
          onChange={(e) => setNewMeldDescription(e.target.value)}
        />
        <Space h={"xs"} />
        <ActionIconGroup>
          <ActionIcon variant="default" onClick={handleAddMeldClick}>
            <IconPlus />
          </ActionIcon>

          {/* Refresh button */}
          <ActionIcon variant="default" onClick={handleRefreshClick}>
            <IconRefresh />
          </ActionIcon>
        </ActionIconGroup>
        <Divider my="sm" />
        <MeldList melds={melds} />
      </Container>
    </Shell>
  );
};

interface MeldListProps {
  melds: Meld[];
}

const MeldList: React.FC<MeldListProps> = ({ melds }) => {
  if (melds.length === 0) {
    return (
      <Container>
        {/* <Space h={"xl"} /> */}
        <Center>
          <Alert icon={<IconBulb />}>
            {/* TODO #7 support notifying that there are no melds after retrieval */}
            we're loading your melds, give us a sec. you might also not have any
            melds but that's not in the server right now.
          </Alert>
        </Center>
      </Container>
    );
  }

  return (
    <div className="meld-list">
      {melds.map((meld, index) => (
        <div key={index}>
          <MeldDisplay meld={meld} />
          <Space h={"xs"} />
        </div>
      ))}
    </div>
  );
};

export default MeldPage;
