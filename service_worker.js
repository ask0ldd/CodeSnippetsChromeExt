chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getTabUrl") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      sendResponse({ url: tabs[0].url });
    });
    return true; // important! keeps response channel open
  }
});

/*chrome.runtime.onInstalled.addListener(() => {
  fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
      console.log("API Data:", data);
      // Optionally, send data to popup or content script
    });
});*/

// To handle requests from content scripts/popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "fetchData") {
    /*fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => sendResponse(data))*/ // sendResponse : return the expected value
    sendResponse([{file : "file1.js", code : `<html></html>`},{file : "file2.js", code : `<html></html>`}])
    return true; // true : signifies it is an async procedure
  }
});