import { Center, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSigninCheck, useUser } from 'reactfire';
import { CreateIssueButton } from '../components/createIssue/CreateIssueButton';
import { KanbanBoard } from '../components/Kanbanboard/board';
import { Issue } from '../helpers/dbTypes';

export const WorkBoard = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: user } = useUser();
    const { status, data: signInCheckResult } = useSigninCheck();
    const [projName, setProjName] = useState<string>();
    const [issues, setIssues] = React.useState<Issue[]>([]);
    const navigate = useNavigate();
    const toast = useToast();

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
        if (!user?.email) return;

        fetch(
            `http://localhost:8000/api/projects/?username=${encodeURIComponent(
                user?.email
            )}`
        )
            .then((response) => response.json())
            .then((data) => {
                if (!data['queryResult']) return;
                setProjName(data['queryResult']['projectName']);
            });
    }, [user?.email]);

    const fetchData = async () => {
        if (!projName) return;
        fetch(
            `http://localhost:8000/api/issues/?projName=${encodeURIComponent(
                projName
            )}`
        )
            .then((response) => response.json())
            .then((data) => {
                if (!data['queryResult']) return;
                setIssues(data['queryResult']['issues']);
            });
    };

    useEffect(() => {
        fetchData();
    }, [projName]);

    return (
        <div>
            <Center py='2'>
                <CreateIssueButton
                    isOpen={isOpen}
                    onClose={onClose}
                    onOpen={onOpen}
                    refetchData={fetchData}
                />
            </Center>
            <KanbanBoard issues={issues} />
        </div>
    );
};
