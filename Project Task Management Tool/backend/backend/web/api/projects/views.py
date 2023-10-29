from bson.objectid import ObjectId
from fastapi import APIRouter, Request

from backend.web.api.projects.models import Project, ProjectMember, ProjectSettings

router = APIRouter()


@router.get("/")
async def get_project(request: Request, username: str):
    """
    Retrieve project from the database.

    Parameter:
        request : Request
            Web request object containing the project settings.
        username: str
            Username (email) of the user

    Returns:
        resp : dict
            Project retrieved from the Projects collection.
    """

    # Get the project from the database
    query = list(
        request.app.database["Projects"].find(
            {"team.username": username},
            {
                "_id": 1,
                "team": 1,
                "issues": 1,
                "reports": 1,
                "projectName": 1,
                "projectStatus": 1,
            },
        )
    )

    if len(query) > 0:
        query[0]["_id"] = str(query[0]["_id"])

        for issue in query[0]["issues"]:
            issue["issueID"] = str(issue["issueID"])

    resp = {"queryResult": query[0] if len(query) > 0 else None}

    return resp


@router.get("/get_all_active_projects")
async def get_active_projects(request: Request):
    resp = request.app.database["Projects"].find({"projectStatus": "IN PROGRESS"})

    documents = []

    for doc in resp:
        doc["_id"] = str(doc["_id"])

        for issue in doc["issues"]:
            issue["issueID"] = str(issue["issueID"])

        documents.append(doc)

    return documents


@router.post("/create_project")
async def create_project(project: Project, request: Request):
    """
    Create a project in the database.
    Parameter:
        project : Project
            Information about the new project being created.
        request : Request
            Web request object for accessing the database.
    Returns:
        resp : str
            Returns the object ID of the new project.
    """

    project = dict(project)

    project["projectStatus"] = project["projectStatus"].value
    project["team"] = [dict(member) for member in project["team"]]

    resp = request.app.database["Projects"].insert_one(dict(project))

    return str(resp.inserted_id)


@router.delete("/delete_project{projectID}")
async def delete_project(projectID: str, request: Request):
    """
    Delete project in the database.

    Parameter:
        projectID: str
            ID of project

        request : Request
            Web request object containing the new settings.

    Returns:
        resp : int
            Number of documents modified, 0 if no document was modified and 1 if a document was modified.
    """
    # Delete the project from the database
    resp = request.app.database["Projects"].delete_one({"_id": ObjectId(projectID)})

    if not resp.deleted_count:
        return {"error": "Project not found"}

    return resp.deleted_count


@router.post("/update_project_settings/{project_id}")
async def update_project_settings(
    project_id: str, settings: ProjectSettings, request: Request
):
    """
    Update project settings in the database.

    Parameter:
        request : Request
            Web request object containing the new settings.

    Returns:
        resp : int
            Number of documents modified, 0 if no document was modified and 1 if a document was modified.
    """

    # Update the project settings in the database
    id = None
    try:
        id = ObjectId(project_id)
    except:
        return "Invalid project ID"

    settings = dict(settings)
    settings["projectStatus"] = settings["projectStatus"].value

    resp = request.app.database["Projects"].update_one(
        {"_id": id},
        {"$set": settings},
    )

    return "Settings updated"


@router.post("/add_project_user/{project_id}")
async def add_project_user(user: ProjectMember, project_id: str, request: Request):
    """
    Add a user to a project.

    Parameter:
        user: ProjectMember
            The user to add to the project.
        project_name : str
            Name of the project.
        request : Request
            Web request object for accessing the database.

    Returns:
        resp : int
            Number of users added to the project, 0 if no user was added and 1 otherwise.
        error : str
            Error message if an error occurred.
    """
    id = None
    try:
        id = ObjectId(project_id)
    except:
        return "Invalid project ID"

    resp = request.app.database["Projects"].update_one(
        {"_id": id},
        {"$push": {"team": dict(user)}},
    )

    if not resp.modified_count:
        return "Error, user not added"

    return "User has been added"


@router.post("/remove_project_user/{project_name}/")
async def remove_project_user(user: ProjectMember, project_name: str, request: Request):
    """
    Remove a user from the project.

    Parameter:
        user: ProjectMember
            The user to remove from the project (role can be NULL).
        project_name : str
            Name of the project.
        request : Request
            Web request object for accessing the database.

    Returns: resp : int Number of users removed from the project, 0 if no user was
    removed and 1 otherwise. error : str Error message if an error occurred.
    """
    resp = request.app.database["Projects"].update_one(
        {"projectName": project_name},
        {"$pull": {"team": {"username": user.username}}},
    )

    if not resp.modified_count:
        return "Error, user not removed"

    return "User has been removed"
