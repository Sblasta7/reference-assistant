import { getActiveTabURL } from "./utils.js";


const addNewReference = (references, reference) => {
  const bookmarkTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");

  bookmarkTitleElement.textContent = reference;
  bookmarkTitleElement.className = "reference-title";
  controlsElement.className = "reference-controls";

  setBookmarkAttributes("delete", OnTest, controlsElement);
  
  // newBookmarkElement.id = "reference-" + "";
  newBookmarkElement.className = "reference";

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  references.appendChild(newBookmarkElement);
};


const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

const viewReferences = (currentReferences=[]) => {
  const referenceElement = document.getElementById("references");
  referenceElement.innerHTML = "";

  if (currentReferences.length > 0) {
    for (let i = 0; i < currentReferences.length; i++) {
      const reference = currentReferences[i];
      addNewReference(referenceElement, reference);
    }
  } else {
    referenceElement.innerHTML = '<i class="row">No references to show</i>';
  }

  return;
};


const OnAdd = async e => {
  const activeTab = await getActiveTabURL();
  console.log(activeTab);
  chrome.tabs.sendMessage(activeTab.id, {
    type: 'ADD',
    urlId: activeTab.url
  });
};

const OnTest = async e => {
  const activeTab = await getActiveTabURL();
  console.log(activeTab);

  const queryParameters = activeTab.url.split('?')[1];
  const urlParameters = new URLSearchParams(queryParameters);
          
  chrome.tabs.sendMessage(activeTab.id, {
    type: 'ADD',
    urlId: urlParameters.get('v')
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    let currentVideoBookmarks = ['test 1', 'test 2', 'test 3'];

    let container = document.getElementById('container');
    setBookmarkAttributes('save', OnAdd, container)
    viewReferences(currentVideoBookmarks);
    
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
  }
});


// document.addEventListener("DOMContentLoaded", async () => {
//   const activeTab = await getActiveTabURL();
//   console.log(activeTab);

//   // Function to send a message to the content script
//   const sendMessageToContentScript = (tabId, message) => {
//     chrome.tabs.sendMessage(tabId, message, (response) => {
//       console.log("Message sent to content script:", response);
//     });
//   };

//   // Query active tab
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     const activeTab = tabs[0];
//     if (activeTab) {
//       // Send a message to the content script when the tab is found
//       sendMessageToContentScript(activeTab.id, {
//         type: "ADD",
//         urlId: activeTab.url,
//       });
//     } else {
//       console.error("No active tab found.");
//     }
//   });
// });


