import { useState, useEffect } from 'react'
import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { TbEdit } from 'react-icons/tb'
import { useLanguage } from '../lib/i18n'
import CreateGameResultModal from './create-game-result-modal'

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

// ── Data row (self-contained; edit icon revealed on hover) ────────────────────
function DataRow({ index, scores, isEven, onEdit }) {
  const rowEvenBg = useColorModeValue('red.50', 'rgba(229,62,62,0.05)')
  const rowHoverBg = useColorModeValue('red.100', 'rgba(229,62,62,0.10)')
  const rowDivider = useColorModeValue('red.50', 'whiteAlpha.50')
  const indexColor = useColorModeValue('red.400', 'red.300')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const iconColor = useColorModeValue('red.300', 'red.600')

  return (
    <Box
      role="group"
      position="relative"
      display="grid"
      gridTemplateColumns="40px 1fr 1fr 1fr 1fr"
      px={3}
      py="11px"
      bg={isEven ? rowEvenBg : 'transparent'}
      borderBottom="1px solid"
      borderColor={rowDivider}
      cursor="pointer"
      transition="background 0.15s"
      _hover={{ bg: rowHoverBg }}
      onClick={onEdit}
    >
      <Text
        fontSize="sm"
        fontWeight="bold"
        color={indexColor}
        textAlign="center"
      >
        {index}
      </Text>
      {scores.map((score, i) => (
        <Text
          key={i}
          fontSize="sm"
          fontWeight="medium"
          color={textColor}
          textAlign="center"
        >
          {score ?? '—'}
        </Text>
      ))}

      {/* Edit hint — faint by default, clear on hover */}
      <Box
        position="absolute"
        right={2}
        top="50%"
        style={{ transform: 'translateY(-50%)' }}
        opacity={0.2}
        _groupHover={{ opacity: 0.75 }}
        transition="opacity 0.15s"
        pointerEvents="none"
        aria-hidden="true"
        color={iconColor}
      >
        <TbEdit size={14} />
      </Box>
    </Box>
  )
}

// ── ScoreTableView ────────────────────────────────────────────────────────────
export default function ScoreTableView() {
  const { t } = useLanguage()
  const [playerNames, setPlayerNames] = useState(['', '', '', ''])
  const [rows, setRows] = useState([])

  // modal: { open, mode: 'add'|'edit', rowIndex }
  const [modal, setModal] = useState({
    open: false,
    mode: 'add',
    rowIndex: null
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('playerNames')
      if (stored) setPlayerNames(JSON.parse(stored))
    } catch {}
  }, [])

  // ── colors ──
  const headerFrom = useColorModeValue('#e53e3e', '#c53030')
  const headerTo = useColorModeValue('#9b2c2c', '#742a2a')
  const tableBg = useColorModeValue('white', '#1e1e24')
  const tableBorder = useColorModeValue('red.100', 'whiteAlpha.100')
  const emptyColor = useColorModeValue('gray.400', 'gray.500')

  const addBorder = useColorModeValue('red.200', 'red.800')
  const addColor = useColorModeValue('red.500', 'red.300')
  const addHoverBg = useColorModeValue('red.50', 'rgba(229,62,62,0.12)')
  const finishGradient = useColorModeValue(
    'linear-gradient(135deg, #e53e3e 0%, #9b2c2c 100%)',
    'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)'
  )
  const finishText = useColorModeValue('white', '#1a202c')
  const finishGlow = useColorModeValue(
    'rgba(197,48,48,0.40)',
    'rgba(252,129,129,0.30)'
  )

  // ── handlers ──
  const openAdd = () => setModal({ open: true, mode: 'add', rowIndex: null })
  const openEdit = i => setModal({ open: true, mode: 'edit', rowIndex: i })
  const closeModal = () => setModal(m => ({ ...m, open: false }))

  const handleConfirm = scores => {
    if (modal.mode === 'add') {
      setRows(prev => [...prev, scores])
    } else {
      setRows(prev => {
        const next = [...prev]
        next[modal.rowIndex] = scores
        return next
      })
    }
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
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(229,62,62,0.28)',
            borderRadius: '4px'
          }
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
            background: `linear-gradient(135deg, ${headerFrom} 0%, ${headerTo} 100%)`
          }}
        >
          <HeaderCell isIndex>{t('roundNumber')}</HeaderCell>
          {playerNames.map((name, i) => (
            <HeaderCell key={i}>{name || `P${i + 1}`}</HeaderCell>
          ))}
        </Box>

        {/* Rows */}
        {rows.length === 0 ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="160px"
          >
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
              onEdit={() => openEdit(i)}
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
          onClick={openAdd}
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
            transition: { duration: 0.15 }
          }}
          whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
          onClick={handleFinish}
        >
          {t('finish')}
        </MotionBox>
      </Box>

      {/* ── Shared add/edit modal ── */}
      <CreateGameResultModal
        isOpen={modal.open}
        onClose={closeModal}
        onConfirm={handleConfirm}
        playerNames={playerNames}
        initialValues={modal.mode === 'edit' ? rows[modal.rowIndex] : null}
        roundIndex={modal.mode === 'edit' ? modal.rowIndex + 1 : null}
      />
    </Box>
  )
}
