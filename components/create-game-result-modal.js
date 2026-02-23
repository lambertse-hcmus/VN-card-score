import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Text,
  IconButton,
  Portal,
  useColorModeValue,
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../lib/i18n'

const MotionBox = motion(Box)

// ── Score input box (mirrors PlayerBox in create-session-modal) ───────────────

function ScoreBox({ index, playerName, value, isEditing, hasError, onEdit, onDone, onChange, onKeyDown }) {
  const { t } = useLanguage()

  const boxBg       = useColorModeValue('white', '#25252c')
  const borderIdle  = useColorModeValue('#e8e8e8', 'rgba(255,255,255,0.10)')
  const borderActive = useColorModeValue('#e53e3e', '#fc8181')
  const borderError  = useColorModeValue('#e53e3e', '#fc8181')
  const labelColor  = useColorModeValue('red.500', 'red.300')
  const valueColor  = useColorModeValue('gray.800', 'gray.100')
  const placeholderClr = useColorModeValue('#b0b0b0', '#555560')
  const inputColor  = useColorModeValue('#1a1a1a', '#f0f0f0')
  const errorBg     = useColorModeValue('red.50', 'rgba(229,62,62,0.10)')

  const borderColorResolved = isEditing
    ? borderActive
    : hasError
      ? borderError
      : borderIdle

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: 0.12 + index * 0.07, ease: 'easeOut' }}
      style={{ display: 'flex', flex: 1 }}
    >
      <Box
        flex={1}
        bg={hasError && !isEditing ? errorBg : boxBg}
        border="2px solid"
        borderColor={borderColorResolved}
        borderRadius="14px"
        p={{ base: 3, md: 4 }}
        cursor="pointer"
        onClick={onEdit}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH={{ base: '88px', md: '108px' }}
        boxShadow={
          isEditing
            ? '0 0 0 3px rgba(229,62,62,0.18), 0 2px 10px rgba(0,0,0,0.10)'
            : hasError
              ? '0 0 0 2px rgba(229,62,62,0.15)'
              : '0 1px 4px rgba(0,0,0,0.07)'
        }
        transition="border-color 0.18s, box-shadow 0.18s, background 0.18s"
        _hover={{ borderColor: isEditing ? borderActive : 'red.300' }}
        {...(hasError && {
          animation: 'shake 0.35s ease-in-out'
        })}
      >
        {/* Player name label */}
        <Text
          fontSize="10px"
          fontWeight="bold"
          color={labelColor}
          letterSpacing="0.13em"
          textTransform="uppercase"
          mb={1}
          isTruncated
          maxW="100%"
        >
          {playerName || `P${index + 1}`}
        </Text>

        {isEditing ? (
          <input
            autoFocus
            value={value}
            inputMode="text"
            pattern="-?[0-9]*"
            onChange={e => onChange(e.target.value)}
            onBlur={onDone}
            onKeyDown={onKeyDown}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              textAlign: 'center',
              fontSize: '22px',
              fontWeight: '700',
              background: 'transparent',
              color: inputColor,
            }}
          />
        ) : (
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={value !== '' ? valueColor : placeholderClr}
          >
            {value !== '' ? value : '0'}
          </Text>
        )}
      </Box>
    </motion.div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export default function CreateGameResultModal({
  isOpen,
  onClose,
  onConfirm,
  playerNames = ['', '', '', ''],
  initialValues = null,
  roundIndex = null,
}) {
  const [inputs, setInputs]             = useState(['', '', '', ''])
  const [editingIndex, setEditingIndex] = useState(null)
  const [errors, setErrors]             = useState(new Set())
  const [errorMessage, setErrorMessage] = useState('')

  const { t } = useLanguage()

  // Reset inputs each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setInputs(initialValues ? initialValues.map(String) : ['', '', '', ''])
      setEditingIndex(null)
      setErrors(new Set())
      setErrorMessage('')
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Enter key triggers confirm
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleConfirm()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const isEditMode = roundIndex !== null

  const modalBg     = useColorModeValue('#ffffff', '#1b1b22')
  const headerColor = useColorModeValue('gray.800', 'gray.50')
  const subtitleClr = useColorModeValue('gray.500', 'gray.400')
  const dividerClr  = useColorModeValue('gray.100', 'whiteAlpha.100')
  const glowColor   = useColorModeValue('rgba(197,48,48,0.50)', 'rgba(252,129,129,0.38)')
  const btnGradient = useColorModeValue(
    'linear-gradient(135deg, #e53e3e 0%, #9b2c2c 100%)',
    'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)'
  )
  const btnTextColor  = useColorModeValue('white', '#1a202c')
  const cancelBorder  = useColorModeValue('gray.300', 'whiteAlpha.300')
  const cancelColor   = useColorModeValue('gray.600', 'gray.300')
  const cancelHoverBg = useColorModeValue('gray.100', 'whiteAlpha.100')

  const handleChange = (index, value) => {
    // Allow digits, minus sign, and empty string
    if (value === '' || value === '-' || /^-?\d+$/.test(value)) {
      setInputs(prev => { const n = [...prev]; n[index] = value; return n })
    }
    // Clear errors as user types
    if (errors.size > 0) {
      setErrors(new Set())
      setErrorMessage('')
    }
  }

  const handleDone = () => setEditingIndex(null)

  const handleKeyDown = (e, index) => {
    if (e.key === 'Escape') {
      setInputs(prev => { const n = [...prev]; n[index] = ''; return n })
      setEditingIndex(null)
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const next = e.shiftKey
        ? (index === 0 ? 3 : index - 1)
        : (index === 3 ? 0 : index + 1)
      setEditingIndex(next)
    }
  }

  const handleConfirm = () => {
    const scores = inputs.map(v => {
      const n = parseInt(v, 10)
      return isNaN(n) ? 0 : n
    })

    // Validate: sum must equal 0
    const sum = scores.reduce((a, b) => a + b, 0)
    if (sum !== 0) {
      setErrors(new Set([0, 1, 2, 3]))
      setErrorMessage(
        t('sumNotZero')
          ? t('sumNotZero').replace('{sum}', sum)
          : `Total score must equal 0 (currently ${sum > 0 ? '+' : ''}${sum})`
      )
      return
    }

    setErrors(new Set())
    setErrorMessage('')
    onConfirm(scores)
    onClose()
  }

  const title = isEditMode
    ? `${t('editRound')} ${roundIndex}`
    : t('addRoundTitle')

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <MotionBox
              position="fixed"
              inset={0}
              zIndex={1200}
              bg="blackAlpha.600"
              css={{ backdropFilter: 'blur(7px)', WebkitBackdropFilter: 'blur(7px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={onClose}
            />

            {/* Panel */}
            <MotionBox
              position="fixed"
              top="50%"
              left="50%"
              zIndex={1300}
              w={{ base: '92vw', md: '460px' }}
              bg={modalBg}
              borderRadius="22px"
              boxShadow="0 28px 70px rgba(0,0,0,0.30)"
              p={{ base: 5, md: 7 }}
              initial={{ opacity: 0, scale: 0.88, x: '-50%', y: '-48%' }}
              animate={{ opacity: 1, scale: 1,    x: '-50%', y: '-50%' }}
              exit={{    opacity: 0, scale: 0.88, x: '-50%', y: '-48%' }}
              transition={{ duration: 0.26, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Shake keyframes */}
              <style>{`
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  20% { transform: translateX(-4px); }
                  40% { transform: translateX(4px); }
                  60% { transform: translateX(-3px); }
                  80% { transform: translateX(3px); }
                }
              `}</style>

              {/* Header */}
              <Box
                display="flex"
                alignItems="flex-start"
                justifyContent="space-between"
                mb={{ base: 4, md: 5 }}
              >
                <Box>
                  <Text
                    fontSize={{ base: 'lg', md: 'xl' }}
                    fontWeight="bold"
                    fontFamily="'M PLUS Rounded 1c', sans-serif"
                    color={headerColor}
                    lineHeight={1.3}
                  >
                    {title}
                  </Text>
                  <Text fontSize="sm" color={subtitleClr} mt={0.5}>
                    {t('enterScores')}
                  </Text>
                </Box>

                <IconButton
                  icon={<CloseIcon boxSize="9px" />}
                  aria-label="Close"
                  size="sm"
                  variant="ghost"
                  borderRadius="full"
                  color={subtitleClr}
                  _hover={{ bg: 'red.50', color: 'red.500' }}
                  onClick={onClose}
                  mt={0.5}
                />
              </Box>

              {/* Divider */}
              <Box h="1px" bg={dividerClr} mb={{ base: 4, md: 5 }} />

              {/* 2×2 Score grid */}
              <Grid
                templateColumns="1fr 1fr"
                gap={{ base: 3, md: 4 }}
                mb={{ base: 2, md: 3 }}
              >
                {[0, 1, 2, 3].map(i => (
                  <ScoreBox
                    key={i}
                    index={i}
                    playerName={playerNames[i]}
                    value={inputs[i]}
                    isEditing={editingIndex === i}
                    hasError={errors.has(i)}
                    onEdit={() => setEditingIndex(i)}
                    onDone={handleDone}
                    onChange={val => handleChange(i, val)}
                    onKeyDown={e => handleKeyDown(e, i)}
                  />
                ))}
              </Grid>

              {/* Error message */}
              <AnimatePresence>
                {errorMessage && (
                  <MotionBox
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    mb={{ base: 3, md: 3 }}
                    mt={1}
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="red.500"
                      textAlign="center"
                    >
                      {errorMessage}
                    </Text>
                  </MotionBox>
                )}
              </AnimatePresence>

              {/* Spacer when no error */}
              {!errorMessage && <Box mb={{ base: 3, md: 3 }} />}

              {/* Action buttons */}
              <Box display="flex" gap={3}>
                {/* Cancel */}
                <MotionBox
                  as="button"
                  flex={1}
                  py={{ base: 3, md: 4 }}
                  fontSize={{ base: 'sm', md: 'md' }}
                  fontWeight="semibold"
                  fontFamily="'M PLUS Rounded 1c', sans-serif"
                  color={cancelColor}
                  bg="transparent"
                  border="1.5px solid"
                  borderColor={cancelBorder}
                  borderRadius="full"
                  cursor="pointer"
                  letterSpacing="wide"
                  style={{ transition: 'background 0.15s' }}
                  _hover={{ bg: cancelHoverBg }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                  onClick={onClose}
                >
                  {t('cancel')}
                </MotionBox>

                {/* Confirm */}
                <MotionBox
                  as="button"
                  flex={1}
                  py={{ base: 3, md: 4 }}
                  fontSize={{ base: 'sm', md: 'md' }}
                  fontWeight="bold"
                  fontFamily="'M PLUS Rounded 1c', sans-serif"
                  color={btnTextColor}
                  background={btnGradient}
                  border="none"
                  borderRadius="full"
                  cursor="pointer"
                  letterSpacing="wide"
                  style={{ boxShadow: `0 4px 22px ${glowColor}` }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: `0 8px 36px ${glowColor}`,
                    transition: { duration: 0.18 },
                  }}
                  whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                  onClick={handleConfirm}
                >
                  {t('confirm')}
                </MotionBox>
              </Box>
            </MotionBox>
          </>
        )}
      </AnimatePresence>
    </Portal>
  )
}
