function injectHighlightJS() {
  if (window.hljs) return;
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('highlight.min.js');
  document.head.appendChild(script);
}

injectHighlightJS();

function insertModalButton() {
    // Prevent duplicate injection
    if (document.getElementById('code-snippets-btn')) return;

    // Find container for YouTube controls
    const controls = document.querySelector('ytd-menu-renderer');
    if (!controls) return;

    // Insert button
    const btn = document.createElement('button');
    btn.id = 'code-snippets-btn';
    btn.innerText = 'Code Snippet';
    btn.onclick = showModal;

    controls.appendChild(btn);
}

function showModal() {

  chrome.runtime.sendMessage({ action: "getTabUrl" }, (response) => {
    if(response.url) console.log("Tab URL:", response.url);
  });

  chrome.runtime.sendMessage({ action: "fetchData" }, (response) => {
    if(response.length) console.log("file:", response[0].file);
  });

  if (document.getElementById('code-snippets-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'code-snippets-modal';

  modal.innerHTML = `
    <div class="code-snippets-modal-content">
      <span id="code-snippets-close">&times;</span>
      <pre><code class="language-javascript"></code></pre>
    </div>
  `;

  document.body.appendChild(modal)

  const codeBlock = modal.querySelector("code")


  codeBlock.textContent = `
function addNumbers(a, b) {
  return a + b;
}

// A dummy class
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log("Hello, my name is Andrew");
  }
}

// A fake async function (simulates API call)
async function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: "Dummy Data Loaded" });
    }, 1000);
  });
}

// Example usage
const sum = addNumbers(5, 7);
console.log("Sum is:", sum);

const user = new User("Alice", 25);
user.sayHello();

fetchData().then((result) => {
  console.log(result.data);
});`;

  document.body.appendChild(modal);

  // Close event
  document.getElementById('code-snippets-close').onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

  // That’s all you need — highlight.js is already loaded!
  window.hljs.highlightAll();
}

// Observe DOM updates for YouTube SPA navigation
const observer = new MutationObserver(insertModalButton);
observer.observe(document.body, { childList: true, subtree: true });

// Initial button attempt
setTimeout(insertModalButton, 2000);
