// Import Alpine.js
import 'alpinejs';

// Helper
import mediumZoom from 'medium-zoom';

// Import Cruip utilities
import { focusHandling } from 'cruip-js-toolkit';

// Import aos
import AOS from 'aos';

// Import Swiper
// import Swiper, { Autoplay, Navigation } from 'swiper';
// import 'swiper/swiper-bundle.css';

// mediumZoom('[data-zoomable]')
mediumZoom(document.querySelectorAll('.data-zoomable'), {
  margin: 24, /* The space outside the zoomed image */
  scrollOffset: 40, /* The number of pixels to scroll to close the zoom */
  container: null, /* The viewport to render the zoom in */
  template: null, /* The template element to display on zoom */
  background: 'rgba(0, 0, 0, 0.8)'
});

AOS.init({
  once: true,
  disable: 'phone',
  duration: 750,
  easing: 'ease-out-quart',
});

// Swiper.use([Autoplay, Navigation]);
// // eslint-disable-next-line no-unused-vars
// const carousel = new Swiper('.carousel', {
//   slidesPerView: 'auto',
//   grabCursor: true,
//   loop: true,
//   centeredSlides: true,
//   initialSlide: 1,
//   spaceBetween: 24,
//   autoplay: {
//     delay: 7000,
//   },
//   navigation: {
//     nextEl: '.carousel-next',
//     prevEl: '.carousel-prev',
//   },
// });

// import component from './components/component';

document.addEventListener('DOMContentLoaded', () => {
  focusHandling('outline');
});

// Light switcher
// const lightSwitches = document.querySelectorAll('.light-switch');
// if (lightSwitches.length > 0) {
//   lightSwitches.forEach((lightSwitch, i) => {
//     if (localStorage.getItem('dark-mode') === 'true' || !('dark-mode' in localStorage)) {
//       // eslint-disable-next-line no-param-reassign
//       lightSwitch.checked = true;
//     }
//     lightSwitch.addEventListener('change', () => {
//       const { checked } = lightSwitch;
//       lightSwitches.forEach((el, n) => {
//         if (n !== i) {
//           // eslint-disable-next-line no-param-reassign
//           el.checked = checked;
//         }
//       });
//       if (lightSwitch.checked) {
//         document.documentElement.classList.add('dark');
//         localStorage.setItem('dark-mode', true);
//       } else {
//         document.documentElement.classList.remove('dark');
//         localStorage.setItem('dark-mode', false);
//       }
//     });
//   });
// }

// Code snip copy button
function createCopyButton(highlightDiv) {
  const button = document.createElement("button");
  button.className = "copy-code-button";
  button.type = "button";
  button.innerText = "Copy";
  button.addEventListener("click", () =>
    copyCodeToClipboard(button, highlightDiv)
  );
  addCopyButtonToDom(button, highlightDiv);
}

async function copyCodeToClipboard(button, highlightDiv) {
  const codeToCopy = highlightDiv.querySelector(":last-child > .chroma > code")
    .innerText;
  try {
    result = await navigator.permissions.query({ name: "clipboard-write" });
    if (result.state == "granted" || result.state == "prompt") {
      await navigator.clipboard.writeText(codeToCopy);
    } else {
      copyCodeBlockExecCommand(codeToCopy, highlightDiv);
    }
  } catch (_) {
    copyCodeBlockExecCommand(codeToCopy, highlightDiv);
  } finally {
    codeWasCopied(button);
  }
}

function copyCodeBlockExecCommand(codeToCopy, highlightDiv) {
  const textArea = document.createElement("textArea");
  textArea.contentEditable = "true";
  textArea.readOnly = "false";
  textArea.className = "copyable-text-area";
  textArea.value = codeToCopy;
  highlightDiv.insertBefore(textArea, highlightDiv.firstChild);
  const range = document.createRange();
  range.selectNodeContents(textArea);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  textArea.setSelectionRange(0, 999999);
  document.execCommand("copy");
  highlightDiv.removeChild(textArea);
}

function codeWasCopied(button) {
  button.blur();
  button.innerText = "Copied!";
  setTimeout(function () {
    button.innerText = "Copy";
  }, 2000);
}

function addCopyButtonToDom(button, highlightDiv) {
  highlightDiv.insertBefore(button, highlightDiv.firstChild);
  const wrapper = document.createElement("div");
  wrapper.className = "highlight-wrapper";
  highlightDiv.parentNode.insertBefore(wrapper, highlightDiv);
  wrapper.appendChild(highlightDiv);
}

document
  .querySelectorAll(".highlight")
  .forEach((highlightDiv) => createCopyButton(highlightDiv));

// Copy button for the kedge-styled command snippets on the marketing site.
// These don't use the chroma highlighter, so we attach our own button and
// strip the leading "$ " prompt from each line so users paste only the command.
function attachKedgeSnippetCopy(pre) {
  if (pre.dataset.copyInit === "1") return;
  pre.dataset.copyInit = "1";
  pre.classList.add("kedge-code-snippet--with-copy");

  const button = document.createElement("button");
  button.className = "kedge-copy-btn";
  button.type = "button";
  button.setAttribute("aria-label", "Copy command");
  button.innerText = "Copy";
  button.addEventListener("click", () => copyKedgeSnippet(button, pre));
  pre.appendChild(button);
}

async function copyKedgeSnippet(button, pre) {
  const raw = (pre.innerText || pre.textContent || "").replace(/\nCopy$/, "");
  const text = raw
    .split("\n")
    .map((line) => line.replace(/^\s*\$\s+/, ""))
    .filter((line, idx, arr) => !(idx === arr.length - 1 && line === ""))
    .join("\n");
  try {
    await navigator.clipboard.writeText(text);
  } catch (_) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.className = "copyable-text-area";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  const prev = button.innerText;
  button.innerText = "Copied!";
  button.classList.add("is-copied");
  setTimeout(() => {
    button.innerText = prev;
    button.classList.remove("is-copied");
  }, 2000);
}

document
  .querySelectorAll(".kedge-code-snippet")
  .forEach((pre) => attachKedgeSnippetCopy(pre));
