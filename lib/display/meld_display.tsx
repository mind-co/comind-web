"use client";
import React, { useContext, useState } from "react";
import { Meld } from "@/lib/types/melds";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { convertToRelativeTimestamp } from "@/lib/utils";
import { AuthContext } from "@/lib/authprovider";
import {
  Button,
  ButtonGroup,
  Card,
  Container,
  Divider,
  Group,
  Modal,
  Space,
  Text,
  Title,
  Tooltip,
  TypographyStylesProvider,
} from "@mantine/core";
import {
  IconArrowsJoin,
  IconEdit,
  IconLayoutNavbarExpand,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { deleteMeld } from "../api";

type MeldDisplayProps = {
  meld: Meld;
};

const MeldDisplay: React.FC<MeldDisplayProps> = ({ meld }) => {
  // Modal stuff
  const [size, setSize] = React.useState("md");
  const auth = useContext(AuthContext);

  // Load context
  const { userId } = useContext(AuthContext);

  // State variables
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [hovered, setHovered] = useState(true);

  // Date created converted to a pretty date time
  const prettyTimestamp = convertToRelativeTimestamp(meld.date_updated);
  const isUserMeld = meld.user_id == userId;

  // Delete modal
  const [opened, { open, close }] = useDisclosure(false);

  const handleDeleteMeld = async () => {
    console.log("Deleting meld", meld);
    try {
      await deleteMeld(auth, meld.id);
      close(); // Close the delete confirmation modal
      // TODO: Update the melds state in the parent component to remove the deleted meld
    } catch (error) {
      console.error("Error deleting meld:", error);
      // TODO: Handle the error, e.g., show an error message to the user
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="delete">
        <Text>
          are you sure you want to delete this meld? cameron isn't that good at
          stuff and probably can't get it back.
        </Text>

        <Text>
          you have{" "}
          {meld.thought_count == 1
            ? `${meld.thought_count} thought`
            : `${meld.thought_count} thoughts`}{" "}
          in the meld.
        </Text>

        <Divider label="you must choose" my="md" />

        <Group justify="space-between">
          <Button variant="default" onClick={close}>
            cancel
          </Button>
          <Button variant="filled" color="red" onClick={handleDeleteMeld}>
            delete
          </Button>
        </Group>
      </Modal>

      <Card withBorder={true}>
        <Title>{meld.title}</Title>
        {/* Show thought_count if non-null */}

        <TypographyStylesProvider>
          <Markdown remarkPlugins={[remarkGfm]}>{meld.description}</Markdown>
        </TypographyStylesProvider>

        {/* Time info */}
        <Card.Section>
          <Group justify="space-between">
            <Group>
              <Space></Space>
              <Text size="xs" c="dimmed">
                {prettyTimestamp}
              </Text>
              {meld.thought_count === null ? (
                <Text size="xs" c="dimmed">
                  no thoughts
                </Text>
              ) : (
                <Text size="xs" c="dimmed">
                  {meld.thought_count + meld.thought_count == 1
                    ? "1 thought"
                    : meld.thought_count + meld.thought_count + " thoughts"}
                </Text>
              )}
            </Group>
            <ButtonGroup>
              {/* Delete button */}
              <Button size="xs" variant="default" color="red" onClick={open}>
                delete
              </Button>

              <Button
                component="a"
                href={`/melds/${meld.slug}`}
                size="xs"
                variant="default"
              >
                jump in
              </Button>
            </ButtonGroup>
          </Group>
        </Card.Section>
      </Card>
    </>
  );
};

export default MeldDisplay;
