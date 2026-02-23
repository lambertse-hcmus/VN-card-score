import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
import { keyframes } from '@emotion/react'
import { useLanguage } from '../lib/i18n'

const MotionBox = motion(Box)
const MotionText = motion(Text)

// ── keyframes ──
const float = keyframes`
  0%   { transform: translateY(0) rotate(0deg); }
  50%  { transform: translateY(-12px) rotate(3deg); }
  100% { transform: translateY(0) rotate(0deg); }
`

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50%      { opacity: 1; transform: scale(1) rotate(180deg); }
`

// ── Confetti piece ──
const COLORS = [
  '#e53e3e',
  '#fc8181',
  '#feb2b2',
  '#fff5f5',
  '#ffd700',
  '#ff6b6b',
  '#ee82ee',
  '#00d4ff',
  '#7fff00',
  '#ff8c00'
]
const SHAPES = ['circle', 'square', 'triangle']

function ConfettiPiece({ delay, duration, left, color, shape, size }) {
  const sway = keyframes`
    0%   { transform: translateX(0) rotate(0deg); }
    25%  { transform: translateX(${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 40}px) rotate(${90 + Math.random() * 180}deg); }
    50%  { transform: translateX(${Math.random() > 0.5 ? '-' : ''}${10 + Math.random() * 30}px) rotate(${180 + Math.random() * 180}deg); }
    75%  { transform: translateX(${Math.random() > 0.5 ? '' : '-'}${15 + Math.random() * 25}px) rotate(${270 + Math.random() * 180}deg); }
    100% { transform: translateX(${Math.random() > 0.5 ? '-' : ''}${5 + Math.random() * 20}px) rotate(${360 + Math.random() * 360}deg); }
  `

  const fall = keyframes`
    0%   { top: -5%; opacity: 1; }
    85%  { opacity: 1; }
    100% { top: 105%; opacity: 0; }
  `

  const borderRadius =
    shape === 'circle' ? '50%' : shape === 'square' ? '2px' : '0'
  const clipPath =
    shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'

  return (
    <Box
      position="absolute"
      left={`${left}%`}
      top="-5%"
      width={`${size}px`}
      height={`${size}px`}
      bg={color}
      borderRadius={borderRadius}
      clipPath={clipPath}
      opacity={0}
      pointerEvents="none"
      animation={`${fall} ${duration}s ${delay}s linear infinite, ${sway} ${duration * 0.8}s ${delay}s ease-in-out infinite`}
      zIndex={10}
    />
  )
}

// ── Flower petal ──
function FlowerPetal({ delay, left, duration }) {
  const petalFall = keyframes`
    0%   { top: -8%; opacity: 1; transform: rotate(0deg) scale(1); }
    50%  { opacity: 1; transform: rotate(180deg) scale(1.1); }
    85%  { opacity: 0.8; }
    100% { top: 108%; opacity: 0; transform: rotate(360deg) scale(0.8); }
  `
  const sway = keyframes`
    0%, 100% { transform: translateX(0); }
    33%  { transform: translateX(${30 + Math.random() * 40}px); }
    66%  { transform: translateX(-${20 + Math.random() * 30}px); }
  `
  const petals = ['🌸', '🌺', '💐', '🌷', '🏵️', '✿', '❀', '🌻', '🌼']
  const petal = petals[Math.floor(Math.random() * petals.length)]

  return (
    <Box
      position="absolute"
      left={`${left}%`}
      top="-8%"
      fontSize={`${14 + Math.random() * 14}px`}
      pointerEvents="none"
      opacity={0}
      animation={`${petalFall} ${duration}s ${delay}s linear infinite, ${sway} ${duration * 0.6}s ${delay}s ease-in-out infinite`}
      zIndex={10}
    >
      {petal}
    </Box>
  )
}

// ── Sparkle star ──
function SparkleStar({ top, left, delay, size }) {
  return (
    <Box
      position="absolute"
      top={`${top}%`}
      left={`${left}%`}
      fontSize={`${size}px`}
      animation={`${sparkle} ${1.5 + Math.random() * 2}s ${delay}s ease-in-out infinite`}
      pointerEvents="none"
      zIndex={11}
    >
      ✨
    </Box>
  )
}

// ── Trophy / rank config ──
const RANK_CONFIG = {
  1: {
    emoji: '🏆',
    size: '50px',
    label: '1st',
    color: '#ffd700',
    glow: 'rgba(255,215,0,0.5)'
  },
  2: {
    emoji: '🥈',
    size: '40px',
    label: '2nd',
    color: '#c0c0c0',
    glow: 'rgba(192,192,192,0.4)'
  },
  3: {
    emoji: '🥉',
    size: '30px',
    label: '3rd',
    color: '#cd7f32',
    glow: 'rgba(205,127,50,0.4)'
  },
  4: {
    emoji: '💪',
    size: '20px',
    label: '4th',
    color: '#e53e3e',
    glow: 'rgba(229,62,62,0.3)'
  }
}

function rankPlayers(totalScores) {
  const entries = Object.entries(totalScores).map(([name, score]) => ({
    name,
    score
  }))
  entries.sort((a, b) => b.score - a.score)

  const ranked = []
  let currentRank = 1
  for (let i = 0; i < entries.length; i++) {
    if (i > 0 && entries[i].score < entries[i - 1].score) {
      currentRank = i + 1
    }
    ranked.push({ ...entries[i], rank: currentRank })
  }
  return ranked
}

// ── Main component ──
export default function RatingScreen({ totalScores }) {
  const { t } = useLanguage()
  const [show, setShow] = useState(false)

  const btnBorder = useColorModeValue('red.200', 'red.800')
  const btnColor = useColorModeValue('red.500', 'red.300')
  const btnHoverBg = useColorModeValue('red.50', 'rgba(229,62,62,0.12)')
  const cardBg = useColorModeValue('white', '#1a202c')
  const cardBorder = useColorModeValue('red.100', 'red.900')
  const textColor = useColorModeValue('gray.800', 'gray.100')
  const subtextColor = useColorModeValue('gray.500', 'gray.400')
  const scorePositive = useColorModeValue('green.500', 'green.300')
  const scoreNegative = useColorModeValue('red.500', 'red.300')
  const scoreZero = useColorModeValue('gray.500', 'gray.400')
  const titleGradient = useColorModeValue(
    'linear-gradient(135deg, #e53e3e 0%, #9b2c2c 100%)',
    'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)'
  )
  const finishGlow = useColorModeValue(
    'rgba(197,48,48,0.40)',
    'rgba(252,129,129,0.30)'
  )
  const finishGradient = useColorModeValue(
    'linear-gradient(135deg, #e53e3e 0%, #9b2c2c 100%)',
    'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)'
  )
  const finishText = useColorModeValue('white', '#1a202c')

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const ranked = useMemo(() => rankPlayers(totalScores), [totalScores])

  // Generate confetti + flowers + sparkles once
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: `c-${i}`,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 4,
        left: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        size: 5 + Math.random() * 8
      })),
    []
  )

  const flowerPetals = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: `f-${i}`,
        delay: Math.random() * 5,
        left: Math.random() * 100,
        duration: 4 + Math.random() * 4
      })),
    []
  )

  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: `s-${i}`,
        top: 5 + Math.random() * 80,
        left: 5 + Math.random() * 90,
        delay: Math.random() * 3,
        size: 12 + Math.random() * 16
      })),
    []
  )

  const getScoreColor = score => {
    if (score > 0) return scorePositive
    if (score < 0) return scoreNegative
    return scoreZero
  }

  const handleNewGame = () => {
    localStorage.removeItem('playerNames')
    localStorage.removeItem('gameRows')
    window.location.reload()
  }

  const firstPlace = useMemo(() => ranked.filter(p => p.rank === 1), [ranked])
  const restPlaces = useMemo(() => {
    const rest = ranked.filter(p => p.rank !== 1)
    rest.sort((a, b) => a.rank - b.rank)
    return rest
  }, [ranked])

  return (
    <Box
      position="relative"
      overflow="hidden"
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {/* ── Confetti layer ── */}
      {confettiPieces.map(p => (
        <ConfettiPiece key={p.id} {...p} />
      ))}

      {/* ── Flower petals layer ── */}
      {flowerPetals.map(p => (
        <FlowerPetal key={p.id} {...p} />
      ))}

      {/* ── Sparkles layer ── */}
      {sparkles.map(s => (
        <SparkleStar key={s.id} {...s} />
      ))}

      {/* ── Title ── */}
      <AnimatePresence>
        {show && (
          <MotionBox
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            textAlign="center"
            mt={4}
            mb={2}
            zIndex={20}
          >
            <Text fontSize="4xl" mb={1}>
              🎉
            </Text>
            <Text
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="extrabold"
              fontFamily="'M PLUS Rounded 1c', sans-serif"
              bgGradient={titleGradient}
              bgClip="text"
              backgroundSize="200% auto"
              animation={`${shimmer} 3s linear infinite`}
              letterSpacing="wider"
            >
              {t('gameOver') || 'Game Over!'}
            </Text>
            <Text
              fontSize="sm"
              color={subtextColor}
              fontFamily="'M PLUS Rounded 1c', sans-serif"
              mt={1}
            >
              {t('finalStandings') || 'Final Standings'}
            </Text>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* ── Podium / Rankings ── */}
      {/* ── 1st Place Row ── */}
      <AnimatePresence>
        {show && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            display="flex"
            justifyContent="center"
            mt={6}
            mb={10}
            zIndex={20}
            w="100%"
            maxW="600px"
          >
            {firstPlace.map((player, i) => {
              const config = RANK_CONFIG[1]
              const animDelay = 0.4

              return (
                <MotionBox
                  key={player.name}
                  initial={{ opacity: 0, y: 60, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: animDelay,
                    ease: 'easeOut',
                    type: 'spring',
                    stiffness: 120
                  }}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  maxW="160px"
                  mx={3}
                >
                  {/* Trophy */}
                  <MotionBox
                    animation={`${float} 3s ease-in-out infinite`}
                    mb={2}
                  >
                    <Text
                      fontSize={config.size}
                      filter={`drop-shadow(0 0 12px ${config.glow})`}
                      lineHeight={1}
                    >
                      {config.emoji}
                    </Text>
                  </MotionBox>

                  {/* Rank badge */}
                  <Box
                    px={3}
                    py={0.5}
                    borderRadius="full"
                    bg={config.color}
                    color="#1a202c"
                    fontSize="xs"
                    fontWeight="bold"
                    fontFamily="'M PLUS Rounded 1c', sans-serif"
                    mb={2}
                    boxShadow={`0 2px 8px ${config.glow}`}
                  >
                    {config.label}
                  </Box>

                  {/* Podium block */}
                  <Box
                    w="140px"
                    h="140px"
                    bg={cardBg}
                    border="1.5px solid"
                    borderColor={cardBorder}
                    borderRadius="xl"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow={`0 4px 20px ${config.glow}`}
                    position="relative"
                    overflow="hidden"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      h: '3px',
                      bg: config.color,
                      borderTopRadius: 'xl'
                    }}
                  >
                    <Text
                      fontSize={{ base: 'md', md: 'lg' }}
                      fontWeight="bold"
                      fontFamily="'M PLUS Rounded 1c', sans-serif"
                      color={textColor}
                      textAlign="center"
                      noOfLines={1}
                      px={2}
                      mt={2}
                    >
                      {player.name}
                    </Text>
                    <MotionText
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: animDelay + 0.3,
                        type: 'spring',
                        stiffness: 200
                      }}
                      fontSize={{ base: '2xl', md: '3xl' }}
                      fontWeight="extrabold"
                      fontFamily="'M PLUS Rounded 1c', sans-serif"
                      color={getScoreColor(player.score)}
                      mt={1}
                    >
                      {player.score > 0 ? '+' : ''}
                      {player.score}
                    </MotionText>
                  </Box>
                </MotionBox>
              )
            })}
          </MotionBox>
        )}
      </AnimatePresence>

      {/* ── 2nd, 3rd, 4th Row ── */}
      <AnimatePresence>
        {show && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            display="flex"
            justifyContent="center"
            gap={{ base: 3, md: 5 }}
            mb={8}
            zIndex={20}
            w="100%"
            maxW="600px"
          >
            {restPlaces.map((player, i) => {
              const config = RANK_CONFIG[player.rank - firstPlace.length + 1] || RANK_CONFIG[4]
              const podiumH =
                player.rank === 2
                  ? '110px'
                  : player.rank === 3
                    ? '85px'
                    : '65px'
              const animDelay = 0.8 + i * 0.2

              return (
                <MotionBox
                  key={player.name}
                  initial={{ opacity: 0, y: 60, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: animDelay,
                    ease: 'easeOut',
                    type: 'spring',
                    stiffness: 120
                  }}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  flex="1 1 30%"
                  maxW="130px"
                >
                  {/* Trophy */}
                  <MotionBox mb={2}>
                    <Text
                      fontSize={config.size}
                      filter={`drop-shadow(0 0 12px ${config.glow})`}
                      lineHeight={1}
                    >
                      {config.emoji}
                    </Text>
                  </MotionBox>

                  {/* Rank badge */}
                  <Box
                    px={3}
                    py={0.5}
                    borderRadius="full"
                    bg={config.color}
                    color={player.rank <= 2 ? '#1a202c' : 'white'}
                    fontSize="xs"
                    fontWeight="bold"
                    fontFamily="'M PLUS Rounded 1c', sans-serif"
                    mb={2}
                    boxShadow={`0 2px 8px ${config.glow}`}
                  >
                    {config.label}
                  </Box>

                  {/* Podium block */}
                  <Box
                    w="100%"
                    h={podiumH}
                    bg={cardBg}
                    border="1.5px solid"
                    borderColor={cardBorder}
                    borderRadius="xl"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow={`0 4px 20px ${config.glow}`}
                    position="relative"
                    overflow="hidden"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      h: '3px',
                      bg: config.color,
                      borderTopRadius: 'xl'
                    }}
                  >
                    <Text
                      fontSize={{ base: 'sm', md: 'md' }}
                      fontWeight="bold"
                      fontFamily="'M PLUS Rounded 1c', sans-serif"
                      color={textColor}
                      textAlign="center"
                      noOfLines={1}
                      px={2}
                      mt={2}
                    >
                      {player.name}
                    </Text>
                    <MotionText
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: animDelay + 0.3,
                        type: 'spring',
                        stiffness: 200
                      }}
                      fontSize={{ base: 'xl', md: '2xl' }}
                      fontWeight="extrabold"
                      fontFamily="'M PLUS Rounded 1c', sans-serif"
                      color={getScoreColor(player.score)}
                      mt={1}
                    >
                      {player.score > 0 ? '+' : ''}
                      {player.score}
                    </MotionText>
                  </Box>
                </MotionBox>
              )
            })}
          </MotionBox>
        )}
      </AnimatePresence>

      {/* ── New Game button ── */}
      <AnimatePresence>
        {show && (
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            zIndex={20}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
            mt={2}
          >
            <MotionBox
              as="button"
              px={10}
              py={3}
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="bold"
              fontFamily="'M PLUS Rounded 1c', sans-serif"
              color={finishText}
              background={finishGradient}
              border="none"
              borderRadius="full"
              cursor="pointer"
              letterSpacing="wide"
              style={{ boxShadow: `0 4px 18px ${finishGlow}` }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 6px 28px ${finishGlow}`,
                transition: { duration: 0.15 }
              }}
              whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
              onClick={handleNewGame}
            >
              {t('newGame') || 'New Game'}
            </MotionBox>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  )
}
