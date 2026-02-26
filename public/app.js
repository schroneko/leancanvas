(function () {
  "use strict";

  var STORAGE_KEY = "leancanvas_data";
  var BLOCK_KEYS = [
    "problem",
    "solution",
    "key-metrics",
    "uvp",
    "unfair-advantage",
    "channels",
    "customer-segments",
    "cost-structure",
    "revenue-streams",
  ];

  function supportsPlaintextOnly() {
    var div = document.createElement("div");
    div.setAttribute("contenteditable", "plaintext-only");
    return div.contentEditable === "plaintext-only";
  }

  var plaintextOnlySupported = supportsPlaintextOnly();

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function createEmptyCanvas(name) {
    var blocks = {};
    for (var i = 0; i < BLOCK_KEYS.length; i++) {
      blocks[BLOCK_KEYS[i]] = "";
    }
    return {
      id: generateId(),
      name: name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: blocks,
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.canvases && parsed.canvases.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    var canvas = createEmptyCanvas("Untitled Canvas");
    return { activeCanvasId: canvas.id, canvases: [canvas] };
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  var state = loadState();

  var canvasSelector = document.getElementById("canvasSelector");
  var canvasNameInput = document.getElementById("canvasName");
  var newCanvasBtn = document.getElementById("newCanvasBtn");
  var deleteCanvasBtn = document.getElementById("deleteCanvasBtn");
  var blockElements = {};

  function getActiveCanvas() {
    for (var i = 0; i < state.canvases.length; i++) {
      if (state.canvases[i].id === state.activeCanvasId) {
        return state.canvases[i];
      }
    }
    return null;
  }

  function updateDeleteButton() {
    deleteCanvasBtn.disabled = state.canvases.length <= 1;
  }

  function renderCanvasSelector() {
    canvasSelector.innerHTML = "";
    for (var i = 0; i < state.canvases.length; i++) {
      var canvas = state.canvases[i];
      var option = document.createElement("option");
      option.value = canvas.id;
      option.textContent = canvas.name;
      if (canvas.id === state.activeCanvasId) {
        option.selected = true;
      }
      canvasSelector.appendChild(option);
    }
  }

  function renderBlocks() {
    var canvas = getActiveCanvas();
    if (!canvas) return;
    for (var key in blockElements) {
      blockElements[key].textContent = canvas.blocks[key] || "";
    }
  }

  function renderCanvasName() {
    var canvas = getActiveCanvas();
    if (!canvas) return;
    canvasNameInput.value = canvas.name;
  }

  function render() {
    renderCanvasSelector();
    renderCanvasName();
    renderBlocks();
    updateDeleteButton();
  }

  function handleBlockInput(key) {
    var canvas = getActiveCanvas();
    if (!canvas) return;
    canvas.blocks[key] = blockElements[key].textContent || "";
    canvas.updatedAt = new Date().toISOString();
    saveState(state);
  }

  function handleCanvasNameChange() {
    var canvas = getActiveCanvas();
    if (!canvas) return;
    var newName = canvasNameInput.value.trim();
    if (newName && newName !== canvas.name) {
      canvas.name = newName;
      canvas.updatedAt = new Date().toISOString();
      saveState(state);
      renderCanvasSelector();
    }
  }

  function handleCanvasSwitch() {
    state.activeCanvasId = canvasSelector.value;
    saveState(state);
    renderCanvasName();
    renderBlocks();
  }

  function handleNewCanvas() {
    var name = prompt("Canvas name:");
    if (!name) return;
    var canvas = createEmptyCanvas(name.trim() || "Untitled Canvas");
    state.canvases.push(canvas);
    state.activeCanvasId = canvas.id;
    saveState(state);
    render();
  }

  function handleDeleteCanvas() {
    if (state.canvases.length <= 1) return;
    var canvas = getActiveCanvas();
    if (!canvas) return;
    if (!confirm('Delete "' + canvas.name + '"?')) return;
    state.canvases = state.canvases.filter(function (c) {
      return c.id !== canvas.id;
    });
    state.activeCanvasId = state.canvases[0].id;
    saveState(state);
    render();
  }

  function handlePaste(e) {
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, text);
  }

  function init() {
    var blocks = document.querySelectorAll(".block-content");
    for (var i = 0; i < blocks.length; i++) {
      var el = blocks[i];
      var key = el.closest(".block").dataset.block;
      blockElements[key] = el;

      if (!plaintextOnlySupported) {
        el.setAttribute("contenteditable", "true");
      }
    }

    var debounceTimers = {};
    for (var j = 0; j < BLOCK_KEYS.length; j++) {
      (function (key) {
        if (!blockElements[key]) return;
        blockElements[key].addEventListener("input", function () {
          clearTimeout(debounceTimers[key]);
          debounceTimers[key] = setTimeout(function () {
            handleBlockInput(key);
          }, 300);
        });
        if (!plaintextOnlySupported) {
          blockElements[key].addEventListener("paste", handlePaste);
        }
      })(BLOCK_KEYS[j]);
    }

    canvasSelector.addEventListener("change", handleCanvasSwitch);
    canvasNameInput.addEventListener("change", handleCanvasNameChange);
    canvasNameInput.addEventListener("blur", handleCanvasNameChange);
    newCanvasBtn.addEventListener("click", handleNewCanvas);
    deleteCanvasBtn.addEventListener("click", handleDeleteCanvas);

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
