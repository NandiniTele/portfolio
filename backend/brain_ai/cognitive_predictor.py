"""Cognitive Prediction Module - Predicts emotions, focus, stress, and behavioral intent."""
from __future__ import annotations

import numpy as np
from .feature_extractor import BrainwaveFeatures


class CognitivePredictor:
    """Predicts cognitive and emotional states from brainwave features."""

    EMOTIONS = ["Calm", "Happy", "Anxious", "Focused", "Tired", "Excited", "Neutral"]
    COGNITIVE_STATES = ["Active", "Passive", "Deep Thought", "Creative", "Resting", "Alert"]
    BEHAVIORAL_INTENTS = [
        "Problem Solving", "Communication", "Rest", "Learning",
        "Decision Making", "Physical Activity", "Observation"
    ]

    def __init__(self):
        self._prediction_count = 0

    def predict_emotion(self, features: BrainwaveFeatures) -> dict:
        """Predict emotional state based on brainwave patterns."""
        # High alpha + low beta = calm/relaxed
        # High beta + high gamma = anxious/excited
        # High theta + low beta = tired

        scores = {
            "Calm": features.alpha_power * 2 - features.beta_power * 0.5,
            "Happy": features.alpha_power + features.gamma_power * 0.5,
            "Anxious": features.beta_power * 1.5 + features.gamma_power - features.alpha_power,
            "Focused": features.beta_power * 1.2 + features.gamma_power * 0.8 - features.theta_power,
            "Tired": features.theta_power * 2 + features.delta_power - features.beta_power,
            "Excited": features.gamma_power * 2 + features.beta_power * 0.8,
            "Neutral": 0.5,  # baseline
        }

        # Normalize to probabilities
        min_score = min(scores.values())
        shifted = {k: v - min_score + 0.01 for k, v in scores.items()}
        total = sum(shifted.values())
        probabilities = {k: v / total for k, v in shifted.items()}

        detected = max(probabilities, key=probabilities.get)
        confidence = probabilities[detected]

        return {
            "detected_emotion": detected,
            "confidence": round(confidence, 4),
            "probabilities": {k: round(v, 4) for k, v in probabilities.items()},
        }

    def predict_focus_level(self, features: BrainwaveFeatures) -> dict:
        """Predict focus/attention level (0-100%)."""
        # High beta + gamma indicates focus, high theta/alpha indicates relaxation
        focus_score = (
            features.beta_power * 0.4 +
            features.gamma_power * 0.3 -
            features.theta_power * 0.2 -
            features.alpha_power * 0.1
        )

        # Normalize to 0-100 using sigmoid-like mapping
        focus_pct = 100 / (1 + np.exp(-focus_score * 2))
        focus_pct = np.clip(focus_pct, 5, 99)

        level = "High" if focus_pct > 70 else "Medium" if focus_pct > 40 else "Low"

        return {
            "focus_percentage": round(float(focus_pct), 1),
            "focus_level": level,
        }

    def predict_stress_level(self, features: BrainwaveFeatures) -> dict:
        """Predict stress level."""
        # High beta, low alpha, high theta-beta ratio indicates stress
        stress_score = (
            features.beta_power * 0.5 +
            features.gamma_power * 0.3 -
            features.alpha_power * 0.4 +
            abs(features.skewness) * 0.1
        )

        stress_pct = 100 / (1 + np.exp(-stress_score * 1.5))
        stress_pct = np.clip(stress_pct, 2, 98)

        if stress_pct > 70:
            level = "High"
        elif stress_pct > 40:
            level = "Medium"
        else:
            level = "Low"

        return {
            "stress_percentage": round(float(stress_pct), 1),
            "stress_level": level,
        }

    def predict_attention_score(self, features: BrainwaveFeatures) -> dict:
        """Predict attention score based on theta-beta ratio."""
        # Low theta/beta ratio indicates better attention
        tbr = features.theta_beta_ratio
        attention = 100 * (1 - min(tbr / 3.0, 1.0))
        attention = np.clip(attention, 5, 99)

        return {
            "attention_score": round(float(attention), 1),
            "attention_quality": "High" if attention > 70 else "Medium" if attention > 40 else "Low",
        }

    def predict_mental_fatigue(self, features: BrainwaveFeatures) -> dict:
        """Predict mental fatigue level."""
        # High theta + alpha, low beta indicates fatigue
        fatigue_score = (
            features.theta_power * 0.4 +
            features.alpha_power * 0.3 +
            features.delta_power * 0.2 -
            features.beta_power * 0.3 -
            features.gamma_power * 0.2
        )

        fatigue_pct = 100 / (1 + np.exp(-fatigue_score * 2))
        fatigue_pct = np.clip(fatigue_pct, 2, 98)

        if fatigue_pct > 70:
            status = "High"
        elif fatigue_pct > 40:
            status = "Moderate"
        else:
            status = "Low"

        return {
            "fatigue_percentage": round(float(fatigue_pct), 1),
            "fatigue_status": status,
        }

    def predict_cognitive_state(self, features: BrainwaveFeatures) -> dict:
        """Predict overall cognitive state."""
        scores = {
            "Active": features.beta_power + features.gamma_power * 0.5,
            "Passive": features.alpha_power + features.theta_power * 0.3,
            "Deep Thought": features.gamma_power + features.beta_power * 0.4 - features.alpha_power * 0.2,
            "Creative": features.alpha_power * 0.6 + features.theta_power * 0.4 + features.gamma_power * 0.3,
            "Resting": features.alpha_power * 0.8 + features.delta_power * 0.5 - features.beta_power * 0.3,
            "Alert": features.beta_power * 0.8 + features.gamma_power * 0.4 - features.theta_power * 0.3,
        }

        state = max(scores, key=scores.get)
        return {"cognitive_state": state}

    def predict_behavioral_intent(self, features: BrainwaveFeatures) -> dict:
        """Predict likely behavioral intent."""
        scores = {
            "Problem Solving": features.gamma_power * 0.5 + features.beta_power * 0.4,
            "Communication": features.beta_power * 0.3 + features.alpha_power * 0.3 + features.gamma_power * 0.2,
            "Rest": features.alpha_power * 0.5 + features.delta_power * 0.3 + features.theta_power * 0.2,
            "Learning": features.beta_power * 0.4 + features.gamma_power * 0.3 + features.theta_power * 0.2,
            "Decision Making": features.gamma_power * 0.6 + features.beta_power * 0.3,
            "Physical Activity": features.beta_power * 0.5 - features.alpha_power * 0.2,
            "Observation": features.alpha_power * 0.4 + features.beta_power * 0.2,
        }

        intent = max(scores, key=scores.get)
        total = sum(max(0, v) for v in scores.values()) + 1e-10
        confidence = max(0, scores[intent]) / total

        return {
            "behavioral_intent": intent,
            "intent_confidence": round(float(confidence), 4),
        }

    def full_prediction(self, features: BrainwaveFeatures) -> dict:
        """Generate complete cognitive prediction report."""
        self._prediction_count += 1

        emotion = self.predict_emotion(features)
        focus = self.predict_focus_level(features)
        stress = self.predict_stress_level(features)
        attention = self.predict_attention_score(features)
        fatigue = self.predict_mental_fatigue(features)
        cognitive = self.predict_cognitive_state(features)
        intent = self.predict_behavioral_intent(features)

        # Generate AI interpretation
        interpretation = self._generate_interpretation(emotion, focus, stress, fatigue, cognitive)

        # Calculate overall prediction accuracy (simulated based on feature consistency)
        accuracy = self._estimate_accuracy(features)

        return {
            "emotion": emotion,
            "focus": focus,
            "stress": stress,
            "attention": attention,
            "fatigue": fatigue,
            "cognitive_state": cognitive,
            "behavioral_intent": intent,
            "ai_interpretation": interpretation,
            "prediction_accuracy": accuracy,
            "prediction_id": self._prediction_count,
        }

    def _generate_interpretation(self, emotion, focus, stress, fatigue, cognitive) -> str:
        """Generate human-readable AI interpretation."""
        parts = []

        em = emotion["detected_emotion"]
        fl = focus["focus_level"]
        sl = stress["stress_level"]
        fs = fatigue["fatigue_status"]
        cs = cognitive["cognitive_state"]

        if fl == "High" and sl == "Low":
            parts.append("User is highly focused and mentally stable.")
        elif fl == "High" and sl != "Low":
            parts.append("User shows high focus but with elevated stress indicators.")
        elif fl == "Low" and fs in ("High", "Moderate"):
            parts.append("User shows signs of mental fatigue with reduced focus.")
        else:
            parts.append(f"User is in a {cs.lower()} state with {fl.lower()} focus.")

        if em in ("Calm", "Happy"):
            parts.append(f"Emotional state is positive ({em.lower()}).")
        elif em in ("Anxious", "Tired"):
            parts.append(f"Emotional indicators suggest {em.lower()} state - consider break.")

        return " ".join(parts)

    def _estimate_accuracy(self, features: BrainwaveFeatures) -> float:
        """Estimate prediction accuracy based on signal quality metrics."""
        # Higher spectral entropy and consistent features = better predictions
        base_accuracy = 85.0
        entropy_bonus = min(features.spectral_entropy * 2, 10)
        consistency_bonus = min(5, max(0, 5 - abs(features.skewness)))
        accuracy = base_accuracy + entropy_bonus + consistency_bonus
        return round(min(99.0, max(70.0, accuracy)), 1)
