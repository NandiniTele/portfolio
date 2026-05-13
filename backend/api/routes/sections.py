from fastapi import APIRouter

from services.data_store import get_portfolio

router = APIRouter()


@router.get('/api/portfolio')
def get_full_portfolio():
    return get_portfolio()


@router.get('/api/home')
def get_home():
    data = get_portfolio()
    return {'hero': data['hero'], 'meta': data.get('meta', {})}


@router.get('/api/about')
def get_about():
    return get_portfolio()['about']


@router.get('/api/education')
def get_education():
    return {'items': get_portfolio()['education']}


@router.get('/api/skills')
def get_skills():
    return {'groups': get_portfolio()['skills']}


@router.get('/api/projects')
def get_projects():
    return {'items': get_portfolio()['projects']}


@router.get('/api/certifications')
def get_certifications():
    return {'items': get_portfolio()['certifications']}


@router.get('/api/internships')
def get_internships():
    return {'items': get_portfolio().get('internships', [])}


@router.get('/api/achievements')
def get_achievements():
    return {'items': get_portfolio().get('achievements', [])}


@router.get('/api/contact-info')
def get_contact_info():
    return get_portfolio()['contact']
