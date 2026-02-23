import { Container, Box, IconButton } from '@chakra-ui/react'
import Layout from '../components/layouts/article.js'
import StartPage from './start.js'

const Page = () => {
  return (
    <Layout>
      <Container maxW="container.md" minH="100vh">
        <StartPage />
      </Container>
    </Layout>
  )
}

export default Page
