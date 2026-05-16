"""Brain-AI API Routes - FastAPI endpoints for the Brain-AI Hybrid Interface."""
from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, Query
from brain_ai.engine import get_engine

router = APIRouter(prefix="/api/brain-ai", tags=["brain-ai"])


@router.get("/status")
def get_status():
    """Get system status and statistics."""
    engine = get_engine()
    return engine.get_system_stats()


@router.post("/session/start")
def start_session(user_id: str = "default_user"):
    """Start a new Brain-AI session."""
    engine = get_engine()
    return engine.start_session(user_id)


@router.get("/analyze")
def analyze_signal(state: Optional[str] = Query(None, description="Cognitive state to simulate")):
    """Run full neural signal analysis pipeline."""
    engine = get_engine()
    return engine.analyze_signal(cognitive_state=state)


@router.get("/snapshot")
def get_snapshot():
    """Get a real-time cognitive snapshot for dashboard streaming."""
    engine = get_engine()
    return engine.get_realtime_snapshot()


@router.get("/profile")
def get_user_profile():
    """Get the current user's adaptive cognitive profile."""
    engine = get_engine()
    return engine.get_user_profile()


@router.get("/states")
def get_available_states():
    """Get available cognitive states for simulation."""
    from brain_ai.signal_simulator import COGNITIVE_PROFILES
    return {
        "states": list(COGNITIVE_PROFILES.keys()),
        "descriptions": {
            "focused": "High beta/gamma, low theta - active concentration",
            "relaxed": "High alpha, low beta - calm and at ease",
            "stressed": "High beta/gamma, low alpha - mental tension",
            "meditative": "High alpha/theta - deep relaxation",
            "fatigued": "High theta/delta, low beta - mental exhaustion",
            "alert": "Balanced beta/gamma - ready and responsive",
            "creative": "High alpha/theta with gamma bursts - flow state",
        },
    }


@router.get("/history")
def get_prediction_history(limit: int = Query(20, ge=1, le=100)):
    """Get recent prediction history from adaptive learning."""
    engine = get_engine()
    profile = engine.adaptive_learner.get_or_create_profile(engine._current_user)
    return {
        "user_id": engine._current_user,
        "recent_states": profile.prediction_history[-limit:],
        "accuracy_trend": profile.accuracy_trend[-limit:],
        "total_predictions": profile.total_predictions,
    }
