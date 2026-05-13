import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

_BACKEND_ROOT = Path(__file__).resolve().parent.parent
_DATA_PATH = _BACKEND_ROOT / 'data' / 'portfolio.json'
_MESSAGES_PATH = _BACKEND_ROOT / 'data' / 'contact_messages.jsonl'

_portfolio_cache: Optional[Dict[str, Any]] = None
_cache_mtime: Optional[float] = None


def get_portfolio() -> Dict[str, Any]:
    global _portfolio_cache, _cache_mtime
    mtime = _DATA_PATH.stat().st_mtime
    if _portfolio_cache is None or _cache_mtime != mtime:
        with open(_DATA_PATH, encoding='utf-8') as f:
            _portfolio_cache = json.load(f)
        _cache_mtime = mtime
    return _portfolio_cache


def reload_portfolio() -> Dict[str, Any]:
    global _portfolio_cache, _cache_mtime
    _portfolio_cache = None
    _cache_mtime = None
    return get_portfolio()


def append_contact_message(payload: dict) -> None:
    _MESSAGES_PATH.parent.mkdir(parents=True, exist_ok=True)
    line = json.dumps(
        {'received_at': datetime.now(timezone.utc).isoformat(), **payload},
        ensure_ascii=False,
    )
    with open(_MESSAGES_PATH, 'a', encoding='utf-8') as f:
        f.write(line + '\n')
