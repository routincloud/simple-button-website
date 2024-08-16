/*
 * Routin Cloud Free Button Sample
 * Alpha V0.2
 * This script dynamically loads stylesheets and JavaScript files, creates and manages buttons and modals on the webpage.
 * It handles button visibility, modal display with specific content based on button data, and form submissions.
 * It fetches URL previews, sets up WhatsApp message functionality, and configures Formspree forms as needed.
 * Additionally, it includes a geolocation script for location-based functionality.
 * The code is designed to be used as a self-contained module with dynamic content and interaction.
 * It integrates dynamically loaded styles, handles different modal types, and manages user interactions.
 * The script ensures smooth transitions and interactions through button clicks and modal management.
 * made for Routin.cloud by @hiddensetup
 */

const scriptElement = document.currentScript;
const baseUrl = new URL(scriptElement.src).origin;

(async function () {
  const data = typeof userData !== "undefined" ? userData : {};

  const stylesheets = [
    "/assets/css/base.css",
    "/assets/css/buttons.css",
    "/assets/css/modal.css",
    "/assets/css/whatsapp.css",
  ];

  stylesheets.forEach((href) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${baseUrl}${href}`;
    document.head.appendChild(link);
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.id = "button-container";

  const mainButtonData = data["main-button"] && data["main-button"][0];
  const floatingBtn = document.createElement("button");
  floatingBtn.id = "floating-button";
  if (mainButtonData) {
    const floatingImg = document.createElement("img");
    floatingImg.src = mainButtonData.url;
    floatingBtn.style.background = mainButtonData.color;
    floatingBtn.appendChild(floatingImg);
  }

  const extraButtonData = data["extra-buttons"] || [];
  const extraButtons = extraButtonData.map((buttonData, index) => {
    const btn = document.createElement("button");
    btn.className = "extra-button";
    btn.id = `button${index + 1}`;
    btn.style.background = buttonData.color || "#ccc";
    const img = document.createElement("img");
    img.src = buttonData.url || "";
    btn.appendChild(img);
    btn.dataset.modalIndex = buttonData["modal-index"] || "";
    btn.dataset.urlPreview = buttonData["url-preview"] || "";
    btn.dataset.linkPreviewApiKey = buttonData["link-preview-api-key"] || "";
    btn.dataset.waMessage = buttonData["wa-message"] || "";
    btn.dataset.waPhoneNumbers = buttonData["wa-phone-numbers"]
      ? JSON.stringify(buttonData["wa-phone-numbers"])
      : "[]";
    btn.dataset.formspreeForm = buttonData["formspree-form"] || "";
    btn.dataset.formspreeSlug = buttonData["formspree-slug"] || "";
    return btn;
  });

  buttonContainer.appendChild(floatingBtn);
  extraButtons.forEach((btn) => buttonContainer.appendChild(btn));
  document.body.appendChild(buttonContainer);

  const modals = [
    {
      id: "modal1",
      content: `
        <div>
          <div id="url-preview" class="preview"></div>
        </div>
      `,
    },
    {
      id: "modal2",
      content: `
        <div>
          <div class="modal-content">
            <h2>WhatsApp Message</h2>
            <textarea id="whatsapp-message" placeholder="Type your message here..."></textarea>
            <div style="margin-bottom: 10px;">
              <select id="whatsapp-select"></select>
            </div>
            <button id="send-whatsapp">Send via WhatsApp</button>
          </div>
        </div>
      `,
    },
    {
      id: "modal3",
      content: `
        <div>
          <h2>Contact Us</h2>
          <form id="formspree-form" method="POST">
            <input type="text" name="name" placeholder="Your Name" required>
            <input type="email" name="email" placeholder="Your Email" required>
            <textarea name="message" placeholder="Your Message" required></textarea>
            <button id="formspree-button" type="submit">Send message</button>
          </form>
        </div>
      `,
    },
  ].map(({ id, content }) => {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = id;
    modal.innerHTML = content;
    return modal;
  });

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  document.body.appendChild(overlay);

  const showModal = (
    id,
    urlPreview,
    linkPreviewApiKey,
    waMessage,
    waPhoneNumbers,
    formspreeForm,
    formspreeSlug
  ) => {
    modals.forEach((modal) => {
      if (modal.id !== id) {
        modal.style.opacity = "0";
        setTimeout(() => {
          modal.style.display = "none";
        }, 300);
      }
    });

    const modal = document.getElementById(id);
    modal.style.display = "block";
    setTimeout(() => (modal.style.opacity = "1"), 10);

    overlay.style.display = "block";
    setTimeout(() => (overlay.style.opacity = "1"), 10);

    if (id === "modal1" && urlPreview && linkPreviewApiKey) {
      fetchUrlPreview(urlPreview, linkPreviewApiKey);
    }

    if (id === "modal2" && waMessage) {
      setupWhatsAppModal(waPhoneNumbers);
    }

    if (id === "modal3" && formspreeForm) {
      setupFormspreeForm(formspreeSlug);
    }
  };

  const fetchUrlPreview = async (url, apiKey) => {
    const previewContainer = document.getElementById("url-preview");

    try {
      const response = await fetch(
        `https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(
          url
        )}`
      );
      const previewData = await response.json();

      if (
        previewData &&
        previewData.image &&
        previewData.title &&
        previewData.description
      ) {
        previewContainer.innerHTML = `
          <img src="${previewData.image}" alt="${previewData.title}">
          <h3>${previewData.title}</h3>
          <p>${previewData.description}</p>
        `;
      } else {
        previewContainer.innerHTML = `
          <h3>Preview Unavailable</h3>
          <p>The URL preview could not be loaded. Please try again later.</p>
        `;
      }
    } catch (error) {
      console.error("Error fetching URL preview:", error);
      previewContainer.innerHTML = `
        <h3>Error</h3>
        <p>There was an error fetching the URL preview. Please try again later.</p>
      `;
    }
  };

  const setupWhatsAppModal = (waPhoneNumbers) => {
    const select = document.getElementById("whatsapp-select");
    const sendButton = document.getElementById("send-whatsapp");
    const messageTextarea = document.getElementById("whatsapp-message");

    select.innerHTML = waPhoneNumbers
      .map(
        (entry) =>
          `<option value="${entry.phone}" data-area="${entry.area}">${entry.area}</option>`
      )
      .join("");

    sendButton.onclick = () => {
      const selectedPhone = select.value;
      const message = encodeURIComponent(messageTextarea.value);
      const whatsappUrl = `https://wa.me/${selectedPhone}?text=${message}`;
      window.open(whatsappUrl, "_blank");
    };
  };

  const setupFormspreeForm = (formspreeSlug) => {
    const form = document.getElementById("formspree-form");
    if (formspreeSlug) {
      form.action = `https://formspree.io/f/${formspreeSlug}`;
    }
  };

  const closeAllModals = () => {
    modals.forEach((modal) => {
      modal.style.opacity = "0";
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    });

    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 300);
  };

  overlay.onclick = closeAllModals;

  modals.forEach((modal) => {
    document.body.appendChild(modal);
  });

  let buttonsVisible = false;

  const toggleExtraButtons = () => {
    if (buttonsVisible) {
      extraButtons.forEach((btn) => {
        btn.style.opacity = "0";
        setTimeout(() => {
          btn.style.display = "none";
        }, 300);
      });
      buttonsVisible = false;
    } else {
      extraButtons.forEach((btn) => {
        btn.style.display = "flex";
        setTimeout(() => {
          btn.style.opacity = "1";
        }, 10);
      });
      buttonsVisible = true;
    }
  };

  floatingBtn.onclick = (event) => {
    event.stopPropagation();
    toggleExtraButtons();
  };

  extraButtons.forEach((btn) => {
    btn.onclick = (event) => {
      event.stopPropagation();
      toggleExtraButtons();
      const modalIndex = btn.dataset.modalIndex;
      const urlPreview = btn.dataset.urlPreview;
      const linkPreviewApiKey = btn.dataset.linkPreviewApiKey;
      const waMessage = btn.dataset.waMessage === "true";
      const waPhoneNumbers = JSON.parse(btn.dataset.waPhoneNumbers || "[]");
      const formspreeForm = btn.dataset.formspreeForm === "true";
      const formspreeSlug = btn.dataset.formspreeSlug;

      if (modalIndex !== undefined) {
        showModal(
          `modal${parseInt(modalIndex)}`,
          urlPreview,
          linkPreviewApiKey,
          waMessage,
          waPhoneNumbers,
          formspreeForm,
          formspreeSlug
        );
      }
    };
  });

  document.body.addEventListener("click", (event) => {
    if (!buttonContainer.contains(event.target) && buttonsVisible) {
      toggleExtraButtons();
    }
  });

  const geoScript = document.createElement("script");
  geoScript.src = `${baseUrl}/assets/js/geolocation.js`; 
  document.head.appendChild(geoScript);
})();
