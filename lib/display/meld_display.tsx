"use client";
import React, { useContext, useState } from "react";
import { Meld } from "@/lib/types/melds";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Kbd,
  Skeleton,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import { convertToRelativeTimestamp } from "@/lib/utils";
import { AuthContext } from "@/lib/authprovider";

type MeldDisplayProps = {
  meld: Meld;
};

const MeldDisplay: React.FC<MeldDisplayProps> = ({ meld }) => {
  // Modal stuff
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState("md");
  const auth = useContext(AuthContext);

  // Load context
  const { userId } = useContext(AuthContext);

  // State variables
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [hovered, setHovered] = useState(true);

  // Date created converted to a pretty date time
  const prettyTimestamp = convertToRelativeTimestamp(meld.date_created);
  const isUserMeld = meld.user_id == userId;

  // Toggle context menu
  const openContextMenu = () => {
    setContextMenuVisible(!contextMenuVisible);
  };

  const openModal = () => {
    onOpen();
  };

  const onMouseEnter = () => {
    setHovered(true);
  };

  const onMouseLeave = () => {
    setHovered(false);
  };

  return (
    <>
      {contextMenuVisible ? (
        <div className="w-full px-4 flex flex-row space-x-2">
          <div className="text-xs">{prettyTimestamp}</div>
        </div>
      ) : (
        <></>
      )}
      <Card
        className={`meld ${
          contextMenuVisible ? "!bg-purple-500" : "bg-transparent"
        }


        `}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        onPress={openContextMenu}
        isPressable={true}
      >
        <CardHeader>
          <h3>{meld.title}</h3>
        </CardHeader>
        <CardBody>
          <Markdown remarkPlugins={[remarkGfm]}>{meld.description}</Markdown>
        </CardBody>
      </Card>

      {contextMenuVisible ? (
        <>
          <div className="flex flex-row justify-end w-full">
            <ButtonGroup>
              <Button
                onClick={openModal}
                variant="ghost"
                className=" font-mono"
              >
                examine
              </Button>
            </ButtonGroup>
          </div>

          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {meld.title}
                  </ModalHeader>
                  <ModalBody>
                    <CardBody>
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {meld.description}
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
      )}
    </>
  );
};

export default MeldDisplay;
