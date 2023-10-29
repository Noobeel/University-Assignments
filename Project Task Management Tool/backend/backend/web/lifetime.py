from typing import Awaitable, Callable

from pymongo import MongoClient

from fastapi import FastAPI
from backend.settings import settings


def register_startup_event(
    app: FastAPI,
) -> Callable[[], Awaitable[None]]:  # pragma: no cover
    """
    Actions to run on application startup.

    This function uses fastAPI app to store data
    inthe state, such as db_engine.

    :param app: the fastAPI application.
    :return: function that actually performs actions.
    """

    @app.on_event("startup")
    async def _startup() -> None:  # noqa: WPS430
        # Connect to the database
        app.mongo_client = MongoClient(settings.MONGODB_CONNECTION_STRING)
        app.database = app.mongo_client["DumpsterFire"]

        pass  # noqa: WPS420

    return _startup


def register_shutdown_event(
    app: FastAPI,
) -> Callable[[], Awaitable[None]]:  # pragma: no cover
    """
    Actions to run on application's shutdown.

    :param app: fastAPI application.
    :return: function that actually performs actions.
    """

    @app.on_event("shutdown")
    async def _shutdown() -> None:  # noqa: WPS430
        # Close the database connection
        app.mongo_client.close()

        pass  # noqa: WPS420

    return _shutdown
