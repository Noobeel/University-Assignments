import React from 'react';
import './Backlog.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSigninCheck, useUser } from 'reactfire';
import { Center, useDisclosure, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CreateIssueButton } from '../components/createIssue/CreateIssueButton';

const FilterableTable = require('react-filterable-table');

export const Backlog = () => {
    const { status, data: signInCheckResult } = useSigninCheck();
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [projName, setProjName] = React.useState("");
    const stateRef = React.useRef<string>();
    stateRef.current = projName;
    const { data: user } = useUser();

    React.useEffect(() => {
        if (user?.email) {
            console.log(user?.email);
            fetch(`http://localhost:8000/api/projects/?username=${encodeURIComponent(user?.email)}`)
            .then(response => response.json())
            .then(data => setProjName(data["queryResult"]["projectName"]));
        }
    }, [user?.email])

    React.useEffect(() => {
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

    const [items, setItems] = React.useState<any[]>([]);

    let fields = [
        {
            name: 'title',
            displayName: 'Title',
            inputFilterable: true,
            exactFilterable: true,
        },
        {
            name: 'description',
            displayName: 'Description',
            inputFilterable: true,
            exactFilterable: true,
        },
        {
            name: 'assignee',
            displayName: 'Assignee',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true,
        },
        {
            name: 'reporter',
            displayName: 'Reporter',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true,
        },
        {
            name: 'priority',
            displayName: 'Priority',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true,
        },
        {
            name: 'status',
            displayName: 'Status',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true,
        },
        {
            name: 'due',
            displayName: 'Due',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true,
        },
    ];
    const fetchData = () => {
        if (projName) {
            fetch(`http://localhost:8000/api/issues/?projName=${projName}`)
                .then((response) => response.json()) // turn response into json
                .then((data) => {
                    // the json above is represented now by the variable data
                    setItems(data['queryResult']['issues']);
                });
        }
    };
    React.useEffect(() => {
        fetchData();
    }, [projName]);

    return (
        <div id='container'>
            <div id='tableArea'>
                <Center py='2'>
                    <CreateIssueButton
                        isOpen={isOpen}
                        onClose={onClose}
                        onOpen={onOpen}
                        refetchData={fetchData}
                    />
                </Center>
                <h1 id='back'>Product Backlog</h1>
                <FilterableTable
                    initialSort='title'
                    data={items}
                    fields={fields}
                    noRecordsMessage='No Records'
                    noFilteredRecordsMessage='No filter matched'
                />
            </div>
        </div>
    );
};
