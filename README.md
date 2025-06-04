# Presets Manager Chrome Extension

**Presets Manager** is a Chrome extension that helps WordPress news editors quickly manage and apply groups of category checkboxes and related fields in the WordPress editor. Save time by creating, selecting, and deleting custom label presets for your publishing workflow.

> **Note:** I initially made this extension for Chambana Today, but it can be used with any WordPress news site.

## Features

- **Save Custom Presets:** Group your favorite category labels and save them as presets.
- **Apply Presets Instantly:** Select a preset to automatically check the right boxes and fill related fields in the WordPress editor.
- **Delete User Presets:** Remove any user-created preset with a single click.
- **Default Presets:** Comes with a set of default presets for common workflows.
- **Accessible UI:** Easy-to-use popup interface with accessible form controls.

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the extension folder.

## Usage

1. Open the WordPress post editor.
2. Click the Presets Manager extension icon in your Chrome toolbar.
3. Select a preset from the dropdown to apply it.
4. Use the checkboxes to customize labels, then save as a new preset if desired.
5. Delete user-created presets as needed.

## File Structure

- `manifest.json` – Chrome extension manifest.
- `popup.html` – Extension popup UI.
- `popup.js` – Popup logic for managing presets.
- `content-script.js` – Script injected into WordPress editor pages to apply presets.

## Permissions

- `storage` – Save your custom presets.
- `activeTab` – Apply presets to the current tab.
- `scripting` – Communicate between popup and content script.

## License

MIT License

---

**Created for WordPress newsrooms to streamline editorial workflows.**
