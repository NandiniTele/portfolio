from fastapi import APIRouter

from . import contact, sections, brain_ai

api_router = APIRouter()
api_router.include_router(sections.router, tags=['sections'])
api_router.include_router(contact.router, tags=['contact'])
api_router.include_router(brain_ai.router)
