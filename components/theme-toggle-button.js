import { motion } from 'framer-motion'
import { Box, Flex, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { useLanguage } from '../lib/i18n'

const ThemeToggleButton = () => {
  const { toggleColorMode, colorMode } = useColorMode()
  const { t } = useLanguage()
  const isDark = colorMode === 'dark'

  const pillBg = useColorModeValue('#deb887', '#3a3a3f')
  const circleBg = useColorModeValue('#ffffff', '#1a1a1f')
  const sunColor = useColorModeValue('#333333', '#666666')
  const moonColor = useColorModeValue('#999999', '#ffffff')

  return (
    <Box
      as="button"
      onClick={toggleColorMode}
      position="relative"
      width="72px"
      height="38px"
      borderRadius="full"
      bg={pillBg}
      display="flex"
      alignItems="center"
      cursor="pointer"
      border="none"
      outline="none"
      p="3px"
      aria-label={t('toggleTheme')}
    >
      {/* Sliding circle */}
      <motion.div
        style={{
          position: 'absolute',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: circleBg,
          boxShadow: isDark
            ? '0 1px 4px rgba(0,0,0,0.5)'
            : '0 1px 4px rgba(0,0,0,0.15)',
          zIndex: 0
        }}
        animate={{ x: isDark ? 34 : 3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      />

      {/* Icons layer */}
      <Flex
        position="relative"
        zIndex={1}
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        px="11px"
      >
        <SunIcon color={sunColor} boxSize="15px" />
        <MoonIcon color={moonColor} boxSize="13px" />
      </Flex>
    </Box>
  )
}

export default ThemeToggleButton
