// content-script.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCheckedLabels") {
    // Collect checked category labels from the page
    const checkedLabels = Array.from(
      document.querySelectorAll("label.selectit input[type='checkbox']:checked")
    ).map((cb) => cb.parentElement.textContent.trim());

    let editorContent = "";
    const iframe = document.querySelector("iframe#content_ifr");
    if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
      editorContent = iframe.contentDocument.body.innerHTML;
    }

    const tagInput = document.getElementById("new-tag-post_tag");
    const photographerInput = document.getElementById(
      "saga_featured_image_photographer"
    );

    const tags = tagInput ? tagInput.value : "";
    const photographer = photographerInput ? photographerInput.value : "";

    sendResponse({ checkedLabels, editorContent, tags, photographer });
    return; // Important: return true if using async, but not needed here
  }

  if (request.action === "applyPreset") {
    const labels = request.labels || [];

    if (!labels.length) {
      // Optionally clear fields
      const captionBox = document.getElementById(
        "saga_featured_image_photographer"
      );
      if (captionBox) captionBox.value = "";

      const hourField = document.getElementById("hh");
      if (hourField) hourField.value = "";

      const tagInput = document.getElementById("new-tag-post_tag");
      if (tagInput) tagInput.value = "";
    }

    // Uncheck all checkboxes first
    document
      .querySelectorAll("label.selectit input[type='checkbox']")
      .forEach((cb) => {
        cb.checked = false;
      });

    // Check the checkboxes matching preset labels
    document.querySelectorAll("label.selectit").forEach((label) => {
      const labelText = label.textContent.trim();
      if (labels.includes(labelText)) {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = true;
      }
    });

    // Set photographer caption
    const captionBox = document.getElementById(
      "saga_featured_image_photographer"
    );
    if (captionBox) captionBox.value = "Metro Creative Connection";

    // Update hour +2
    const hourField = document.getElementById("hh");
    if (hourField) {
      let hourNum = parseInt(hourField.value, 10);
      hourNum = (hourNum + 2) % 24;
      hourField.value = String(hourNum).padStart(2, "0");
    }

    // Set default tags
    const tagInput = document.getElementById("new-tag-post_tag");
    if (tagInput) tagInput.value = "Chambana Today, News";

    // Set photographer caption if provided
    if (request.photographer !== undefined) {
      const captionBox = document.getElementById(
        "saga_featured_image_photographer"
      );
      if (captionBox) captionBox.value = request.photographer;
    }

    // Set tags if provided
    if (request.tags !== undefined) {
      const tagInput = document.getElementById("new-tag-post_tag");
      if (tagInput) tagInput.value = request.tags;
    }

    // Inject content into TinyMCE iframe

    if (request.editorContent) {
      const interval = setInterval(() => {
        const iframe = document.querySelector("iframe#content_ifr");
        if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
          clearInterval(interval);
          iframe.contentDocument.body.innerHTML = request.editorContent;
        }
      }, 300);
    } else if (request.presetName === "All Defaults") {
      // Fallback for All Defaults if no editorContent provided
      const interval = setInterval(() => {
        const iframe = document.querySelector("iframe#content_ifr");
        if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
          clearInterval(interval);
          iframe.contentDocument.body.innerHTML = `<p>CHAMPAIGN, IL (<a href="https://chambanatoday.com" target="_blank" rel="noopener noreferrer">Chambana Today</a>) - </p>`;
        }
      }, 300);
    }
  }
});
