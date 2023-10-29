from bson.objectid import ObjectId
from fastapi import APIRouter, Request
from backend.web.api.users.models import User

router = APIRouter()


@router.get("/get_user_settings/{userID}")
async def get_user_settings(userID: str, request: Request):
    """
    Retrieve user settings from the database.

    Parameter:
        userID : str
            ID of the user.

    Returns:
        resp : dict
            Settings of the user retrieved from the User Settings collection.
    """

    # Get the user settings from the database
    resp = request.app.database["Users"].find_one({"_id": ObjectId(userID)})

    # Convert the ObjectId to a string as ObjectId is not iterable
    resp["_id"] = str(resp["_id"])

    return resp


@router.post("/update_user_settings/{userID}")
async def update_user_settings(userID: str, settings: User, request: Request):
    """
    Update user settings in the database.

    Parameter:
        userID : str
            ID of the user.
        request : Request
            Web request object containing the new settings.

    Returns:
        resp : int
            Number of documents modified, 0 if no document was modified and 1 if a document was modified.
    """

    # Update the user settings in the database
    resp = request.app.database["Users"].update_one(
        {"_id": ObjectId(userID)},
        {"$set": {dict(settings)}},
    )

    return resp.modified_count


@router.post("/create_user")
async def create_user(user: User, request: Request):
    """
    Create a user in the database.

    Parameter:
        request : Request
            Web request object for accessing the database and user information.

    Returns:
        resp : int
            Number of users added, 0 if no user was added and 1 if a user was added.
    """

    # User information received as
    # {
    #   "username": str,
    #   "name": str,
    # }
    resp = request.app.database["Users"].insert_one(dict(user))

    return str(resp.inserted_id)


@router.delete("/delete_user/{userID}")
async def delete_user(userID: str, request: Request):
    """
    Delete a user from the database.

    Parameter:
        userID : str
            ID of the user.
        request : Request
            Web request object for accessing the database.

    Returns:
        resp : int
            Number of documents deleted, 0 if no document was delete and 1 if a document was deleted.
        error : str
            Error message if an error occurred.
    """

    # Delete the user from the database
    resp = request.app.database["Users"].delete_one({"_id": ObjectId(userID)})

    if not resp.deleted_count:
        return {"error": "User not found"}

    return resp.deleted_count
