import { Button, ButtonGroup, CardFooter, Kbd } from "@nextui-org/react";
import React from "react";

type ActionBarProps = {
  onThink: () => void;
};

const ActionBar: React.FC<ActionBarProps> = ({ onThink }) => {
  return (
    <CardFooter className="text-xs">
      <ButtonGroup>
        <Button size="sm" variant="ghost">
          edit
          <Kbd>e</Kbd>
        </Button>
        <Button size="sm" variant="ghost">
          think
          <Kbd>t</Kbd>
        </Button>
      </ButtonGroup>
    </CardFooter>
  );
};

export default ActionBar;
