import { useState } from 'react'
import { FaInfo } from 'react-icons/fa'
import Image from 'next/image'
import {
  Box,
  Text,
  IconButton,
  Portal,
  Link,
  useColorModeValue,
  Flex,
  Badge,
  Divider,
  Tooltip
} from '@chakra-ui/react'
import { CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useLanguage } from '../lib/i18n'
import styled from '@emotion/styled'

const MotionBox = motion(Box)

const GlowButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(135deg, #e84848 0%, #ff6b6b 100%);
  box-shadow: 0 4px 18px rgba(229, 62, 62, 0.35);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 6px 28px rgba(229, 62, 62, 0.5);
  }
`

const floatAnimation = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15
    }
  }
}

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2 } }
}

function EngineerInfoModal({ isOpen, onClose }) {
  const { t } = useLanguage()
  const [liked, setLiked] = useState(false)

  const modalBg = useColorModeValue('#fff5f5', '#1e1616')
  const headerColor = useColorModeValue('gray.800', 'gray.50')
  const subtitleClr = useColorModeValue('gray.600', 'gray.400')
  const cardBg = useColorModeValue('white', '#261919')
  const borderClr = useColorModeValue('red.100', 'red.900')
  const accentGradient = 'linear-gradient(135deg, #e84848 0%, #ff6b6b 100%)'

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
              bg="blackAlpha.700"
              css={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onClose}
            />

            {/* Panel */}
            <MotionBox
              position="fixed"
              top="50%"
              left="50%"
              zIndex={1300}
              w={{ base: '92vw', sm: '420px', md: '460px' }}
              maxH="90vh"
              overflowY="auto"
              bg={modalBg}
              borderRadius="28px"
              border="1px solid"
              borderColor={borderClr}
              boxShadow="0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(229,62,62,0.08)"
              initial={{ opacity: 0, scale: 0.85, x: '-50%', y: '-46%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.85, x: '-50%', y: '-46%' }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              onClick={e => e.stopPropagation()}
            >
              {/* Accent top bar */}

              <Box p={{ base: 5, md: 7 }}>
                {/* Header row */}
                <Flex justify="space-between" align="center" mb={4}>
                  <Badge
                    bgGradient={accentGradient}
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="0.7rem"
                    fontWeight="800"
                    textTransform="uppercase"
                    letterSpacing="0.05em"
                  >
                    {t('engineerInfoHeader')}
                  </Badge>

                  <IconButton
                    icon={<CloseIcon boxSize="8px" />}
                    aria-label="Close"
                    size="xs"
                    variant="ghost"
                    borderRadius="full"
                    color={subtitleClr}
                    _hover={{
                      bg: 'red.50',
                      color: 'red.500',
                      _dark: { bg: 'red.900', color: 'red.300' }
                    }}
                    onClick={onClose}
                  />
                </Flex>

                {/* Title & subtitle */}
                <motion.div
                  variants={staggerChildren}
                  initial="initial"
                  animate="animate"
                >
                  <motion.div variants={fadeUp}>
                    <Divider borderColor={borderClr} mb={4} />
                  </motion.div>
                  {/* Author section */}
                  <motion.div variants={fadeUp}>
                    <Flex
                      align="center"
                      justify="space-between"
                      bg={cardBg}
                      borderRadius="14px"
                      border="1px solid"
                      borderColor={borderClr}
                      px={4}
                      py={3}
                      mb={4}
                    >
                      <Flex align="center" gap={3}>
                        <Box
                          w="36px"
                          h="36px"
                          borderRadius="full"
                          bgGradient={accentGradient}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                          fontWeight="800"
                          fontSize="sm"
                          flexShrink={0}
                        >
                          L
                        </Box>
                        <Box>
                          <Text
                            fontSize="sm"
                            fontWeight="700"
                            color={headerColor}
                          >
                            Minh-Tri Le
                          </Text>
                          <Text fontSize="xs" color={subtitleClr}>
                            Creator & Developer
                          </Text>
                        </Box>
                      </Flex>

                      <Flex align="center" gap={2}>
                        <Tooltip
                          label={
                            liked
                              ? t('engineerInfoThanks')
                              : t('engineerInfoShowLove')
                          }
                          hasArrow
                          borderRadius="lg"
                        >
                          <IconButton
                            icon={liked ? <FaHeart /> : <FaRegHeart />}
                            aria-label="Like"
                            size="sm"
                            variant="ghost"
                            borderRadius="full"
                            color={liked ? 'red.400' : subtitleClr}
                            onClick={() => setLiked(!liked)}
                            _hover={{
                              color: 'red.400',
                              bg: 'red.50',
                              _dark: { bg: 'red.900' }
                            }}
                          />
                        </Tooltip>

                        <Link
                          href="https://lambertse.vercel.app"
                          isExternal
                          _hover={{ textDecoration: 'none' }}
                        >
                          <GlowButton
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {t('engineerInfoVisit')}{' '}
                            <ExternalLinkIcon boxSize="12px" />
                          </GlowButton>
                        </Link>
                      </Flex>
                    </Flex>
                  </motion.div>

                  {/* QR code card */}
                  <motion.div variants={fadeUp}>
                    <Box
                      bg={cardBg}
                      borderRadius="18px"
                      border="1px solid"
                      borderColor={borderClr}
                      p={4}
                      mb={4}
                      boxShadow="0 4px 20px rgba(229,62,62,0.08)"
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="700"
                        color={subtitleClr}
                        textTransform="uppercase"
                        letterSpacing="0.08em"
                        mb={3}
                        textAlign="center"
                      >
                        ☕ {t('momoScanMessage')}
                      </Text>

                      <Flex justify="center">
                        <Box
                          borderRadius="14px"
                          overflow="hidden"
                          border="3px solid"
                          borderColor="red.200"
                          boxShadow="0 8px 30px rgba(229,62,62,0.15)"
                          transition="transform 0.3s ease, box-shadow 0.3s ease"
                          _hover={{
                            transform: 'scale(1.03)',
                            boxShadow: '0 12px 40px rgba(255,154,86,0.25)'
                          }}
                        >
                          <Image
                            src="/images/momo_qr.jpeg"
                            alt="MoMo QR Code - Buy me a coffee"
                            width={280}
                            height={280}
                            style={{ display: 'block', objectFit: 'cover' }}
                            priority
                          />
                        </Box>
                      </Flex>
                    </Box>
                  </motion.div>

                  {/* Footer note */}
                  <motion.div variants={fadeUp}>
                    <Text
                      fontSize="xs"
                      color={subtitleClr}
                      textAlign="center"
                      lineHeight="1.5"
                    >
                      <Text as="span" fontWeight="600" color="red.400">
                        {t('engineerInfoThanksNote')}
                      </Text>
                    </Text>
                  </motion.div>
                </motion.div>
              </Box>
            </MotionBox>
          </>
        )}
      </AnimatePresence>
    </Portal>
  )
}

export default function EngineerInfo() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Box borderRadius="full">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}>
          <IconButton
            icon={<FaInfo size="12px" />}
            aria-label="Buy me a coffee"
            size="md"
            bg={useColorModeValue('red.700', 'red.300')}
            color="white"
              boxShadow="0 4px 16px rgba(229,62,62,0.4)"
              _hover={{
                boxShadow: '0 6px 24px rgba(229,62,62,0.55)',
                bg: 'linear-gradient(135deg, #e84848 0%, #ff5252 100%)'
            }}
            _active={{
              bg: 'linear-gradient(135deg, #e8793a 0%, #e84848 100%)'
            }}
            onClick={() => setIsModalOpen(true)}
          />
        </motion.div>
      </Box>

      <EngineerInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
