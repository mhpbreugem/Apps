# Apps

Personal web apps, served with GitHub Pages.

- [Kāshi](kashi/) — Persian typing trainer
- [MDR](mdr/) — flashcards on the EU Medical Device Regulation (EU) 2017/745, chapters and annexes switchable, optional answer check by Claude Haiku. Built from `mdr/src/` with `python3 mdr/build.py` (cards in `mdr/src/cards/*.txt`, one `question|answer|reference` per line)
- [MDRupdates](MDRupdates/) — daily check for new EU MDR/IVDR updates (legislation, MDCG guidance, standards, EUDAMED, authorities). On launch Claude Haiku searches the web and lists what is new since the last check as an inbox: compact or detailed view, optional AI summary and 0-5 star importance rating for the user's role (set in Settings), a relevant / not relevant mark per item that is fed into later searches, an Email button on the front page (subject "MDR Updates - number - date range", number counts up per email), select items and email them to an address saved in Settings (opens the email app). Optional backup of updates and settings (never the API key) to a secret GitHub gist, restored by pasting the same token after a reinstall. Tap-to-open start screen switches to full screen on Android. Needs your own Anthropic API key (shared with the other apps through the browser); about $0.10 per check. Single file, no build step
- [Chess of Empires](chess-of-empires/) — chess game, moved from mhpbreugem.github.io
- [Literature tree](literature/) — map of the REE literature (copied automatically from the private research repo; no ratings, ideas or to-do list)
- [Planner](planner/) — Planner Dots: a quarter or half year as dots, one dot per booked hour in quarters; gates (squares) for stages still to plan; focused and regular work; weekly budgets, a daily buffer hour, a fortnight board, a 10/20 min focus timer and a weekly review of estimates. Sample data is generic. The Haiku planner and dictation need the Claude artifact runtime or your own API key; everything else works on Pages. Add it to your Home Screen to open it full screen.

## Kāshi speech sprint: third-party model

The speech sprint runs a phoneme recognizer in the browser with [Transformers.js](https://github.com/huggingface/transformers.js) (Apache 2.0). The model is downloaded once from Hugging Face and cached on the device; it is not stored in this repo.

- Model: [onnx-community/wav2vec2-lv-60-espeak-cv-ft-ONNX](https://huggingface.co/onnx-community/wav2vec2-lv-60-espeak-cv-ft-ONNX), an ONNX export of [facebook/wav2vec2-lv-60-espeak-cv-ft](https://huggingface.co/facebook/wav2vec2-lv-60-espeak-cv-ft) by Meta AI (Xu, Baevski & Auli, 2021, "Simple and Effective Zero-shot Cross-lingual Phoneme Recognition", arXiv:2109.11680).
- License: Apache License 2.0. Copyright Meta Platforms, Inc. and the Hugging Face team.
- To switch models, change `ASR.MODEL` in `src/speech.js` and rebuild.
