import { Box, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { SlReload } from 'react-icons/sl'
import ResetSessionModal from './reset-session-modal'
import ScoreTableView from './score-table-view'
import { useLanguage } from '../lib/i18n'

const MotionBox = motion(Box)

const ScoreTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useLanguage()

  const btnBorder  = useColorModeValue('red.200', 'red.800')
  const btnColor   = useColorModeValue('red.500', 'red.300')
  const btnHoverBg = useColorModeValue('red.50', 'rgba(229,62,62,0.12)')

  return (
    <Box mt={5}>
      {/* Reset button — right aligned */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
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
      <ScoreTableView />

      <ResetSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  )
}

export default ScoreTable
