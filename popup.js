// popup.js
document.addEventListener("DOMContentLoaded", () => {
  // Default presets
  const defaultPresets = {
    "All Defaults": [
      "ZZZ App Top Srories",
      "Community",
      "Chambana Today",
      "Metro Services",
    ],
    "News Only": ["Chambana Today", "Community"],
    "Metro Services Only": ["Metro Services"],
  };

  // UI elements
  const menu = document.getElementById("defaultPresetsMenu");
  const presetNameInput = document.getElementById("presetNameInput");
  const labelsContainer = document.getElementById("labelsContainer");
  const saveBtn = document.getElementById("saveBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  // All possible labels to show as checkboxes
  const allLabels = [
    "ZZZ App Top Srories",
    "Community",
    "Chambana Today",
    "Metro Services",
  ];

  // User presets stored here
  let userPresets = {};

  // Load presets from chrome.storage or use defaults
  function loadPresets() {
    chrome.storage.local.get(["userPresets"], (result) => {
      userPresets = result.userPresets || {};
      buildMenu();
      buildLabelCheckboxes();
      applyPreset(menu.value || "All Defaults");
    });
  }

  // Save userPresets back to storage
  function saveUserPresets() {
    chrome.storage.local.set({ userPresets });
  }

  // Build dropdown menu options from presets + userPresets
  function buildMenu() {
    // Clear existing options
    menu.innerHTML = "";
    // Add default presets first
    for (const presetName in defaultPresets) {
      const option = document.createElement("option");
      option.value = presetName;
      option.textContent = presetName;
      menu.appendChild(option);
    }
    // Add user presets
    for (const presetName in userPresets) {
      const option = document.createElement("option");
      option.value = presetName;
      option.textContent = presetName;
      menu.appendChild(option);
    }
    // Select first option if none selected
    if (!menu.value) menu.value = "All Defaults";
  }

  // Build checkboxes for allLabels
  function buildLabelCheckboxes(selectedLabels = []) {
    labelsContainer.innerHTML = "";
    allLabels.forEach((labelText, idx) => {
      const checkboxId = `label-checkbox-${idx}`;
      const label = document.createElement("label");
      label.setAttribute("for", checkboxId);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = labelText;
      checkbox.name = "labelCheckbox";
      checkbox.id = checkboxId;
      checkbox.checked = selectedLabels.includes(labelText);

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(labelText));
      labelsContainer.appendChild(label);
    });
  }
  // When user selects a preset, update checkboxes and tell content script to apply preset
  menu.addEventListener("change", () => {
    const presetName = menu.value;
    applyPreset(presetName);
  });

  // Save preset button
  saveBtn.addEventListener("click", () => {
    const name = presetNameInput.value.trim();
    if (!name) {
      alert("Please enter a preset name.");
      return;
    }
    const checkedLabels = Array.from(
      labelsContainer.querySelectorAll("input[type='checkbox']:checked")
    ).map((cb) => cb.value);

    if (checkedLabels.length === 0) {
      alert("Please select at least one label to save the preset.");
      return;
    }

    // Save preset to userPresets and storage
    userPresets[name] = checkedLabels;
    saveUserPresets();
    buildMenu();
    menu.value = name;
    applyPreset(name);
    presetNameInput.value = "";
  });

  // Delete preset button (only user presets can be deleted)
  deleteBtn.addEventListener("click", () => {
    const selected = menu.value;
    if (!selected || defaultPresets[selected]) {
      alert("You can only delete user-created presets.");
      return;
    }
    if (confirm(`Delete preset "${selected}"?`)) {
      delete userPresets[selected];
      saveUserPresets();
      buildMenu();
      menu.value = "All Defaults";
      applyPreset("All Defaults");
    }
  });

  // Send message to content script to apply preset, and update checkboxes in popup
  function applyPreset(presetName) {
    let labels = userPresets[presetName] || defaultPresets[presetName] || [];
    buildLabelCheckboxes(labels);

    console.log(labels);
    // console.log(labelText);

    // Send message to content script to apply preset to page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "applyPreset",
        presetName,
        labels,
      });
    });
  }

  loadPresets();
});
