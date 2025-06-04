window.addEventListener("load", () => {
  // Default presets (same as before)
  const presets = {
    "All Defaults": {
      labels: [
        "ZZZ App Top Srories",
        "Community",
        "Chambana Today",
        "Metro Services",
      ],
      tags: "Chambana Today, News",
      photographer: "Metro Creative Connection",
      content: `<p>CHAMPAIGN, IL (<a href="https://chambanatoday.com" target="_blank" rel="noopener noreferrer">Chambana Today</a>) - </p>`,
    },
    "News Only": {
      labels: ["Chambana Today", "Community"],
      tags: "Chambana Today, News",
      photographer: "Metro Creative Connection",
      content: `<p>CHAMPAIGN, IL (<a href="https://chambanatoday.com" target="_blank" rel="noopener noreferrer">Chambana Today</a>) - </p>`,
    },
    "Metro Services Only": {
      labels: ["Metro Services"],
      tags: "Metro Creative Connection",
      photographer: "Metro Creative Connection",
      content: `<p>CHAMPAIGN, IL (<a href="https://chambanatoday.com" target="_blank" rel="noopener noreferrer">Chambana Today</a>) - </p>`,
    },
  };

  // Load user presets and merge
  const userPresetsRaw = localStorage.getItem("userPresets") || "{}";
  const userPresets = JSON.parse(userPresetsRaw);
  Object.assign(presets, userPresets);

  // Create toggle button
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Toggle Presets";
  toggleBtn.style.position = "fixed";
  toggleBtn.style.top = "10px";
  toggleBtn.style.left = "50%";
  toggleBtn.style.transform = "translateX(-50%)";
  toggleBtn.style.zIndex = 10000;
  toggleBtn.style.padding = "6px 12px";
  toggleBtn.style.fontSize = "14px";
  toggleBtn.style.cursor = "pointer";
  document.body.appendChild(toggleBtn);

  // Container for presets UI
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "50px"; // below toggle button
  container.style.left = "50%";
  container.style.transform = "translateX(-50%)";
  container.style.background = "#fff";
  container.style.border = "1px solid #ccc";
  container.style.padding = "10px 20px";
  container.style.zIndex = 9999;
  container.style.fontSize = "14px";
  container.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.gap = "10px";
  document.body.insertBefore(container, document.body.firstChild);

  // Toggle container visibility on button click
  toggleBtn.addEventListener("click", () => {
    if (container.style.display === "none") {
      container.style.display = "flex";
    } else {
      container.style.display = "none";
    }
  });

  // Create dropdown menu
  const menu = document.createElement("select");
  menu.id = "defaultPresetsMenu";
  for (const presetName in presets) {
    const option = document.createElement("option");
    option.value = presetName;
    option.textContent = presetName;
    menu.appendChild(option);
  }
  container.appendChild(menu);

  // Create form for new preset
  const form = document.createElement("form");
  form.style.display = "flex";
  form.style.flexDirection = "column";
  form.style.alignItems = "center";
  form.style.gap = "6px";
  container.appendChild(form);

  // Preset name input
  const presetNameInput = document.createElement("input");
  presetNameInput.type = "text";
  presetNameInput.placeholder = "New Preset Name";
  presetNameInput.style.padding = "5px";
  presetNameInput.style.fontSize = "14px";
  presetNameInput.style.width = "200px";
  form.appendChild(presetNameInput);

  // Labels container (checkboxes)
  const labels = [
    "ZZZ App Top Srories",
    "Community",
    "Chambana Today",
    "Metro Services",
  ];
  const labelsContainer = document.createElement("div");
  labelsContainer.style.display = "flex";
  labelsContainer.style.flexWrap = "wrap";
  labelsContainer.style.justifyContent = "center";
  labelsContainer.style.gap = "8px";
  form.appendChild(labelsContainer);

  labels.forEach((labelText) => {
    const label = document.createElement("label");
    label.style.userSelect = "none";
    label.style.fontSize = "13px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "labelCheckbox";
    checkbox.value = labelText;
    checkbox.style.marginRight = "4px";

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(labelText));
    labelsContainer.appendChild(label);
  });

  // Save button
  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.textContent = "Save Preset";
  saveBtn.style.padding = "6px 12px";
  saveBtn.style.fontSize = "14px";
  saveBtn.style.cursor = "pointer";
  form.appendChild(saveBtn);

  // Helper to add preset to menu
  function addPresetToMenu(presetName) {
    const option = document.createElement("option");
    option.value = presetName;
    option.textContent = presetName;
    menu.appendChild(option);
  }

  // Get editor content
  function getEditorContent() {
    const iframe = document.querySelector("iframe#content_ifr");
    if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
      return iframe.contentDocument.body.innerHTML;
    }
    return "";
  }

  // Set editor content
  function setEditorContent(html) {
    const interval = setInterval(() => {
      const iframe = document.querySelector("iframe#content_ifr");
      if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
        clearInterval(interval);
        iframe.contentDocument.body.innerHTML = html;
      }
    }, 300);
  }

  // Save preset handler
  saveBtn.addEventListener("click", () => {
    const name = presetNameInput.value.trim();
    if (!name) {
      alert("Please enter a preset name.");
      return;
    }

    const checkedLabels = [];
    document.querySelectorAll("label.selectit").forEach((label) => {
      const checkbox = label.querySelector("input[type='checkbox']");
      if (checkbox && checkbox.checked) {
        checkedLabels.push(label.textContent.trim());
      }
    });

    if (checkedLabels.length === 0) {
      alert("No checkboxes are currently selected to create a preset.");
      return;
    }

    const tagInput = document.getElementById("new-tag-post_tag");
    const captionBox = document.getElementById(
      "saga_featured_image_photographer"
    );
    const contentHtml = getEditorContent();

    const newPreset = {
      labels: checkedLabels,
      tags: tagInput ? tagInput.value.trim() : "",
      photographer: captionBox ? captionBox.value.trim() : "",
      content:
        contentHtml ||
        `<p>CHAMPAIGN, IL (<a href="https://chambanatoday.com" target="_blank" rel="noopener noreferrer">Chambana Today</a>) - </p>`,
    };

    userPresets[name] = newPreset;
    localStorage.setItem("userPresets", JSON.stringify(userPresets));

    presets[name] = newPreset;
    addPresetToMenu(name);

    menu.value = name;
    presetNameInput.value = "";

    alert(`Preset "${name}" saved with ${checkedLabels.length} labels!`);
    applyPreset(name);
  });

  // Checkbox checking function
  function checkCheckboxByLabelText(targetText) {
    const labelsElements = document.querySelectorAll("label.selectit");
    labelsElements.forEach((label) => {
      const labelText = label.textContent.trim();
      if (labelText === targetText) {
        const checkbox = label.querySelector("input[type='checkbox']");
        if (checkbox) {
          checkbox.checked = true;
          console.log(`Checked checkbox for label: "${labelText}"`);
        }
      }
    });
  }

  // Apply preset function
  function applyPreset(presetName) {
    console.log(`Applying preset: ${presetName}`);
    const preset = presets[presetName];
    if (!preset) {
      console.warn("Preset not found:", presetName);
      return;
    }

    document
      .querySelectorAll("label.selectit input[type='checkbox']")
      .forEach((cb) => {
        cb.checked = false;
      });

    preset.labels.forEach((label) => checkCheckboxByLabelText(label));

    const captionBox = document.getElementById(
      "saga_featured_image_photographer"
    );
    if (captionBox && preset.photographer !== undefined) {
      captionBox.value = preset.photographer;
      console.log("Caption auto-filled with: " + captionBox.value);
    }

    const hourField = document.getElementById("hh");
    if (hourField) {
      let hourNum = parseInt(hourField.value, 10);
      hourNum = (hourNum + 2) % 24;
      hourField.value = String(hourNum).padStart(2, "0");
      console.log("Hour updated to: " + hourField.value);
    }

    const tagInput = document.getElementById("new-tag-post_tag");
    if (tagInput && preset.tags !== undefined) {
      tagInput.value = preset.tags;
      console.log("Tags filled in: " + tagInput.value);
    }

    if (preset.content !== undefined) {
      setEditorContent(preset.content);
    }
  }

  applyPreset("All Defaults");

  menu.addEventListener("change", (e) => {
    applyPreset(e.target.value);
  });
});
