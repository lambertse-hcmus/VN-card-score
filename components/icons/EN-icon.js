import { Box, useColorModeValue } from "@chakra-ui/react";
const ENIcon = ({ size = 10 }) => {
  return (
    <Box
      as="span"
      fontSize="sm"
      fontWeight="bold"
      color="white"
      bg={useColorModeValue("blue.700", "blue.300")}
      width={size}
      height={size}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      py={1}
      borderRadius="md"
    >
      EN
    </Box>
  );
};

export default ENIcon;
