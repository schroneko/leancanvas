import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>Lean Canvas</title>
        <meta
          name="description"
          content="Create and manage Lean Canvases. All data stored locally in your browser."
        />
        <link rel="stylesheet" href="/styles.css" />
        <meta name="theme-color" content="#0d1117" />
      </head>
      <body>
        <header class="toolbar">
          <div class="toolbar-brand">Lean Canvas</div>
          <input type="text" id="canvasName" class="canvas-name-input" spellcheck={false} />
          <div class="canvas-controls">
            <select id="canvasSelector" aria-label="Select canvas"></select>
            <button id="newCanvasBtn" class="btn btn-primary" type="button">
              New
            </button>
            <button id="deleteCanvasBtn" class="btn btn-danger" type="button">
              Delete
            </button>
          </div>
        </header>
        <main class="canvas-container">
          <div class="canvas-grid">
            <div class="block" data-block="problem">
              <h3>Problem</h3>
              <div
                class="block-content"
                contenteditable="plaintext-only"
                data-placeholder="Top 3 problems"
              ></div>
            </div>
            <div class="block" data-block="solution">
              <h3>Solution</h3>
              <div
                class="block-content"
                contenteditable="plaintext-only"
                data-placeholder="Top 3 features"
              ></div>
            </div>
            <div class="block" data-block="key-metrics">
              <h3>Key Metrics</h3>
              <div
                class="block-content"
                contenteditable="plaintext-only"
                data-placeholder="Key activities you measure"
              ></div>
            </div>
            <div class="block" data-block="uvp">
              <h3>Unique Value Proposition</h3>
              <div
                class="block-content"
                contenteditable="plaintext-only"
                data-placeholder="Single, clear, compelling message"
              ></div>
            </div>
            <div class="block" data-block="unfair-advantage">
              <h3>Unfair Advantage</h3>
              <div
                class="block-content"
                contenteditable="plaintext-only"
                data-placeholder="Can't be easily copied or bought"
              ></div>
            </div>
            <div class="block" data-block="channels">
              <h3>Channels</h3>
              <div
                class="block-content"
                contenteditable="plaintext-only"
                data-placeholder="Path to customers"
              ></div>
            </div>
            <div class="block" data-block="customer-segments">
              <h3>Customer Segments</h3>
              <div
                class="block-content"
                contenteditable="plaintext-only"
                data-placeholder="Target customers"
              ></div>
            </div>
            <div class="block" data-block="cost-structure">
              <h3>Cost Structure</h3>
              <div
                class="block-content"
                contenteditable="plaintext-only"
                data-placeholder="Customer acquisition costs, distribution costs, hosting, people, etc."
              ></div>
            </div>
            <div class="block" data-block="revenue-streams">
              <h3>Revenue Streams</h3>
              <div
                class="block-content"
                contenteditable="plaintext-only"
                data-placeholder="Revenue model, lifetime value, revenue, gross margin"
              ></div>
            </div>
          </div>
        </main>
        <script src="/app.js"></script>
      </body>
    </html>,
  );
});

export default app;
