import { IconButton, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ColorModeB = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      onClick={toggleColorMode}
      aria-label="Toggle Color Mode"
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    />
  );
};

export default ColorModeB;
