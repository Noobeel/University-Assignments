import React, { useEffect, useRef } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    HStack,
    List,
    ListItem,
    Text,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSigninCheck, useUser } from 'reactfire';
import './ProjectSettings.css';
import { Form, Formik, FormikHelpers } from 'formik';
import { InputFormControl } from '../components/form/InputFormControl';
import { object, string } from 'yup';

type ProjectType = {
    _id: string;
    projectName: string;
    projectStatus: string;
    team: Array<{ username: string; role: string }>;
    issues: Array<{
        issueId: string;
        title: string;
        description: string;
        assignee: string;
        reporter: string;
        priority: string;
        status: string;
        due: string;
    }>;
    reports: Array<{
        doc_type: string;
        doc_name: string;
        doc_path: string;
    }>;
};

export type AddUserFormValues = {
    username: string;
    role: string;
};

const addUserFormSchema = object({
    username: string().email().required(),
    role: string().min(3).required(),
});

const addUserFormInitialValues: AddUserFormValues = {
    username: '',
    role: '',
};

export const ProjectSettings = () => {
    // Button redirecting to the project settings page will only be visible if there is an active project for the user
    // i.e., a project with "In Progress" status in which the user is a member of the team

    const navigate = useNavigate();
    const toast = useToast();
    const { status, data: signInCheckResult } = useSigninCheck();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: user } = useUser();

    const cancelRef = useRef(null);

    useEffect(() => {
        if (status === 'success') {
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

    // Set the initial state of the project settings
    const [projectName, setProjectName] = React.useState('');
    const [projectStatus, setProjectStatus] = React.useState('');
    const [project, setProject] = React.useState<ProjectType>();

    // On page load, fetch the project
    const fetchProject = async () => {
        if (!user?.email) return;

        fetch(
            `http://localhost:8000/api/projects/?${new URLSearchParams({
                username: user.email,
            })}`
        )
            .then((response) => response.json())
            .then((data) => {
                if (!data['queryResult']) return;
                setProject(data['queryResult']);
                setProjectName(data['queryResult']['projectName']);
                setProjectStatus(data['queryResult']['projectStatus']);
                console.log(data['queryResult']);
            });
    };
    useEffect(() => {
        fetchProject();
    }, []);

    // Get team members from the active project and display them
    const getTeamMembers = () => {
        return (
            <List style={{ listStyle: 'none' }}>
                {project?.team?.map((user) => {
                    return (
                        <ListItem key={user.username} mt='3'>
                            <HStack>
                                <Text>{user.username}</Text>
                                <Text>-</Text>
                                <Text fontWeight='bold'>{user.role}</Text>
                                <Button
                                    size='xs'
                                    colorScheme='red'
                                    value={user.username}
                                    onClick={removeUser}
                                >
                                    Remove User
                                </Button>
                            </HStack>
                        </ListItem>
                    );
                })}
            </List>
        );
    };

    // Remove a user from the active project when the "Remove User" button is clicked
    const removeUser = (e: any) => {
        e.preventDefault();
        if (!project) return;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: e.target.value,
                role: 'NULL',
            }),
        };

        fetch(
            `http://localhost:8000/api/projects/remove_project_user/${project.projectName}`,
            requestOptions
        )
            .then((response) => response.json())
            .then(async (data) => {
                toast({
                    title: 'Info',
                    description: data,
                    status: 'info',
                    duration: 3500,
                });
                await fetchProject();
            });
    };

    const updateSettings = () => {
        if (!project) return;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectName: projectName,
                projectStatus: projectStatus,
            }),
        };
        fetch(
            `http://localhost:8000/api/projects/update_project_settings/${project._id}`,
            requestOptions
        )
            .then((response) => response.json())
            .then(async (data) => {
                await fetchProject();
                toast({
                    title: 'Info',
                    description: data,
                    status: 'info',
                    duration: 3500,
                });
                onClose();
            });
    };

    const addUserFormSubmit = (
        values: AddUserFormValues,
        {}: FormikHelpers<AddUserFormValues>
    ) => {
        if (!project) return;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        };

        fetch(
            `http://localhost:8000/api/projects/add_project_user/${project._id}`,
            requestOptions
        )
            .then((response) => response.json())
            .then(async (data) => {
                await fetchProject();
                toast({
                    title: 'Info',
                    description: data,
                    status: 'info',
                    duration: 3500,
                });
                onClose();
            });
    };

    return (
        <div id='container'>
            <VStack w='full' alignItems='flex-start' px='8' spacing='6'>
                <h1 id='back'>Project Settings</h1>
                <h1 id='setting-title'>Project Name:</h1>
                <input
                    type='text'
                    style={{ width: 'clamp(250px, 50%, 100%)' }}
                    id='projectName'
                    name='projectName'
                    defaultValue={projectName}
                    onChange={(e) => {
                        setProjectName(e.target.value);
                    }}
                />
                <h1 id='setting-title'>Project Status:</h1>
                <input
                    type='text'
                    id='projectStatus'
                    style={{ width: 'clamp(250px, 50%, 100%)' }}
                    name='projectStatus'
                    defaultValue={projectStatus}
                    onChange={(e) => {
                        setProjectStatus(e.target.value);
                    }}
                />
                <Box py='2'>
                    <Button
                        colorScheme='purple'
                        size='lg'
                        onClick={updateSettings}
                    >
                        Save Changes
                    </Button>
                </Box>
                <HStack alignItems='baseline'>
                    <h1 id='setting-title'>Team Members</h1>
                    <Button colorScheme='purple' size='sm' onClick={onOpen}>
                        Add User
                    </Button>
                </HStack>
                <Box id='manage-team' color='black'>
                    {getTeamMembers()}
                </Box>
            </VStack>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Add User
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Formik
                                initialValues={addUserFormInitialValues}
                                validationSchema={addUserFormSchema}
                                onSubmit={addUserFormSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form style={{ width: '100%' }}>
                                        <VStack spacing='4' w='full'>
                                            <InputFormControl
                                                isRequired
                                                label='User Email'
                                                name='username'
                                                type='text'
                                                errors={errors.username}
                                                touched={touched.username}
                                            />

                                            <InputFormControl
                                                isRequired
                                                label='User Role'
                                                name='role'
                                                type='text'
                                                errors={errors.role}
                                                touched={touched.role}
                                            />
                                        </VStack>
                                        <HStack
                                            w='full'
                                            mt='4'
                                            pb='4'
                                            justifyContent='flex-end'
                                        >
                                            <Button
                                                onClick={onClose}
                                                ref={cancelRef}
                                            >
                                                Close
                                            </Button>
                                            <Button
                                                type='submit'
                                                variant='ghost'
                                                colorScheme='purple'
                                            >
                                                Create
                                            </Button>
                                        </HStack>
                                    </Form>
                                )}
                            </Formik>
                        </AlertDialogBody>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    );
};
