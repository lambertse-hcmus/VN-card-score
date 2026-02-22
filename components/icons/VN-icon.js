import { Box, useColorModeValue } from "@chakra-ui/react";
const VNIcon = ({ size = 10 }) => {
  return (
    <Box
      as="span"
      fontSize="sm"
      fontWeight="bold"
      color="white"
      bg={useColorModeValue("red.700", "red.300")}
      width={size}
      height={size}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      py={1}
      borderRadius="md"
    >
      VN
    </Box>
  );
};

export default VNIcon;
