"""Deep Learning Analysis Module - CNN-LSTM hybrid for cognitive prediction."""
from __future__ import annotations

import numpy as np
from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class ModelConfig:
    """Configuration for the neural network architecture."""
    input_length: int = 256
    n_channels: int = 5  # delta, theta, alpha, beta, gamma
    cnn_filters: Optional[List[int]] = None
    lstm_units: int = 64
    dense_units: int = 32
    n_classes: int = 7  # cognitive states
    learning_rate: float = 0.001

    def __post_init__(self):
        if self.cnn_filters is None:
            self.cnn_filters = [32, 64, 128]


class Conv1DLayer:
    """Simulated 1D Convolutional layer."""

    def __init__(self, in_channels, out_channels, kernel_size=3):
        self.weights = np.random.randn(out_channels, in_channels, kernel_size) * 0.1
        self.bias = np.zeros(out_channels)
        self.kernel_size = kernel_size

    def forward(self, x):
        """Apply 1D convolution with ReLU activation."""
        batch, channels, length = x.shape
        out_length = length - self.kernel_size + 1
        out = np.zeros((batch, self.weights.shape[0], out_length))

        for b in range(batch):
            for f in range(self.weights.shape[0]):
                for i in range(out_length):
                    window = x[b, :, i:i + self.kernel_size]
                    out[b, f, i] = np.sum(window * self.weights[f]) + self.bias[f]

        # ReLU activation
        return np.maximum(0, out)


class LSTMLayer:
    """Simulated LSTM layer for sequence processing."""

    def __init__(self, input_size, hidden_size):
        self.hidden_size = hidden_size
        scale = 0.1
        self.Wf = np.random.randn(hidden_size, input_size + hidden_size) * scale
        self.Wi = np.random.randn(hidden_size, input_size + hidden_size) * scale
        self.Wc = np.random.randn(hidden_size, input_size + hidden_size) * scale
        self.Wo = np.random.randn(hidden_size, input_size + hidden_size) * scale
        self.bf = np.zeros(hidden_size)
        self.bi = np.zeros(hidden_size)
        self.bc = np.zeros(hidden_size)
        self.bo = np.zeros(hidden_size)

    def _sigmoid(self, x):
        return 1 / (1 + np.exp(-np.clip(x, -10, 10)))

    def forward(self, x):
        """Process sequence and return final hidden state."""
        batch, seq_len, features = x.shape
        h = np.zeros((batch, self.hidden_size))
        c = np.zeros((batch, self.hidden_size))

        for t in range(seq_len):
            xt = x[:, t, :]
            combined = np.concatenate([xt, h], axis=1)

            ft = self._sigmoid(combined @ self.Wf.T + self.bf)
            it = self._sigmoid(combined @ self.Wi.T + self.bi)
            ct = np.tanh(combined @ self.Wc.T + self.bc)
            ot = self._sigmoid(combined @ self.Wo.T + self.bo)

            c = ft * c + it * ct
            h = ot * np.tanh(c)

        return h


class DenseLayer:
    """Fully connected layer."""

    def __init__(self, in_features, out_features, activation="relu"):
        self.weights = np.random.randn(in_features, out_features) * np.sqrt(2.0 / in_features)
        self.bias = np.zeros(out_features)
        self.activation = activation

    def forward(self, x):
        out = x @ self.weights + self.bias
        if self.activation == "relu":
            return np.maximum(0, out)
        elif self.activation == "softmax":
            exp_x = np.exp(out - np.max(out, axis=-1, keepdims=True))
            return exp_x / np.sum(exp_x, axis=-1, keepdims=True)
        return out


class CNNLSTMModel:
    """Hybrid CNN-LSTM architecture for cognitive state prediction.

    Architecture:
    - Conv1D layers extract spatial patterns from multi-channel EEG
    - LSTM layer captures temporal dependencies
    - Dense layers produce final cognitive predictions
    """

    COGNITIVE_STATES = [
        "focused", "relaxed", "stressed", "meditative",
        "fatigued", "alert", "creative"
    ]

    def __init__(self, config=None):
        self.config = config or ModelConfig()
        self._build_model()
        self._trained = False
        self._training_history = []  # type: List[float]

    def _build_model(self):
        """Initialize model layers."""
        # CNN layers for spatial feature extraction
        self.conv1 = Conv1DLayer(self.config.n_channels, self.config.cnn_filters[0], kernel_size=3)
        self.conv2 = Conv1DLayer(self.config.cnn_filters[0], self.config.cnn_filters[1], kernel_size=3)

        # LSTM for temporal processing
        self.lstm = LSTMLayer(self.config.cnn_filters[1], self.config.lstm_units)

        # Dense layers for classification
        self.dense1 = DenseLayer(self.config.lstm_units, self.config.dense_units, "relu")
        self.dense2 = DenseLayer(self.config.dense_units, self.config.n_classes, "softmax")

    def predict(self, multi_channel_signal):
        """Predict cognitive state from multi-channel EEG input.

        Args:
            multi_channel_signal: Shape (n_channels, n_samples) or (batch, n_channels, n_samples)
        """
        if multi_channel_signal.ndim == 2:
            multi_channel_signal = multi_channel_signal[np.newaxis, ...]

        # CNN feature extraction
        x = self.conv1.forward(multi_channel_signal)
        x = self.conv2.forward(x)

        # Reshape for LSTM: (batch, seq_len, features)
        x = x.transpose(0, 2, 1)

        # Temporal processing
        x = self.lstm.forward(x)

        # Classification
        x = self.dense1.forward(x)
        probabilities = self.dense2.forward(x)

        # Get predictions
        pred_idx = np.argmax(probabilities, axis=-1)

        return {
            "predicted_state": self.COGNITIVE_STATES[pred_idx[0]],
            "probabilities": {
                state: float(prob)
                for state, prob in zip(self.COGNITIVE_STATES, probabilities[0])
            },
            "confidence": float(np.max(probabilities)),
        }

    def train_step(self, features, labels):
        """Simulate a training step (returns synthetic loss)."""
        loss = np.random.uniform(0.1, 0.5) * (0.95 ** len(self._training_history))
        self._training_history.append(loss)
        self._trained = True
        return loss

    @property
    def is_trained(self):
        return self._trained

    @property
    def training_epochs(self):
        return len(self._training_history)
