import React from 'react';
import "./boardNav.css"; 
import { ImHome,ImDrawer,ImImage,ImFileText,ImBubble, ImStatsDots, ImClipboard,ImUsers, ImUser, ImHammer} from 'react-icons/im';

export const BoardNav = () =>{
    return(
        <div className ="kbcontainer">
            <div> 
            <ul className = "Kbnav" style={{listStyle:'none'}}>
                <li><ImHome size = {30} style={{marginRight:'15px'}}/>  Dashboard </li>
                <li><ImDrawer size ={30} style={{marginRight:'15px'}}/> Backlog</li> 
                <li> <ImImage size ={30} style={{marginRight:'15px'}}/> Kanban Board</li>
                <li> <ImFileText size ={30} style={{marginRight:'15px'}}/>  Reports </li> 
                <li> <ImBubble  size ={30} style={{marginRight:'15px'}}/> Create Project </li> 
                <li> <ImStatsDots  size ={30} style={{marginRight:'15px'}}/> Roadmap </li> 
                <li> <ImClipboard size ={30} style={{marginRight:'15px'}}/>Active Sprint </li>
                <li> <ImUsers size ={30} style={{marginRight:'15px'}}/>Project Settings </li>
                <li> <ImUser size ={30} style={{marginRight:'15px'}}/> User Settings</li>
                <li> <ImHammer size ={30} style={{marginRight:'15px'}}/>Tools </li>
            </ul> 
            </div>

        </div>
    )
}