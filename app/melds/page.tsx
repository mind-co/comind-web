"use client";
import React, { useEffect, useState } from "react";

interface MeldPageProps {
  // Add any additional props here
}

const MeldPage: React.FC<MeldPageProps> = () => {
  const [melds, setMelds] = useState<Meld[]>([]);

  useEffect(() => {
    // Fetch melds from the API and update the state
    fetchMelds();
  }, []);

  const fetchMelds = async () => {
    try {
      // Make API request to retrieve melds
      const response = await fetch("/api/melds");
      const data = await response.json();
      setMelds(data);
    } catch (error) {
      console.error("Error fetching melds:", error);
    }
  };

  return (
    <div>
      <h1>Melds</h1>
      <MeldList melds={melds} />
    </div>
  );
};

interface MeldListProps {
  melds: Meld[];
}

const MeldList: React.FC<MeldListProps> = ({ melds }) => {
  return (
    <div>
      {melds.map((meld) => (
        <Meld key={meld.meld_id} meld={meld} />
      ))}
    </div>
  );
};

interface SlotProps {
  children: React.ReactNode;
}

const Slot: React.FC<SlotProps> = ({ children }) => {
  return <div className="slot">{children}</div>;
};

interface MeldProps {
  meld: Meld;
}

const Meld: React.FC<MeldProps> = ({ meld }) => {
  return (
    <Slot>
      <div>
        <h2>{meld.title}</h2>
        <p>{meld.description}</p>
        <p>User ID: {meld.user_id}</p>
        <p>Group ID: {meld.group_id}</p>
        <p>Meld ID: {meld.meld_id}</p>
      </div>
    </Slot>
  );
};

export default MeldPage;
