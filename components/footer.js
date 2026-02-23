import {
  Box,
  Flex,
  Link,
  IconButton,
  HStack,
  Container,
  useColorModeValue
} from '@chakra-ui/react'

import styled from '@emotion/styled'
import { GiCoffeeCup } from "react-icons/gi";

const Param = styled.span`
  font-size: 0.875rem;
  color: var(--chakra-colors-gray-500);
`

const Footer = () => {
  return (
    <Box as="footer">
      <Container minWidth="55%">
        <hr
          style={{
            width: '90%',
            border: '1px solid',
            margin: 'auto'
          }}
        />
        <Box width="100%" height={'7px'} mb={5} mt={5}>
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align="center"
            height="100%"
            gap={2}
          >
            {/* Left side */}
            <Box as="span" fontSize="sm" ml={10}>
              <Param>
              Powered by
                <Link>@lambert_se</Link>
              </Param>
            </Box>
            <Box>
              {/* Right side */}
              <Box>
                <HStack>
                  <Link href="https://x.com/lambert_se">
                    <IconButton
                      variant="ghost"
                      colorScheme="teal"
                      icon={<GiCoffeeCup />}
                    />
                  </Link>
                </HStack>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
