"""Signal Preprocessing Module - Noise removal, filtering, normalization, artifact removal."""
from __future__ import annotations

import numpy as np
from scipy.signal import butter, filtfilt, iirnotch


class SignalPreprocessor:
    """EEG signal preprocessing pipeline."""

    def __init__(self, sampling_rate=256):
        self.sampling_rate = sampling_rate

    def bandpass_filter(self, data, low_freq=0.5, high_freq=50.0):
        """Apply bandpass filter to remove frequencies outside the EEG range."""
        nyquist = self.sampling_rate / 2
        low = low_freq / nyquist
        high = high_freq / nyquist
        b, a = butter(4, [low, high], btype='band')
        return filtfilt(b, a, data)

    def notch_filter(self, data, freq=50.0, quality=30.0):
        """Remove power line interference (50/60 Hz)."""
        nyquist = self.sampling_rate / 2
        w0 = freq / nyquist
        b, a = iirnotch(w0, quality)
        return filtfilt(b, a, data)

    def normalize(self, data):
        """Z-score normalization."""
        mean = np.mean(data)
        std = np.std(data)
        if std == 0:
            return data - mean
        return (data - mean) / std

    def remove_artifacts(self, data, threshold=4.0):
        """Remove artifacts using amplitude thresholding with interpolation."""
        normalized = self.normalize(data)
        artifact_mask = np.abs(normalized) > threshold

        if not np.any(artifact_mask):
            return data

        clean = data.copy()
        artifact_indices = np.where(artifact_mask)[0]

        for idx in artifact_indices:
            left = idx - 1
            while left >= 0 and artifact_mask[left]:
                left -= 1
            right = idx + 1
            while right < len(data) and artifact_mask[right]:
                right += 1

            if left >= 0 and right < len(data):
                clean[idx] = (data[left] + data[right]) / 2
            elif left >= 0:
                clean[idx] = data[left]
            elif right < len(data):
                clean[idx] = data[right]

        return clean

    def segment_signal(self, data, window_size=1.0, overlap=0.5):
        """Segment signal into overlapping windows."""
        samples_per_window = int(window_size * self.sampling_rate)
        step = int(samples_per_window * (1 - overlap))
        segments = []

        for start in range(0, len(data) - samples_per_window + 1, step):
            segments.append(data[start:start + samples_per_window])

        return segments

    def preprocess_pipeline(self, raw_signal):
        """Full preprocessing pipeline."""
        # Step 1: Bandpass filter (0.5 - 50 Hz)
        filtered = self.bandpass_filter(raw_signal, 0.5, 50.0)

        # Step 2: Notch filter (remove 50 Hz power line)
        filtered = self.notch_filter(filtered, 50.0)

        # Step 3: Artifact removal
        clean = self.remove_artifacts(filtered)

        # Step 4: Normalize
        normalized = self.normalize(clean)

        return normalized
