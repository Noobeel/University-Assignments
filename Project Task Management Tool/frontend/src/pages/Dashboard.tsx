import {
    Box,
    Stack,
    Text,
    StackDivider,
    Heading,
    useDisclosure,
    useToast,
    Center,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSigninCheck, useUser } from 'reactfire';
import './Dashboard.css';
import { Issue } from '../helpers/dbTypes';
import {
    CreateIssueButton,
} from '../components/createIssue/CreateIssueButton';

export const Dashboard = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const { status, data: signInCheckResult } = useSigninCheck();
    const { data: user } = useUser();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [projName, setProjName] = React.useState('');
    const [issues, setIssues] = React.useState<Array<Issue>>([]);

    useEffect(() => {
        if (status == 'success') {
            if (!signInCheckResult.signedIn) {
                toast({
                    title: 'Cannot Access Dashboard',
                    description: 'User is not Authenticated',
                    status: 'error',
                    duration: 3500,
                });
                navigate('/login');
            }
        }

    }, [signInCheckResult, status]);

    useEffect(() => {
        if (user?.email) {
            fetch(`http://localhost:8000/api/projects/?username=${encodeURIComponent(user?.email)}`)
                .then(response => response.json())
                .then(data => setProjName(data["queryResult"]["projectName"]));
        }
    }, [user?.email])

    const fetchData = () => {
        if (projName) {
            fetch(`http://localhost:8000/api/issues/?projName=${encodeURIComponent(projName)}`)
                .then((response) => response.json())
                .then(data => setIssues(data['queryResult']['issues']));
        }
    };

    useEffect(() => {
        fetchData();
    }, [projName]);

    return (
        <>
            <div className='dashboard-container'>
                <div className='dashboard-body'>
                    <Center py='2'>
                        <CreateIssueButton
                            isOpen={isOpen}
                            onClose={onClose}
                            onOpen={onOpen}
                            refetchData={fetchData}
                        />
                    </Center>

                    <div className='card-warpper'>
                        {issues.map((issue, index) => {
                            return (
                                <Box
                                    p={4}
                                    m={4}
                                    borderRadius={10}
                                    boxShadow='0 0 15px -5px gray'
                                    color='black'
                                    w={'30%'}
                                    key={index}
                                >
                                    <Stack
                                        divider={
                                            <StackDivider
                                                borderColor={'gainsboro'}
                                            />
                                        }
                                        spacing='2'
                                    >
                                        <div className='heading-wrapper'>
                                            <Heading size='md'>
                                                Client Report
                                            </Heading>
                                            <Text pt='2' fontSize='sm'>
                                                {issue?.status}
                                            </Text>
                                        </div>
                                        <Box>
                                            <Heading
                                                size='xs'
                                                textTransform='uppercase'
                                            >
                                                {issue?.title}
                                            </Heading>
                                            <Text pt='2' fontSize='sm'>
                                                {issue?.description}
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Heading
                                                size='xs'
                                                textTransform='uppercase'
                                            >
                                                Reporter
                                            </Heading>
                                            <Text pt='2' fontSize='sm'>
                                                {issue?.reporter}
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Heading
                                                size='xs'
                                                textTransform='uppercase'
                                            >
                                                Assignee
                                            </Heading>
                                            <Text pt='2' fontSize='sm'>
                                                {issue?.assignee}
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Heading
                                                size='xs'
                                                textTransform='uppercase'
                                            >
                                                Priority
                                            </Heading>
                                            <Text pt='2' fontSize='sm'>
                                                {issue?.priority}
                                            </Text>
                                        </Box>
                                    </Stack>
                                </Box>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};
