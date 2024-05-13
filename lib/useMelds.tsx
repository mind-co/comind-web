import { useState, useCallback } from "react";
import { Thought } from "@/lib/types/thoughts";
import { Meld } from "@/lib/types/melds";

const useMelds = (initialMelds: Meld[]) => {
  const [melds, setMelds] = useState<Meld[]>(initialMelds);

  const addThoughtToMeld = useCallback((thought: Thought, meldId: string) => {
    setMelds((currentMelds) => {
      const meldIndex = currentMelds.findIndex(
        (meld) => meld.meld_id === meldId
      );

      if (meldIndex !== -1) {
        const updatedMelds = [...currentMelds];
        const updatedMeld = {
          ...updatedMelds[meldIndex],
          thoughts: [...updatedMelds[meldIndex].thoughts, thought],
        };
        updatedMelds[meldIndex] = updatedMeld as Meld;

        return updatedMelds;
      }

      return currentMelds;
    });
  }, []);

  return { melds, addThoughtToMeld };
};

export default useMelds;
