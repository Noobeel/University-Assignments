import React from 'react';
import './Reports.css';
import './CreateProject.css';
import { Input, Text } from '@chakra-ui/react';
import { useSigninCheck, useUser } from 'reactfire';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ReactMultiEmail } from 'react-multi-email';


export const CreateProject = () => {

    type Member = {
        username: string,
        role: string
    }

    const { status, data: signInCheckResult } = useSigninCheck();
    const toast = useToast();
    const navigate = useNavigate();
    const [newProjName, setNewProjName] = React.useState("");
    const [team, setTeam] = React.useState<Member[]>([]);
    const [emails, setEmails] = React.useState<string[]>([]);
    const [didSubmit, setSubmit] = React.useState(false);
    const [projectName, setProjectName] = React.useState("");
    const [canCreate, setCreate] = React.useState(false);
    const stateRef = React.useRef<string>();
    stateRef.current = projectName;
    const { data: user } = useUser();
    
    React.useEffect(() => {
        if (user?.email) {
            fetch(`http://localhost:8000/api/projects/?username=${encodeURIComponent(user?.email)}`)
            .then(response => response.json())
            .then(data => {
                if ((data["queryResult"] === null)) {
                    setCreate(true);
                }
                else {
                    setProjectName(data["queryResult"]["projectName"]);
                }
            });
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

    

    const handleSubmit = (event:any) => {
        event.preventDefault();
        console.log(projectName);
        if ((user?.email) && (projectName === "")) {
            
            console.log(`project name: ${newProjName}`);
            let addedMembers: Member[] = [];
            let currUser = user?.email!;
            let appendVal:Member = {username: currUser, role: "admin"};
            addedMembers.push(appendVal);
            emails.forEach((member:any, index:number) => {
                let appendVal2:Member = {username: member, role: "developer"};
                addedMembers.push(appendVal2);
            });
            setTeam(addedMembers);
            setSubmit(true);
        }
        else {
            toast({
                title: "Operation Failed!",
                description: "Please check that Project Name and Team has been filled correctly",
                status: "error",
                duration: 5000,
                isClosable: true
            });
        }
        
    }

    React.useEffect(() => {
        if ((team.length > 1) && (didSubmit === true)) {
            console.log(team);
            
            fetch("http://localhost:8000/api/projects/create_project", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({projectName: newProjName, projectStatus: "IN PROGRESS", team: team, issues: [], reports: []})
                });
            
            setSubmit(false);
            toast({
                title: "Success!",
                description: "Your project has been created.",
                status: "success",
                duration: 5000,
                isClosable: true
            });
        }
        if (team.length === 1) {
            toast({
                title: "Operation Failed!",
                description: "Please check that Project Name and Team has been filled correctly. Remember that you should not include your own email.",
                status: "error",
                duration: 5000,
                isClosable: true
            });
        }
    }, [team]);

    return (
        <div id="container">
            {(canCreate) ? 
                <div id="uploadArea">
                    <div className="formbold-main-wrapper">
                        
                        <div className="formbold-form-wrapper">
                            <Text fontSize='24px' as='b' color="#07074d">Create a new project</Text>
                            <br /><br />
                            <form onSubmit={handleSubmit}>
                            <div className="formbold-mb-5">
                            <Text fontSize='18px' as='b' color="#07074d">Project Name: {newProjName}</Text>
                            <Input
                                isInvalid
                                errorBorderColor='grey'
                                value={newProjName}
                                color="#07074d"
                                onChange={(e) => {setNewProjName(e.target.value);}}
                                placeholder='Dumpster Fire'
                                size='sm'
                            />
                                
                            </div>

                            <div className="formbold-mb-5" style={{color: "#07074d"}}>
                                <Text fontSize='18px' as='b' color="#07074d">Add team members other than yourself by providing their emails below. Press enter after each entry:</Text>
                                <div id="email-input">
                                <ReactMultiEmail
                                    emails={emails}
                                    onChange={(_emails: string[]) => {
                                        setEmails(_emails);
                                    }}
                                    getLabel={(
                                        email: string,
                                        index: number,
                                        removeEmail: (index: number) => void
                                    ) => {
                                        return (
                                        <div data-tag key={index}>
                                            {email}
                                            <span data-tag-handle onClick={() => removeEmail(index)}>
                                            ×
                                            </span>
                                        </div>
                                        );
                                    }}
                                    />
                                </div>
                            </div>

                            <div>
                                <button className="formbold-btn w-full" type="submit">Create</button>
                            </div>
                        
                            </form>
                            
                        </div>
                    </div>
                </div>
            : <Text id="noCreate" fontSize='18px' as='b' color="#07074d">You cannot create a project because you are already apart of one</Text>}
            
            </div>
    );
};
