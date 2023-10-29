import datetime
from fastapi import APIRouter, Request
from bson.objectid import ObjectId
from backend.web.api.issues.models import Issue, UpdateIssue

router = APIRouter()


@router.get("/")
async def get_issue(request: Request, projName: str):
    """
    Retrieve all issues for a project
    """
    query = list(
        request.app.database["Projects"].find(
            {"projectName": projName}, {"_id": 0, "issues": 1}
        )
    )
    for i in range(len(query[0]["issues"])):
        issue = query[0]["issues"][i]
        issue["issueID"] = str(issue["issueID"])
        query[0]["issues"][i] = issue
    resp = {"queryResult": query[0]}

    return resp


@router.post("/add")
async def add_issue(issue: Issue, projectName: str, request: Request):
    """
    Add issue to a project
    """
    # Convert enum to string
    issue.priority = issue.priority.value
    issue.status = issue.status.value

    # Convert date to datetime as mongo doesn't accept date objects
    issue.due = datetime.datetime.combine(issue.due, datetime.time.min)

    issue = dict(issue)
    issue["issueID"] = ObjectId()

    resp = request.app.database["Projects"].update_one(
        {"projectName": projectName}, {"$push": {"issues": issue}}
    )

    return resp.modified_count


@router.post("/issues/edit")
async def edit_issue(request: Request, issue_id: str, issue: UpdateIssue):
    """
    Edit or update issue in a project
    """
    # define parameters and update
    if issue.priority:
        issue.priority = issue.priority.value
    if issue.status:
        issue.status = issue.status.value
    if issue.due:
        issue.due = datetime.datetime.combine(issue.due, datetime.time.min)

    try:
        myquery = {"issues.issueID": ObjectId(issue_id)}
        issue_dict = dict(issue)
        issue_without_none = {
            f"issues.$.{k}": v for k, v in issue_dict.items() if v is not None
        }
        new_values = {"$set": issue_without_none}
        request.app.database["Projects"].update_one(myquery, new_values)
    except Exception as e:
        return "Issue failed to update"
    return "Issue updated"


@router.post("/issues/delete")
async def delete_issue(issue_id: str, request: Request):
    """
    Delete issue from a project
    """
    request.app.DumpsterFire["Projects"].delete_one({"issues.issueID": issue_id})
    return {}
