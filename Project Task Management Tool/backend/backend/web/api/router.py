from fastapi.routing import APIRouter
from backend.web.api import docs, monitoring, users, issues, reports, projects

api_router = APIRouter()

api_router.include_router(docs.router)
api_router.include_router(monitoring.router)
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(issues.router, prefix="/issues", tags=["issues"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
