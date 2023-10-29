import { useEffect, useMemo } from 'react';

import { Button, Center, Flex, Heading, HStack, Link, Text, VStack } from '@chakra-ui/react';
import { usePageHeight } from '../helpers/hooks';
import { GoogleIcon } from '../customIcons/google';
import { getRedirectResult, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { useAuth } from 'reactfire';
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom';

export const Signup = () => {
    const pageHeight = usePageHeight();
    const auth = useAuth();
    const navigate = useNavigate();

    const provider = useMemo(() => new GoogleAuthProvider(), []);
    provider.setCustomParameters({ prompt: 'select_account' });

    const googleLogin = async () => {
        await signInWithRedirect(auth, provider);
    };

    function addUserToDatabase(email: string, name: string) {
        fetch('http://localhost:8000/api/users/create_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: email,
                name: name,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        const getOAuthResponse = async () => {
            await getRedirectResult(auth)
                .then(async (result) => {
                    if (result) {
                        addUserToDatabase(result.user.email!, result.user.displayName!);
                        navigate('/dashboard');
                    }
                })
                .catch((error) => {console.log(error)});
        };
        getOAuthResponse();
    }, [auth, navigate]);

    return (
        <Center w='full' h={pageHeight}>
            <Center w='full' h='60%'>
                <Flex
                    w='400px'
                    h='full'
                    rounded='lg'
                    flexDir='column'
                    bg='gray.900'
                    px='5'
                    py='6'
                    color='gray.100'>
                    <Center>
                        <Heading fontSize='3xl'>Signup</Heading>
                    </Center>
                    <Text mt='4' textAlign='center' fontWeight='light'>
                        Create an account by clicking below
                    </Text>
                    <Center as={VStack} w='full' h='full' mt='8'>
                        <Button
                            leftIcon={<GoogleIcon boxSize='5' />}
                            iconSpacing='3'
                            color='gray.900'
                            bg='gray.100'
                            onClick={googleLogin}>
                            Sign up with Google
                        </Button>

                        <HStack>
                            <Link
                                color='teal.600'
                                target='_blank'
                                href='https://support.google.com/accounts/answer/41078?hl=en&co=GENIE.Platform%3DDesktop'>
                                Forgot password
                            </Link>
                            <Link color='teal.600' to='/login' as={ReactRouterLink}>
                                Log into existing account
                            </Link>
                        </HStack>
                    </Center>
                </Flex>
            </Center>
        </Center>
    );
};
