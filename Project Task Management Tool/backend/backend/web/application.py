from importlib import metadata
from pathlib import Path

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import UJSONResponse
from fastapi.staticfiles import StaticFiles

from backend.web.api.router import api_router
from backend.web.lifetime import register_shutdown_event, register_startup_event
from fastapi.middleware.cors import CORSMiddleware

APP_ROOT = Path(__file__).parent.parent

import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate(
    "firebaseServiceAccount.json"
)
firebase_admin.initialize_app(cred)


def get_app() -> FastAPI:
    """
    Get FastAPI application.

    This is the main constructor of an application.

    :return: application.
    """
    app = FastAPI(
        title="backend",
        description="backend",
        version=metadata.version("backend"),
        docs_url=None,
        redoc_url=None,
        openapi_url="/api/openapi.json",
        default_response_class=UJSONResponse,
    )
    '''
    @app.middleware("http")
    async def auth_middleware(request: Request, call_next):
        if "Authorization" in request.headers:
            id_token = str(request.headers["Authorization"])
            if "Bearer " not in id_token:
                return UJSONResponse(
                    status_code=401,
                    content={"message": f"Invalid Auth Method"},
                )
            try:
                id_token = id_token.replace("Bearer ", "")
                decoded_token = auth.verify_id_token(id_token)
                uid = decoded_token["uid"]
                if uid:
                    response = await call_next(request)
                    return response
                else:
                    return UJSONResponse(
                        status_code=401,
                        content={"message": f"Invalid Token"},
                    )
            except firebase_admin._auth_utils.InvalidIdTokenError:
                return UJSONResponse(
                    status_code=401,
                    content={"message": f"Invalid Token"},
                )
        else:
            return UJSONResponse(
                status_code=401,
                content={"message": f"Not Authorized"},
            )
    '''

    origins = ["*"]

    app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )
    # Adds startup and shutdown events.
    register_startup_event(app)
    register_shutdown_event(app)

    # Main router for the API.
    app.include_router(router=api_router, prefix="/api")
    # Adds static directory.
    # This directory is used to access swagger files.
    app.mount(
        "/static",
        StaticFiles(directory=APP_ROOT / "static"),
        name="static",
    )

    return app
