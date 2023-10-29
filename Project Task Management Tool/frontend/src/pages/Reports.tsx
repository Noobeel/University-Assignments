import React from 'react';
import {Tree} from "@geist-ui/react";
import './Reports.css';
import { useSigninCheck, useUser } from 'reactfire';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const Reports = () => {

    type Doc = {
        docName: string;
        docPath: string;
        docType: string;
    };

    const { status, data: signInCheckResult } = useSigninCheck();
    const toast = useToast();
    const navigate = useNavigate();
    const { data: user } = useUser();

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

    /*
        All states (variables) being declared with default values. First array item is the variable
        itself. Second item is the function that you call to change the value of the variable.
    */
    const [docType, setDocType] = React.useState("");
    const [operation, setOperation] = React.useState("");
    const [myFile, setMyFile] = React.useState<any | null>(null);
    const [delFile, setDelFile] = React.useState("");
    const [fileList, setFileList] = React.useState<any[]>([]);
    const [counter, setCounter] = React.useState(0);
    const [burndown, setBurndown] = React.useState<Doc[]>([]);
    const [gantt, setGantt] = React.useState<Doc[]>([]);
    const [risk, setRisk] = React.useState<Doc[]>([]);
    const [projMan, setProjMan] = React.useState<Doc[]>([]);
    const [other, setOther] = React.useState<Doc[]>([]);
    const [projName, setProjName] = React.useState("");
    const stateRef = React.useRef<string>();

    let toDelete = "";
    stateRef.current = projName; // useRef was used to update projName in the function openDoc
    
    /*
        Sleep function used to delay for x milliseconds
    */
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    /*
        React hook useEffect runs on page load. This one prevents an auto-scrolling bug
    */
    React.useEffect(() => {
        window.scrollTo(0, 0); //stop auto scroll on file select
    }, [])

    /*
        Pull current user's project name
    */
    React.useEffect(() => {
        if (user?.email) {
            fetch(`http://localhost:8000/api/projects/?username=${encodeURIComponent(user?.email)}`)
            .then(response => response.json())
            .then(data => setProjName(data["queryResult"]["projectName"]));
        }
    }, [user?.email])

    /*
        This also runs on page load. Fetches list of reports from backend db and sorts them into
        their respective arrays declared above for easy access later on in the rendering
    */
    React.useEffect(() => {
        if (projName) {
        (async () => { 
            
            await sleep(1000);

            fetch(`http://localhost:8000/api/reports/get_reports?projName=${projName}`) // send get request to backend
            .then(response => response.json()) // turn response into json
            .then(data => { // the json above is represented now by the variable data
                // reset the arrays for each docType to prevent duplicate entries
                setBurndown([]);
                setGantt([]);
                setRisk([]);
                setProjMan([]);
                setOther([]);

                setFileList(data["queryResult"]["reports"]); // store the reports array in var fileList
                
                /*
                    elemental for loop goes through each item in the reports array and appends them to
                    their respective docType arrays
                */
                data["queryResult"]["reports"].forEach((value:Doc, index:number) => {
                    if (value.docType === "burndown") {
                         //concat instead of push because that what the internet says
                        setBurndown(burndown => burndown.concat(value));
                    }
                    else if (value.docType === "gantt") {
                        setGantt(gantt => gantt.concat(value));
                    }
                    else if (value.docType === "risk") {
                        setRisk(risk => risk.concat(value));
                    }
                    else if (value.docType === "project_management") {
                        setProjMan(projMan => projMan.concat(value));
                    }
                    else {
                        setOther(other => other.concat(value));
                    }
                });
            });
        })();
        }
      }, [counter, projName]);
    
    
    /*
        This functions handles the submit button press event. Typescript requires the parameter
        "event" to be set to something so set it to "any".
    */
    const handleSubmit = (event:any) => {
        event.preventDefault();
        if ((docType !== "") && (myFile !== null) && (operation === "upload")) {
            let form = new FormData(); // init new form
            form.append("docType", docType); // append stuff to form
            form.append("projName", projName);
            form.append("uploaded_file", myFile);
            // perform the post request
            fetch('http://localhost:8000/api/reports/add_report', {
                method: 'POST',
                body: form
            });

            setCounter(counter => counter+1); // Counter variable to invoke the file tree re-render upon file upload
            toast({
                title: "Success!",
                description: "Document has been uploaded successfully",
                status: "success",
                duration: 5000,
                isClosable: true
            }); // this is for the success or fail message
        }
        else if (docType !== "" && toDelete !== "" && operation === "delete") {
            // Set the header Content-Type because sending a JSON body
            fetch("http://localhost:8000/api/reports/delete_report", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({projName: projName, docName: toDelete, docType: docType})
            });
            setCounter(counter => counter+1);
            toast({
                title: "Success!",
                description: "Document has been deleted successfully",
                status: "success",
                duration: 5000,
                isClosable: true
            });
            toDelete="";
            let deletionSelect = (document.getElementById("delSelect")) as HTMLSelectElement;
            deletionSelect.selectedIndex = 0;
        }
        else {
            toast({
                title: "Operation Failed!",
                description: "Invalid form data.",
                status: "error",
                duration: 5000,
                isClosable: true
            });
        }
        
    }

    /*
        This function handles the file selected by the user when they browse their computer.
    */
    const updateFile = (event:any) => {
        //event.preventDefault();
        if (event.target.files[0] !== null){ // check if file exists
            setMyFile(event.target.files[0]); // set the chosen file
        }
        else {
            console.log("No file selected");
        }
    }

    React.useEffect(() => {
        if (delFile !== "") {
            
            toDelete = delFile;
        }
    }, [delFile])

    /*
        This function takes a path to the static folder of the backend and opens a new tab in the user's browser
        to display the file that was clicked on in the file tree.
    */
    const openDoc = (path: string) => {
        const temp = path.split("/");
        
        if (temp[0] === "Burndown Charts") {
            const w = window.open(`http://localhost:8000/static/reports/burndown/${stateRef.current+"_"+temp[1]}`, '_blank');
            if (w) {
                w.focus();
            }
        }
        if (temp[0] === "Gantt Charts") {
            const w = window.open(`http://localhost:8000/static/reports/gantt/${stateRef.current+"_"+temp[1]}`, '_blank');
            if (w) {
                w.focus();
            }
        }
        if (temp[0] === "Project Management Plans") {
            const w = window.open(`http://localhost:8000/static/reports/project_management/${stateRef.current+"_"+temp[1]}`, '_blank');
            if (w) {
                w.focus();
            }
        }
        if (temp[0] === "Risk Reports") {
            const w = window.open(`http://localhost:8000/static/reports/risk/${stateRef.current+"_"+temp[1]}`, '_blank');
            if (w) {
                w.focus();
            }
        }
        if (temp[0] === "Other") {
            const w = window.open(`http://localhost:8000/static/reports/other/${stateRef.current+"_"+temp[1]}`, '_blank');
            if (w) {
                w.focus();
            }
        }
    };

    /*
        This is where the html stuff gets rendered dynamically.
        To dynamically render components, use ternary operators "(condition) ? renderThis : elseRenderThat"
        to show different things for different variable values. If you need to create multiple component, 
        use the var.map() function which will render a component for each item in var. If you don't want to
        use ternary operators, you can also do

        { (() => {
            your code here. Example on line 275-318
        })()}
    */
    return (
        <div id="container">
            <div id="fileTree">
                <Tree onClick={openDoc}>
                    <Tree.Folder name="Burndown Charts">
                        {(burndown.length === 0) ? '':
                            burndown.map((item, index) => {
                                return (
                                    <Tree.File key={index} name={item.docName} />
                                )
                            })
                        }
                    </Tree.Folder>
                    <Tree.Folder name="Gantt Charts">
                        {(gantt.length === 0) ? '':
                            gantt.map((item, index) => {
                                return (
                                    <Tree.File key={index} name={item.docName} />
                                )
                            })
                        }
                    </Tree.Folder>
                    <Tree.Folder name="Project Management Plans">
                        {(projMan.length === 0) ? '':
                            projMan.map((item, index) => {
                                return (
                                    <Tree.File key={index} name={item.docName} />
                                )
                            })
                        }
                    </Tree.Folder>
                    <Tree.Folder name="Risk Reports">
                        {(risk.length === 0) ? '':
                            risk.map((item, index) => {
                                return (
                                    <Tree.File key={index} name={item.docName} />
                                )
                            })
                        }
                    </Tree.Folder>
                    <Tree.Folder name="Other">
                        {(other.length === 0) ? '':
                            other.map((item, index) => {
                                return (
                                    <Tree.File key={index} name={item.docName} />
                                )
                            })
                        }
                    </Tree.Folder>
                </Tree>
            </div>
            <div id="uploadArea">
                <div className="formbold-main-wrapper">
                    <div className="formbold-form-wrapper">
                        <form onSubmit={handleSubmit}>
                        <div className="formbold-mb-5">
                            <label className="formbold-form-label">
                            Choose document type:
                            </label>
                            <select value={docType} onChange={(e) => {setDocType(e.target.value);}}>
                                <option hidden disabled value=""> Select an option </option>
                                <option value="burndown">Burndown Chart</option>
                                <option value="gantt">Gantt Chart</option>
                                <option value="project_management">Project Management Plan</option>
                                <option value="risk">Risk Report</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="formbold-mb-5">
                            <label className="formbold-form-label">
                            Choose operation:
                            </label>
                            <select value={operation} onChange={(e) => {setOperation(e.target.value);}}>
                                <option hidden disabled value=""> Select an option </option>
                                <option value="upload">Upload</option>
                                <option value="delete">Delete</option>
                            </select>
                        </div>

                        {(() => {
                            if (operation === "upload") {
                                return(
                                    <div className="mb-6 pt-4">
                                        <label className="formbold-form-label formbold-form-label-2">
                                        Upload File
                                        </label>

                                        <div className="formbold-mb-5 formbold-file-input">
                                        <input type="file" name="file" id="file" onChange={updateFile}/>
                                        <label htmlFor="file">
                                            <div>
                                            <span className="formbold-drop-file">Upload Your File</span>
                                            <span className="formbold-browse"> Browse </span>
                                            </div>
                                        </label>
                                        </div>
                                        {(myFile !== null) ? <label className="formbold-form-label">{myFile.name}</label> : ''}
                                    </div>
                                )
                            }

                            if (operation === "delete") {
                                return(
                                    <div className="formbold-mb-5">
                                        <label className="formbold-form-label">
                                        Choose file:
                                        </label>
                                        <select id="delSelect" defaultValue={toDelete} onChange={(e) => setDelFile(e.target.value)}>
                                            <option value="" disabled> Select an option </option>
                                            {
                                                fileList.map((item, index) => {
                                                    if (item.docType === docType){
                                                        return (
                                                            <option key={index} value={item.docName}>{item.docName}</option>
                                                        )
                                                    }
                                                    else {
                                                        return ('')
                                                    }
                                                })
                                            }
                                        </select>
                                    </div>
                                )
                            }
                        })()}

                        <div>
                            <button className="formbold-btn w-full" type="submit">Submit</button>
                        </div>
                        </form>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};
