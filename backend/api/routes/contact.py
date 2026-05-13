from fastapi import APIRouter

from models.schemas import ContactMessageIn, ContactMessageOut
from services.data_store import append_contact_message

router = APIRouter()


@router.post('/api/contact', response_model=ContactMessageOut)
def submit_contact_message(body: ContactMessageIn):
    append_contact_message(
        {
            'name': body.name.strip(),
            'email': str(body.email).strip(),
            'message': body.message.strip(),
        }
    )
    return ContactMessageOut()
