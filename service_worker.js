chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "askOllama") {

    const titles = msg.titles || [];
    // console.log("titles:", JSON.stringify(titles));

    fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "granite4.1:3b",
        stream: false,
        system: "You are a helpful assistant.",
        prompt: `extract the gaming items related titles from this array : ${JSON.stringify(titles)}`
      })
    })
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      sendResponse({
        answer: data.response ?? ""
      });
    })
    .catch((err) => {
      sendResponse({ error: err.message });
    });

    return true;
  }

  if (msg.action === "getTabUrl") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      sendResponse({ url: tabs[0]?.url ?? "" });
    });
    return true;
  }

  if (msg.action === "fetchData") {
    sendResponse([
      { file: "file1.js", code: `<html></html>` },
      { file: "file2.js", code: `<html></html>` }
    ]);
    return true;
  }
});