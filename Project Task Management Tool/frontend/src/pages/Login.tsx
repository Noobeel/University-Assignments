import { useEffect, useMemo } from 'react';
import { Button, Center, Flex, Heading, Link, VStack, Text, HStack } from '@chakra-ui/react';
import { usePageHeight } from '../helpers/hooks';
import { GoogleIcon } from '../customIcons/google';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom';
import { useAuth } from 'reactfire';

export const Login = () => {
    const pageHeight = usePageHeight();
    const auth = useAuth();
    const navigate = useNavigate();

    const provider = useMemo(() => new GoogleAuthProvider(), []);
    provider.setCustomParameters({ prompt: 'select_account' });

    const googleLogin = async () => {
        await signInWithRedirect(auth, provider);
    };

    useEffect(() => {
        const getOAuthResponse = async () => {
            await getRedirectResult(auth)
                .then(async (result) => {
                    if (result) {
                        const idToken = await result.user.getIdToken();
                        navigate('/dashboard');
                    }
                })
                .catch((error) => {});
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
                        <Heading fontSize='3xl'>Login</Heading>
                    </Center>
                    <Text mt='4' textAlign='center' fontWeight='light'>
                        Log into your account by clicking below
                    </Text>
                    <Center as={VStack} w='full' h='full' mt='8'>
                        <Button
                            leftIcon={<GoogleIcon boxSize='5' />}
                            iconSpacing='3'
                            color='gray.900'
                            bg='gray.100'
                            onClick={googleLogin}>
                            Log in with Google
                        </Button>

                        <HStack>
                            <Link
                                color='teal.600'
                                target='_blank'
                                href='https://support.google.com/accounts/answer/41078?hl=en&co=GENIE.Platform%3DDesktop'>
                                Forgot password
                            </Link>
                            <Link color='teal.600' to='/signup' as={ReactRouterLink}>
                                Create an account
                            </Link>
                        </HStack>
                    </Center>
                </Flex>
            </Center>
        </Center>
    );
};
