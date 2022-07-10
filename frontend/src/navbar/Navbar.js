import { Box, Divider, HStack, Icon, Heading, Link } from "@chakra-ui/react";
import { GoMarkGithub } from "react-icons/go";
import ColorModeB from "./ColorModeB";
import WalletConnectB from "./WalletConnectB";

const Navbar = ({ account, connect }) => {
  const connectWall = () => {
    connect();
  };
  return (
    <nav>
      <HStack justify="center" padding={"0.5rem 1rem"}>
        <Heading fontSize="2xl">BombGame</Heading>
        <Box width={"80%"}></Box>
        <Link
          href={"https://github.com/Shada100/escape-the-bomber"}
          isExternal
          alignItems={"center"}
        >
          <Icon as={GoMarkGithub} w={8} h={8} pos={"relative"} bottom={-0.5} />
        </Link>
        <ColorModeB />
        <WalletConnectB account={account} connectWall={connectWall} />
      </HStack>
      <Divider />
    </nav>
  );
};

export default Navbar;
