from fastapi import APIRouter, Body, File, UploadFile, Form, Request
import os

router = APIRouter()


@router.get("/get_reports")
async def get_reports(request: Request, projName: str):
    """
    Retrieve all reports db
    """
    resp = {
        "queryResult": list(
            request.app.database["Projects"].find({"projectName": projName}, {"_id": 0, "reports": 1})
        )[0]
    }
    # omit _id from the query because it will give error. 0 = omit, 1 = include
    # return value must always be a JSON
    return resp


@router.post("/add_report")
async def upload_report(
    request: Request, projName: str = Body(...), docType: str = Form(...), uploaded_file: UploadFile = File(...)
):
    """
    Add report to db
    """

    docPath = "static/reports/"
    if docType == "burndown":
        docPath += "burndown/"
    elif docType == "gantt":
        docPath += "gantt/"
    elif docType == "risk":
        docPath += "risk/"
    elif docType == "project_management":
        docPath += "project_management/"
    else:
        docPath += "other/"

    fullPath = docPath + projName + "_" +uploaded_file.filename

    # create dict to insert into db
    newEntry = {
        "docType": docType,
        "docName": uploaded_file.filename,
        "docPath": fullPath,
    }
    # insert into db
    request.app.database["Projects"].update_one({"projectName": projName}, {"$push": {"reports": newEntry}})
    my_path = os.path.abspath(os.path.dirname(__file__))
    file_location = os.path.join(my_path, f"../../../{fullPath}")

    with open(file_location, "wb+") as file_object:
        file_object.write(uploaded_file.file.read())
    # return success message
    return {"message": "file upload success!"}


@router.post("/delete_report")
async def delete_report(request: Request, projName: str = Body(...) ,docName: str = Body(...), docType: str = Body(...)):
    # add embed=True to the Body param if there is only 1 parameter passed
    """
    Delete report from db
    """

    # filter db for entry where docName = the one given in the parameters
    findQuery = list(
        request.app.database["Projects"].find({"projectName": projName}, {"_id": 0, "reports": 1})
    )[0]

    docPath = ""
    for report in findQuery["reports"]:
        if ((report["docName"] == docName) and (report["docType"] == docType)):
            docPath = report["docPath"]

    my_path = os.path.abspath(os.path.dirname(__file__))
    file_location = os.path.join(my_path, f"../../../{docPath}")

    if os.path.isfile(file_location):
        os.remove(file_location)
        # delete from db
        request.app.database["Projects"].update_one(
            {"projectName": projName}, {"$pull": {"reports": {"docName": docName, "docType": docType}}}
        )
    else:
        return {"message": "file to delete does not exist"}

    return {"message": "successfully deleted document"}


# access file in browser at /static/reports/{docType}/{fileName}
