(function () {
const root = document.getElementById("lesson-root");
const titleNode = document.getElementById("lesson-title");
const subtitleNode = document.getElementById("lesson-subtitle");
const printButton = document.getElementById("print-pdf-btn");
const paperLink = document.getElementById("paper-link-btn");
let previewManifest = {};
let activeLesson = null;
let previewScale = 1;
let activePreviewPage = 1;
let previewOpen = false;
let previewBox = { width: 760, height: 0, left: null, top: 18 };

boot();

async function boot() {
  printButton.addEventListener("click", () => window.print());
  try {
    const params = new URLSearchParams(window.location.search);
    const paperId = params.get("paper") || "";
    const mode = params.get("mode") || "slides";
    const [data, manifest] = await Promise.all([
      fetchJson("../paper-lessons.json"),
      fetchJson("../assets/paper-figures/manifest.json").catch(() => ({}))
    ]);
    previewManifest = manifest || {};
    const lesson = Array.isArray(data.papers) ? data.papers.find((item) => item.id === paperId) : null;
    if (!lesson) {
      renderError(`Cannot find lesson for paper id "${paperId}".`);
      return;
    }
    activeLesson = lesson;
    renderLesson(lesson, mode);
  } catch (error) {
    renderError(error && error.message ? error.message : String(error));
  }
}

function renderLesson(lesson, mode) {
  document.title = `${lesson.title} | Detailed Understand`;
  titleNode.textContent = lesson.title;
  subtitleNode.textContent = lesson.subtitle || "";
  paperLink.href = lesson.link || "#";

  root.className = `lesson-root mode-${mode}`;
  root.classList.add("theme-defense");
  root.innerHTML = renderStandardLessonDeck(lesson);
  bindPreviewButtons();
}

function renderStandardLessonDeck(lesson) {
  const figures = Array.isArray(lesson.figuresToInspect) ? lesson.figuresToInspect.filter(Boolean) : [];
  const figureOne = figures[0] || "Fig. 1";
  const figureTwo = figures[1] || figures[0] || "Fig. 2";
  const fastTakeaways = Array.isArray(lesson.fastTakeaways) ? lesson.fastTakeaways.filter(Boolean) : [];
  const introGuide = Array.isArray(lesson.introGuide) ? lesson.introGuide.filter(Boolean) : [];
  const readingHighlights = Array.isArray(lesson.readingHighlights) ? lesson.readingHighlights.filter(Boolean) : [];
  const methodChecklist = Array.isArray(lesson.methodChecklist) ? lesson.methodChecklist.filter(Boolean) : [];
  const resultsChecklist = Array.isArray(lesson.resultsChecklist) ? lesson.resultsChecklist.filter(Boolean) : [];
  const experimentChecks = Array.isArray(lesson.experimentChecks) && lesson.experimentChecks.length
    ? lesson.experimentChecks.filter(Boolean)
    : resultsChecklist;
  const afterReading = Array.isArray(lesson.afterReading) ? lesson.afterReading.filter(Boolean) : [];
  const thinkingPoints = Array.isArray(lesson.thinkingPoints) ? lesson.thinkingPoints.filter(Boolean) : [];
  const steps = Array.isArray(lesson.steps) ? lesson.steps.filter(Boolean) : [];
  const summaryNotes = lesson.summaryNotes || {};
  const sourceSummary = lesson.sourceSummary || {};
  const comparison = lesson.comparison;
  const paperTags = [
    lesson.venue && lesson.year ? `${lesson.venue} ${lesson.year}` : "",
    lesson.focus || "",
    lesson.category || ""
  ].filter(Boolean);

  return `
    <div class="lesson-main-column lesson-main-column-wide">
      <section class="slide slide-cover slide-defense">
        <div class="cover-main cover-main-full">
          <p class="eyebrow">Seminar presentation</p>
          <h2>${escapeHtml(lesson.title)}</h2>
          <p class="cover-thesis">${escapeHtml(lesson.thesis || lesson.bigPicture || sourceSummary.one_line_takeaway || lesson.readerValue || "")}</p>
          <div class="agenda-strip">
            <div class="agenda-item">
              <span>01</span>
              <p>${escapeHtml(lesson.problemFrame || lesson.researchQuestion || lesson.sourceSummary?.why_it_matters || "Start by naming the exact problem the paper is trying to solve.")}</p>
            </div>
            <div class="agenda-item">
              <span>02</span>
              <p>${escapeHtml(lesson.methodSetup || lesson.methodSummary || lesson.sourceSummary?.next_action || "Then unpack the method in plain language and tie it back to the claim.")}</p>
            </div>
            <div class="agenda-item">
              <span>03</span>
              <p>${escapeHtml(lesson.coreInsight || lesson.readerValue || lesson.comparisonSummary || "Finish by deciding what this paper changes in your reading standard.")}</p>
            </div>
          </div>
          <div class="tag-row">
            ${paperTags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            <button type="button" class="secondary-btn inline-preview-btn" data-toggle-preview="open">Open paper preview</button>
          </div>
          ${lesson.figure ? `
            <figure class="cover-figure">
              <img src="${escapeHtml(resolveFigure(lesson.figure))}" alt="${escapeHtml(lesson.title)} figure">
              <figcaption>${escapeHtml(lesson.figureCaption || "Paper first-page preview for quick scanning.")}</figcaption>
            </figure>
          ` : ""}
        </div>
      </section>
      <section class="slide slide-defense">
        <div class="slide-head">
          <p class="eyebrow">Slide 1</p>
          <h2>Research Problem</h2>
        </div>
        <div class="defense-grid">
          <article class="panel-card panel-emphasis">
            <h3>Thesis</h3>
            <p class="lead">${escapeHtml(summaryNotes.abstract || lesson.thesis || sourceSummary.one_line_takeaway || lesson.problemFrame || "")}</p>
          </article>
          <article class="panel-card">
            <h3>Problem framing</h3>
            <p>${escapeHtml(lesson.problemFrame || lesson.researchQuestion || "")}</p>
            <p class="figure-ref">${escapeHtml(lesson.whyItMatters || lesson.readerValue || "")}</p>
            <p class="figure-ref">Figure to inspect in the paper: ${escapeHtml(figureOne)}</p>
            <div class="tag-row">
              <button type="button" class="secondary-btn inline-preview-btn" data-toggle-preview="open" data-preview-page="1">Open ${escapeHtml(figureOne.split(":")[0] || "Fig. 1")} in preview</button>
            </div>
          </article>
        </div>
        ${fastTakeaways.length ? `
          <div class="pillar-grid">
            ${fastTakeaways.slice(0, 3).map((item, index) => `
              <article class="pillar-card detailed">
                <p class="mini-kicker">${escapeHtml(item.label || `Takeaway ${index + 1}`)}</p>
                <p>${escapeHtml(item.text || "")}</p>
              </article>
            `).join("")}
          </div>
        ` : ""}
      </section>
      <section class="slide slide-defense">
        <div class="slide-head">
          <p class="eyebrow">Slide 2</p>
          <h2>Motivation and Framing</h2>
        </div>
        <p class="slide-caption">${escapeHtml(summaryNotes.introduction || lesson.bigPicture || lesson.sourceSummary?.why_it_matters || "")}</p>
        <div class="defense-grid">
          <article class="panel-card">
            <h3>Core motivation</h3>
            ${renderList(introGuide.length ? introGuide : readingHighlights.slice(0, 4))}
          </article>
          <article class="panel-card panel-emphasis">
            <h3>Central claim</h3>
            <p class="lead">${escapeHtml(lesson.authorClaim || lesson.coreClaim || sourceSummary.one_line_takeaway || lesson.readerValue || "")}</p>
            ${lesson.figuresToInspect && lesson.figuresToInspect.length ? `<p class="figure-ref">Paper figure to keep nearby: ${escapeHtml(figureOne)}</p>` : ""}
          </article>
        </div>
      </section>
      <section class="slide slide-defense">
        <div class="slide-head">
          <p class="eyebrow">Slide 3</p>
          <h2>Method Overview</h2>
        </div>
        <p class="slide-caption">${escapeHtml(summaryNotes.method || lesson.methodSummary || lesson.methodSetup || "")}</p>
        <div class="defense-grid">
          <article class="panel-card panel-emphasis">
            <h3>Method at a glance</h3>
            <p class="lead">${escapeHtml(lesson.methodSummary || lesson.methodSetup || lesson.sourceSummary?.next_action || "")}</p>
          </article>
          <article class="panel-card">
            <h3>What the method is doing</h3>
            ${renderList(methodChecklist.length ? methodChecklist : readingHighlights.slice(0, 3))}
            <p class="figure-ref">Paper figure to match with this slide: ${escapeHtml(figureTwo)}</p>
            <div class="tag-row">
              <button type="button" class="secondary-btn inline-preview-btn" data-toggle-preview="open" data-preview-page="2">Open ${escapeHtml(figureTwo.split(":")[0] || "Fig. 2")} in preview</button>
            </div>
          </article>
        </div>
      </section>
      <section class="slide slide-defense">
        <div class="slide-head">
          <p class="eyebrow">Slide 4</p>
          <h2>Paper Walkthrough</h2>
        </div>
        <p class="slide-caption">The key paper figures to keep in view are ${escapeHtml(figureOne)}${figureTwo !== figureOne ? ` and ${escapeHtml(figureTwo)}` : ""}.</p>
        <div class="timeline-card">
          ${(steps.length ? steps : [{
            title: "Start from the abstract",
            summary: summaryNotes.abstract || lesson.thesis || "",
            points: introGuide.length ? introGuide : readingHighlights.slice(0, 3)
          }, {
            title: "Then read the method",
            summary: summaryNotes.method || lesson.methodSummary || "",
            points: methodChecklist.length ? methodChecklist : []
          }, {
            title: "Then inspect the results",
            summary: summaryNotes.experiments || lesson.resultsSummary || "",
            points: resultsChecklist.length ? resultsChecklist : experimentChecks
          }]).map((step, index) => `
            <div class="timeline-step">
              <div class="timeline-node">${index + 1}</div>
              <div class="timeline-copy">
                <h3>${escapeHtml(step.title || `Section ${index + 1}`)}</h3>
                <p>${escapeHtml(step.summary || "")}</p>
                ${renderList(step.points || [])}
              </div>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="slide slide-defense">
        <div class="slide-head">
          <p class="eyebrow">Slide 5</p>
          <h2>Experimental Findings</h2>
        </div>
        <div class="defense-grid">
          <article class="panel-card panel-emphasis">
            <h3>Main finding</h3>
            <p class="lead">${escapeHtml(summaryNotes.experiments || lesson.resultsSummary || lesson.sourceSummary?.next_action || "")}</p>
          </article>
          <article class="panel-card">
            <h3>How to read the evidence</h3>
            ${renderList(resultsChecklist.length ? resultsChecklist : experimentChecks)}
            <p class="figure-ref">Go back to ${escapeHtml(figureOne)} and ask whether the evidence really matches the claim.</p>
          </article>
        </div>
      </section>
      <section class="slide slide-defense">
        <div class="slide-head">
          <p class="eyebrow">Slide 6</p>
          <h2>Key Takeaways</h2>
        </div>
        <div class="pillar-grid">
          <article class="pillar-card detailed">
            <p class="mini-kicker">Core insight</p>
            <p>${escapeHtml(lesson.coreInsight || sourceSummary.one_line_takeaway || lesson.readerValue || "")}</p>
          </article>
          <article class="pillar-card detailed">
            <p class="mini-kicker">Reader value</p>
            <p>${escapeHtml(lesson.readerValue || lesson.whyItMatters || sourceSummary.why_it_matters || "")}</p>
          </article>
          <article class="pillar-card detailed">
            <p class="mini-kicker">Comparison lens</p>
            <p>${escapeHtml(lesson.comparisonSummary || sourceSummary.unresolved || lesson.summaryNotes?.limitations || "")}</p>
          </article>
        </div>
        <div class="defense-grid" style="margin-top: 18px;">
          <article class="panel-card">
            <h3>Natural comparison paper</h3>
            <p>${escapeHtml(lesson.comparisonSummary || "")}</p>
            ${comparison ? `<p><strong>${escapeHtml(comparison.title)}</strong><br>${escapeHtml(comparison.venue || "")} ${escapeHtml(String(comparison.year || ""))}</p>` : ""}
          </article>
          <article class="panel-card">
            <h3>Unresolved point</h3>
            <p>${escapeHtml(sourceSummary.unresolved || summaryNotes.limitations || lesson.skepticism?.[2] || "")}</p>
            ${sourceSummary.next_action ? `<p class="figure-ref">${escapeHtml(sourceSummary.next_action)}</p>` : ""}
          </article>
        </div>
      </section>
      <section class="slide slide-defense slide-final">
        <div class="slide-head">
          <p class="eyebrow">Discussion</p>
          <h2>Critical Questions and Next Steps</h2>
        </div>
        <div class="final-grid">
          <article class="panel-card">
            <h3>Critical checks</h3>
            ${renderList(experimentChecks)}
          </article>
          <article class="panel-card">
            <h3>Discussion prompts</h3>
            ${renderList([...thinkingPoints, ...afterReading])}
          </article>
          <article class="panel-card">
            <h3>Why this paper matters</h3>
            <p>${escapeHtml(lesson.thesis || lesson.coreInsight || sourceSummary.one_line_takeaway || "")}</p>
            ${comparison ? `<p><strong>${escapeHtml(comparison.title)}</strong><br>${escapeHtml(comparison.venue || "")} ${escapeHtml(String(comparison.year || ""))}</p>` : ""}
            ${renderList((lesson.skepticism || []).slice(0, 2))}
          </article>
        </div>
      </section>
    </div>
    ${renderPreviewFloat(lesson)}
  `;
}

function renderPreviewFloat(lesson) {
  const previewImages = previewImagesForPaper(lesson.id, lesson.title);
  const selectedPreview = previewImages[Math.max(0, Math.min(activePreviewPage - 1, previewImages.length - 1))] || previewImages[0];
  return `
    <button type="button" class="preview-launcher ${previewOpen ? "hidden" : ""}" data-toggle-preview="open">Paper Preview</button>
    <aside class="preview-float ${previewOpen ? "open" : ""}" style="${previewFloatStyle()}">
      <div class="preview-float-shell">
        <div class="preview-pane-head">
          <div>
            <p class="eyebrow">Paper Preview</p>
            <h2>${escapeHtml(lesson.title)}</h2>
            <div class="preview-nav-row">
              <button type="button" class="secondary-btn preview-nav-btn" data-preview-nav="prev">Previous</button>
              <p class="subtitle preview-page-indicator">Page ${activePreviewPage} of ${previewImages.length}</p>
              <button type="button" class="secondary-btn preview-nav-btn" data-preview-nav="next">Next</button>
            </div>
          </div>
          <div class="preview-toolbar">
            <button type="button" class="secondary-btn preview-zoom-btn" data-preview-zoom="out">A-</button>
            <button type="button" class="secondary-btn preview-zoom-btn" data-preview-zoom="in">A+</button>
            <button type="button" class="secondary-btn" data-toggle-preview="close">Close</button>
          </div>
        </div>
        <div class="preview-page-stage">
          <figure class="preview-page-card active-page">
            <img src="${escapeHtml(selectedPreview.src)}" alt="${escapeHtml(selectedPreview.title)}">
            <figcaption>${escapeHtml(selectedPreview.caption)} / ${previewImages.length}</figcaption>
          </figure>
        </div>
        <div class="preview-resize-handle preview-resize-top" data-preview-resize="top" aria-hidden="true"></div>
        <div class="preview-resize-handle preview-resize-left" data-preview-resize="left" aria-hidden="true"></div>
        <div class="preview-resize-handle preview-resize-right" data-preview-resize="right" aria-hidden="true"></div>
        <div class="preview-resize-handle preview-resize-bottom" data-preview-resize="bottom" aria-hidden="true"></div>
        <div class="preview-resize-handle preview-resize-tl" data-preview-resize="tl" aria-hidden="true"></div>
        <div class="preview-resize-handle preview-resize-tr" data-preview-resize="tr" aria-hidden="true"></div>
        <div class="preview-resize-handle preview-resize-bl" data-preview-resize="bl" aria-hidden="true"></div>
        <div class="preview-resize-handle preview-resize-corner" data-preview-resize="corner" aria-hidden="true"></div>
      </div>
    </aside>
  `;
}

function bindPreviewButtons() {
  applyPreviewSizing();
  Array.from(document.querySelectorAll("[data-toggle-preview]")).forEach((button) => {
    if (button.dataset.bound === "1") return;
    button.dataset.bound = "1";
    button.addEventListener("click", () => {
      if (button.dataset.previewPage) {
        activePreviewPage = Number(button.dataset.previewPage);
      }
      previewOpen = button.dataset.togglePreview === "open";
      rerenderActiveLesson();
    });
  });
  Array.from(document.querySelectorAll("[data-preview-zoom]")).forEach((button) => {
    if (button.dataset.bound === "1") return;
    button.dataset.bound = "1";
    button.addEventListener("click", () => {
      previewScale = button.dataset.previewZoom === "in"
        ? Math.min(2.2, previewScale + 0.15)
        : Math.max(0.85, previewScale - 0.15);
      applyPreviewSizing();
    });
  });
  Array.from(document.querySelectorAll("[data-preview-nav]")).forEach((button) => {
    if (button.dataset.bound === "1") return;
    button.dataset.bound = "1";
    button.addEventListener("click", () => {
      const total = activeLesson ? previewImagesForPaper(activeLesson.id, activeLesson.title).length : 1;
      activePreviewPage = button.dataset.previewNav === "next"
        ? Math.min(total, activePreviewPage + 1)
        : Math.max(1, activePreviewPage - 1);
      rerenderActiveLesson();
    });
  });
  bindPreviewMove();
  bindPreviewResize();
}

function jumpPreviewPage(pageNumber) {
  activePreviewPage = Math.max(1, Number(pageNumber || 1));
  rerenderActiveLesson();
}

function rerenderActiveLesson() {
  if (activeLesson) {
    root.innerHTML = renderStandardLessonDeck(activeLesson);
    bindPreviewButtons();
    applyPreviewSizing();
  }
}

function applyPreviewSizing() {
  root.style.setProperty("--preview-scale", String(previewScale));
}

function previewFloatStyle() {
  const width = Math.max(520, Math.min(1400, Number(previewBox.width || 760)));
  const height = previewBox.height ? Math.max(420, Math.min(window.innerHeight - 24, Number(previewBox.height))) : (window.innerHeight - 36);
  const top = Math.max(12, Math.min(window.innerHeight - 80, Number(previewBox.top ?? 18)));
  const left = previewBox.left == null
    ? Math.max(12, window.innerWidth - width - 18)
    : Math.max(12, Math.min(window.innerWidth - width - 12, Number(previewBox.left)));
  previewBox.width = width;
  previewBox.height = height;
  previewBox.top = top;
  previewBox.left = left;
  return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;right:auto;`;
}

function bindPreviewMove() {
  const header = document.querySelector(".preview-pane-head");
  const panel = document.querySelector(".preview-float");
  if (!header || !panel || header.dataset.bound === "1") return;
  header.dataset.bound = "1";
  header.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    event.preventDefault();
    header.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const startY = event.clientY;
    const rect = panel.getBoundingClientRect();
    const startLeft = rect.left;
    const startTop = rect.top;
    const onMove = (moveEvent) => {
      previewBox.left = Math.max(12, Math.min(window.innerWidth - rect.width - 12, startLeft + (moveEvent.clientX - startX)));
      previewBox.top = Math.max(12, Math.min(window.innerHeight - rect.height - 12, startTop + (moveEvent.clientY - startY)));
      panel.setAttribute("style", previewFloatStyle());
    };
    const onUp = () => {
      header.removeEventListener("pointermove", onMove);
      header.removeEventListener("pointerup", onUp);
      header.removeEventListener("pointercancel", onUp);
    };
    header.addEventListener("pointermove", onMove);
    header.addEventListener("pointerup", onUp);
    header.addEventListener("pointercancel", onUp);
  });
}

function bindPreviewResize() {
  Array.from(document.querySelectorAll("[data-preview-resize]")).forEach((handle) => {
    if (handle.dataset.bound === "1") return;
    handle.dataset.bound = "1";
    handle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      const panel = handle.closest(".preview-float");
      if (!panel) return;
      handle.setPointerCapture(event.pointerId);
      const startX = event.clientX;
      const startY = event.clientY;
      const rect = panel.getBoundingClientRect();
      const startWidth = rect.width;
      const startHeight = rect.height;
      const startLeft = rect.left;
      const startTop = rect.top;
      const mode = handle.dataset.previewResize;
      const onMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        const useLeft = ["left", "tl", "bl"].includes(mode);
        const useRight = ["right", "tr", "corner"].includes(mode);
        const useTop = ["top", "tl", "tr"].includes(mode);
        const useBottom = ["bottom", "bl", "corner"].includes(mode);
        if (useRight) previewBox.width = Math.max(520, Math.min(window.innerWidth - 24, startWidth + dx));
        if (useBottom) previewBox.height = Math.max(420, Math.min(window.innerHeight - 24, startHeight + dy));
        if (useLeft) {
          const nextWidth = Math.max(520, startWidth - dx);
          const widthDelta = nextWidth - startWidth;
          previewBox.width = nextWidth;
          previewBox.left = Math.max(12, Math.min(window.innerWidth - nextWidth - 12, startLeft - widthDelta));
        }
        if (useTop) {
          const nextHeight = Math.max(420, startHeight - dy);
          const heightDelta = nextHeight - startHeight;
          previewBox.height = nextHeight;
          previewBox.top = Math.max(12, Math.min(window.innerHeight - nextHeight - 12, startTop - heightDelta));
        }
        panel.setAttribute("style", previewFloatStyle());
      };
      const onUp = () => {
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
      };
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    });
  });
}

function previewImagesForPaper(paperId, title) {
  const manifestEntry = previewManifest && previewManifest[paperId];
  const pageCount = Math.max(1, Number(manifestEntry && manifestEntry.page_count ? manifestEntry.page_count : 1));
  return Array.from({ length: pageCount }, (_, index) => {
    const page = index + 1;
    return {
      src: page === 1 ? `../assets/paper-figures/${paperId}/preview.png` : `../assets/paper-figures/${paperId}/preview-${page}.png`,
      title: `${title} page ${page}`,
      caption: `Page ${page}`
    };
  });
}

function renderList(items) {
  if (!Array.isArray(items) || !items.length) return "";
  return `<ul class="lesson-list">${items.filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function resolveFigure(src) {
  return src.startsWith("./") ? `..${src.slice(1)}` : src;
}

function renderError(message) {
  titleNode.textContent = "Lesson unavailable";
  subtitleNode.textContent = "";
  root.innerHTML = `<section class="panel-card error-card"><h2>Cannot load lesson</h2><p>${escapeHtml(message)}</p></section>`;
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
const observer = new MutationObserver(() => bindPreviewButtons());
observer.observe(document.body, { childList: true, subtree: true });
})();
