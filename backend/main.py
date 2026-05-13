import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import api_router

app = FastAPI(title='Portfolio API', version='1.0.0')

_origins_env = os.getenv('FRONTEND_ORIGINS', '')
if _origins_env.strip():
    allow_origins = [o.strip() for o in _origins_env.split(',') if o.strip()]
else:
    allow_origins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
        'http://127.0.0.1:4173',
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(api_router)


@app.get('/health')
def health():
    return {'status': 'ok'}
