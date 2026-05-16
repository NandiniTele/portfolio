"""Feature Extraction Module - Extract brainwave patterns and frequency-domain features."""
from __future__ import annotations

import numpy as np
from scipy.signal import welch
from dataclasses import dataclass


@dataclass
class BrainwaveFeatures:
    """Extracted brainwave features."""
    # Band powers
    delta_power: float
    theta_power: float
    alpha_power: float
    beta_power: float
    gamma_power: float

    # Ratios
    alpha_beta_ratio: float
    theta_beta_ratio: float
    theta_alpha_ratio: float

    # Statistical features
    mean_amplitude: float
    std_amplitude: float
    skewness: float
    kurtosis: float

    # Spectral features
    spectral_entropy: float
    peak_frequency: float
    median_frequency: float

    # Band strengths (categorical)
    alpha_strength: str
    beta_strength: str
    gamma_strength: str
    theta_strength: str

    def to_dict(self) -> dict:
        return {
            "delta_power": round(self.delta_power, 4),
            "theta_power": round(self.theta_power, 4),
            "alpha_power": round(self.alpha_power, 4),
            "beta_power": round(self.beta_power, 4),
            "gamma_power": round(self.gamma_power, 4),
            "alpha_beta_ratio": round(self.alpha_beta_ratio, 4),
            "theta_beta_ratio": round(self.theta_beta_ratio, 4),
            "theta_alpha_ratio": round(self.theta_alpha_ratio, 4),
            "mean_amplitude": round(self.mean_amplitude, 4),
            "std_amplitude": round(self.std_amplitude, 4),
            "skewness": round(self.skewness, 4),
            "kurtosis": round(self.kurtosis, 4),
            "spectral_entropy": round(self.spectral_entropy, 4),
            "peak_frequency": round(self.peak_frequency, 4),
            "median_frequency": round(self.median_frequency, 4),
            "alpha_strength": self.alpha_strength,
            "beta_strength": self.beta_strength,
            "gamma_strength": self.gamma_strength,
            "theta_strength": self.theta_strength,
        }


class FeatureExtractor:
    """Extract features from preprocessed EEG signals."""

    BAND_RANGES = {
        "delta": (0.5, 4),
        "theta": (4, 8),
        "alpha": (8, 13),
        "beta": (13, 30),
        "gamma": (30, 50),
    }

    def __init__(self, sampling_rate: int = 256):
        self.sampling_rate = sampling_rate

    def compute_band_power(self, data: np.ndarray, low_freq: float, high_freq: float) -> float:
        """Compute power in a specific frequency band using Welch's method."""
        freqs, psd = welch(data, fs=self.sampling_rate, nperseg=min(256, len(data)))
        band_mask = (freqs >= low_freq) & (freqs <= high_freq)
        return float(np.trapz(psd[band_mask], freqs[band_mask]))

    def compute_spectral_entropy(self, data: np.ndarray) -> float:
        """Compute spectral entropy as a measure of signal complexity."""
        freqs, psd = welch(data, fs=self.sampling_rate, nperseg=min(256, len(data)))
        psd_norm = psd / np.sum(psd)
        psd_norm = psd_norm[psd_norm > 0]
        return float(-np.sum(psd_norm * np.log2(psd_norm)))

    def compute_peak_frequency(self, data: np.ndarray) -> float:
        """Find the dominant frequency."""
        freqs, psd = welch(data, fs=self.sampling_rate, nperseg=min(256, len(data)))
        return float(freqs[np.argmax(psd)])

    def compute_median_frequency(self, data: np.ndarray) -> float:
        """Compute the frequency below which 50% of the total power resides."""
        freqs, psd = welch(data, fs=self.sampling_rate, nperseg=min(256, len(data)))
        cumulative_power = np.cumsum(psd)
        total_power = cumulative_power[-1]
        median_idx = np.searchsorted(cumulative_power, total_power / 2)
        return float(freqs[min(median_idx, len(freqs) - 1)])

    def _classify_strength(self, power: float, thresholds: tuple[float, float]) -> str:
        """Classify band power into Low/Medium/Strong categories."""
        if power < thresholds[0]:
            return "Low"
        elif power < thresholds[1]:
            return "Medium"
        return "Strong"

    def extract_features(self, data: np.ndarray) -> BrainwaveFeatures:
        """Extract comprehensive features from an EEG signal segment."""
        # Band powers
        delta_power = self.compute_band_power(data, *self.BAND_RANGES["delta"])
        theta_power = self.compute_band_power(data, *self.BAND_RANGES["theta"])
        alpha_power = self.compute_band_power(data, *self.BAND_RANGES["alpha"])
        beta_power = self.compute_band_power(data, *self.BAND_RANGES["beta"])
        gamma_power = self.compute_band_power(data, *self.BAND_RANGES["gamma"])

        # Ratios (avoid division by zero)
        eps = 1e-10
        alpha_beta_ratio = alpha_power / (beta_power + eps)
        theta_beta_ratio = theta_power / (beta_power + eps)
        theta_alpha_ratio = theta_power / (alpha_power + eps)

        # Statistical features
        mean_amplitude = float(np.mean(data))
        std_amplitude = float(np.std(data))
        n = len(data)
        skewness = float(np.mean(((data - mean_amplitude) / (std_amplitude + eps)) ** 3))
        kurtosis = float(np.mean(((data - mean_amplitude) / (std_amplitude + eps)) ** 4) - 3)

        # Spectral features
        spectral_entropy = self.compute_spectral_entropy(data)
        peak_frequency = self.compute_peak_frequency(data)
        median_frequency = self.compute_median_frequency(data)

        # Classify band strengths
        total_power = delta_power + theta_power + alpha_power + beta_power + gamma_power + eps
        alpha_rel = alpha_power / total_power
        beta_rel = beta_power / total_power
        gamma_rel = gamma_power / total_power
        theta_rel = theta_power / total_power

        alpha_strength = self._classify_strength(alpha_rel, (0.15, 0.30))
        beta_strength = self._classify_strength(beta_rel, (0.15, 0.30))
        gamma_strength = self._classify_strength(gamma_rel, (0.10, 0.20))
        theta_strength = self._classify_strength(theta_rel, (0.15, 0.30))

        return BrainwaveFeatures(
            delta_power=delta_power,
            theta_power=theta_power,
            alpha_power=alpha_power,
            beta_power=beta_power,
            gamma_power=gamma_power,
            alpha_beta_ratio=alpha_beta_ratio,
            theta_beta_ratio=theta_beta_ratio,
            theta_alpha_ratio=theta_alpha_ratio,
            mean_amplitude=mean_amplitude,
            std_amplitude=std_amplitude,
            skewness=skewness,
            kurtosis=kurtosis,
            spectral_entropy=spectral_entropy,
            peak_frequency=peak_frequency,
            median_frequency=median_frequency,
            alpha_strength=alpha_strength,
            beta_strength=beta_strength,
            gamma_strength=gamma_strength,
            theta_strength=theta_strength,
        )

    def extract_feature_vector(self, data: np.ndarray) -> np.ndarray:
        """Extract features as a numeric vector for ML models."""
        features = self.extract_features(data)
        return np.array([
            features.delta_power,
            features.theta_power,
            features.alpha_power,
            features.beta_power,
            features.gamma_power,
            features.alpha_beta_ratio,
            features.theta_beta_ratio,
            features.theta_alpha_ratio,
            features.mean_amplitude,
            features.std_amplitude,
            features.skewness,
            features.kurtosis,
            features.spectral_entropy,
            features.peak_frequency,
            features.median_frequency,
        ])
