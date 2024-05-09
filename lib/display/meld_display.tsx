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
  Group,
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
} from "@tabler/icons-react";

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

  return (
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
  );
};

export default MeldDisplay;
