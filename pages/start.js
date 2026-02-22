import React, { useState } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../lib/i18n";
import Layout from "../components/layouts/article";
import Dashboard from "../components/dashboard";
import ScoreTable from "../components/score-table";

const MotionBox = motion(Box);

const SUITS = [
  { char: "♠", left: "8%", top: "22%", size: "2rem", dur: 6, delay: 0 },
  { char: "♥", left: "87%", top: "15%", size: "2.6rem", dur: 7, delay: 1 },
  { char: "♦", left: "78%", top: "70%", size: "1.9rem", dur: 8, delay: 2 },
  { char: "♣", left: "13%", top: "76%", size: "2.3rem", dur: 5, delay: 0.5 },
  { char: "♥", left: "47%", top: "6%", size: "1.6rem", dur: 9, delay: 1.5 },
  { char: "♠", left: "91%", top: "47%", size: "1.5rem", dur: 7, delay: 3 },
  { char: "♣", left: "3%", top: "50%", size: "1.4rem", dur: 6, delay: 2.5 },
  { char: "♦", left: "55%", top: "88%", size: "1.7rem", dur: 8, delay: 1 },
];

export default function StartPage() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [players, setPlayers] = useState([]);

  // Collect players from localStorage
  React.useEffect(() => {
    const storedPlayers = localStorage.getItem("playerNames");
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    }
  }, []);

  const suitColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)",
  );

  return (
    <Layout>
      {/* Decorative floating card suits */}
      <Box
        position="fixed"
        inset={0}
        overflow="hidden"
        pointerEvents="none"
        zIndex={0}
      >
        {SUITS.map((s, i) => (
          <MotionBox
            key={i}
            position="absolute"
            left={s.left}
            top={s.top}
            fontSize={s.size}
            color={suitColor}
            userSelect="none"
            aria-hidden="true"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -18, 0],
                    rotate: [0, 6, -6, 0],
                    scale: [1, 1.08, 1],
                  }
            }
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {s.char}
          </MotionBox>
        ))}
      </Box>

      {/* Page content */}
      <Box
        position="relative"
        zIndex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="80vh"
        px={4}
      >
        <Box w="full" height="80vh">
          {players.length > 0 ? (
            <ScoreTable />
          ) : (
            <Dashboard players={players} />
          )}
        </Box>
      </Box>
    </Layout>
  );
}
