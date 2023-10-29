from fastapi import APIRouter, Request
from backend.web.api.kanban.models import Issue
import datetime

router = APIRouter()


@router.get('/')
async def get_kbfromProject(projectname: str, request: Request):
    """Retreieve all issues from DB"""
    query = list(
        request.app.database["Projects"].find({'projectName': projectname}, {"_id": 0, "issues": {
            'title': 1,
            'description': 1,
            'assignee': 1,
            'reporter': 1,
            'priority': 1,
            'status': 1,
            'due': 1
        }})
    )
    resp = {
        "queryResult": query[0]
    }
    return resp


@router.post('/change')
async def change_status(projectname: str, title: str, status: str, request: Request):
    resp = request.app.database["Projects"].update_one(
        {'projectName': projectname, 'issues.title': title},
        {'$set': {'issues.$.status': status}})
    if not resp.modified_count:
        return "Status not changed"

    return "Status Changed"
