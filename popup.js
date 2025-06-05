// popup.js
document.addEventListener("DOMContentLoaded", () => {
  // Default presets
  const defaultPresets = {
    None: [],
    "Champaign Default": {
      labels: [
        "ZZZ App Top Srories",
        "Community",
        "Chambana Today",
        "Metro Services",
        "Saga Communications",
      ],
      photographer: "Metro Creative Connection", // <-- Default photographer
      tags: "Chambana Today, News, Champaign,", // <-- Default tags
      editorContent: `<p>CHAMPAIGN, IL (<a href="https://chambanatoday.com" target="_blank" rel="noopener noreferrer">Chambana Today</a>) - </p>`,
    },
    "Danville Default": {
      labels: [
        "ZZZ App Top Srories",
        "Community",
        "Chambana Today",
        "Metro Services",
        "Saga Communications",
      ],
      photographer: "Metro Creative Connection", // <-- Default photographer
      tags: "Chambana Today, News, Danville,", // <-- Default tags
      editorContent: `<p>DANVILLE, IL (<a href="https://chambanatoday.com" target="_blank" rel="noopener noreferrer">Chambana Today</a>) - </p>`,
    },
    "Chicago Default": {
      labels: [
        "ZZZ App Top Srories",
        "Community",
        "Chambana Today",
        "Metro Services",
        "Saga Communications",
      ],
      photographer: "Metro Creative Connection", // <-- Default photographer
      tags: "Chambana Today, News, Chicago,", // <-- Default tags
      editorContent: `<p>CHICAGO, IL (<a href="https://chambanatoday.com" target="_blank" rel="noopener noreferrer">Chambana Today</a>) - </p>`,
    },
    "Springfield Default": {
      labels: [
        "ZZZ App Top Srories",
        "IL State News",
        "Chambana Today",
        "Metro Services",
        "Saga Communications",
      ],
      photographer: "Metro Creative Connection", // <-- Default photographer
      tags: "Chambana Today, News, Springfield,", // <-- Default tags
      editorContent: `<p>SPRINGFIELD, IL (<a href="https://chambanatoday.com" target="_blank" rel="noopener noreferrer">Chambana Today</a>) - </p>`,
    },
  };
  // UI elements
  const menu = document.getElementById("defaultPresetsMenu");
  const presetNameInput = document.getElementById("presetNameInput");
  const labelsContainer = document.getElementById("labelsContainer");
  const saveBtn = document.getElementById("saveBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  // All possible labels to show as checkboxes
  const allLabels = [
    // "ZZZ App Top Srories",
    // "Community",
    // "Chambana Today",
    // "Metro Services",
  ];

  // User presets stored here
  let userPresets = {};

  // Load presets from chrome.storage or use defaults
  function loadPresets() {
    chrome.storage.local.get(["userPresets"], (result) => {
      userPresets = result.userPresets || {};
      buildMenu();
      buildLabelCheckboxes();
      //   applyPreset(menu.value || "All Defaults");
    });
  }

  // Save userPresets back to storage
  function saveUserPresets() {
    chrome.storage.local.set({ userPresets });
  }

  // Build dropdown menu options from presets + userPresets
  function buildMenu() {
    // Add "None" option
    const noneOption = document.createElement("option");
    noneOption.value = "";
    noneOption.textContent = "None";
    menu.appendChild(noneOption);

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
    // if (!menu.value) menu.value = "All Defaults";
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

    // Save preset to userPresets and storage
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getCheckedLabels" },
        (response) => {
          const checkedLabels =
            response && response.checkedLabels ? response.checkedLabels : [];
          const editorContent =
            response && response.editorContent ? response.editorContent : "";
          const tags = response && response.tags ? response.tags : "";
          const photographer =
            response && response.photographer ? response.photographer : "";

          if (checkedLabels.length === 0) {
            alert(
              "Please select at least one label on the site to save the preset."
            );
            return;
          }

          userPresets[name] = {
            labels: checkedLabels,
            editorContent,
            tags,
            photographer,
          };
          saveUserPresets();
          buildMenu();
          menu.value = name;
          applyPreset(name);
          presetNameInput.value = "";
        }
      );
    });
  });

  deleteBtn.addEventListener("click", () => {
    const presetName = menu.value;

    // Prevent deleting default presets or "None"
    if (
      !presetName ||
      presetName === "None" ||
      defaultPresets.hasOwnProperty(presetName)
    ) {
      alert("You can only delete your own custom presets.");
      return;
    }

    if (!userPresets.hasOwnProperty(presetName)) {
      alert("Please select a user-created preset to delete.");
      return;
    }

    // Remove from userPresets and save
    delete userPresets[presetName];
    saveUserPresets();

    // Rebuild menu and reset selection/UI
    buildMenu();
    menu.value = "None";
    buildLabelCheckboxes([]);
    applyPreset(""); // Clear fields on page

    alert(`Preset "${presetName}" deleted.`);
  });

  // Send message to content script to apply preset, and update checkboxes in popup
  function applyPreset(presetName) {
    let preset = userPresets[presetName] || defaultPresets[presetName];
    let labels = [];
    let editorContent = "";
    let tags = "";
    let photographer = "";

    if (preset) {
      if (Array.isArray(preset)) {
        labels = preset;
      } else {
        labels = preset.labels || [];
        editorContent = preset.editorContent || "";
        tags = preset.tags || "";
        photographer = preset.photographer || "";
      }
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "applyPreset",
        presetName,
        labels,
        editorContent,
        tags,
        photographer,
      });
    });
  }
  loadPresets();

  document.getElementById("plus1Btn").addEventListener("click", () => {
    incrementHour(1);
  });
  document.getElementById("plus2Btn").addEventListener("click", () => {
    incrementHour(2);
  });
  document.getElementById("plus3Btn").addEventListener("click", () => {
    incrementHour(3);
  });

  function incrementHour(amount) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "incrementHour",
        amount,
      });
    });
  }
});
