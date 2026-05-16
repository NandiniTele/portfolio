"""Brain-AI Engine - Orchestrates the full Brain-AI Hybrid Interface pipeline."""
from __future__ import annotations

import numpy as np
import time
from typing import Optional
from .signal_simulator import NeuralSignalSimulator, COGNITIVE_PROFILES
from .preprocessor import SignalPreprocessor
from .feature_extractor import FeatureExtractor
from .deep_learning import CNNLSTMModel, ModelConfig
from .cognitive_predictor import CognitivePredictor
from .adaptive_learner import AdaptiveLearner


class BrainAIEngine:
    """Main orchestrator for the Brain-AI Hybrid Interface System."""

    def __init__(self):
        self.signal_simulator = NeuralSignalSimulator(sampling_rate=256, duration=4.0)
        self.preprocessor = SignalPreprocessor(sampling_rate=256)
        self.feature_extractor = FeatureExtractor(sampling_rate=256)
        self.deep_learning_model = CNNLSTMModel()
        self.cognitive_predictor = CognitivePredictor()
        self.adaptive_learner = AdaptiveLearner()
        self._session_active = False
        self._current_user = "default_user"

    def start_session(self, user_id: str = "default_user") -> dict:
        """Start a Brain-AI session for a user."""
        self._session_active = True
        self._current_user = user_id
        session_info = self.adaptive_learner.start_session(user_id)
        return {
            **session_info,
            "system_status": "online",
            "modules": {
                "signal_acquisition": "ready",
                "preprocessing": "ready",
                "feature_extraction": "ready",
                "deep_learning": "ready",
                "cognitive_prediction": "ready",
                "adaptive_learning": "ready",
            },
        }

    def analyze_signal(self, cognitive_state: str | None = None) -> dict:
        """Run full analysis pipeline on a generated/simulated neural signal."""
        start_time = time.time()

        # Step 1: Signal Acquisition
        if cognitive_state and cognitive_state in COGNITIVE_PROFILES:
            raw_data = self.signal_simulator.generate_for_state(cognitive_state)
        else:
            # Generate with random variation
            states = list(COGNITIVE_PROFILES.keys())
            cognitive_state = np.random.choice(states)
            raw_data = self.signal_simulator.generate_for_state(cognitive_state)

        # Step 2: Preprocessing
        preprocessed = self.preprocessor.preprocess_pipeline(raw_data["composite"])

        # Step 3: Feature Extraction
        features = self.feature_extractor.extract_features(preprocessed)
        feature_dict = features.to_dict()

        # Step 4: Deep Learning Prediction
        # Create multi-channel input from band signals
        multi_channel = np.array([
            self.preprocessor.preprocess_pipeline(raw_data["delta"]),
            self.preprocessor.preprocess_pipeline(raw_data["theta"]),
            self.preprocessor.preprocess_pipeline(raw_data["alpha"]),
            self.preprocessor.preprocess_pipeline(raw_data["beta"]),
            self.preprocessor.preprocess_pipeline(raw_data["gamma"]),
        ])
        dl_prediction = self.deep_learning_model.predict(multi_channel)

        # Step 5: Cognitive Prediction
        cognitive_prediction = self.cognitive_predictor.full_prediction(features)

        # Step 6: Adaptive Learning
        personalization = self.adaptive_learner.get_personalized_adjustment(
            self._current_user, feature_dict
        )
        self.adaptive_learner.record_prediction(
            self._current_user, cognitive_prediction, feature_dict
        )

        processing_time = time.time() - start_time

        # Compile results
        return {
            "timestamp": time.time(),
            "processing_time_ms": round(processing_time * 1000, 2),
            "signal_info": {
                "sampling_rate": 256,
                "duration": 4.0,
                "simulated_state": cognitive_state,
            },
            "brainwave_features": feature_dict,
            "deep_learning": dl_prediction,
            "cognitive_prediction": cognitive_prediction,
            "personalization": personalization,
            "signal_data": {
                "time": raw_data["time"][:100].tolist(),  # Downsample for API
                "composite": preprocessed[:100].tolist(),
                "alpha": raw_data["alpha"][:100].tolist(),
                "beta": raw_data["beta"][:100].tolist(),
                "gamma": raw_data["gamma"][:100].tolist(),
                "theta": raw_data["theta"][:100].tolist(),
            },
        }

    def get_realtime_snapshot(self) -> dict:
        """Get a quick real-time snapshot for dashboard streaming."""
        # Generate a quick signal burst
        states = list(COGNITIVE_PROFILES.keys())
        weights = [0.3, 0.2, 0.1, 0.1, 0.05, 0.15, 0.1]  # Favor focused/relaxed
        state = np.random.choice(states, p=weights)

        raw_data = self.signal_simulator.generate_for_state(state)
        preprocessed = self.preprocessor.preprocess_pipeline(raw_data["composite"])
        features = self.feature_extractor.extract_features(preprocessed)
        prediction = self.cognitive_predictor.full_prediction(features)

        # Record for adaptive learning
        self.adaptive_learner.record_prediction(
            self._current_user, prediction, features.to_dict()
        )

        return {
            "timestamp": time.time(),
            "emotion": prediction["emotion"]["detected_emotion"],
            "emotion_confidence": prediction["emotion"]["confidence"],
            "focus_level": prediction["focus"]["focus_percentage"],
            "stress_level": prediction["stress"]["stress_percentage"],
            "stress_category": prediction["stress"]["stress_level"],
            "attention_score": prediction["attention"]["attention_score"],
            "fatigue_level": prediction["fatigue"]["fatigue_percentage"],
            "fatigue_status": prediction["fatigue"]["fatigue_status"],
            "cognitive_state": prediction["cognitive_state"]["cognitive_state"],
            "behavioral_intent": prediction["behavioral_intent"]["behavioral_intent"],
            "ai_interpretation": prediction["ai_interpretation"],
            "prediction_accuracy": prediction["prediction_accuracy"],
            "brainwave_summary": {
                "alpha": features.alpha_strength,
                "beta": features.beta_strength,
                "gamma": features.gamma_strength,
                "theta": features.theta_strength,
            },
            "band_powers": {
                "alpha": round(features.alpha_power, 4),
                "beta": round(features.beta_power, 4),
                "gamma": round(features.gamma_power, 4),
                "theta": round(features.theta_power, 4),
                "delta": round(features.delta_power, 4),
            },
            "signal_preview": preprocessed[:64].tolist(),
        }

    def get_user_profile(self) -> dict:
        """Get the current user's adaptive profile."""
        profile = self.adaptive_learner.get_or_create_profile(self._current_user)
        return profile.to_dict()

    def get_system_stats(self) -> dict:
        """Get system-wide statistics."""
        learning_stats = self.adaptive_learner.get_learning_stats()
        return {
            "system": "Brain-AI Hybrid Interface Simulator",
            "version": "1.0.0",
            "session_active": self._session_active,
            "current_user": self._current_user,
            "model_info": {
                "architecture": "CNN-LSTM Hybrid",
                "trained": self.deep_learning_model.is_trained,
                "training_epochs": self.deep_learning_model.training_epochs,
            },
            "learning_stats": learning_stats,
            "available_states": list(COGNITIVE_PROFILES.keys()),
        }


# Singleton instance
_engine_instance = None  # type: Optional[BrainAIEngine]


def get_engine() -> BrainAIEngine:
    """Get or create the singleton engine instance."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = BrainAIEngine()
        _engine_instance.start_session()
    return _engine_instance
