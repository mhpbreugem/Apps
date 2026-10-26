# Apps

Personal web apps, served with GitHub Pages.

- [Kāshi](kashi/) — Persian typing trainer
- [Chess of Empires](chess-of-empires/) — chess game, moved from mhpbreugem.github.io
- [Literature tree](literature/) — map of the REE literature (copied automatically from the private research repo; no ratings, ideas or to-do list)

## Kāshi speech sprint: third-party model

The speech sprint runs a phoneme recognizer in the browser with [Transformers.js](https://github.com/huggingface/transformers.js) (Apache 2.0). The model is downloaded once from Hugging Face and cached on the device; it is not stored in this repo.

- Model: [onnx-community/wav2vec2-lv-60-espeak-cv-ft-ONNX](https://huggingface.co/onnx-community/wav2vec2-lv-60-espeak-cv-ft-ONNX), an ONNX export of [facebook/wav2vec2-lv-60-espeak-cv-ft](https://huggingface.co/facebook/wav2vec2-lv-60-espeak-cv-ft) by Meta AI (Xu, Baevski & Auli, 2021, "Simple and Effective Zero-shot Cross-lingual Phoneme Recognition", arXiv:2109.11680).
- License: Apache License 2.0. Copyright Meta Platforms, Inc. and the Hugging Face team.
- To switch models, change `ASR.MODEL` in `src/speech.js` and rebuild.
