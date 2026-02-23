import { useState, useEffect, useRef } from 'react'
import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform
} from 'framer-motion'
import { TbEdit, TbTrash } from 'react-icons/tb'
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
      w={isIndex ? '41px' : undefined}
    >
      {children}
    </Text>
  )
}

// ── Swipeable Data Row ────────────────────────────────────────────────────────
function DataRow({ index, scores, isEven, onEdit, onDelete }) {
  const { t } = useLanguage()

  const rowHoverBg = useColorModeValue('red.100', 'rgba(229,62,62,0.10)')
  const rowDivider = useColorModeValue('red.50', 'whiteAlpha.50')
  const indexDivider = useColorModeValue(
    'rgba(155,44,44,0.25)',
    'rgba(155,44,44,0.4)'
  )
  const indexColor = useColorModeValue('red.400', 'red.300')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const iconColor = useColorModeValue('red.300', 'red.600')
  const deleteBg = useColorModeValue(
    'rgba(229,62,62,0.12)',
    'rgba(229,62,62,0.15)'
  )
  const deleteTextClr = useColorModeValue('red.500', 'red.300')
  const confirmBg = useColorModeValue(
    'rgba(229,62,62,0.15)',
    'rgba(229,62,62,0.18)'
  )
  const confirmBtnBg = useColorModeValue('red.500', 'red.400')
  const confirmBtnBorder = useColorModeValue('red.400', 'red.300')

  const rowBg = useColorModeValue(
    isEven ? '#fff5f5' : 'white',
    isEven ? 'rgba(229,62,62,0.05)' : '#1e1e24'
  )

  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const constraintsRef = useRef(null)

  const x = useMotionValue(0)
  const deleteOpacity = useTransform(x, [-140, -70, 0], [1, 0.8, 0])
  const deleteScale = useTransform(x, [-140, -70, 0], [1, 0.85, 0.6])

  const SWIPE_THRESHOLD = -80

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (_, info) => {
    if (info.offset.x < SWIPE_THRESHOLD) {
      // Trigger shake + blur, then show confirm
      setIsShaking(true)
      setTimeout(() => {
        setIsShaking(false)
        setShowConfirm(true)
      }, 420)
    }
    // Delay resetting so onClick doesn't fire
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDragging(false)
      })
    })
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  const handleConfirmDelete = () => {
    setIsDeleting(true)
  }

  const handleDeleteAnimationComplete = () => {
    if (isDeleting) {
      onDelete()
    }
  }

  const handleRowClick = () => {
    if (isDragging || showConfirm || isShaking) return
    onEdit()
  }

  return (
    <AnimatePresence
      mode="popLayout"
      onExitComplete={handleDeleteAnimationComplete}
    >
      {!isDeleting && (
        <MotionBox
          layout
          initial={{ opacity: 1, height: 'auto' }}
          exit={{
            opacity: 0,
            height: 0,
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            transition: {
              opacity: { duration: 0.2 },
              height: { duration: 0.3, delay: 0.05, ease: [0.32, 0.72, 0, 1] }
            }
          }}
          position="relative"
          overflow="hidden"
          ref={constraintsRef}
        >
          {/* ── Delete action layer (sits behind the row) ── */}
          <Box
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            w="100%"
            bg={deleteBg}
            css={{
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            pr={5}
            zIndex={0}
          >
            <MotionBox
              style={{ opacity: deleteOpacity, scale: deleteScale }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <TbTrash size={16} color="var(--chakra-colors-red-400)" />
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={deleteTextClr}
                letterSpacing="0.06em"
              >
                {t('delete') || 'DELETE'}
              </Text>
            </MotionBox>
          </Box>{' '}
          {/* ── Shake + blur keyframes ── */}
          <style>{`
            @keyframes rowShake {
              0%, 100% { transform: translateX(0); filter: blur(0px); }
              10% { transform: translateX(-6px); filter: blur(1.5px); }
              20% { transform: translateX(5px); filter: blur(2px); }
              30% { transform: translateX(-4px); filter: blur(2.5px); }
              40% { transform: translateX(4px); filter: blur(2px); }
              50% { transform: translateX(-3px); filter: blur(1.5px); }
              60% { transform: translateX(2px); filter: blur(1px); }
              70% { transform: translateX(-1px); filter: blur(0.5px); }
              80%, 100% { transform: translateX(0); filter: blur(0px); }
            }
          `}</style>
          {/* ── Confirm delete overlay ── */}
          <AnimatePresence>
            {showConfirm && (
              <MotionBox
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                zIndex={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={3}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                bg={confirmBg}
                css={{
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)'
                }}
                px={4}
              >
                <Text fontSize="xs" fontWeight="bold" color="red.500" mr={2}>
                  {t('confirmDelete') || 'Delete this round?'}
                </Text>

                {/* Confirm button */}
                <MotionBox
                  as="button"
                  px={4}
                  py={1.5}
                  fontSize="xs"
                  fontWeight="bold"
                  fontFamily="'M PLUS Rounded 1c', sans-serif"
                  color="white"
                  bg={confirmBtnBg}
                  border="none"
                  borderRadius="full"
                  cursor="pointer"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleConfirmDelete}
                >
                  {t('yes') || 'Yes'}
                </MotionBox>

                {/* Cancel button */}
                <MotionBox
                  as="button"
                  px={4}
                  py={1.5}
                  fontSize="xs"
                  fontWeight="bold"
                  fontFamily="'M PLUS Rounded 1c', sans-serif"
                  color="red.500"
                  bg="transparent"
                  border="1.5px solid"
                  borderColor={confirmBtnBorder}
                  borderRadius="full"
                  cursor="pointer"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleCancel}
                >
                  {t('no') || 'No'}
                </MotionBox>
              </MotionBox>
            )}
          </AnimatePresence>
          {/* ── Draggable row content ── */}
          <MotionBox
            role="group"
            position="relative"
            zIndex={1}
            display="grid"
            gridTemplateColumns="40px 1fr 1fr 1fr 1fr"
            px={3}
            py="11px"
            bg={rowBg}
            borderBottom="1px solid"
            borderColor={rowDivider}
            cursor="grab"
            transition="background 0.15s"
            _hover={{ bg: showConfirm ? rowBg : rowHoverBg }}
            style={{ x, touchAction: 'pan-y' }}
            drag={showConfirm || isShaking ? false : 'x'}
            dragConstraints={{ left: -160, right: 0 }}
            dragElastic={{ left: 0.15, right: 0 }}
            dragSnapToOrigin
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleRowClick}
            whileActive={{ cursor: 'grabbing' }}
            css={
              isShaking
                ? {
                    animation: 'rowShake 0.4s ease-in-out',
                    filter: 'blur(0px)'
                  }
                : undefined
            }
          >
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={indexColor}
              textAlign="center"
              display="flex"
              alignItems="center"
              justifyContent="center"
              alignSelf="stretch"
              my="-12px"
              borderRight="1.5px solid"
              borderColor={indexDivider}
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

            {/* Edit hint */}
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
          </MotionBox>
        </MotionBox>
      )}
    </AnimatePresence>
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

    try {
      const storedRows = localStorage.getItem('gameRows')
      if (storedRows) setRows(JSON.parse(storedRows))
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
    let newRows
    if (modal.mode === 'add') {
      newRows = [...rows, scores]
    } else {
      newRows = [...rows]
      newRows[modal.rowIndex] = scores
    }
    setRows(newRows)
    localStorage.setItem('gameRows', JSON.stringify(newRows))
  }

  const handleDelete = i => {
    const newRows = rows.filter((_, idx) => idx !== i)
    setRows(newRows)
    localStorage.setItem('gameRows', JSON.stringify(newRows))
  }

  const handleFinish = () => {
    // TODO: navigate to results summary
    console.log('Finish game — not yet implemented')
  }

  return (
    <Box display="flex" flexDirection="column" h="calc(100svh - 195px)">
      {/* ── Fixed header (always visible) ── */}
      <Box
        display="grid"
        gridTemplateColumns="40px 1fr 1fr 1fr 1fr"
        px={3}
        py="12px"
        borderRadius="16px 16px 0 0"
        style={{
          background: `linear-gradient(135deg, ${headerFrom} 0%, ${headerTo} 100%)`
        }}
        border="1.5px solid"
        borderBottom="2px solid"
        borderColor={tableBorder}
        borderBottomColor="rgba(255,255,255,0.15)"
        boxShadow="0 2px 14px rgba(0,0,0,0.07)"
      >
        <HeaderCell isIndex>{t('roundNumber')}</HeaderCell>
        {playerNames.map((name, i) => (
          <HeaderCell key={i}>{name || `P${i + 1}`}</HeaderCell>
        ))}
      </Box>
      {/* ── Scrollable table body ── */}
      <Box
        flex={1}
        minH={0}
        overflowY="auto"
        bg={tableBg}
        borderLeft="1.5px solid"
        borderRight="1.5px solid"
        borderColor={tableBorder}
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(229,62,62,0.28)',
            borderRadius: '4px'
          }
        }}
      >
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
          <AnimatePresence initial={false}>
            {rows.map((row, i) => (
              <DataRow
                key={`row-${i}-${row.join(',')}`}
                index={i + 1}
                scores={row}
                isEven={i % 2 === 1}
                onEdit={() => openEdit(i)}
                onDelete={() => handleDelete(i)}
              />
            ))}
          </AnimatePresence>
        )}
      </Box>
      {/* ── Fixed total bar (always visible) ── */}
      <Box
        display="grid"
        gridTemplateColumns="40px 1fr 1fr 1fr 1fr"
        px={3}
        py="10px"
        borderRadius="0 0 16px 16px"
        style={{
          background: `linear-gradient(135deg, ${headerFrom} 0%, ${headerTo} 100%)`
        }}
        border="1.5px solid"
        borderTop="2px solid"
        borderColor={tableBorder}
        borderTopColor="rgba(255,255,255,0.15)"
        boxShadow="0 -2px 14px rgba(0,0,0,0.07)"
      >
        <Text
          key={'total-games'}
          fontSize="sm"
          fontWeight="bold"
          textAlign="center"
          color={useColorModeValue('whiteAlpha.900', 'white')}
          display="flex"
          alignItems="center"
          justifyContent="center"
          alignSelf="stretch"
          my="-10px"
          borderRight="1.5px solid"
          borderColor="rgba(155,44,44,0.6)"
        >
          {/* The number of games */}
          {rows.length}
        </Text>
        {playerNames.map((_, i) => {
          const total = rows.reduce((sum, row) => sum + (row[i] ?? 0), 0)
          return (
            <Text
              key={i}
              fontSize="sm"
              fontWeight="bold"
              textAlign="center"
              color={total > 0 ? 'green.200' : total < 0 ? 'red.200' : 'white'}
            >
              {total}
            </Text>
          )
        })}
      </Box>{' '}
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
