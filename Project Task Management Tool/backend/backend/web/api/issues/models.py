from datetime import date
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class IssuePriority(Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class IssueStatus(Enum):
    TO_DO = "TO DO"
    IN_PROGRESS = "IN PROGRESS"
    DONE = "DONE"


class Issue(BaseModel):
    title: str
    description: str
    assignee: str
    reporter: str
    priority: IssuePriority
    status: IssueStatus
    due: date


class UpdateIssue(BaseModel):
    title: Optional[str]
    description: Optional[str]
    assignee: Optional[str]
    reporter: Optional[str]
    priority: Optional[IssuePriority]
    status: Optional[IssueStatus]
    due: Optional[date]
