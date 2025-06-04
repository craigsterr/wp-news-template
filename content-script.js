// content-script.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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

      const iframe = document.querySelector("iframe#content_ifr");
      if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
        iframe.contentDocument.body.innerHTML = "";
      }
      return;
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

    // Inject content into TinyMCE iframe
    const interval = setInterval(() => {
      const iframe = document.querySelector("iframe#content_ifr");
      if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
        clearInterval(interval);
        iframe.contentDocument.body.innerHTML = `<p>CHAMPAIGN, IL (<a href="https://chambanatoday.com" target="_blank" rel="noopener noreferrer">Chambana Today</a>) - </p>`;
      }
    }, 300);
  }
});
