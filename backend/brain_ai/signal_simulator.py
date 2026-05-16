"""Neural Signal Acquisition Module - Simulates EEG-like brainwave signals."""
from __future__ import annotations

import numpy as np
from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass
class BrainwaveParams:
    """Parameters for brainwave band generation."""
    alpha_amplitude: float = 1.0   # 8-13 Hz - relaxation
    beta_amplitude: float = 0.8    # 13-30 Hz - active thinking
    gamma_amplitude: float = 0.4   # 30-100 Hz - high-level cognition
    theta_amplitude: float = 0.6   # 4-8 Hz - drowsiness/meditation
    delta_amplitude: float = 0.3   # 0.5-4 Hz - deep sleep
    noise_level: float = 0.15


# Cognitive state profiles that modulate brainwave amplitudes
COGNITIVE_PROFILES = {
    "focused": BrainwaveParams(alpha_amplitude=0.5, beta_amplitude=1.4, gamma_amplitude=0.9, theta_amplitude=0.3),
    "relaxed": BrainwaveParams(alpha_amplitude=1.5, beta_amplitude=0.4, gamma_amplitude=0.2, theta_amplitude=0.8),
    "stressed": BrainwaveParams(alpha_amplitude=0.3, beta_amplitude=1.6, gamma_amplitude=1.2, theta_amplitude=0.2, noise_level=0.3),
    "meditative": BrainwaveParams(alpha_amplitude=1.8, beta_amplitude=0.2, gamma_amplitude=0.1, theta_amplitude=1.4),
    "fatigued": BrainwaveParams(alpha_amplitude=0.6, beta_amplitude=0.3, gamma_amplitude=0.1, theta_amplitude=1.2, delta_amplitude=0.8),
    "alert": BrainwaveParams(alpha_amplitude=0.7, beta_amplitude=1.2, gamma_amplitude=0.7, theta_amplitude=0.2),
    "creative": BrainwaveParams(alpha_amplitude=1.3, beta_amplitude=0.9, gamma_amplitude=0.6, theta_amplitude=1.0),
}


class NeuralSignalSimulator:
    """Generates realistic EEG-like neural signals with multiple frequency bands."""

    def __init__(self, sampling_rate=256, duration=4.0):
        self.sampling_rate = sampling_rate
        self.duration = duration
        self.n_samples = int(sampling_rate * duration)
        self.time = np.linspace(0, duration, self.n_samples, endpoint=False)
        self._state_history = []  # type: List[str]

    def generate_band(self, freq_low, freq_high, amplitude):
        """Generate a signal within a specific frequency band."""
        n_components = np.random.randint(3, 7)
        signal = np.zeros(self.n_samples)
        for _ in range(n_components):
            freq = np.random.uniform(freq_low, freq_high)
            phase = np.random.uniform(0, 2 * np.pi)
            amp = amplitude * np.random.uniform(0.5, 1.5)
            signal += amp * np.sin(2 * np.pi * freq * self.time + phase)
        return signal / n_components

    def generate_eeg_signal(self, params=None):
        """Generate a complete multi-band EEG signal."""
        if params is None:
            params = BrainwaveParams()

        # Generate individual frequency bands
        alpha = self.generate_band(8, 13, params.alpha_amplitude)
        beta = self.generate_band(13, 30, params.beta_amplitude)
        gamma = self.generate_band(30, 50, params.gamma_amplitude)
        theta = self.generate_band(4, 8, params.theta_amplitude)
        delta = self.generate_band(0.5, 4, params.delta_amplitude)

        # Add realistic noise
        noise = params.noise_level * np.random.randn(self.n_samples)

        # Composite signal
        composite = alpha + beta + gamma + theta + delta + noise

        return {
            "composite": composite,
            "alpha": alpha,
            "beta": beta,
            "gamma": gamma,
            "theta": theta,
            "delta": delta,
            "time": self.time,
            "sampling_rate": self.sampling_rate,
        }

    def generate_for_state(self, cognitive_state):
        """Generate EEG signal for a specific cognitive state."""
        params = COGNITIVE_PROFILES.get(cognitive_state, BrainwaveParams())
        signal_data = self.generate_eeg_signal(params)
        signal_data["cognitive_state"] = cognitive_state
        self._state_history.append(cognitive_state)
        return signal_data

    def generate_transition(self, from_state, to_state, steps=10):
        """Generate signals showing transition between cognitive states."""
        from_params = COGNITIVE_PROFILES.get(from_state, BrainwaveParams())
        to_params = COGNITIVE_PROFILES.get(to_state, BrainwaveParams())

        signals = []
        for i in range(steps):
            t = i / (steps - 1)
            interp_params = BrainwaveParams(
                alpha_amplitude=from_params.alpha_amplitude * (1 - t) + to_params.alpha_amplitude * t,
                beta_amplitude=from_params.beta_amplitude * (1 - t) + to_params.beta_amplitude * t,
                gamma_amplitude=from_params.gamma_amplitude * (1 - t) + to_params.gamma_amplitude * t,
                theta_amplitude=from_params.theta_amplitude * (1 - t) + to_params.theta_amplitude * t,
                delta_amplitude=from_params.delta_amplitude * (1 - t) + to_params.delta_amplitude * t,
                noise_level=from_params.noise_level * (1 - t) + to_params.noise_level * t,
            )
            signals.append(self.generate_eeg_signal(interp_params))
        return signals
