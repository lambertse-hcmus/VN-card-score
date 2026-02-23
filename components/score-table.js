import { Box, useColorModeValue } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlReload } from 'react-icons/sl'
import ResetSessionModal from './reset-session-modal'
import ScoreTableView from './score-table-view'
import CreateGameResultModal from './create-game-result-modal'
import FinishConfirmationModal from './finish-confirmation'

import { useLanguage } from '../lib/i18n'

const MotionBox = motion(Box)

const ScoreTable = ({ onFinishClick }) => {
  const { t } = useLanguage()

  const [rows, setRows] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false)
  const [playerNames, setPlayerNames] = useState(['', '', '', ''])
  // -- color schemes --
  const btnBorder = useColorModeValue('red.200', 'red.800')
  const btnColor = useColorModeValue('red.500', 'red.300')
  const btnHoverBg = useColorModeValue('red.50', 'rgba(229,62,62,0.12)')
  const addBorder = useColorModeValue('red.200', 'red.800')
  const addColor = useColorModeValue('red.500', 'red.300')
  const addHoverBg = useColorModeValue('red.50', 'rgba(229,62,62,0.12)')
  const finishText = useColorModeValue('white', '#1a202c')
  const finishGlow = useColorModeValue(
    'rgba(197,48,48,0.40)',
    'rgba(252,129,129,0.30)'
  )
  const finishGradient = useColorModeValue(
    'linear-gradient(135deg, #e53e3e 0%, #9b2c2c 100%)',
    'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)'
  )

  const [modal, setModal] = useState({
    open: false,
    mode: 'add',
    rowIndex: null
  })

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

  const handleFinishConfirm = () => {
    const finalScores = playerNames.reduce((acc, name, i) => {
      acc[name] = rows.reduce((sum, round) => sum + (round[i] || 0), 0)
      return acc
    }, {})
    onFinishClick(finalScores)
    localStorage.removeItem('playerNames')
    localStorage.removeItem('gameRows')
    setIsFinishModalOpen(false)
  }

  // ── handlers ──
  const openAdd = () => setModal({ open: true, mode: 'add', rowIndex: null })
  const closeModal = () => setModal(m => ({ ...m, open: false }))
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

  return (
    <Box>
      {/* Reset button — right aligned */}
      <Box display="flex" justifyContent="flex-end" my={2}>
        <MotionBox
          as="button"
          display="inline-flex"
          alignItems="center"
          gap="6px"
          px={4}
          py={2}
          fontSize="sm"
          fontWeight="semibold"
          fontFamily="'M PLUS Rounded 1c', sans-serif"
          color={btnColor}
          bg="transparent"
          border="1.5px solid"
          borderColor={btnBorder}
          borderRadius="full"
          cursor="pointer"
          letterSpacing="wide"
          style={{ transition: 'background 0.18s, border-color 0.18s' }}
          _hover={{ bg: btnHoverBg, borderColor: btnColor }}
          whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.96, transition: { duration: 0.1 } }}
          onClick={() => setIsModalOpen(true)}
          aria-label={t('reset')}
        >
          <Box as={SlReload} boxSize="13px" />
          {t('reset')}
        </MotionBox>
      </Box>

      {/* Score table */}
      <ScoreTableView
        rows={rows}
        playerNames={playerNames}
        updateRows={rows => {
          setRows(rows)
        }}
      />

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
          onClick={() => setIsFinishModalOpen(true)}
        >
          {t('finish')}
        </MotionBox>
      </Box>

      {/* ── Reset confirmation modal ── */}
      <ResetSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {/* ── Shared add/edit modal ── */}
      <CreateGameResultModal
        isOpen={modal.open}
        onClose={closeModal}
        onConfirm={handleConfirm}
        playerNames={playerNames}
        initialValues={modal.mode === 'edit' ? rows[modal.rowIndex] : null}
        roundIndex={modal.mode === 'edit' ? modal.rowIndex + 1 : null}
      />
      {/* ── Finish confirmation modal ── */}
      <FinishConfirmationModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onConfirm={() => {
          handleFinishConfirm()
        }}
      />
    </Box>
  )
}

export default ScoreTable
