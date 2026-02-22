import { useState } from 'react'
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

// ── Player input box ──────────────────────────────────────────────────────────

function PlayerBox({ index, value, isEditing, onEdit, onDone, onChange, onKeyDown }) {
  const { t } = useLanguage()

  const boxBg          = useColorModeValue('white', '#25252c')
  const borderIdle     = useColorModeValue('#e8e8e8', 'rgba(255,255,255,0.10)')
  const borderActive   = useColorModeValue('#e53e3e', '#fc8181')
  const labelColor     = useColorModeValue('red.500', 'red.300')
  const valueColor     = useColorModeValue('gray.800', 'gray.100')
  const placeholderClr = useColorModeValue('#b0b0b0', '#555560')
  const inputColor     = useColorModeValue('#1a1a1a', '#f0f0f0')

  return (
    // motion.div handles entrance; inner Box handles interactive CSS
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: 0.12 + index * 0.07, ease: 'easeOut' }}
      style={{ display: 'flex', flex: 1 }}
    >
      <Box
        flex={1}
        bg={boxBg}
        border="2px solid"
        borderColor={isEditing ? borderActive : borderIdle}
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
            : '0 1px 4px rgba(0,0,0,0.07)'
        }
        transition="border-color 0.18s, box-shadow 0.18s"
        _hover={{ borderColor: isEditing ? borderActive : 'red.300' }}
      >
        <Text
          fontSize="10px"
          fontWeight="bold"
          color={labelColor}
          letterSpacing="0.13em"
          textTransform="uppercase"
          mb={2}
        >
          {t('player')} {index + 1}
        </Text>

        {isEditing ? (
          <input
            autoFocus
            value={value}
            onChange={e => onChange(e.target.value)}
            onBlur={onDone}
            onKeyDown={onKeyDown}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              textAlign: 'center',
              fontSize: '15px',
              fontWeight: '600',
              background: 'transparent',
              color: inputColor,
            }}
          />
        ) : (
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight={value ? 'semibold' : 'normal'}
            color={value ? valueColor : placeholderClr}
            textAlign="center"
          >
            {value || t('clickToType')}
          </Text>
        )}
      </Box>
    </motion.div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export default function CreateSessionModal({ isOpen, onClose }) {
  const [inputs, setInputs]             = useState(['', '', '', ''])
  const [editingIndex, setEditingIndex] = useState(null)

  const { t } = useLanguage()

  const modalBg      = useColorModeValue('#ffffff', '#1b1b22')
  const headerColor  = useColorModeValue('gray.800', 'gray.50')
  const subtitleClr  = useColorModeValue('gray.500', 'gray.400')
  const dividerClr   = useColorModeValue('gray.100', 'whiteAlpha.100')
  const glowColor    = useColorModeValue('rgba(197,48,48,0.50)', 'rgba(252,129,129,0.38)')
  const btnGradient  = useColorModeValue(
    'linear-gradient(135deg, #e53e3e 0%, #9b2c2c 100%)',
    'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)'
  )
  const btnTextColor = useColorModeValue('white', '#1a202c')

  const handleChange = (index, value) => {
    setInputs(prev => { const n = [...prev]; n[index] = value; return n })
  }

  const handleDone = () => setEditingIndex(null)

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') handleDone()
    if (e.key === 'Escape') {
      setInputs(prev => { const n = [...prev]; n[index] = ''; return n })
      setEditingIndex(null)
    }
  }

  const handleStartGame = () => {
    const playerNames = inputs.map(name => name.trim() || null)
    console.log('Starting game with players:', playerNames)
    if(!playerNames.every(name => name)) {
      alert(t('enterPlayerNames'))
      return 
    } 
    localStorage.setItem('playerNames', JSON.stringify(playerNames))
    window.location.href = '/' 
  }

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
                    {t('createSession')}
                  </Text>
                  <Text fontSize="sm" color={subtitleClr} mt={0.5}>
                    {t('enterPlayerNames')}
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

              {/* 2×2 Player grid */}
              <Grid
                templateColumns="1fr 1fr"
                gap={{ base: 3, md: 4 }}
                mb={{ base: 5, md: 6 }}
              >
                {[0, 1, 2, 3].map(i => (
                  <PlayerBox
                    key={i}
                    index={i}
                    value={inputs[i]}
                    isEditing={editingIndex === i}
                    onEdit={() => setEditingIndex(i)}
                    onDone={handleDone}
                    onChange={val => handleChange(i, val)}
                    onKeyDown={e => handleKeyDown(e, i)}
                  />
                ))}
              </Grid>

              {/* Start game button */}
              <MotionBox
                as="button"
                display="block"
                w="100%"
                py={{ base: 4, md: 5 }}
                fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight="bold"
                fontFamily="'M PLUS Rounded 1c', sans-serif"
                borderRadius="full"
                background={btnGradient}
                color={btnTextColor}
                border="none"
                cursor="pointer"
                letterSpacing="wide"
                style={{ boxShadow: `0 4px 22px ${glowColor}` }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: `0 8px 36px ${glowColor}`,
                  transition: { duration: 0.18 },
                }}
                whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                onClick={handleStartGame}
              >
                {t('startGame')}
              </MotionBox>
            </MotionBox>
          </>
        )}
      </AnimatePresence>
    </Portal>
  )
}
