import {
	Box,
	Flex,
	HStack,
	Link,
	useColorModeValue,
	Heading,
	useColorMode,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

import { isLocalHost } from './utils/helpers';
import Logo from './Icons/Logo';
export default function Navbar() {
	// const { isOpen, onOpen, onClose } = useDisclosure();
	const { colorMode } = useColorMode();
	return (
		<>
			<Box
				bg={useColorModeValue('gray.100', 'gray.900')}
				px={4}
			>
				<Flex
					h={16}
					alignItems={'center'}
					justifyContent={'space-between'}
				>
					{/* <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          /> */}
					<HStack
						spacing={8}
						alignItems={'center'}
					>
						<Heading size='lg'>
							<Link
								href={`${
									isLocalHost ? 'http://localhost:3000' : 'https://ytmate.in/'
								}`}
								_hover={{ textDecoration: 'none', color: 'gray.500' }}
							>
								<Logo />
							</Link>
						</Heading>
						{/* <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack> */}
					</HStack>
					<Flex alignItems={'center'}>
						<ColorModeSwitcher />
					</Flex>
				</Flex>

				{/* {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null} */}
			</Box>
		</>
	);
}
