import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import Layout from '../components/layouts/main'
import Fonts from '../components/fonts'
import theme from '../lib/theme'
import { LanguageProvider } from '../lib/i18n'

const Website = ({ Component, pageProps, router }) => {
  return (
    <ChakraProvider theme={theme}>
      <LanguageProvider>
        <Head>
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>♣</text></svg>"
          />
        </Head>
        <Fonts />
        <Layout router={router}>
          <Component {...pageProps} key={router.route} />
        </Layout>
      </LanguageProvider>
    </ChakraProvider>
  )
}

export default Website
