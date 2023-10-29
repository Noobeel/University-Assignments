from enum import Enum
from datetime import date
from pydantic import BaseModel


class IssuePriority(Enum): 
    LOW = 'LOW' 
    MEDIUM = 'MEDIUM' 
    HIGH = 'HIGH' 

class IssueStatus(Enum): 
    TO_DO = "TO DO" 
    IN_PROGRESS = 'IN PROGRESS' 
    DONE = 'DONE' 

class Issue(BaseModel): 
    title: str 
    description: str 
    assignee: str 
    reporter: str
    priority: IssuePriority
    status: IssueStatus
    due: date