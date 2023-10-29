from datetime import date
from enum import Enum

from bson.objectid import ObjectId
from pydantic import BaseModel


# https://github.com/tiangolo/fastapi/issues/68#issuecomment-497348481
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v: str):
        if not isinstance(v, ObjectId):
            raise ValueError("Not a valid ObjectId")
        return str(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class IssuePriority(Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class IssueStatus(Enum):
    TO_DO = "TO DO"
    IN_PROGRESS = "IN PROGRESS"
    DONE = "DONE"


class Issue(BaseModel):
    issueId: PyObjectId
    title: str
    description: str
    assignee: str
    reporter: str
    priority: IssuePriority
    status: IssueStatus
    due: date


class Report(BaseModel):
    doc_type: str
    doc_name: str
    doc_path: str


class ProjectMember(BaseModel):
    username: str
    role: str


class ProjectStatus(Enum):
    IN_PROGRESS = "IN PROGRESS"
    COMPLETED = "COMPLETED"


class ProjectSettings(BaseModel):
    projectName: str
    projectStatus: ProjectStatus


class Project(BaseModel):
    projectName: str
    projectStatus: ProjectStatus
    team: list[ProjectMember]
    issues: list[Issue]
    reports: list[Report]
