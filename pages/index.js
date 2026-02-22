import { Container, Box, IconButton } from '@chakra-ui/react'
import Layout from '../components/layouts/article.js'
import StartButton from './start.js'

const Page = () => {
  return (
    <Layout>
      <Container maxW='2xl' minH="100vh">
        <StartButton />
      </Container>
    </Layout>
  )
}

export default Page

