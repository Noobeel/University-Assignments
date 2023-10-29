import React, { useEffect, useState } from 'react';
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from 'react-beautiful-dnd';
import './board.css';
import { v4 as uuid } from 'uuid';
import { BoardNav } from './boardNav';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Center,
    HStack,
    useToast,
    VStack,
    Text,
    Heading,
    LightMode,
} from '@chakra-ui/react';

import { ImUser, ImBooks, ImUserCheck } from 'react-icons/im';
import { BsGraphUp } from 'react-icons/bs';
import { MdOutlineDateRange } from 'react-icons/md';
import { Issue, IssueStatus } from '../../helpers/dbTypes';

const initialWorkingBoard: WorkingBoard = {
    'TO DO': {
        name: 'TO DO ',
        items: [],
        status: 'To Do ',
    },
    'IN PROGRESS': {
        name: 'IN PROGRESS',
        items: [],
        status: 'In Progress',
    },
    DONE: {
        name: 'DONE',
        items: [],
        status: 'Finished',
    },
};

type WorkingBoard = {
    [key: string]: {
        name: string;
        items: Issue[];
        status: string;
    };
};

interface Props {
    issues: Issue[];
}

export const KanbanBoard = React.memo(({ issues }: Props) => {
    const [columns, setColumns] = useState(initialWorkingBoard);
    const toast = useToast();

    useEffect(() => {
        // Clear working board items
        const t_columns = { ...columns };
        for (const board in t_columns) {
            t_columns[board].items = [];
        }
        // Map through issues to update the working board
        for (const issue of issues) {
            switch (issue.status) {
                case 'TO DO':
                    t_columns['TO DO'].items.push(issue);
                    break;
                case 'IN PROGRESS':
                    t_columns['IN PROGRESS'].items.push(issue);
                    break;
                case 'DONE':
                    t_columns['DONE'].items.push(issue);
                    break;
            }
        }
        setColumns(t_columns);
    }, [issues]);

    const updateIssueStatus = (issueID: string, newStatus: string) => {
        fetch(
            `http://localhost:8000/api/issues/issues/edit?${new URLSearchParams(
                {
                    issue_id: issueID,
                }
            )}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                }),
            }
        )
            .then((response) => response.json())
            .then(async (data) => {
                toast({
                    title: 'Info',
                    description: data,
                    status: 'info',
                    duration: 3500,
                });
            });
    };
    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            removed.status = destination.droppableId as IssueStatus;
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems,
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems,
                },
            });

            await updateIssueStatus(removed.issueID, removed.status);
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems,
                },
            });
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'row',
                justifyContent: 'right',
                height: '100%',
            }}
        >
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                <HStack overflowX='auto'>
                    {Object.entries(columns).map(
                        ([columnId, column], index) => {
                            return (
                                <div
                                    className='todoCont'
                                    key={columnId}
                                    style={{
                                        backgroundColor: '#f7f2f8',
                                    }}
                                >
                                    <h2 className='boardtitle'>
                                        {column.name}
                                    </h2>
                                    <div style={{ margin: 8 }}>
                                        <Droppable
                                            droppableId={columnId}
                                            key={columnId}
                                        >
                                            {(provided, snapshot) => {
                                                return (
                                                    <div
                                                        className='droparea'
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={{
                                                            background:
                                                                snapshot.isDraggingOver
                                                                    ? '#e6e1f9'
                                                                    : '#e6e1f9',
                                                        }}
                                                    >
                                                        {column.items.map(
                                                            (item, index) => {
                                                                return (
                                                                    <Draggable
                                                                        key={
                                                                            item.title +
                                                                            item.assignee +
                                                                            item.reporter
                                                                        }
                                                                        draggableId={
                                                                            item.title +
                                                                            item.assignee +
                                                                            item.reporter
                                                                        }
                                                                        index={
                                                                            index
                                                                        }
                                                                    >
                                                                        {(
                                                                            provided,
                                                                            snapshot
                                                                        ) => {
                                                                            return (
                                                                                <div
                                                                                    className='dragbox'
                                                                                    ref={
                                                                                        provided.innerRef
                                                                                    }
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                    style={{
                                                                                        userSelect:
                                                                                            'none',
                                                                                        backgroundColor:
                                                                                            snapshot.isDragging
                                                                                                ? '#d0e6fb'
                                                                                                : 'white',

                                                                                        ...provided
                                                                                            .draggableProps
                                                                                            .style,
                                                                                    }}
                                                                                >
                                                                                    [
                                                                                    {index +
                                                                                        1}

                                                                                    ]
                                                                                    :{' '}
                                                                                    <b>
                                                                                        {
                                                                                            item.title
                                                                                        }
                                                                                    </b>
                                                                                    <br />
                                                                                    {
                                                                                        item.description
                                                                                    }
                                                                                    <br />
                                                                                    Status:{' '}
                                                                                    {
                                                                                        column.status
                                                                                    }
                                                                                    <br />
                                                                                    <IssueDetailsModal
                                                                                        issue={
                                                                                            item
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            );
                                                                        }}
                                                                    </Draggable>
                                                                );
                                                            }
                                                        )}
                                                        {provided.placeholder}
                                                    </div>
                                                );
                                            }}
                                        </Droppable>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </HStack>
            </DragDropContext>
        </div>
    );
});

type IssueDetailsModalProps = {
    issue: Issue;
};
const IssueDetailsModal = React.memo(({ issue }: IssueDetailsModalProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <LightMode>
                <Button onClick={onOpen} size='sm' colorScheme='purple' mt='2'>
                    Details
                </Button>
            </LightMode>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader style={{ color: 'white' }}>
                        {issue.title}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing='4' pb='6' alignItems='flex-start'>
                            <Text>{issue.description}</Text>
                            <HStack>
                                <ImUser />
                                <Heading fontSize='md' pl='3'>
                                    Asssignee:
                                </Heading>
                                <Text>{issue.assignee}</Text>
                            </HStack>
                            <HStack>
                                <ImUserCheck />
                                <Heading fontSize='md' pl='3'>
                                    Reporter:
                                </Heading>
                                <Text>{issue.reporter}</Text>
                            </HStack>
                            <HStack>
                                <ImBooks />
                                <Heading fontSize='md' pl='3'>
                                    Status:
                                </Heading>
                                <Text>{issue.status}</Text>
                            </HStack>
                            <HStack>
                                <BsGraphUp />
                                <Heading fontSize='md' pl='3'>
                                    Priority:
                                </Heading>
                                <Text>{issue.priority}</Text>
                            </HStack>
                            <HStack>
                                <MdOutlineDateRange />
                                <Heading fontSize='md' pl='3'>
                                    Due:
                                </Heading>
                                <Text>
                                    {new Date(issue.due).toLocaleDateString()}
                                </Text>
                            </HStack>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
});
