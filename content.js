function insertButton() {
    // Prevent duplicate injection
    if (document.getElementById('ollama-btn')) return;

    // Find container for YouTube controls
    const controls = document.querySelector('.subNavMenu-layer');
    if (!controls) return;

    // Insert button
    const btn = document.createElement('button');
    btn.id = 'ollama-btn';
    btn.innerText = 'Ollama Button';
    btn.onclick = clickButton;

    controls.appendChild(btn);
}

function clickButton() {

  /*chrome.runtime.sendMessage({ action: "fetchData" }, (response) => {
    if(response.length) console.log("file:", response[0].file);
  });*/

  const titles = Array.from(document.querySelectorAll('.thread-title')).map(el => el.innerText.trim())

  console.log("titles:", JSON.stringify(titles));

  chrome.runtime.sendMessage({ action: "askOllama", titles },
    (response) => {
      if (response?.error) {
        console.error(response.error);
        return;
      }

      console.log(response.answer);
    }
  );

}

// Observe DOM updates for YouTube SPA navigation
const observer = new MutationObserver(insertButton);
observer.observe(document.body, { childList: true, subtree: true });

// Initial button attempt
setTimeout(insertButton, 2000);
