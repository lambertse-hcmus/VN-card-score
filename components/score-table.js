import { Box, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { SlReload } from 'react-icons/sl'
import ResetSessionModal from './reset-session-modal'
import { useLanguage } from '../lib/i18n'

const MotionBox = motion(Box)

const ScoreTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useLanguage()

  const btnBorder  = useColorModeValue('red.200', 'red.800')
  const btnColor   = useColorModeValue('red.500', 'red.300')
  const btnBg      = useColorModeValue('transparent', 'transparent')
  const btnHoverBg = useColorModeValue('red.50', 'rgba(229,62,62,0.12)')

  return (
    <Box align="right" mt={5}>
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
        bg={btnBg}
        border="1.5px solid"
        borderColor={btnBorder}
        borderRadius="full"
        cursor="pointer"
        letterSpacing="wide"
        style={{ transition: 'background 0.18s, border-color 0.18s, color 0.18s' }}
        whileHover={{
          scale: 1.04,
          transition: { duration: 0.15 },
        }}
        whileTap={{ scale: 0.96, transition: { duration: 0.1 } }}
        onClick={() => setIsModalOpen(true)}
        _hover={{ bg: btnHoverBg, borderColor: btnColor }}
        aria-label={t('reset')}
      >
        <Box as={SlReload} boxSize="13px" />
        {t('reset')}
      </MotionBox>

      <ResetSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  )
}

export default ScoreTable
