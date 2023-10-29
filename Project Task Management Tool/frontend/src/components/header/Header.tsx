import {
    Button,
    Center,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    Input,
    InputLeftElement,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    InputGroup,
    Heading,
    Box,
    HStack,
} from '@chakra-ui/react';

import {
    ImHome,
    ImDrawer,
    ImImage,
    ImFileText,
    ImBubble,
    ImStatsDots,
    ImClipboard,
    ImUsers,
    ImUser,
    ImHammer,
} from 'react-icons/im';
import { HiChevronDown, HiMenu, HiSearch } from 'react-icons/hi';
import React from 'react';
import { useAuth, useSigninCheck, useUser } from 'reactfire';
import { Link as RouterLink, Router } from 'react-router-dom';
import { signOut } from 'firebase/auth';

import dumpsterFireLogo from '../../images/dumpsterfire.png';
import './Header.css';
export const LandingNav = () => {
    const { status, data: signInCheckResult } = useSigninCheck();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: user } = useUser();
    const auth = useAuth();

    const renderTopRightButton = () => {
        if (status == 'success' && signInCheckResult.signedIn) {
            return (
                <Menu>
                    <MenuButton as={Button} rightIcon={<HiChevronDown />}>
                        {user?.displayName}
                    </MenuButton>
                    <MenuList>
                        <Link
                            as={RouterLink}
                            to='/dashboard'
                            _hover={{ textDecoration: 'none' }}
                        >
                            <MenuItem>Dashboard</MenuItem>
                        </Link>
                        <Link
                            as={RouterLink}
                            to='/project-settings'
                            _hover={{ textDecoration: 'none' }}
                        >
                            <MenuItem>Project Settings</MenuItem>
                        </Link>
                        <MenuItem onClick={async () => await signOut(auth)}>
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>
            );
        } else if (status == 'loading') {
            return (
                <Center w='100px'>
                    <Spinner />
                </Center>
            );
        }
        return (
            <Link as={RouterLink} to='/login'>
                <Button colorScheme='purple'>Login/Signup</Button>
            </Link>
        );
    };

    const renderMenu = () => {
        return (
            status == 'success' &&
            signInCheckResult.signedIn && (
                <Button onClick={onOpen}>
                    <HiMenu size={24} />
                </Button>
            )
        );
    };

    return (
        <>
            <header id='header'>
                <Box className='container' py='2' mx='2'>
                    <div className='nav-area'>
                        <ul className='nav'>
                            <li>{renderMenu()}</li>
                            <li>
                                <Link as={RouterLink} to='/'>
                                    <div className='logo'>
                                        <img
                                            src={dumpsterFireLogo}
                                            alt='Dumpster Fire Logo'
                                        />
                                    </div>
                                </Link>
                            </li>
                        </ul>
                        {renderTopRightButton()}
                    </div>
                </Box>
            </header>

            <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bgColor={'#702963'}>
                    <DrawerCloseButton />
                    <DrawerHeader></DrawerHeader>

                    <DrawerBody>
                        <ul id='SideNav'>
                            <li>
                                <Link as={RouterLink} to='/dashboard'>
                                    <Button onClick={onClose} variant='ghost'>
                                        <ImHome size={30} />
                                        <Text>Dashboard</Text>
                                    </Button>
                                </Link>
                            </li>
                            <li>
                                <Link as={RouterLink} to='/board'>
                                    <Button onClick={onClose} variant='ghost'>
                                        <ImImage size={30} />
                                        <Text>Kanban Board</Text>
                                    </Button>
                                </Link>
                            </li>

                            <li>
                                <Link as={RouterLink} to='/backlog'>
                                    <Button onClick={onClose} variant='ghost'>
                                        <ImDrawer size={30} />
                                        <Text>Backlog</Text>
                                    </Button>
                                </Link>
                            </li>

                            <li>
                                <Link as={RouterLink} to='/reports'>
                                    <Button onClick={onClose} variant='ghost'>
                                        <ImFileText size={30} />
                                        <Text>Reports</Text>
                                    </Button>
                                </Link>
                            </li>

                            <li>
                                <Link as={RouterLink} to='/create_project'>
                                    <Button onClick={onClose} variant='ghost'>
                                        <ImBubble size={30} />
                                        <Text>Create Project</Text>
                                    </Button>
                                </Link>
                            </li>

                            <li>
                                <Link as={RouterLink} to='/project-settings'>
                                    <Button onClick={onClose} variant='ghost'>
                                        <ImUsers size={30} />
                                        <Text>Project Settings </Text>
                                    </Button>
                                </Link>
                            </li>
                        </ul>
                    </DrawerBody>
                    <DrawerFooter>
                        <HStack>
                            <Text>{user?.displayName}</Text>
                            <Button onClick={async () => await signOut(auth)}>
                                Sign Out
                            </Button>
                        </HStack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};
