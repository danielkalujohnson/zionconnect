
"use strict";

// ============================================
// ZIONCONNECT — MAIN JAVASCRIPT
// ============================================

// Save and load information in this browser.
const DETAILS_KEY = "zionConnectDetails";
const TASKS_KEY = "zionConnectTasks";

// ============================================
// HELPER FUNCTIONS
// ============================================

// Safely read saved details.
function getSavedDetails() {
  try {
    const saved = localStorage.getItem(DETAILS_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Could not load saved details:", error);
    return null;
  }
}

// Show a message inside a form.
function displayFormMessage(form, message) {
  let messageBox = form.querySelector(".form-message");

  if (!messageBox) {
    messageBox = document.createElement("p");
    messageBox.className = "form-message";
    messageBox.setAttribute("role", "status");
    form.appendChild(messageBox);
  }

  messageBox.textContent = message;
}

// ============================================
// 1. PASSWORD SHOW/HIDE BUTTONS
// ============================================

function initializePasswordToggles() {
  const toggleButtons =
    document.querySelectorAll(".toggle-password");

  toggleButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const targetId = button.dataset.target;
      const passwordInput = document.getElementById(targetId);

      if (!passwordInput) return;

      const isHidden = passwordInput.type === "password";

      passwordInput.type = isHidden ? "text" : "password";

      button.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
      );
    });
  });
}

// ============================================
// 2. SIGN-UP FORM
// ============================================

function initializeSignupForm() {
  const signupForm = document.getElementById("signupForm");

  if (!signupForm) return;

  const passwordInput = document.getElementById("password");
  const confirmPasswordInput =
    document.getElementById("confirmPassword");

  function checkPasswords() {
    if (!passwordInput || !confirmPasswordInput) return;

    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.setCustomValidity(
        "Your passwords do not match."
      );
    } else {
      confirmPasswordInput.setCustomValidity("");
    }
  }

  if (passwordInput && confirmPasswordInput) {
    passwordInput.addEventListener("input", checkPasswords);
    confirmPasswordInput.addEventListener("input", checkPasswords);
  }

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    checkPasswords();

    if (!signupForm.reportValidity()) return;

    // This prototype does not create a real account.
    window.location.href = "details.html";
  });
}

// ============================================
// 3. MISSIONARY DETAILS FORM
// ============================================

function initializeDetailsForm() {
  const detailsForm = document.getElementById("detailsForm");

  if (!detailsForm) return;

  const missionFields = document.getElementById("missionFields");
  const preparationFields =
    document.getElementById("preparationFields");

  const missionName = document.getElementById("missionName");
  const missionCountry = document.getElementById("missionCountry");
  const mtcDate = document.getElementById("mtcDate");

  const preparationStage =
    document.getElementById("preparationStage");

  const callOptions = document.querySelectorAll(
    'input[name="hasCall"]'
  );

  function updateDetailsFields() {
    const selectedCall = document.querySelector(
      'input[name="hasCall"]:checked'
    );

    const hasCall = selectedCall ? selectedCall.value : "";

    if (missionFields) {
      missionFields.hidden = hasCall !== "yes";
    }

    if (preparationFields) {
      preparationFields.hidden = hasCall !== "no";
    }

    if (missionName) {
      missionName.required = hasCall === "yes";
    }

    if (missionCountry) {
      missionCountry.required = hasCall === "yes";
    }

    if (mtcDate) {
      mtcDate.required = hasCall === "yes";
    }

    if (preparationStage) {
      preparationStage.required = hasCall === "no";
    }
  }

  callOptions.forEach(function (option) {
    option.addEventListener("change", updateDetailsFields);
  });

  updateDetailsFields();

  detailsForm.addEventListener("submit", function (event) {
    event.preventDefault();

    updateDetailsFields();

    if (!detailsForm.reportValidity()) return;

    const selectedCall = document.querySelector(
      'input[name="hasCall"]:checked'
    );

    if (!selectedCall) {
      displayFormMessage(
        detailsForm,
        "Please select whether you have received your mission call."
      );
      return;
    }

    const hasCall = selectedCall.value;

    const details = {
      name:
        detailsForm.elements["missionaryName"]?.value.trim() || "",

      gender: detailsForm.elements["gender"]?.value || "",

      age: detailsForm.elements["age"]?.value || "",

      hasCall: hasCall,

      missionName:
        hasCall === "yes"
          ? missionName?.value.trim() || ""
          : "",

      missionCountry:
        hasCall === "yes"
          ? missionCountry?.value.trim() || ""
          : "",

      mtcDate:
        hasCall === "yes"
          ? mtcDate?.value || ""
          : "",

      language:
        hasCall === "yes"
          ? detailsForm.elements["language"]?.value.trim() || ""
          : "",

      preparationStage:
        hasCall === "no"
          ? preparationStage?.value || ""
          : ""
    };

    try {
      localStorage.setItem(DETAILS_KEY, JSON.stringify(details));
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("Could not save details:", error);

      displayFormMessage(
        detailsForm,
        "Your details could not be saved in this browser. Please check your browser settings."
      );
    }
  });
}

// ============================================
// 4. DASHBOARD WELCOME AND MISSION DETAILS
// ============================================

function initializeDashboard() {
  const welcomeHeading = document.getElementById("welcomeHeading");
  const cardWelcomeHeading =
  document.getElementById("cardWelcomeHeading");

  // If this is not the dashboard page, do nothing.
  if (!welcomeHeading) return;

  const welcomeMessage = document.getElementById("welcomeMessage");
  const missingDetails = document.getElementById("missingDetails");
  const countdownCard = document.getElementById("countdownCard");
  const countdownNumber = document.getElementById("countdownNumber");
  const countdownMessage =
    document.getElementById("countdownMessage");

  const missionSummary = document.getElementById("missionSummary");
  const missionInfoCard = document.getElementById("missionInfoCard");
  const missionInfo = document.getElementById("missionInfo");
  const languageInfo = document.getElementById("languageInfo");

  const preparationCard =
    document.getElementById("preparationCard");

  const preparationMessage =
    document.getElementById("preparationMessage");

  // Open dashboard.html?demo=true to view example content.
  const demoMode =
    new URLSearchParams(window.location.search).get("demo") === "true";

  const demoDetails = {
    name: "Alex",
    gender: "Elder",
    hasCall: "yes",
    missionName: "Toronto Mission",
    missionCountry: "Canada",
    mtcDate: "",
    language: "English",
    preparationStage: ""
  };

  const details =
    getSavedDetails() || (demoMode ? demoDetails : null);

  if (missingDetails) {
    missingDetails.hidden = Boolean(details);
  }

  if (!details) {
    welcomeHeading.textContent = "Welcome to ZionConnect!";

    if (welcomeMessage) {
      welcomeMessage.textContent =
        "Enter your details to receive guidance for your preparation journey.";
    }

    if (countdownCard) countdownCard.hidden = true;
    if (missionInfoCard) missionInfoCard.hidden = true;
    if (preparationCard) preparationCard.hidden = true;

    return;
  }

  
  const fullName = String(details.name || "").trim();

  const nameParts = fullName.split(/\s+/).filter(Boolean);

  const lastName = nameParts.length > 1
    ? nameParts[nameParts.length - 1]
    : "";

  const savedGender = String(details.gender || "").trim().toLowerCase();

  let greeting = "Missionary";

  if (savedGender === "elder") {
    greeting = "Elder";
  } else if (savedGender === "sister") {
    greeting = "Sister";
  }


 
const personalizedGreeting = lastName
  ? `Hello, ${greeting} ${lastName}!`
  : `Hello, ${greeting}!`;

welcomeHeading.textContent = personalizedGreeting;

if (cardWelcomeHeading) {
  cardWelcomeHeading.textContent = personalizedGreeting;
}



  if (welcomeMessage) {
    welcomeMessage.textContent =
      "Your preparation journey is underway. Take one step at a time.";
  }

  if (details.hasCall === "yes") {
    if (countdownCard) countdownCard.hidden = false;
    if (missionInfoCard) missionInfoCard.hidden = false;
    if (preparationCard) preparationCard.hidden = true;

    if (missionSummary) {
      missionSummary.textContent = details.missionName
        ? `Mission: ${details.missionName}`
        : `Assigned country: ${details.missionCountry || "Not entered yet"}`;
    }

    if (missionInfo) {
      missionInfo.textContent =
        `Mission: ${details.missionName || "Not entered"} | Country: ${details.missionCountry || "Not entered"}`;
    }

    if (languageInfo) {
      languageInfo.textContent =
        `Language: ${details.language || "Not specified"}`;
    }

    if (countdownNumber && countdownMessage) {
      if (!details.mtcDate) {
        countdownNumber.textContent = "—";
        countdownMessage.textContent =
          "Add your MTC date to see your countdown.";
      } else {
        const targetDate = new Date(details.mtcDate + "T00:00:00");
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(targetDate.getTime())) {
          countdownNumber.textContent = "—";
          countdownMessage.textContent =
            "Please check the MTC date in your details.";
        } else {
          const difference = targetDate.getTime() - today.getTime();

          const daysLeft = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
          );

          if (daysLeft > 0) {
            countdownNumber.textContent = daysLeft;
            countdownMessage.textContent = "days until your MTC";
          } else if (daysLeft === 0) {
            countdownNumber.textContent = "Today!";
            countdownMessage.textContent =
              "Your MTC date is today.";
          } else {
            countdownNumber.textContent = "Started";
            countdownMessage.textContent =
              "Your entered MTC date has passed.";
          }
        }
      }
    }
  } else {
    if (countdownCard) countdownCard.hidden = true;
    if (missionInfoCard) missionInfoCard.hidden = true;
    if (preparationCard) preparationCard.hidden = false;

    const stageMessages = {
      considering:
        "Learn about missionary service, reflect on your goals, and speak with trusted Church leaders.",

      speaking:
        "Continue conversations with your Church leaders and learn about the preparation process.",

      preparing:
        "Build consistent spiritual habits and work on practical preparation one step at a time.",

      waiting:
        "While waiting for your call, keep learning, serving, and strengthening your daily habits."
    };

    if (preparationMessage) {
      preparationMessage.textContent =
        stageMessages[details.preparationStage] ||
        "Build good habits, learn about missionary service, and speak with your Church leaders.";
    }
  }
}

// ============================================
// 5. PREPARATION CHECKLIST AND PROGRESS
// ============================================

function initializePreparationChecklist() {
  const tasks = Array.from(
    document.querySelectorAll(".preparation-task")
  );

  // If the page has no checklist, do nothing.
  if (tasks.length === 0) return;

  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  // Find the status label for each checkbox.
  function getTaskStatus(task) {
    const taskItem = task.closest(".task-item");

    if (taskItem) {
      const status = taskItem.querySelector(".task-status");
      if (status) return status;
    }

    // Fallback: look in the checkbox's parent label or list item.
    const parent = task.closest("label") || task.parentElement;
    const listItem = task.closest("li");

    return (
      parent?.querySelector(".task-status") ||
      listItem?.querySelector(".task-status") ||
      null
    );
  }

  // Update Pending/Completed for one task.
  function updateTaskStatus(task) {
    const status = getTaskStatus(task);

    if (!status) {
      console.warn(
        "No .task-status element was found for a checklist checkbox:",
        task
      );
      return;
    }

    if (task.checked) {
      status.textContent = "✓ Completed";
    } else {
      status.textContent = "Pending";
    }
  }

  // Load previously checked tasks.
  function loadTasks() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(TASKS_KEY) || "[]"
      );

      tasks.forEach(function (task, index) {
        task.checked = saved.includes(index);
      });
    } catch (error) {
      console.error("Could not load checklist:", error);
    }
  }

  // Update progress and save the checked tasks.
  function updateProgress() {
    const completed = tasks.filter(function (task) {
      return task.checked;
    }).length;

    const percentage = Math.round(
      (completed / tasks.length) * 100
    );

    if (progressBar) {
      progressBar.style.width = percentage + "%";
      progressBar.setAttribute("aria-valuenow", percentage);
    }

    if (progressText) {
      progressText.textContent =
        `${completed} of ${tasks.length} tasks completed (${percentage}%)`;
    }

    try {
      const checkedIndexes = tasks
        .map(function (task, index) {
          return task.checked ? index : -1;
        })
        .filter(function (index) {
          return index !== -1;
        });

      localStorage.setItem(
        TASKS_KEY,
        JSON.stringify(checkedIndexes)
      );
    } catch (error) {
      console.error("Could not save checklist:", error);
    }
  }

  // Set the saved checkbox states first.
  loadTasks();

  // Update every status label when the page opens.
  tasks.forEach(function (task) {
    updateTaskStatus(task);

    // THIS IS THE IMPORTANT FIX:
    // Update the status and progress whenever a checkbox changes.
    task.addEventListener("change", function () {
      updateTaskStatus(task);
      updateProgress();
    });
  });

  // Show the correct progress when the page first opens.
  updateProgress();
}




 // ============================================
 // PROFILE MENU
 // ============================================

function initializeProfileMenu() {
  const profileButton = document.getElementById("profileButton");
  const profileMenu = document.getElementById("profileMenu");

  if (!profileButton || !profileMenu) return;

  profileButton.addEventListener("click", function () {
    const isOpen =
      profileButton.getAttribute("aria-expanded") === "true";

    profileMenu.hidden = isOpen;

    profileButton.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );
  });

  document.addEventListener("click", function (event) {
    if (
      !profileButton.contains(event.target) &&
      !profileMenu.contains(event.target)
    ) {
      profileMenu.hidden = true;

      profileButton.setAttribute("aria-expanded", "false");
    }
  });
}



// ============================================
// 6. SIGN OUT BUTTON
// ============================================

function initializeLogoutButton() {
  const logoutButton = document.getElementById("logoutButton");

  if (!logoutButton) return;

  logoutButton.addEventListener("click", function () {
    // This prototype does not have real user accounts.
    window.location.href = "login.html";
  });
}

// ============================================
// 7. START THE APP
// ============================================

function initializeApp() {
  initializePasswordToggles();
  initializeSignupForm();
  initializeDetailsForm();
  initializeDashboard();
  initializePreparationChecklist();
  initializeLogoutButton();
  initializeProfileMenu();
}

document.addEventListener("DOMContentLoaded", initializeApp);




function initializeProfilePicture() {
  const profileInput = document.getElementById("profilePictureInput");
  const profilePreview = document.getElementById("profilePreview");
  const saveButton = document.getElementById("saveProfilePicture");
  const profileMessage = document.getElementById("profileMessage");
  const headerPicture = document.getElementById("headerProfilePicture");

  const PICTURE_KEY = "zionConnectProfilePicture";

  // Show the saved picture when the page opens.
  const savedPicture = localStorage.getItem(PICTURE_KEY);

  if (savedPicture) {
    if (profilePreview) profilePreview.src = savedPicture;
    if (headerPicture) headerPicture.src = savedPicture;
  }

  // Let the user preview a selected picture.
  if (profileInput && profilePreview) {
    profileInput.addEventListener("change", function () {
      const file = profileInput.files[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        profileMessage.textContent = "Please choose an image file.";
        profileInput.value = "";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        profileMessage.textContent =
          "Please choose an image smaller than 2 MB.";
        profileInput.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onload = function () {
        profilePreview.src = reader.result;
        profileMessage.textContent =
          "Preview ready. Click Save Picture to keep it.";
      };

      reader.readAsDataURL(file);
    });
  }

  // Save the picture in this browser.
  if (saveButton && profileInput) {
    saveButton.addEventListener("click", function () {
      const file = profileInput.files[0];

      if (!file) {
        if (savedPicture) {
          profileMessage.textContent = "Your picture is already saved.";
        } else {
          profileMessage.textContent = "Please choose a picture first.";
        }
        return;
      }

      if (!file.type.startsWith("image/") ||
          file.size > 2 * 1024 * 1024) {
        profileMessage.textContent =
          "Choose a valid image smaller than 2 MB.";
        return;
      }

      const reader = new FileReader();

      reader.onload = function () {
        try {
          localStorage.setItem(PICTURE_KEY, reader.result);

          if (profilePreview) profilePreview.src = reader.result;
          if (headerPicture) headerPicture.src = reader.result;

          profileMessage.textContent = "Profile picture saved!";
        } catch (error) {
          profileMessage.textContent =
            "Storage is full. Try a smaller picture.";
        }
      };

      reader.readAsDataURL(file);
    });
  }
}

// Run the picture feature on pages that include app.js.
initializeProfilePicture();
