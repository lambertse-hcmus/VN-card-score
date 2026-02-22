import { AnimatePresence, motion } from 'framer-motion'
import { IconButton } from '@chakra-ui/react'
import VNIcon from './icons/VN-icon'
import ENIcon from './icons/EN-icon'
import { useLanguage } from '../lib/i18n'

const LanguageToggleButton = () => {
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        style={{ display: 'inline-block' }}
        key={language}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          aria-label={t('toggleLanguage')}
          icon={language === 'vn' ? <VNIcon boxSize="20px" /> : <ENIcon boxSize="20px" />}
          onClick={toggleLanguage}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default LanguageToggleButton
