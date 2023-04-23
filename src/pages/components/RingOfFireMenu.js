import React, { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SlideFade,
  keyframes,
  useTheme,
  Grid,
  Text,
  Select,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import rules from "../../data/rules";

const fireRingAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const customFont = css`
  font-family: "Comic Sans MS", "Marker Felt", "Permanent Marker", "Homemade Apple", sans-serif;
`;

function MainMenu({ onStartGame }) {
  const [selectedRuleSetKey, setSelectedRuleSetKey] = useState("default");

  const [playerNames, setPlayerNames] = useState([""]);
  const {
    isOpen: isPlayerModalOpen,
    onOpen: onPlayerModalOpen,
    onClose: onPlayerModalClose,
  } = useDisclosure();
  const {
    isOpen: isRulesModalOpen,
    onOpen: onRulesModalOpen,
    onClose: onRulesModalClose,
  } = useDisclosure();
  const theme = useTheme();

  function handleAddPlayer() {
    setPlayerNames([...playerNames, ""]);
  }

  function handlePlayerNameChange(index, newName) {
    const updatedPlayerNames = [...playerNames];
    updatedPlayerNames[index] = newName;
    setPlayerNames(updatedPlayerNames);
  }

  function handleStartGame() {
    onStartGame(playerNames.filter((name) => name.trim() !== ""));
  }

  return(
    <><Box
      textAlign="center"
      minHeight="100vh"
      bgImage="url('../../../public/ROF/ROF2.jpg')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
    <SlideFade in offsetY="-100px">
      <Heading mb={4} fontSize={["2xl", "4xl"]} color="red.500" css={customFont}>
        Ring of Fire
      </Heading>
      <Text fontSize="md" color="gray.200" css={customFont}>
        only default rules are available for now!
      </Text>
    </SlideFade>
    <VStack spacing={4}>
      <SlideFade in offsetY="-50px">
        <Button
          onClick={onPlayerModalOpen}
          colorScheme="red"
          variant="outline"
          css={customFont}
        >
          Add Players
        </Button>
      </SlideFade>
      <SlideFade in offsetY="-50px">
        <Button
          onClick={onRulesModalOpen}
          colorScheme="teal"
          variant="outline"
          css={customFont}
        >
          Edit Rules
        </Button>
      </SlideFade>
      <SlideFade in offsetY="-50px">
        <Button onClick={handleStartGame} colorScheme="teal" css={customFont}>
          Start Game
        </Button>
      </SlideFade>
    </VStack>
    <Box
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      width="100px"
      height="100px"
      borderRadius="50%"
      bgGradient="linear(to-br, red.500, yellow.500)"
      boxShadow="0 0 10px red, 0 0 30px yellow, 0 0 50px red"
      animation={`${fireRingAnimation} 4s linear infinite`}
      zIndex="-1"
    />
    <Modal isOpen={isPlayerModalOpen} onClose={onPlayerModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader css={customFont}>Add Players</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {playerNames.map((name, index) => (
            <FormControl key={index} my={2}>
              <FormLabel css={customFont}>Player {index + 1}</FormLabel>
              <Input
                value={name}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              />
            </FormControl>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleAddPlayer}
            colorScheme="red"
            variant="outline"
            css={customFont}
          >
            Add Player
            </Button>
            <Button onClick={onPlayerModalClose} css={customFont}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal><Modal isOpen={isRulesModalOpen} onClose={onRulesModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader css={customFont}>Edit Rules</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel css={customFont}>Select Rule Set</FormLabel>
              <Select
                value={selectedRuleSetKey}
                onChange={(e) => setSelectedRuleSetKey(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="funny">Funny</option>
                {/*<option value="modified">mods</option>*/}
                {/*<option value="nsfw">Dirty</option>*/}
                 {/*<option value="random">other</option>*/}
                 {/*<option value="alt">Alternative</option>*/}
                <option value="crazy">crazy</option>
                <option value="sweet">sweet</option>
                <option value="spicy">spicy</option>
                 {/*<option value="meme">meme</option>*/}
              </Select>
            </FormControl>
            <Grid
              templateColumns={{
                base: "repeat(auto-fit, minmax(200px, 1fr))",
                sm: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={6}
            >
              {Object.entries(rules[selectedRuleSetKey]).map(([key, value]) => (
                <Box
                  key={key}
                  p={4}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={theme.colors.gray[200]}
                  bg={theme.colors.gray[50]}
                  boxShadow="md"
                >
                  <Heading fontSize="xl              " color={theme.colors.red[500]} css={customFont}>
                    {key}
                  </Heading>
                  <Text mt={2} fontSize="sm" color={theme.colors.gray[600]} css={customFont}>
                    {value}
                  </Text>
                </Box>
              ))}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onRulesModalClose} css={customFont}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
    </>
);
}

export default MainMenu;
