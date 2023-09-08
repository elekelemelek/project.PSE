document.addEventListener("DOMContentLoaded", () => {
  fetchUserDataAndInitialize();
});

// variables
const serverUrl = "http://localhost:3000/userActions";

// downloading data from the random-data-api
function fetchUserData() {
  const url = new URL(`https://random-data-api.com/api/v2/users`);
  let params = new URLSearchParams();

  params.set("size", 1);
  params.set("response_type", "json");
  url.search = params;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Bad things happened");
      return response.json();
    })
    .then((user) => {
      buildUserHTML(user);
      trackScrollAndLoad(user);
    })
    .catch(console.warn);
}

async function fetchUserDataAndInitialize() {
  const user = await fetchUserData();
  if (!user) {
    return;
  }
  buildUserHTML(user);
  trackScrollAndLoad(user);
}

// generating HTML structure
function buildUserHTML(user) {
  // Creates a user card
  const html = `
    <div class="card" data-ref="${user.id}">
      <img src="${user.avatar}" alt="User Avatar" />
    </div>
  `;

  // Create a temporary element to hold the HTML
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;
  // Find the card element in the temporary element
  const generatedElement = tempElement.querySelector(".card");

  //Generates 20 lines of text 20 lines each
  const main = document.querySelector("main");
  for (let i = 1; i <= 20; i++) {
    const paragraph = document.createElement("p");
    for (let j = 1; j <= 20; j++) {
      paragraph.innerText += `Line ${j} `;
    }
    main.appendChild(paragraph);

    //Injects avatar after 10 lines of text
    if (i === 10) {
      main.appendChild(generatedElement.cloneNode(true));
    }
  }
}

// checking if avatar is visible
function isAvatarInViewport() {
  const avatarElement = document.querySelector(".card[data-ref]");
  if (!avatarElement) {
    return false;
  }

  const rect = avatarElement.getBoundingClientRect();

  // Set the threshold of avatar visibility to 1, so the scroll counts only if whole avatar is visible
  const threshold = 1;

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) *
        threshold &&
    rect.right <=
      (window.innerWidth || document.documentElement.clientWidth) * threshold
  );
}

// tracking scroll and load data and pushing them to the server
async function trackScrollAndLoad(user) {
  if (isAvatarInViewport()) {
    const avatarScrollData = {
      type: "avatarScroll",
      userId: user.id,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(avatarScrollData),
      });

      if (response.ok) {
        console.log("Avatar scroll data sent successfully");
      } else {
        console.error("Failed to send avatar scroll data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const pageLoadData = {
    type: "pageLoad",
    userId: user.id,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pageLoadData),
    });

    if (response.ok) {
      console.log("Page load data sent successfully");
    } else {
      console.error("Failed to send page load data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
