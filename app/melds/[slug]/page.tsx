"use client";
import { Meld } from "@/lib/types/melds";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/authprovider";
import Nav from "../../nav";
import { Thought } from "@/lib/types/thoughts";
import MeldView from "@/lib/MeldView";
import Shell from "@/app/Shell";
import Loading from "@/lib/loading";
import Comind from "@/lib/comind";
import {
  Card,
  Center,
  Container,
  Divider,
  Loader,
  Paper,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { comindContainerWidth } from "@/lib/Configuration";
import { useParams } from "next/navigation";
import { ThoughtContext } from "@/lib/thoughtprovider";

interface MeldDisplayPageProps {
  // Add any additional props here
}

const MeldDisplayPage: React.FC<MeldDisplayPageProps> = () => {
  // Get the auth context
  const auth = useContext(AuthContext);

  // Get the thought context
  const {
    setActiveMeld,
    connected,
    getCurrentMeld,
    activeMeldSlug,
    meldSlugs,
    currentSlugIsLoaded,
    currentMeldTitle,
    currentMeldDescription,
    getCurrentThoughts,
  } = useContext(ThoughtContext);

  // Get the slug from the params
  const slug = useParams().slug;
  // console.log("At meld", { slug });
  // setActiveMeld(slug as string); // TODO: #11 gracefully handle multiple path params

  // Load the meld the first time the page renders
  useEffect(() => {
    if (connected) {
      console.log("Setting active meld", slug);
      setActiveMeld(slug as string);
    }
  }, [slug, connected]);

  // Return early if no meld
  if (!currentSlugIsLoaded) {
    return (
      <Shell>
        <div style={{ fontSize: "10vmin" }}>
          melding
          {/* <Comind /> */}
        </div>
        <div style={{ fontSize: "5vmin" }}>give us a sec</div>
        <Text fw={700}>{activeMeldSlug}</Text>
      </Shell>
    );
  }

  return (
    <Shell>
      <Card withBorder={true}>
        <Title>{currentMeldTitle}</Title>
        <Text>{currentMeldDescription}</Text>
      </Card>

      <Divider
        my="md"
        label={`${getCurrentThoughts().length} thoughts`}
      ></Divider>

      <MeldView />

      <Center>
        <Text size="xs" c="dimmed">
          end of meld
        </Text>
      </Center>
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
    </Shell>
  );
};

export default MeldDisplayPage;
