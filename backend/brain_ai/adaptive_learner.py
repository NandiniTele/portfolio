"""Adaptive Learning Module - Personalized neural pattern recognition and continuous improvement."""
from __future__ import annotations

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional
from collections import deque
import time


@dataclass
class UserProfile:
    """Personalized cognitive profile for a user."""
    user_id: str
    baseline_alpha: float = 0.0
    baseline_beta: float = 0.0
    baseline_gamma: float = 0.0
    baseline_theta: float = 0.0
    baseline_delta: float = 0.0
    prediction_history: list = field(default_factory=list)
    accuracy_trend: list = field(default_factory=list)
    dominant_state: str = "unknown"
    sessions_count: int = 0
    total_predictions: int = 0
    adaptation_level: float = 0.0  # 0-1, how well the model has adapted
    created_at: float = field(default_factory=time.time)
    last_active: float = field(default_factory=time.time)

    def to_dict(self) -> dict:
        return {
            "user_id": self.user_id,
            "baselines": {
                "alpha": round(self.baseline_alpha, 4),
                "beta": round(self.baseline_beta, 4),
                "gamma": round(self.baseline_gamma, 4),
                "theta": round(self.baseline_theta, 4),
                "delta": round(self.baseline_delta, 4),
            },
            "dominant_state": self.dominant_state,
            "sessions_count": self.sessions_count,
            "total_predictions": self.total_predictions,
            "adaptation_level": round(self.adaptation_level, 4),
            "accuracy_trend": self.accuracy_trend[-20:],  # Last 20
        }


class AdaptiveLearner:
    """Adaptive learning system that builds personalized cognitive models."""

    def __init__(self, learning_rate: float = 0.01, memory_size: int = 1000):
        self.learning_rate = learning_rate
        self.memory_size = memory_size
        self.profiles = {}  # type: Dict[str, UserProfile]
        self.experience_buffer = deque(maxlen=memory_size)
        self._global_accuracy = 85.0
        self._adaptation_steps = 0

    def get_or_create_profile(self, user_id: str) -> UserProfile:
        """Get existing profile or create new one."""
        if user_id not in self.profiles:
            self.profiles[user_id] = UserProfile(user_id=user_id)
        return self.profiles[user_id]

    def update_baselines(self, user_id: str, features: dict) -> None:
        """Update user's baseline brainwave levels using exponential moving average."""
        profile = self.get_or_create_profile(user_id)
        lr = self.learning_rate

        profile.baseline_alpha = (1 - lr) * profile.baseline_alpha + lr * features.get("alpha_power", 0)
        profile.baseline_beta = (1 - lr) * profile.baseline_beta + lr * features.get("beta_power", 0)
        profile.baseline_gamma = (1 - lr) * profile.baseline_gamma + lr * features.get("gamma_power", 0)
        profile.baseline_theta = (1 - lr) * profile.baseline_theta + lr * features.get("theta_power", 0)
        profile.baseline_delta = (1 - lr) * profile.baseline_delta + lr * features.get("delta_power", 0)
        profile.last_active = time.time()

    def record_prediction(self, user_id: str, prediction: dict, features: dict) -> None:
        """Record a prediction for adaptive learning."""
        profile = self.get_or_create_profile(user_id)
        profile.total_predictions += 1

        # Update baselines
        self.update_baselines(user_id, features)

        # Track prediction history
        state = prediction.get("cognitive_state", {}).get("cognitive_state", "unknown")
        profile.prediction_history.append(state)
        if len(profile.prediction_history) > 100:
            profile.prediction_history = profile.prediction_history[-100:]

        # Update dominant state
        if profile.prediction_history:
            from collections import Counter
            state_counts = Counter(profile.prediction_history)
            profile.dominant_state = state_counts.most_common(1)[0][0]

        # Track accuracy
        accuracy = prediction.get("prediction_accuracy", 85.0)
        profile.accuracy_trend.append(accuracy)
        if len(profile.accuracy_trend) > 50:
            profile.accuracy_trend = profile.accuracy_trend[-50:]

        # Update adaptation level
        profile.adaptation_level = min(1.0, profile.total_predictions / 100)

        # Store in experience buffer
        self.experience_buffer.append({
            "user_id": user_id,
            "features": features,
            "prediction": prediction,
            "timestamp": time.time(),
        })

        self._adaptation_steps += 1

    def get_personalized_adjustment(self, user_id: str, features: dict) -> dict:
        """Get personalized prediction adjustments based on user's history."""
        profile = self.get_or_create_profile(user_id)

        if profile.total_predictions < 5:
            return {"adjustment_factor": 1.0, "personalized": False}

        # Calculate deviation from baseline
        deviations = {
            "alpha_deviation": features.get("alpha_power", 0) - profile.baseline_alpha,
            "beta_deviation": features.get("beta_power", 0) - profile.baseline_beta,
            "gamma_deviation": features.get("gamma_power", 0) - profile.baseline_gamma,
            "theta_deviation": features.get("theta_power", 0) - profile.baseline_theta,
        }

        # Confidence boost for adapted models
        confidence_boost = profile.adaptation_level * 0.05

        return {
            "adjustment_factor": 1.0 + confidence_boost,
            "personalized": True,
            "deviations": deviations,
            "adaptation_level": profile.adaptation_level,
            "dominant_state": profile.dominant_state,
        }

    def start_session(self, user_id: str) -> dict:
        """Start a new session for a user."""
        profile = self.get_or_create_profile(user_id)
        profile.sessions_count += 1
        profile.last_active = time.time()

        return {
            "session_started": True,
            "user_id": user_id,
            "session_number": profile.sessions_count,
            "adaptation_level": profile.adaptation_level,
            "is_new_user": profile.sessions_count == 1,
        }

    def get_learning_stats(self) -> dict:
        """Get overall adaptive learning statistics."""
        total_users = len(self.profiles)
        total_predictions = sum(p.total_predictions for p in self.profiles.values())
        avg_adaptation = (
            np.mean([p.adaptation_level for p in self.profiles.values()])
            if self.profiles else 0.0
        )

        return {
            "total_users": total_users,
            "total_predictions": total_predictions,
            "average_adaptation_level": round(float(avg_adaptation), 4),
            "experience_buffer_size": len(self.experience_buffer),
            "adaptation_steps": self._adaptation_steps,
            "global_accuracy": round(self._global_accuracy, 2),
        }
