import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    HStack,
    Button,
    useToast,
    LightMode,
    Select,
    FormControl,
    FormLabel,
} from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useUser } from 'reactfire';
import { object, string, mixed, date } from 'yup';
import { DatePickerFormControl } from '../form/DatePickerFormControl';
import { InputFormControl } from '../form/InputFormControl';

const createIssueFormSchema = object({
    title: string().min(3).required(),
    description: string().min(10).required(),
    assignee: string(),
    reporter: string().min(3),
    priority: mixed().oneOf(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
    status: mixed().oneOf(['TO DO', 'IN PROGRESS', 'DONE']).default('TO DO'),
    due: date().required(),
});

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
    refetchData: () => Promise<void> | void;
}

export type CreateIssueFormValues = {
    title: string;
    description: string;
    assignee: string;
    reporter: string;
    priority: string;
    status: string;
    due: Date;
};

export const CreateIssueButton = React.memo(
    ({ isOpen, onClose, onOpen, refetchData }: Props) => {
        const toast = useToast();
        const { data: user } = useUser();

        type TeamType = Array<{ username: string; role: string }>;

        const [teamMembers, setTeam] = React.useState<TeamType>();
        const [projName, setProjName] = React.useState<string>();
        const [assignee, setAssignee] = React.useState<string>();

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
                    setProjName(data['queryResult']['projectName']);
                    setTeam(data['queryResult']['team']);
                });
        };

        React.useEffect(() => {
            fetchProject();
        }, [user?.email]);

        // Get team members from the active project and display them
        const getTeamMembers = () => {
            return (
                teamMembers?.map((user) => {
                    return (
                        <option key={user.username} value={user.username}>{user.username}</option>
                    );
                })
            );
        };

        const submitCreateIssueForm = (
            values: CreateIssueFormValues,
            { }: FormikHelpers<CreateIssueFormValues>
        ) => {
            values.assignee = assignee!;

            const data = {
                ...values,
                // Needed to get date into a yy-mm-dd format
                // See: https://stackoverflow.com/questions/35843050/return-dd-mm-yyyy-from-date-object
                due: values.due.toISOString().split('T')[0],
            };

            axios
                .post("http://localhost:8000/api/issues/add", data, { params: { projectName: projName } })
                .then(async (res) => {
                    if (res.status == 200) {
                        toast({
                            title: 'Issue Creation Succeeded',
                            description: 'Issue was created',
                            status: 'success',
                            duration: 3500,
                        });
                        onClose();
                        await refetchData();
                    }
                })
                .catch((_err) => {
                    const err = _err as AxiosError;

                    toast({
                        title: 'Issue Creation Failed',
                        description: err.message,
                        status: 'error',
                        duration: 3500,
                    });
                });
        };

        const createIssueFormInitialValues: CreateIssueFormValues = {
            title: '',
            description: '',
            assignee: '',
            reporter: `${user?.email}`,
            priority: 'LOW',
            status: 'TO DO',
            due: new Date(),
        };

        return (
            <>
                <style>
                    {`
                        option {
                            background-color: white !important;
                        }
                    `}
                </style>

                <LightMode>
                    <Button onClick={onOpen} colorScheme='purple'>
                        Create
                    </Button>
                </LightMode>

                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    size='2xl'
                    blockScrollOnMount={true}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create Issue</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Formik
                                initialValues={createIssueFormInitialValues}
                                validationSchema={createIssueFormSchema}
                                onSubmit={submitCreateIssueForm}
                            >
                                {({ errors, touched }) => (
                                    <Form style={{ width: '100%' }}>
                                        <VStack spacing='4' w='full'>
                                            <InputFormControl
                                                isRequired
                                                label='Issue Title'
                                                name='title'
                                                type='text'
                                                errors={errors.title}
                                                touched={touched.title}
                                            />

                                            <FormControl defaultValue={teamMembers?.[0].username} isRequired colorScheme='purple'>
                                                <FormLabel>Issue Assignee</FormLabel>
                                                <Select placeholder='Select a team member' onChange={(e) => (setAssignee(e.target.value))}
                                                        size='lg' iconColor='black' bg='white' outline='solid grey' outlineOffset='2px'>
                                                    {getTeamMembers()}
                                                </Select>
                                            </FormControl>

                                            <InputFormControl
                                                isDisabled
                                                label='Issue Reporter'
                                                name='reporter'
                                                type='text'
                                                errors={errors.reporter}
                                                touched={touched.reporter}
                                            />

                                            <InputFormControl
                                                isRequired
                                                label='Issue Status'
                                                name='status'
                                                type='text'
                                                errors={errors.status}
                                                touched={touched.status}
                                            />

                                            <InputFormControl
                                                isRequired
                                                label='Priority'
                                                name='priority'
                                                type='text'
                                                errors={errors.priority}
                                                touched={touched.priority}
                                            />

                                            <DatePickerFormControl
                                                name='due'
                                                label='Date Due'
                                            />

                                            <InputFormControl
                                                isRequired
                                                label='Description'
                                                name='description'
                                                errors={errors.description}
                                                touched={touched.description}
                                                h='185px'
                                                backgroundColor='white'
                                                color='black'
                                                textArea={{ resize: 'none' }}
                                            />
                                        </VStack>
                                        <HStack
                                            w='full'
                                            mt='4'
                                            justifyContent='flex-end'
                                        >
                                            <Button onClick={onClose}>
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
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </>
        );
    }
);
