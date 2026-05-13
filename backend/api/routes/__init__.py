from fastapi import APIRouter

from . import contact, sections

api_router = APIRouter()
api_router.include_router(sections.router, tags=['sections'])
api_router.include_router(contact.router, tags=['contact'])
