"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./authprovider";
import { ThoughtContext } from "./thoughtprovider";
import { delve } from "./api";
import { Card, Space, Text } from "@mantine/core";
import { ThoughtDisplay } from "./display/thought_display";
import { Thought } from "./types/thoughts";
// import { Thought } from "./types";

const DelveView: React.FC = () => {
  const { delvingThoughtId } = useContext(ThoughtContext);
  const auth = useContext(AuthContext);
  const [delveData, setDelveData] = useState<any>(null);

  useEffect(() => {
    const fetchDelveData = async () => {
      if (delvingThoughtId) {
        try {
          const data = await delve(auth, delvingThoughtId);
          setDelveData(data);
        } catch (error) {
          console.error("Error fetching delve data:", error);
        }
      }
    };

    fetchDelveData();
  }, [auth, delvingThoughtId]);

  if (!delveData) {
    return <Text>Loading...</Text>;
  }

  const { thought, parents, children } = delveData;

  return (
    <div>
      <ThoughtDisplay thought={thought} suggestions={[]} />

      <Space my="md" />

      <Card withBorder mb="md">
        <Text size="lg" mb="sm">
          Parents
        </Text>
        {parents.map((parent: Thought) => (
          <ThoughtDisplay key={parent.id} thought={parent} suggestions={[]} />
        ))}
      </Card>
      <Card withBorder>
        <Text size="lg" mb="sm">
          Children
        </Text>
        {children.map((child: Thought) => (
          <ThoughtDisplay key={child.id} thought={child} suggestions={[]} />
        ))}
      </Card>
    </div>
  );
};

export default DelveView;
