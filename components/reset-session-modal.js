import {
  Box,
  Text,
  IconButton,
  Portal,
  useColorModeValue
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { TbAlertTriangle } from 'react-icons/tb'
import { useLanguage } from '../lib/i18n'

const MotionBox = motion(Box)

export default function ResetSessionModal({ isOpen, onClose }) {
  const { t } = useLanguage()

  const modalBg = useColorModeValue('#ffffff', '#1b1b22')
  const headerColor = useColorModeValue('gray.800', 'gray.50')
  const warningText = useColorModeValue('gray.600', 'gray.400')
  const subtitleClr = useColorModeValue('gray.500', 'gray.400')
  const dividerClr = useColorModeValue('gray.100', 'whiteAlpha.100')
  const iconBg = useColorModeValue('orange.50', 'rgba(221,107,32,0.12)')
  const iconColor = useColorModeValue('orange.400', 'orange.300')

  // Cancel — neutral outline
  const cancelBorder = useColorModeValue('gray.300', 'whiteAlpha.300')
  const cancelColor = useColorModeValue('gray.600', 'gray.300')
  const cancelHoverBg = useColorModeValue('gray.100', 'whiteAlpha.100')

  // Confirm — red solid
  const confirmGradient = useColorModeValue(
    'linear-gradient(135deg, #e53e3e 0%, #9b2c2c 100%)',
    'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)'
  )
  const confirmText = useColorModeValue('white', '#1a202c')
  const confirmGlow = useColorModeValue(
    'rgba(197,48,48,0.40)',
    'rgba(252,129,129,0.30)'
  )

  const handleConfirm = () => {
    localStorage.removeItem('playerNames')
    window.location.reload()
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
              css={{
                backdropFilter: 'blur(7px)',
                WebkitBackdropFilter: 'blur(7px)'
              }}
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
              w={{ base: '88vw', md: '400px' }}
              bg={modalBg}
              borderRadius="22px"
              boxShadow="0 28px 70px rgba(0,0,0,0.30)"
              p={{ base: 5, md: 6 }}
              initial={{ opacity: 0, scale: 0.88, x: '-50%', y: '-48%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.88, x: '-50%', y: '-48%' }}
              transition={{ duration: 0.26, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Close button */}
              <Box display="flex" justifyContent="flex-end" mb={1}>
                <IconButton
                  icon={<CloseIcon boxSize="9px" />}
                  aria-label="Close"
                  size="sm"
                  variant="ghost"
                  borderRadius="full"
                  color={subtitleClr}
                  _hover={{ bg: 'red.50', color: 'red.500' }}
                  onClick={onClose}
                />
              </Box>

              {/* Warning icon */}
              <Box display="flex" justifyContent="center" mb={4}>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.1,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                >
                  <Box
                    bg={iconBg}
                    borderRadius="full"
                    p={4}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box
                      as={TbAlertTriangle}
                      boxSize="36px"
                      color={iconColor}
                    />
                  </Box>
                </motion.div>
              </Box>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.18 }}
              >
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  fontWeight="bold"
                  fontFamily="'M PLUS Rounded 1c', sans-serif"
                  color={headerColor}
                  textAlign="center"
                  mb={3}
                >
                  {t('resetTitle')}
                </Text>

                {/* Warning text */}
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  color={warningText}
                  textAlign="center"
                  lineHeight={1.65}
                  px={2}
                >
                  {t('resetWarning')}
                </Text>
              </motion.div>

              {/* Divider */}
              <Box h="1px" bg={dividerClr} my={{ base: 5, md: 6 }} />

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.24 }}
              >
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
                    whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                    _hover={{ bg: cancelHoverBg }}
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
                    color={confirmText}
                    background={confirmGradient}
                    border="none"
                    borderRadius="full"
                    cursor="pointer"
                    letterSpacing="wide"
                    style={{ boxShadow: `0 4px 18px ${confirmGlow}` }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: `0 6px 28px ${confirmGlow}`,
                      transition: { duration: 0.15 }
                    }}
                    whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                    onClick={handleConfirm}
                  >
                    {t('confirmReset')}
                  </MotionBox>
                </Box>
              </motion.div>
            </MotionBox>
          </>
        )}
      </AnimatePresence>
    </Portal>
  )
}
