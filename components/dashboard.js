import {
  Box,
  Text,
  VStack,
  usePrefersReducedMotion,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CreateSessionModal from "./create-session-modal";
import { useLanguage } from "../lib/i18n";

const MotionBox = motion(Box);

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const glowColor = useColorModeValue(
    "rgba(197,48,48,0.55)",
    "rgba(252,129,129,0.45)",
  );

  const suitRowColor = useColorModeValue("red.500", "red.300");
  const titleGradient = useColorModeValue(
    "linear(to-r, red.500, red.800)",
    "linear(to-r, red.200, red.400)",
  );
  const btnGradient = useColorModeValue(
    "linear-gradient(135deg, #e53e3e 0%, #9b2c2c 100%)",
    "linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)",
  );
  const btnTextColor = useColorModeValue("white", "#1a202c");
  const shouldReduceMotion = useReducedMotion();

  const { t } = useLanguage();

  return (
    <Box
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      <VStack spacing={{ base: 10, md: 14 }}>
        {/* Title */}
        <MotionBox
          textAlign="center"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            color={suitRowColor}
            letterSpacing="0.35em"
            mb={3}
            aria-hidden="true"
          >
            ♠ ♥ ♦ ♣
          </Text>
          <Text
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight="extrabold"
            fontFamily="'M PLUS Rounded 1c', sans-serif"
            bgGradient={titleGradient}
            bgClip="text"
            lineHeight={1.3}
          >
            {t("logo")}
          </Text>
        </MotionBox>

        {/* Start button — entrance then idle pulse */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
        >
          <MotionBox
            as="button"
            px={{ base: 12, md: 20 }}
            py={{ base: 5, md: 7 }}
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            fontFamily="'M PLUS Rounded 1c', sans-serif"
            borderRadius="full"
            background={btnGradient}
            color={btnTextColor}
            border="none"
            cursor="pointer"
            letterSpacing="wide"
            minW={{ base: "220px", md: "300px" }}
            display="block"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scale: [1, 1.04, 1],
                    boxShadow: [
                      `0 0 18px ${glowColor}, 0 4px 18px rgba(0,0,0,0.15)`,
                      `0 0 42px ${glowColor}, 0 6px 28px rgba(0,0,0,0.20)`,
                      `0 0 18px ${glowColor}, 0 4px 18px rgba(0,0,0,0.15)`,
                    ],
                  }
            }
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: `0 0 60px ${glowColor}, 0 8px 32px rgba(0,0,0,0.25)`,
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
            onClick={() => setIsModalOpen(true)}
          >
            {t("start")}
          </MotionBox>
        </MotionBox>
      </VStack>
      <CreateSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};

export default Dashboard;
