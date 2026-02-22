import { useState, useEffect } from 'react'
import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useLanguage } from '../lib/i18n'

const MotionBox = motion(Box)

// ── Header cell ───────────────────────────────────────────────────────────────
function HeaderCell({ children, isIndex }) {
  return (
    <Text
      fontSize="11px"
      fontWeight="bold"
      letterSpacing="0.09em"
      textTransform="uppercase"
      textAlign="center"
      color="white"
      px={1}
      isTruncated
      w={isIndex ? '40px' : undefined}
    >
      {children}
    </Text>
  )
}

// ── Data row ──────────────────────────────────────────────────────────────────
function DataRow({ index, scores, isEven, rowBg, hoverBg, borderColor, indexColor, textColor }) {
  return (
    <Box
      display="grid"
      gridTemplateColumns="40px 1fr 1fr 1fr 1fr"
      px={3}
      py="11px"
      bg={isEven ? rowBg : 'transparent'}
      borderBottom="1px solid"
      borderColor={borderColor}
      transition="background 0.15s"
      _hover={{ bg: hoverBg }}
    >
      <Text fontSize="sm" fontWeight="bold" color={indexColor} textAlign="center">
        {index}
      </Text>
      {scores.map((score, i) => (
        <Text key={i} fontSize="sm" fontWeight="medium" color={textColor} textAlign="center">
          {score ?? '—'}
        </Text>
      ))}
    </Box>
  )
}

// ── ScoreTableView ────────────────────────────────────────────────────────────
export default function ScoreTableView() {
  const { t } = useLanguage()
  const [playerNames, setPlayerNames] = useState(['', '', '', ''])
  const [rows] = useState([]) // placeholder — Add button will populate

  useEffect(() => {
    try {
      const stored = localStorage.getItem('playerNames')
      if (stored) setPlayerNames(JSON.parse(stored))
    } catch {}
  }, [])

  // ── colors ──
  const headerFrom    = useColorModeValue('#e53e3e', '#c53030')
  const headerTo      = useColorModeValue('#9b2c2c', '#742a2a')
  const tableBg       = useColorModeValue('white',              '#1e1e24')
  const tableBorder   = useColorModeValue('red.100',            'whiteAlpha.100')
  const rowEvenBg     = useColorModeValue('red.50',             'rgba(229,62,62,0.05)')
  const rowHoverBg    = useColorModeValue('red.100',            'rgba(229,62,62,0.10)')
  const rowDivider    = useColorModeValue('red.50',             'whiteAlpha.50')
  const indexColor    = useColorModeValue('red.400',            'red.300')
  const textColor     = useColorModeValue('gray.700',           'gray.200')
  const emptyColor    = useColorModeValue('gray.400',           'gray.500')

  const addBorder     = useColorModeValue('red.200',            'red.800')
  const addColor      = useColorModeValue('red.500',            'red.300')
  const addHoverBg    = useColorModeValue('red.50',             'rgba(229,62,62,0.12)')
  const finishGradient = useColorModeValue(
    'linear-gradient(135deg, #e53e3e 0%, #9b2c2c 100%)',
    'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)'
  )
  const finishText    = useColorModeValue('white', '#1a202c')
  const finishGlow    = useColorModeValue('rgba(197,48,48,0.40)', 'rgba(252,129,129,0.30)')

  const handleAddRound = () => {
    // TODO: open input row or modal to enter scores
    console.log('Add round — not yet implemented')
  }

  const handleFinish = () => {
    // TODO: navigate to results summary
    console.log('Finish game — not yet implemented')
  }

  return (
    <Box display="flex" flexDirection="column" h="calc(100svh - 195px)">

      {/* ── Scrollable table ── */}
      <Box
        flex={1}
        minH={0}
        overflowY="auto"
        bg={tableBg}
        borderRadius="16px"
        border="1.5px solid"
        borderColor={tableBorder}
        boxShadow="0 2px 14px rgba(0,0,0,0.07)"
        css={{
          '&::-webkit-scrollbar':       { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(229,62,62,0.28)',
            borderRadius: '4px',
          },
        }}
      >
        {/* Sticky header */}
        <Box
          position="sticky"
          top={0}
          zIndex={1}
          display="grid"
          gridTemplateColumns="40px 1fr 1fr 1fr 1fr"
          px={3}
          py="12px"
          borderTopRadius="14px"
          style={{
            background: `linear-gradient(135deg, ${headerFrom} 0%, ${headerTo} 100%)`,
          }}
        >
          <HeaderCell isIndex>{t('roundNumber')}</HeaderCell>
          {playerNames.map((name, i) => (
            <HeaderCell key={i}>{name || `P${i + 1}`}</HeaderCell>
          ))}
        </Box>

        {/* Rows */}
        {rows.length === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" h="160px">
            <Text fontSize="sm" color={emptyColor}>
              {t('noRounds')}
            </Text>
          </Box>
        ) : (
          rows.map((row, i) => (
            <DataRow
              key={i}
              index={i + 1}
              scores={row}
              isEven={i % 2 === 1}
              rowBg={rowEvenBg}
              hoverBg={rowHoverBg}
              borderColor={rowDivider}
              indexColor={indexColor}
              textColor={textColor}
            />
          ))
        )}
      </Box>

      {/* ── Bottom buttons ── */}
      <Box display="flex" gap={3} pt={3} pb={1}>

        {/* Add Round */}
        <MotionBox
          as="button"
          flex={1}
          py={{ base: 3, md: 4 }}
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="semibold"
          fontFamily="'M PLUS Rounded 1c', sans-serif"
          color={addColor}
          bg="transparent"
          border="1.5px solid"
          borderColor={addBorder}
          borderRadius="full"
          cursor="pointer"
          letterSpacing="wide"
          style={{ transition: 'background 0.15s' }}
          _hover={{ bg: addHoverBg }}
          whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
          onClick={handleAddRound}
        >
          {t('addRound')}
        </MotionBox>

        {/* Finish */}
        <MotionBox
          as="button"
          flex={1}
          py={{ base: 3, md: 4 }}
          fontSize={{ base: 'sm', md: 'md' }}
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
            scale: 1.02,
            boxShadow: `0 6px 28px ${finishGlow}`,
            transition: { duration: 0.15 },
          }}
          whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
          onClick={handleFinish}
        >
          {t('finish')}
        </MotionBox>

      </Box>
    </Box>
  )
}
