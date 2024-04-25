"use client";
import React, { useState } from "react";
import { Thought } from "@/lib/types/thoughts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import { convertToRelativeTimestamp } from "@/lib/utils";
// import { AuthContext } from "@/lib/authprovider";
// import Link from "next/link";

import ComindUsername from "../comindusername";

type ThoughtDisplayProps = {
  thought: Thought;
};

const ThoughtDisplay: React.FC<ThoughtDisplayProps> = ({ thought }) => {
  // Modal stuff
  // const auth = useContext(AuthContext);

  // Load context
  // const { userId } = useContext(AuthContext);

  // State variables
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  // const [hovered, setHovered] = useState(true);
  // const [editorValue, setEditorValue] = useState("");

  // Date created converted to a pretty date time
  // const prettyTimestamp = convertToRelativeTimestamp(thought.date_created);
  // const isUserThought = thought.user_id == userId;

  // Toggle context menu
  const openContextMenu = () => {
    setContextMenuVisible(!contextMenuVisible);
  };

  // const onMouseEnter = () => {
  //   setHovered(true);
  // };

  // const onMouseLeave = () => {
  //   setHovered(false);
  // };

  /**
   * Asynchronously saves a new thought based on the current editor value.
   *
   * This function first checks if the editorValue state variable, which represents
   * the content of the thought to be saved, is not empty. If it is empty, an error
   * message is logged, and the function returns early without attempting to save the thought.
   *
   * If the editorValue is not empty, the function attempts to save the thought by calling
   * the saveQuickThought function imported from "@/lib/api". This API call requires several
   * parameters:
   * - context: An object containing the authProvider with the user's token. This is used for
   *   authentication purposes.
   * - body: The content of the thought to be saved, represented by editorValue.
   * - isPublic: A boolean flag indicating whether the thought should be public. It is set to true.
   * - parentThoughtId: The ID of the parent thought, if any. In this case, it uses the ID of the
   *   thought being displayed.
   *
   * If the saveQuickThought function successfully saves the thought, a success message is logged
   * to the console along with the newly saved thought object. If the function throws an error,
   * an error message is logged to the console.
   */
  // const think = async () => {
  //   // Check if the editor value is empty
  //   if (editorValue.trim().length === 0) {
  //     console.error("Editor value is empty.");
  //     return;
  //   }

  //   try {
  //     // Attempt to save the new thought
  //     const newThought = await saveQuickThought(
  //       auth,
  //       editorValue,
  //       true,
  //       thought.id
  //     );
  //     // Log success message
  //     console.log("Thought saved successfully:", newThought);
  //   } catch (error) {
  //     // Log error message if saving fails
  //     console.error("Failed to save thought:", error);
  //   }
  // };
  return (
    <div className="w-full relative">
      {/* Username and relative date */}
      {/* <div className="w-full px-4 flex flex-row space-x-2 text-xs">
        <ComindUsername username={thought.username} />
        <div className="text-xs">{prettyTimestamp}</div>
      </div> */}
      <div className="w-full bg-red-500">abc</div>

      <div className="absolute top-0 left-0">
        <ComindUsername username={thought.username} />
        {/* <Link
          href={`https://comind.me/users/${thought.username}`}
          className="!text-lg opacity-50 hover:opacity-100"
        >
          {thought.username}
        </Link>{" "} */}
      </div>

      {/* Main text display */}
      <div className={`thought`} onClick={openContextMenu}>
        <Markdown remarkPlugins={[remarkGfm]}>{thought.body}</Markdown>
      </div>

      {/* Action bar shit + editor */}
      {/* {contextMenuVisible ? (
        <>
          <div className="py-4 w-full">
            <Textarea
              className="w-full"
              autoFocus={true}
              variant="flat"
              value={editorValue}
              onValueChange={setEditorValue}
              minRows={1}
            />
          </div>
          <div className="flex flex-row justify-end w-full">
            <ButtonGroup>
              <Button
                onClick={openModal}
                variant="ghost"
                className=" font-mono"
              >
                examine
              </Button>
              <Button onClick={think} variant="ghost" className="font-mono">
                think
              </Button>
            </ButtonGroup>
          </div>
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {thought.title + " "}
                    <ComindUsername username={thought.username} />
                  </ModalHeader>
                  <ModalBody>
                    <CardBody>
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {thought.body}
                      </Markdown>
                    </CardBody>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      Action
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      ) : (
        <></>
      )} */}
    </div>
  );
};

interface ThoughtListProps {
  thoughts: Thought[];
}

const ThoughtList: React.FC<ThoughtListProps> = ({ thoughts }) => {
  if (thoughts.length === 0) {
    return <></>;
    // return <div className="w-full text-center">. . .</div>;
  }

  return (
    <div className="thought-list">
      {thoughts.map((thought, index) => (
        <ThoughtDisplay key={index} thought={thought} />
      ))}
    </div>
  );
};

export default ThoughtList;
export { ThoughtDisplay };
