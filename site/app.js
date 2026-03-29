(function () {
const data = window.RESEARCH_DATA;

const state = loadState();
const sync = {
  apiAvailable: false,
  syncChecked: false,
  paperRecords: null,
  paperInbox: null,
  topicFocus: null,
  paperPreviewManifest: null,
  paperInsights: null,
  paperLessons: null,
  lastError: ""
};

const LABELS = {
  status: {
    want: "\u60f3\u8b80",
    reading: "\u5728\u8b80",
    read: "\u5df2\u8b80",
    pause: "\u66ab\u505c",
    not_now: "\u5148\u4e0d\u8b80",
    disliked: "\u4e0d\u611f\u8208\u8da3"
  },
  triage: {
    new: "\u65b0\u52a0\u5165",
    shortlisted: "\u5df2\u5165\u9078",
    imported: "\u5df2\u532f\u5165",
    rejected: "\u7565\u904e"
  }
};

const NAV_TITLES = {
  dashboard: "\u7e3d\u89bd",
  papers: "Papers",
  roadmap: "10 \u9031\u8a08\u756b",
  inbox: "\u6536\u4ef6\u5323",
  taskboard: "\u672c\u9031\u4efb\u52d9\u677f",
  problems: "\u958b\u653e\u554f\u984c",
  decision: "\u4e0b\u4e00\u6b65\u5efa\u8b70"
};

const views = {
  dashboard: byId("view-dashboard"),
  papers: byId("view-papers"),
  roadmap: byId("view-roadmap"),
  inbox: byId("view-inbox"),
  taskboard: byId("view-taskboard"),
  problems: byId("view-problems"),
  decision: byId("view-decision")
};

const viewTitle = byId("view-title");
const cmdRoot = byId("command-palette-root");
const promptRoot = byId("codex-prompt-root");
const deepRoot = byId("deep-understand-root");
const imageRoot = byId("image-viewer-root");

bootApp();

function bootApp() {
  try {
    bindShell();
    applyStaticLabels();
    renderAll();
    setView(state.view || "dashboard");
    loadPaperPreviewManifest();
    loadPaperInsights();
    loadPaperLessons();
    loadRecordsFromApi();
  } catch (error) {
    renderFatalBootError(error);
  }
}

function bindShell() {
  const resetBtn = byId("reset-state-btn");
  const quickJumpBtn = byId("quick-jump-btn");
  const askCodexBtn = byId("ask-codex-btn");
  if (resetBtn) resetBtn.addEventListener("click", () => {
    localStorage.removeItem("tv-research-navigator-state");
    location.reload();
  });
  if (quickJumpBtn) quickJumpBtn.addEventListener("click", togglePalette);
  if (askCodexBtn) askCodexBtn.addEventListener("click", togglePromptBuilder);

  qsa(document, ".nav-link").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      togglePalette();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "j") {
      event.preventDefault();
      togglePromptBuilder();
    }
  if (event.key === "Escape") {
    if (state.palette) {
      state.palette = false;
      saveState();
      renderPalette();
    }
    if (state.promptBuilder) {
      state.promptBuilder = false;
      saveState();
      renderPromptBuilder();
    }
    if (state.deepUnderstand) {
      state.deepUnderstand = null;
      saveState();
      renderDeepUnderstand();
    }
    if (state.imageViewer) {
      state.imageViewer = null;
      saveState();
      renderImageViewer();
    }
  }
  });
}

function applyStaticLabels() {
  qsa(document, ".nav-link").forEach((button) => {
    const label = NAV_TITLES[button.dataset.view];
    if (label) button.textContent = label;
  });
  const quickJump = byId("quick-jump-btn");
  if (quickJump) quickJump.textContent = "\u5feb\u901f\u8df3\u8f49";
  const reset = byId("reset-state-btn");
  if (reset) reset.textContent = "\u91cd\u8a2d\u9078\u64c7";
  const view = byId("view-title");
  if (view) view.textContent = NAV_TITLES[state.view || "dashboard"] || NAV_TITLES.dashboard;
}

function renderAll() {
  renderDashboard();
  renderPapers();
  renderRoadmap();
  renderInbox();
  renderTaskboard();
  renderProblems();
  renderDecision();
  renderPalette();
  renderPromptBuilder();
  renderDeepUnderstand();
  renderImageViewer();
}

function setView(name) {
  state.view = name;
  saveState();
  Object.entries(views).forEach(([key, node]) => {
    if (node) node.classList.toggle("active", key === name);
  });
  qsa(document, ".nav-link").forEach((button) => button.classList.toggle("active", button.dataset.view === name));
  if (viewTitle) viewTitle.textContent = navLabel(name);
}

function renderDashboard() {
  const focus = topicFocus();
  const week = currentWeek();
  const readCount = countStatus("read");
  const readingCount = countStatus("reading");
  const focusPapers = focusSeedPapers().slice(0, 3);

  views.dashboard.innerHTML = `
    ${syncBanner("soft")}
    <section class="hero-card">
      <div>
        <p class="eyebrow">Research Reset</p>
        <h3>${data.summary.title}</h3>
        <p>${data.summary.description}</p>
        <div class="tag-row">
          <span class="tag">${data.summary.topCluster}</span>
          <span class="tag">Week ${week.week}</span>
          <span class="tag">${sync.apiAvailable ? "\u5c08\u6848\u7d00\u9304\u540c\u6b65\u4e2d" : "\u4f7f\u7528\u672c\u6a5f\u66ab\u5b58"}</span>
        </div>
        <div class="progress-wrap">
          <div class="section-head"><strong>\u9032\u5ea6</strong><span class="muted">${percent(readCount, data.papers.length)}%</span></div>
          <div class="progress-track"><div class="progress-bar" style="width:${percent(readCount, data.papers.length)}%"></div></div>
        </div>
        <div class="micro-stats">
          <div class="micro-stat"><strong>${readCount}</strong><span class="muted">\u5df2\u8b80</span></div>
          <div class="micro-stat"><strong>${readingCount}</strong><span class="muted">\u5728\u8b80</span></div>
          <div class="micro-stat"><strong>${inboxItems().length}</strong><span class="muted">\u6536\u4ef6\u5323</span></div>
        </div>
      </div>
      <div class="card">
        <p class="eyebrow">\u76ee\u524d\u4e3b\u984c</p>
        <h3>${focus.primary_topic}</h3>
        <p class="muted">${focus.summary}</p>
        <div class="tag-row">${focus.practical_failure_modes.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>
      </div>
    </section>
    <section class="dashboard-grid">
      <div class="card">
        <div class="section-head"><div><p class="eyebrow">Field Map</p><h3>Clusters</h3></div></div>
        <div class="cluster-list">
          ${data.clusters.map((cluster) => `
            <article class="cluster-item clickable" data-cluster="${cluster.id}">
              <div class="section-head">
                <h4>${cluster.name}</h4>
                <span class="tag">${countCluster(cluster.id)} papers</span>
              </div>
              <p>${cluster.takeaway}</p>
              <div class="tag-row"><span class="tag">${cluster.bestFor}</span></div>
            </article>
          `).join("")}
        </div>
      </div>
      <div class="card">
        <div class="section-head"><div><p class="eyebrow">Temporal Hallucination</p><h3>\u91cd\u9ede\u8ad6\u6587</h3></div></div>
        <div class="cluster-list">
          ${focusPapers.map((paper) => `
            <article class="cluster-item clickable" data-paper="${paper.id}">
              <div class="section-head"><h4>${paper.title}</h4>${pill(statusOf(paper.id))}</div>
              <p>${paper.why}</p>
              <div class="tag-row"><span class="tag">${paper.venue} ${paper.year}</span><span class="tag">${paper.focus}</span></div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;

  qsa(views.dashboard, "[data-cluster]").forEach((node) => node.addEventListener("click", () => {
    state.weekPaperIds = [];
    state.categoryFilter = node.dataset.cluster;
    state.selectedPaperId = "";
    saveState();
    renderPapers();
    setView("papers");
  }));
  qsa(views.dashboard, "[data-paper]").forEach((node) => node.addEventListener("click", () => {
    state.weekPaperIds = [];
    state.selectedPaperId = node.dataset.paper;
    saveState();
    renderPapers();
    setView("papers");
  }));
}

function renderPapers() {
  const papers = filteredPapers();
  const selectedId = papers.find((paper) => paper.id === state.selectedPaperId)?.id || (papers[0] && papers[0].id) || data.papers[0].id;
  const focus = topicFocus();

  views.papers.innerHTML = `
    ${syncBanner("inline")}
    <section class="topic-spotlight">
      <div class="section-head">
        <div><p class="eyebrow">Topic focus</p><h3>${focus.primary_topic}</h3></div>
        <span class="tag">temporal hallucination</span>
      </div>
      <p class="muted">${focus.summary}</p>
      <div class="tag-row">${focus.practical_failure_modes.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>
      <div class="tag-row">${focusSeedPapers().slice(0, 4).map((paper) => `<button class="secondary-btn" data-focus-paper="${paper.id}">${paper.title}</button>`).join("")}</div>
    </section>
    <div class="filters-bar">
      <input id="paper-search" class="search-input" type="search" placeholder="Search title, venue, focus">
      <div class="filter-row">${["All", "A", "B", "C"].map((tier) => `<button class="filter-chip ${tierFilter() === tier ? "active" : ""}" data-tier="${tier}">${tier === "All" ? "All tiers" : `Tier ${tier}`}</button>`).join("")}</div>
      <div class="status-filter-row">${["all", "want", "reading", "read", "pause", "not_now", "disliked"].map((status) => `<button class="filter-chip ${statusFilter() === status ? "active" : ""}" data-status="${status}">${status === "all" ? "All status" : LABELS.status[status]}</button>`).join("")}</div>
      <select id="category-filter" class="select-input">
        <option value="all">All categories</option>
        ${data.clusters.map((cluster) => `<option value="${cluster.id}" ${categoryFilter() === cluster.id ? "selected" : ""}>${cluster.name}</option>`).join("")}
      </select>
    </div>
    <div class="papers-layout">
      <div class="card">
        <div class="section-head"><div><p class="eyebrow">Paper Queue</p><h3>Papers</h3></div><span class="tag">${papers.length} results</span></div>
        <div class="paper-list">
          ${papers.length ? papers.map((paper) => `
            <article class="paper-item ${paper.id === selectedId ? "active" : ""}" data-paper="${paper.id}">
              <div class="paper-item-top"><h4>${paper.title}</h4><span class="tier-badge tier-${paper.tier}">${paper.tier}</span></div>
              <p class="paper-subline">${paper.venue} ${paper.year} · ${paper.focus}</p>
              <p class="muted">${paper.why}</p>
              <div class="tag-row">
                <span class="tag">${clusterName(paper.category)}</span>
                ${focusRelated(paper) ? '<span class="tag">topic match</span>' : ""}
                ${paper.anchor ? '<span class="tag">anchor</span>' : ""}
                ${pill(statusOf(paper.id))}
              </div>
            </article>
          `).join("") : '<p class="muted">No papers match the current filters.</p>'}
        </div>
      </div>
      <div id="paper-detail" class="detail-card"></div>
    </div>
  `;

  byId("paper-search").value = state.paperQuery || "";
  byId("paper-search").addEventListener("input", (event) => {
    state.weekPaperIds = [];
    state.paperQuery = event.target.value;
    saveState();
    renderPapers();
  });
  qsa(views.papers, "[data-tier]").forEach((button) => button.addEventListener("click", () => {
    state.weekPaperIds = [];
    state.tierFilter = button.dataset.tier;
    saveState();
    renderPapers();
  }));
  qsa(views.papers, "[data-status]").forEach((button) => button.addEventListener("click", () => {
    state.weekPaperIds = [];
    state.paperStatusFilter = button.dataset.status;
    saveState();
    renderPapers();
  }));
  byId("category-filter").addEventListener("change", (event) => {
    state.weekPaperIds = [];
    state.categoryFilter = event.target.value;
    saveState();
    renderPapers();
  });
  qsa(views.papers, "[data-paper]").forEach((node) => node.addEventListener("click", () => {
    state.selectedPaperId = node.dataset.paper;
    saveState();
    renderPapers();
  }));
  qsa(views.papers, "[data-focus-paper]").forEach((button) => button.addEventListener("click", () => {
    state.selectedPaperId = button.dataset.focusPaper;
    saveState();
    renderPapers();
  }));
  renderPaperDetail(selectedId);
}

function renderPaperDetail(paperId) {
  const detailRoot = byId("paper-detail");
  if (!detailRoot) return;
  try {
    const paper = findPaper(paperId);
    const lesson = buildDeepUnderstandLesson(paper, paperInsight(paper.id), data.anchorNotes.find((item) => item.paperId === paper.id), comparePaper(paper.id));
    const related = lesson.comparison && lesson.comparison.id ? findPaper(lesson.comparison.id) : comparePaper(paper.id);
    const status = statusOf(paper.id);
    const record = mergedRecord(paper.id);

    detailRoot.innerHTML = `
    <div class="section-head">
        <div><p class="eyebrow">\u7814\u7a76\u8a73\u5361</p><h3>${paper.title}</h3></div>
        ${pill(status)}
    </div>
    <div class="detail-top-grid">
      <div class="detail-top-main">
        <div class="meta-row">
          <span class="tag">${paper.venue} ${paper.year}</span>
          <span class="tag">${clusterName(paper.category)}</span>
          <span class="tag">${focusRelated(paper) ? "hallucination-related" : "general"}</span>
        </div>
        <p>${paper.why}</p>
        <div class="status-buttons">${["want", "reading", "read", "pause", "not_now"].map((key) => `<button class="status-btn ${status === key ? "active" : ""}" data-status-set="${key}">${LABELS.status[key]}</button>`).join("")}</div>
        <div class="status-buttons">
          <button class="secondary-btn ${record.disliked ? "active-soft" : ""}" data-dislike="${paper.id}">\u4e0d\u611f\u8208\u8da3 / \u66ab\u4e0d\u76f8\u95dc</button>
          <button class="secondary-btn" data-undislike="${paper.id}">\u6e05\u9664\u6a19\u8a18</button>
        </div>
        <div class="status-buttons quick-brief-actions">
          <button class="primary-btn" data-toggle-quick="${paper.id}">${isQuickUnderstandOpen(paper.id) ? "Collapse quick understand" : "Quick understand"}</button>
          <button class="secondary-btn" data-open-deep="${paper.id}">Detailed understand</button>
        </div>
        <p class="sync-note">${record.disliked ? "\u9019\u7bc7 paper \u5df2\u88ab\u6a19\u8a18\u70ba\u4e0d\u512a\u5148\uff0c\u4e4b\u5f8c\u66f4\u65b0 queue \u6642\u6703\u9810\u8a2d\u7565\u904e\u3002" : "\u72c0\u614b\u6703\u512a\u5148\u540c\u6b65\u5230\u5c08\u6848\u7d00\u9304\uff1b\u5982\u679c API \u66ab\u6642\u4e0d\u53ef\u7528\uff0c\u624d\u9000\u56de\u672c\u6a5f\u66ab\u5b58\u3002"}</p>
      </div>
      <div class="detail-top-side">
        ${renderDetailPreviewCard(paper, lesson)}
      </div>
    </div>
    ${isQuickUnderstandOpen(paper.id) ? renderQuickUnderstandSectionV2(paper, lesson) : ""}
    ${detailSection("question", "\u9019\u7bc7 paper \u771f\u6b63\u5728\u56de\u7b54\u4ec0\u9ebc\u554f\u984c", `<p>${escapeHtml(lesson.researchQuestion || lesson.problemFrame || paper.why)}</p>`)}
    ${detailSection("claim", "\u4f5c\u8005\u6700\u6838\u5fc3\u7684\u4e3b\u5f35", `<p>${escapeHtml(lesson.coreClaim || lesson.authorClaim || lesson.thesis)}</p>`)}
    ${detailSection("setup", "\u65b9\u6cd5 / benchmark \u5230\u5e95\u505a\u4e86\u4ec0\u9ebc", `<p>${escapeHtml(lesson.methodSetup || lesson.methodSummary || paper.focus)}</p>`)}
    ${detailSection("insight", "\u6838\u5fc3\u555f\u767c", `<p>${escapeHtml(lesson.coreInsight || lesson.readerValue || lesson.thesis)}</p>`)}
    ${detailSection("value", "\u70ba\u4ec0\u9ebc\u9019\u7bc7\u503c\u5f97\u4f60\u8b80", `<p>${escapeHtml(lesson.readerValue || lesson.whyItMatters || paper.why)}</p>${lesson.whyItMatters ? `<p class="muted">${escapeHtml(lesson.whyItMatters)}</p>` : ""}`)}
    ${detailSection("compare", "\u81ea\u7136\u6bd4\u8f03\u5c0d\u8c61", `<div class="tag-row"><span class="tag">${related.venue} ${related.year}</span>${pill(statusOf(related.id))}</div><p>${escapeHtml(related.title)}</p>${lesson.comparisonSummary ? `<p class="muted">${escapeHtml(lesson.comparisonSummary)}</p>` : ""}<button class="secondary-btn" data-related="${related.id}">\u6253\u958b\u6bd4\u8f03\u8ad6\u6587</button>`)}
    <p style="margin-top:16px;"><a class="detail-link" href="${paper.link}" target="_blank" rel="noreferrer">\u6253\u958b\u539f\u59cb\u8ad6\u6587</a></p>
  `;

  qsa(detailRoot, "[data-status-set]").forEach((button) => button.addEventListener("click", async () => {
    await setPaperRecord(paper.id, { status: button.dataset.statusSet, disliked: false });
    renderAll();
    setView("papers");
  }));
  qsa(detailRoot, "[data-dislike]").forEach((button) => button.addEventListener("click", async () => {
    await setPaperRecord(paper.id, { status: "not_now", disliked: true });
    renderAll();
    setView("papers");
  }));
  qsa(detailRoot, "[data-undislike]").forEach((button) => button.addEventListener("click", async () => {
    await setPaperRecord(paper.id, { status: "pause", disliked: false });
    renderAll();
    setView("papers");
  }));
  qsa(detailRoot, "[data-toggle-quick]").forEach((button) => button.addEventListener("click", () => {
    state.quickUnderstandOpen = state.quickUnderstandOpen || {};
    state.quickUnderstandOpen[paper.id] = !isQuickUnderstandOpen(paper.id);
    saveState();
    renderPaperDetail(paper.id);
  }));
  qsa(detailRoot, "[data-open-deep]").forEach((button) => button.addEventListener("click", () => {
    openDeepUnderstand(button.dataset.openDeep);
  }));
  qsa(detailRoot, "[data-open-image]").forEach((button) => button.addEventListener("click", () => {
    const images = paperPreviewImages(paper);
    state.imageViewer = {
      src: button.dataset.openImage,
      title: button.dataset.openImageTitle || paper.title,
      caption: button.dataset.openImageCaption || "Representative figure",
      images,
      index: 0
    };
    saveState();
    renderImageViewer();
  }));
  qsa(detailRoot, ".detail-section-toggle").forEach((button) => button.addEventListener("click", () => {
    state.detailSections = state.detailSections || {};
    state.detailSections[button.dataset.section] = !state.detailSections[button.dataset.section];
    saveState();
    renderPaperDetail(paper.id);
  }));
  const relatedButton = detailRoot.querySelector("[data-related]");
  if (relatedButton) {
    relatedButton.addEventListener("click", () => {
      state.selectedPaperId = relatedButton.dataset.related;
      saveState();
      renderPapers();
    });
  }
  const quickButton = detailRoot.querySelector("[data-toggle-quick]");
  if (quickButton) quickButton.textContent = isQuickUnderstandOpen(paper.id) ? "\u6536\u8d77\u5feb\u901f\u7406\u89e3" : "\u5feb\u901f\u7406\u89e3";
  const deepButton = detailRoot.querySelector("[data-open-deep]");
  if (deepButton) deepButton.textContent = "\u8a73\u7d30\u7406\u89e3 (\u65b0\u8996\u7a97)";
  } catch (error) {
    detailRoot.innerHTML = `
      <section class="sync-banner offline inline">
        <strong>\u7814\u7a76\u8a73\u5361\u8f09\u5165\u5931\u6557</strong>
        <span>${escapeHtml(error && error.message ? error.message : String(error))}</span>
      </section>
    `;
  }
}

function renderRoadmap() {
  views.roadmap.innerHTML = `
    ${syncBanner("soft")}
    <div class="timeline-grid">
      ${data.weeks.map((week) => `
        <article class="timeline-card timeline-item" data-week-card="${week.week}">
          <div class="section-head"><h3><span class="week-number">Week ${week.week}</span> · ${week.title}</h3><span class="tag">${week.week === currentWeek().week ? "\u672c\u9031" : "\u898f\u5283"}</span></div>
          <p><strong>Read:</strong> ${week.reads.join(", ")}</p>
          <p><strong>Deliverable:</strong> ${week.deliverable}</p>
          <div class="timeline-actions">
            <button class="secondary-btn" data-week-task="${week.week}">\u672c\u9031\u4efb\u52d9\u677f</button>
            <button class="secondary-btn" data-week-papers="${week.week}">\u672c\u9031\u8ad6\u6587</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
  qsa(views.roadmap, "[data-week-card]").forEach((node) => node.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    state.currentWeek = Number(node.dataset.weekCard);
    saveState();
    renderTaskboard();
    setView("taskboard");
  }));
  qsa(views.roadmap, "[data-week-task]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    state.currentWeek = Number(button.dataset.weekTask);
    saveState();
    renderTaskboard();
    setView("taskboard");
  }));
  qsa(views.roadmap, "[data-week-papers]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    openWeekPapers(Number(button.dataset.weekPapers));
  }));
}

function renderInbox() {
  const items = inboxItems();
  const focus = topicFocus();
  views.inbox.innerHTML = `
    ${syncBanner("inline")}
    <div class="inbox-layout">
      <section class="card inbox-form-card">
        <div class="section-head"><div><p class="eyebrow">\u5916\u90e8\u8ad6\u6587</p><h3>\u6536\u4ef6\u5323 / \u5f85\u6574\u7406</h3></div><span class="tag">${items.length} \u7b46</span></div>
        <p class="muted">\u628a\u4f60\u5728\u5176\u4ed6\u5730\u65b9\u770b\u5230\u7684 paper \u8cbc\u9032\u4f86\u3002API \u53ef\u7528\u6642\u6703\u5beb\u9032\u5c08\u6848\u7d00\u9304\uff0c\u4e0d\u53ef\u7528\u6642\u6703\u5148\u5b58\u5728\u672c\u6a5f\u3002</p>
        <div class="topic-spotlight compact">
          <div class="section-head"><div><p class="eyebrow">\u76ee\u524d\u7126\u9ede</p><h4>${focus.primary_topic}</h4></div><span class="tag">topic focus</span></div>
          <p class="muted">Good candidates usually mention temporal hallucination, order confusion, unstable grounding, or unsupported time claims.</p>
        </div>
        <form id="inbox-form" class="inbox-form">
          <div class="form-grid">
            <label><span>Title</span><input name="title" class="search-input" required placeholder="Paper title"></label>
            <label><span>Link</span><input name="link" class="search-input" placeholder="https://..."></label>
            <label><span>Venue / source</span><input name="venue" class="search-input" placeholder="CVPR / arXiv / Slack / X"></label>
            <label><span>Year</span><input name="year" class="search-input" placeholder="2026"></label>
          </div>
          <label><span>Why it matters</span><textarea name="why" class="textarea-input" placeholder="Why this paper might matter"></textarea></label>
          <label><span>Quick paste</span><textarea name="raw" class="textarea-input" placeholder="Paste citation, abstract, link, or discussion snippet"></textarea></label>
          <div class="tag-row">
            <button type="submit" class="primary-btn">\u5b58\u5230\u6536\u4ef6\u5323</button>
            <button type="button" id="fill-topic-focus" class="secondary-btn">\u5e36\u5165\u4e3b\u984c\u7126\u9ede</button>
          </div>
        </form>
      </section>
      <section class="card inbox-list-card">
        <div class="section-head"><div><p class="eyebrow">\u5df2\u8ffd\u8e64\u9805\u76ee</p><h3>\u5f85\u6574\u7406</h3></div></div>
        ${items.length ? `<div class="paper-list">${items.map(renderInboxItem).join("")}</div>` : `<div class="empty-state"><h4>\u76ee\u524d\u9084\u6c92\u6709\u5916\u90e8\u8ad6\u6587</h4><p>\u628a title\u3001link \u6216 citation \u8cbc\u9032\u4f86\uff0c\u4e4b\u5f8c\u66f4\u65b0 queue \u6642\u5c31\u80fd\u4e00\u8d77\u8003\u616e\u3002</p></div>`}
      </section>
    </div>
  `;
  const form = byId("inbox-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();
    if (!title) return;
    await addInboxItem({
      title,
      link: String(fd.get("link") || "").trim(),
      venue: String(fd.get("venue") || "").trim(),
      year: String(fd.get("year") || "").trim(),
      why: String(fd.get("why") || "").trim(),
      raw: String(fd.get("raw") || "").trim(),
      topic_focus: focus.primary_topic
    });
    form.reset();
    renderAll();
    setView("inbox");
  });
  byId("fill-topic-focus").addEventListener("click", () => {
    const why = form.querySelector('[name="why"]');
    if (why && !why.value.trim()) why.value = `Related to ${focus.primary_topic}.`;
  });
  qsa(views.inbox, "[data-inbox-status]").forEach((button) => button.addEventListener("click", async () => {
    await updateInboxItem(button.dataset.inboxId, { status: button.dataset.inboxStatus });
    renderAll();
    setView("inbox");
  }));
  qsa(views.inbox, "[data-open-link]").forEach((button) => button.addEventListener("click", () => {
    const item = inboxItems().find((entry) => entry.id === button.dataset.openLink);
    if (item && item.link) window.open(item.link, "_blank", "noreferrer");
  }));
}

function renderInboxItem(item) {
  return `
    <article class="paper-item inbox-item">
      <div class="section-head"><div><h4>${item.title}</h4><p class="paper-subline">${[item.venue, item.year].filter(Boolean).join(" · ") || "\u5c1a\u672a\u63d0\u4f9b\u4f86\u6e90"}</p></div><span class="status-pill inbox-status inbox-${item.status}">${LABELS.triage[item.status] || item.status}</span></div>
      ${item.why ? `<p>${item.why}</p>` : ""}
      ${item.raw ? `<p class="muted">${truncate(item.raw, 220)}</p>` : ""}
      <div class="tag-row">${item.topic_focus ? `<span class="tag">${item.topic_focus}</span>` : ""}<span class="tag">${sync.apiAvailable ? "records API" : "\u672c\u6a5f\u66ab\u5b58"}</span></div>
      <div class="timeline-actions">
        <button class="secondary-btn" data-inbox-status="shortlisted" data-inbox-id="${item.id}">\u52a0\u5165\u5019\u9078</button>
        <button class="secondary-btn" data-inbox-status="imported" data-inbox-id="${item.id}">\u5df2\u532f\u5165</button>
        <button class="secondary-btn" data-inbox-status="rejected" data-inbox-id="${item.id}">\u7565\u904e</button>
        ${item.link ? `<button class="secondary-btn" data-open-link="${item.id}">\u6253\u958b\u9023\u7d50</button>` : ""}
      </div>
    </article>
  `;
}

function renderTaskboard() {
  const week = currentWeek();
  const tasks = weeklyTasks(week);
  const progress = percent(tasks.filter((task) => task.done).length, tasks.length || 1);
  views.taskboard.innerHTML = `
    ${syncBanner("soft")}
    <div class="card">
      <div class="section-head"><div><p class="eyebrow">\u672c\u9031\u898f\u5283</p><h3>\u672c\u9031\u4efb\u52d9\u677f</h3></div><span class="tag">Week ${week.week}</span></div>
      <p class="muted">\u4efb\u52d9\u6703\u6839\u64da\u76ee\u524d\u9031\u6b21\u8207\u4f60\u7684\u8ad6\u6587\u72c0\u614b\u81ea\u52d5\u751f\u6210\u3002</p>
      <div class="progress-wrap"><div class="section-head"><strong>\u9032\u5ea6</strong><span class="muted">${progress}%</span></div><div class="progress-track"><div class="progress-bar" style="width:${progress}%"></div></div></div>
      <div class="filter-row" style="margin:14px 0 18px;">${data.weeks.map((item) => `<button class="filter-chip ${week.week === item.week ? "active" : ""}" data-week="${item.week}">Week ${item.week}</button>`).join("")}</div>
      <div class="task-list">${tasks.map(renderTask).join("")}</div>
    </div>
  `;
  qsa(views.taskboard, "[data-week]").forEach((button) => button.addEventListener("click", () => {
    state.currentWeek = Number(button.dataset.week);
    saveState();
    renderTaskboard();
  }));
  qsa(views.taskboard, "[data-task-action]").forEach((card) => card.addEventListener("click", () => {
    handleTaskAction(card.dataset.taskAction, card.dataset.taskPaper, card.dataset.taskWeek);
  }));
}

function renderProblems() {
  views.problems.innerHTML = `
    ${syncBanner("soft")}
    <div class="problem-grid">
      ${data.problems.map((problem) => `
        <article class="problem-card ${problem.priority === "highest" ? "priority" : ""}">
          <h3>${problem.title}</h3>
          <div class="tag-row"><span class="tag">priority: ${problem.priority}</span></div>
          <p>${problem.why}</p>
          <div class="decision-list">${problem.probes.map((probe) => `<div class="decision-result">${probe}</div>`).join("")}</div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderDecision() {
  views.decision.innerHTML = `
    ${syncBanner("soft")}
    <div class="decision-grid">
      <section class="decision-card">
        <h3>Choose your mode</h3>
        <p class="muted">Turn your current state into one concrete next step.</p>
        <label for="goal-select">Goal</label>
        <select id="goal-select" class="select-input">
          <option value="map">Rebuild the field map</option>
          <option value="project">Converge to a project idea</option>
          <option value="taste">Improve research taste</option>
        </select>
        <label for="energy-select">Energy</label>
        <select id="energy-select" class="select-input">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label for="confusion-select">Main blocker</label>
        <select id="confusion-select" class="select-input">
          <option value="too-broad">The field still feels too broad</option>
          <option value="what-read">I do not know what to read next</option>
          <option value="what-idea">I do not know which problem is worth chasing</option>
        </select>
        <div style="margin-top:14px"><button id="recommend-btn" class="primary-btn">Recommend next step</button></div>
      </section>
      <section class="decision-card"><h3>Recommendation</h3><div id="decision-output"></div></section>
    </div>
  `;
  byId("goal-select").value = state.goal || "map";
  byId("energy-select").value = state.energy || "medium";
  byId("confusion-select").value = state.confusion || "too-broad";
  byId("recommend-btn").addEventListener("click", () => {
    state.goal = byId("goal-select").value;
    state.energy = byId("energy-select").value;
    state.confusion = byId("confusion-select").value;
    saveState();
    drawDecision();
  });
  drawDecision();
}

function renderPalette() {
  if (!cmdRoot) return;
  if (!state.palette) {
    cmdRoot.innerHTML = "";
    return;
  }
  const items = [
    ...Object.keys(views).map((key) => ({ kind: "View", title: navLabel(key), subtitle: "Open page", go: () => setView(key) })),
    ...data.papers.filter((paper) => statusOf(paper.id) !== "read").slice(0, 5).map((paper) => ({
      kind: "Paper",
      title: paper.title,
      subtitle: `${paper.venue} ${paper.year}`,
      go: () => {
        state.selectedPaperId = paper.id;
        saveState();
        renderPapers();
        setView("papers");
      }
    }))
  ];
  cmdRoot.innerHTML = `
    <div class="command-backdrop" data-close="1"></div>
    <div class="command-palette">
      <p class="eyebrow">Quick jump</p>
      <h3>Open a page or paper</h3>
      <div class="command-grid">${items.map((item, index) => `<article class="command-item" data-cmd="${index}"><strong>${item.title}</strong><small>${item.subtitle}</small><div class="tag-row"><span class="tag">${item.kind}</span></div></article>`).join("")}</div>
    </div>
  `;
  qsa(cmdRoot, "[data-close]").forEach((node) => node.addEventListener("click", () => {
    state.palette = false;
    saveState();
    renderPalette();
  }));
  qsa(cmdRoot, "[data-cmd]").forEach((node) => node.addEventListener("click", () => {
    items[Number(node.dataset.cmd)].go();
    state.palette = false;
    saveState();
    renderPalette();
  }));
}

function togglePalette() {
  state.palette = !state.palette;
  saveState();
  renderPalette();
}

function togglePromptBuilder() {
  state.promptBuilder = !state.promptBuilder;
  saveState();
  renderPromptBuilder();
}

function renderPromptBuilder() {
  if (!promptRoot) return;
  if (!state.promptBuilder) {
    promptRoot.innerHTML = "";
    return;
  }
  const ctx = promptContext();
  const prompt = buildPrompt(ctx);
  promptRoot.innerHTML = `
    <div class="prompt-backdrop" data-close-prompt="1"></div>
    <div class="prompt-modal">
      <div class="section-head"><div><p class="eyebrow">Ask Codex</p><h3>Build a prompt from the current screen</h3></div><div class="tag-row"><span class="tag">Ctrl/Cmd + J</span><span class="tag">${navLabel(state.view || "dashboard")}</span></div></div>
      <div class="prompt-grid">
        <section class="prompt-panel">
          <h4>Your question</h4>
          <textarea id="codex-question" class="prompt-textarea" placeholder="Ask a question about the current page">${escapeHtml(state.codexQuestion || "")}</textarea>
          <div class="prompt-actions">
            <button id="build-codex-prompt" class="primary-btn">Refresh prompt</button>
            <button id="copy-codex-prompt" class="secondary-btn">Copy</button>
            <button id="close-codex-prompt" class="secondary-btn">Close</button>
          </div>
        </section>
        <section class="prompt-panel">
          <h4>Prompt</h4>
          <div id="codex-prompt-output" class="prompt-output">${escapeHtml(prompt)}</div>
        </section>
      </div>
    </div>
  `;
  qsa(promptRoot, "[data-close-prompt]").forEach((node) => node.addEventListener("click", () => {
    state.promptBuilder = false;
    saveState();
    renderPromptBuilder();
  }));
  byId("close-codex-prompt").addEventListener("click", () => {
    state.promptBuilder = false;
    saveState();
    renderPromptBuilder();
  });
  byId("build-codex-prompt").addEventListener("click", () => {
    state.codexQuestion = byId("codex-question").value.trim();
    saveState();
    renderPromptBuilder();
  });
  byId("copy-codex-prompt").addEventListener("click", async () => {
    state.codexQuestion = byId("codex-question").value.trim();
    const latest = buildPrompt(promptContext());
    saveState();
    try {
      await navigator.clipboard.writeText(latest);
      byId("copy-codex-prompt").textContent = "Copied";
      setTimeout(() => {
        const button = byId("copy-codex-prompt");
        if (button) button.textContent = "Copy";
      }, 1200);
    } catch (_error) {
      const range = document.createRange();
      range.selectNodeContents(byId("codex-prompt-output"));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
}

function openDeepUnderstand(paperId) {
  window.open(buildLessonUrl(paperId), "_blank", "noopener,noreferrer");
}

function renderImageViewer() {
  if (!imageRoot) return;
  if (!state.imageViewer) {
    imageRoot.innerHTML = "";
    return;
  }
  const image = state.imageViewer;
  const images = Array.isArray(image.images) && image.images.length ? image.images : [image];
  const safeIndex = Math.max(0, Math.min(Number(image.index || 0), images.length - 1));
  const activeImage = images[safeIndex] || images[0];
  imageRoot.innerHTML = `
    <div class="image-viewer-backdrop" data-close-image="1"></div>
    <div class="image-viewer-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(image.title || "Image preview")}">
      <div class="section-head image-viewer-head">
        <div>
          <p class="eyebrow">Figure Preview</p>
          <h3>${escapeHtml(image.title || "Image preview")}</h3>
        </div>
        <div class="image-viewer-actions">
          ${images.length > 1 ? `<span class="tag">Page ${safeIndex + 1} / ${images.length}</span>` : ""}
          <button class="secondary-btn" data-close-image="1">Close</button>
        </div>
      </div>
      ${images.length > 1 ? `
        <div class="image-viewer-nav">
          <button class="secondary-btn" data-image-nav="prev" ${safeIndex <= 0 ? "disabled" : ""}>Previous</button>
          <button class="secondary-btn" data-image-nav="next" ${safeIndex >= images.length - 1 ? "disabled" : ""}>Next</button>
        </div>
      ` : ""}
      <img class="image-viewer-img" src="${escapeHtml(activeImage.src)}" alt="${escapeHtml(activeImage.title || image.title || "Image preview")}">
      <p class="image-viewer-caption">${escapeHtml(activeImage.caption || image.caption || "")}</p>
      ${images.length > 1 ? `
        <div class="image-viewer-thumbs">
          ${images.map((item, index) => `
            <button type="button" class="image-thumb ${index === safeIndex ? "active" : ""}" data-image-index="${index}" aria-label="Open page ${index + 1}">
              <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title || `Page ${index + 1}`)}">
            </button>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
  qsa(imageRoot, "[data-close-image]").forEach((node) => node.addEventListener("click", () => {
    state.imageViewer = null;
    saveState();
    renderImageViewer();
  }));
  qsa(imageRoot, "[data-image-nav]").forEach((node) => node.addEventListener("click", () => {
    const delta = node.dataset.imageNav === "next" ? 1 : -1;
    state.imageViewer.index = Math.max(0, Math.min(safeIndex + delta, images.length - 1));
    saveState();
    renderImageViewer();
  }));
  qsa(imageRoot, "[data-image-index]").forEach((node) => node.addEventListener("click", () => {
    state.imageViewer.index = Number(node.dataset.imageIndex || 0);
    saveState();
    renderImageViewer();
  }));
}

function promptContext() {
  const week = currentWeek();
  const selected = findPaper(state.selectedPaperId || data.papers[0].id);
  const filters = [];
  if (tierFilter() !== "All") filters.push(`tier=${tierFilter()}`);
  if (categoryFilter() !== "all") filters.push(`category=${clusterName(categoryFilter())}`);
  if (statusFilter() !== "all") filters.push(`status=${statusFilter()}`);
  if ((state.paperQuery || "").trim()) filters.push(`query=${state.paperQuery.trim()}`);
  return {
    view: navLabel(state.view || "dashboard"),
    week,
    selected,
    filters: filters.length ? filters.join(" | ") : "none",
    tracked: data.papers.filter((paper) => ["want", "reading", "read"].includes(statusOf(paper.id))).slice(0, 6).map((paper) => `${paper.title} [${LABELS.status[statusOf(paper.id)]}]`),
    topic: topicFocus().primary_topic,
    question: (state.codexQuestion || "").trim()
  };
}

function buildPrompt(ctx) {
  const related = comparePaper(ctx.selected.id);
  return [
    "I am using a local research website called Temporal Video Research Navigator.",
    "",
    `My question: ${ctx.question || "Answer based on the current screen and suggest the best next step."}`,
    "",
    `Current view: ${ctx.view}`,
    `Current week: Week ${ctx.week.week} - ${ctx.week.title}`,
    `Current filters: ${ctx.filters}`,
    `Topic focus: ${ctx.topic}`,
    "",
    "Selected paper:",
    `- Title: ${ctx.selected.title}`,
    `- Venue: ${ctx.selected.venue} ${ctx.selected.year}`,
    `- Focus: ${ctx.selected.focus}`,
    `- Why it matters: ${ctx.selected.why}`,
    `- Status: ${LABELS.status[statusOf(ctx.selected.id)]}`,
    "",
    `Natural comparison: ${related.title} (${related.venue} ${related.year})`,
    "",
    "Tracked papers:",
    ...(ctx.tracked.length ? ctx.tracked.map((item) => `- ${item}`) : ["- none"]),
    "",
    `Week deliverable: ${ctx.week.deliverable}`,
    "",
    "Please answer directly from this context, suggest the best next click or next paper, and give 2-3 concrete next steps if appropriate."
  ].join("\n");
}

function drawDecision() {
  const choice = decide(state.goal || "map", state.energy || "medium", state.confusion || "too-broad");
  byId("decision-output").innerHTML = `
    <div class="decision-result"><p><strong>Action:</strong> ${choice.action}</p><p>${choice.why}</p></div>
    <div class="decision-result"><p><strong>Read next:</strong> ${choice.papers.join(", ")}</p></div>
    <div class="decision-result"><p><strong>Output:</strong> ${choice.output}</p></div>
    <div class="decision-result"><p><strong>Guardrail:</strong> ${choice.guardrail}</p></div>
  `;
}

function decide(goal, energy, confusion) {
  if (goal === "map" || confusion === "too-broad") {
    return {
      action: "Read one benchmark anchor and one method anchor, then update your field map.",
      why: "Benchmark + method comparison is the fastest way to define real temporal understanding.",
      papers: energy === "low" ? ["TempCompass", "VidHalluc"] : ["TempCompass", "MVBench", "VidHalluc"],
      output: "One memo on what counts as true temporal understanding.",
      guardrail: "Do not read only method papers back-to-back."
    };
  }
  if (goal === "taste" || confusion === "what-read") {
    return {
      action: "Read evidence/search papers plus one hallucination paper.",
      why: "This is the fastest path to better research taste.",
      papers: energy === "high" ? ["LV-Haystack", "ViTED", "VidHalluc"] : ["LV-Haystack", "VidHalluc"],
      output: "A comparison note across search failure, reasoning failure, and hallucination failure.",
      guardrail: "Do not clone repos before you can explain the core idea in plain language."
    };
  }
  return {
    action: "Turn the current bottlenecks into scored research directions.",
    why: "You are close to problem selection, so compare novelty, tractability, and faithfulness.",
    papers: energy === "low" ? ["Temporal Reasoning Transfer from Text to Video", "VidHalluc"] : ["Temporal Reasoning Transfer from Text to Video", "LV-Haystack", "VidHalluc"],
    output: "Three candidate research directions with scores.",
    guardrail: "If an idea only improves score but not temporal faithfulness, downgrade it."
  };
}

function currentWeek() {
  return data.weeks.find((week) => week.week === (state.currentWeek || 1)) || data.weeks[0];
}

function weeklyTasks(week) {
  const papers = papersForWeek(week);
  const reading = papers.filter((paper) => statusOf(paper.id) === "reading");
  const want = papers.filter((paper) => statusOf(paper.id) === "want");
  const read = papers.filter((paper) => statusOf(paper.id) === "read");
  const tasks = [{
    type: "Week focus",
    title: week.title,
    body: `Read ${week.reads.join(", ")} and finish: ${week.deliverable}`,
    done: read.length === papers.length && papers.length > 0,
    action: "week-papers",
    week: week.week
  }];
  reading.forEach((paper) => tasks.push({ type: "Reading", title: `Finish ${paper.title}`, body: "This one is already in progress.", done: false, action: "paper", paperId: paper.id }));
  want.forEach((paper) => tasks.push({ type: "Want", title: `Start ${paper.title}`, body: "Promote it to reading after a first pass.", done: false, action: "paper", paperId: paper.id }));
  if (!papers.length) tasks.push({ type: "Fallback", title: "Open week papers", body: "This week does not map cleanly yet, so start from the paper page.", done: false, action: "papers" });
  if (!want.length && !reading.length && !read.length) tasks.push({ type: "Setup", title: "Mark 2-3 week papers", body: "Taskboard works best after you tag a few week papers.", done: false, action: "week-papers", week: week.week });
  tasks.push({ type: "Synthesis", title: "Update this week judgement", body: read.length >= 2 ? "Write a comparison note or a short judgement memo." : "Pair one benchmark paper with one method paper.", done: read.length >= 2, action: read.length >= 2 ? "decision" : "papers" });
  return tasks;
}

function renderTask(task) {
  return `<article class="task-item ${task.action ? "clickable" : ""}" ${task.action ? `data-task-action="${task.action}"` : ""} ${task.paperId ? `data-task-paper="${task.paperId}"` : ""} ${task.week ? `data-task-week="${task.week}"` : ""}><div class="task-head"><div class="task-meta"><span class="tag">${task.type}</span>${task.paperId ? pill(statusOf(task.paperId)) : ""}</div>${task.done ? '<span class="tag">On track</span>' : ""}</div><h4>${task.title}</h4><p class="muted">${task.body}</p>${task.action ? `<div class="tag-row"><span class="tag">${taskActionLabel(task.action)}</span></div>` : ""}</article>`;
}

function taskActionLabel(action) {
  return ({ paper: "Open paper", papers: "Open papers", decision: "Open next step", "week-papers": "Open week papers" })[action] || "Open";
}

function handleTaskAction(action, paperId, weekNo) {
  if (action === "paper" && paperId) {
    state.selectedPaperId = paperId;
    state.categoryFilter = findPaper(paperId).category;
    saveState();
    renderPapers();
    setView("papers");
    return;
  }
  if (action === "week-papers") {
    openWeekPapers(Number(weekNo || currentWeek().week));
    return;
  }
  if (action === "decision") {
    setView("decision");
    return;
  }
  setView("papers");
}

function openWeekPapers(weekNo) {
  const week = data.weeks.find((item) => item.week === weekNo) || data.weeks[0];
  const list = papersForWeek(week);
  state.currentWeek = week.week;
  state.weekPaperIds = list.map((paper) => paper.id);
  state.paperQuery = "";
  state.tierFilter = "All";
  state.paperStatusFilter = "all";
  state.categoryFilter = "all";
  state.selectedPaperId = list[0] ? list[0].id : data.papers[0].id;
  saveState();
  renderPapers();
  setView("papers");
}

function papersForWeek(week) {
  return (week.reads || []).map(findPaperForWeekRead).filter(Boolean);
}

function filteredPapers() {
  const query = (state.paperQuery || "").trim().toLowerCase();
  const weekPaperIds = Array.isArray(state.weekPaperIds) ? state.weekPaperIds : [];
  return data.papers.filter((paper) => {
    const haystack = `${paper.title} ${paper.venue} ${paper.focus} ${paper.why}`.toLowerCase();
    return (!weekPaperIds.length || weekPaperIds.includes(paper.id))
      && (tierFilter() === "All" || paper.tier === tierFilter())
      && (categoryFilter() === "all" || paper.category === categoryFilter())
      && (statusFilter() === "all" || statusOf(paper.id) === statusFilter())
      && (!query || haystack.includes(query));
  });
}

function findPaperForWeekRead(readTitle) {
  const aliases = weekReadAliases(readTitle);
  for (const alias of aliases) {
    const normalizedAlias = normalizeTitle(alias);
    const exact = data.papers.find((paper) => normalizeTitle(paper.title) === normalizedAlias || normalizeTitle(paper.id) === normalizedAlias);
    if (exact) return exact;
    const partial = data.papers.find((paper) => normalizeTitle(paper.title).includes(normalizedAlias) || normalizedAlias.includes(normalizeTitle(paper.title)));
    if (partial) return partial;
  }
  return null;
}

function weekReadAliases(readTitle) {
  const source = String(readTitle || "").trim();
  const aliases = new Set([source]);
  const lower = source.toLowerCase();
  if (lower.includes("temporal sentence grounding survey")) aliases.add("Temporal Sentence Grounding in Videos");
  if (lower.includes("debiasing temporal grounding")) aliases.add("Towards Debiasing Temporal Sentence Grounding in Video");
  if (lower.includes("consistency of video llms")) aliases.add("On the Consistency of Video Large Language Models in Temporal Comprehension");
  if (lower.includes("temporal reasoning transfer")) aliases.add("Temporal Reasoning Transfer from Text to Video");
  if (lower.includes("multimodal guidance")) aliases.add("Localizing Moments in Long Video Via Multimodal Guidance");
  if (lower.includes("temporal corruption robustness")) aliases.add("Benchmarking the Robustness of Temporal Action Detection Models Against Temporal Corruptions");
  if (lower.includes("videorefer suite")) aliases.add("VideoRefer Suite");
  if (lower.includes("lv-haystack")) aliases.add("Re-thinking Temporal Search for Long-Form Video Understanding");
  if (lower.includes("vited")) aliases.add("VITED");
  return Array.from(aliases);
}

function normalizeTitle(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function mergedRecord(paperId) {
  const apiRecord = sync.paperRecords && sync.paperRecords.map[paperId];
  if (apiRecord) return apiRecord;
  return { paper_id: paperId, status: (state.paperStatuses && state.paperStatuses[paperId]) || "want", disliked: !!(state.paperFlags && state.paperFlags[paperId] && state.paperFlags[paperId].disliked) };
}

function statusOf(paperId) {
  const record = mergedRecord(paperId);
  return record.disliked ? "disliked" : (record.status || "want");
}

function countStatus(status) {
  return data.papers.filter((paper) => statusOf(paper.id) === status).length;
}

function countCluster(clusterId) {
  return data.papers.filter((paper) => paper.category === clusterId).length;
}

function clusterName(clusterId) {
  return data.clusters.find((cluster) => cluster.id === clusterId)?.name || clusterId;
}

function findPaper(paperId) {
  return data.papers.find((paper) => paper.id === paperId) || data.papers[0];
}

function comparePaper(paperId) {
  const paper = findPaper(paperId);
  return data.papers.find((candidate) => candidate.category === paper.category && candidate.id !== paperId) || data.papers[0];
}

function pill(status) {
  return `<span class="status-pill status-${status}">${LABELS.status[status] || status}</span>`;
}

function detailSection(key, title, body) {
  const collapsed = !!(state.detailSections && state.detailSections[key]);
  return `<section class="detail-section ${collapsed ? "collapsed" : ""}"><button class="detail-section-toggle" data-section="${key}"><h4>${title}</h4><span>${collapsed ? "Expand" : "Collapse"}</span></button><div class="detail-body">${body}</div></section>`;
}

function buildLessonUrl(paperId) {
  return `./lessons/index.html?paper=${encodeURIComponent(paperId)}&mode=slides`;
}

function paperPreviewImages(paper) {
  const manifestEntry = sync.paperPreviewManifest && sync.paperPreviewManifest[paper.id];
  const pageCount = Math.max(1, Number(manifestEntry && manifestEntry.page_count ? manifestEntry.page_count : 1));
  return Array.from({ length: pageCount }, (_, index) => {
    const page = index + 1;
    return {
      src: page === 1 ? `./assets/paper-figures/${paper.id}/preview.png` : `./assets/paper-figures/${paper.id}/preview-${page}.png`,
      title: `${paper.title} page ${page}`,
      caption: `PDF preview page ${page}`
    };
  });
}

function topicFocus() {
  const fallback = {
    primary_topic: "Temporal hallucination in video understanding",
    summary: "Track order confusion, state-transition mistakes, unsupported temporal claims, and unstable temporal grounding.",
    practical_failure_modes: ["take off vs put on", "sparse frame order errors", "wrong temporal span", "answer without temporal evidence"],
    seed_papers: ["vidhalluc", "mashvlm", "tempcompass", "consistency"]
  };
  const raw = sync.topicFocus || {};
  return {
    primary_topic: raw.primary_topic || fallback.primary_topic,
    summary: raw.summary || fallback.summary,
    practical_failure_modes: Array.isArray(raw.practical_failure_modes) && raw.practical_failure_modes.length ? raw.practical_failure_modes : fallback.practical_failure_modes,
    seed_papers: Array.isArray(raw.seed_papers) && raw.seed_papers.length ? raw.seed_papers : fallback.seed_papers
  };
}

function focusSeedPapers() {
  const list = topicFocus().seed_papers
    .map((seed) => data.papers.find((paper) => paper.id === seed || paper.title.toLowerCase().includes(String(seed).toLowerCase())))
    .filter(Boolean);
  return list.length ? list : data.papers.filter((paper) => focusRelated(paper)).slice(0, 4);
}

function focusRelated(paper) {
  const text = `${paper.title} ${paper.focus} ${paper.why}`.toLowerCase();
  return text.includes("hallucination") || text.includes("consistency") || text.includes("temporal benchmark");
}

function tierFilter() {
  return state.tierFilter || "All";
}

function categoryFilter() {
  return state.categoryFilter || "all";
}

function statusFilter() {
  return state.paperStatusFilter || "all";
}

function inboxItems() {
  if (sync.paperInbox && Array.isArray(sync.paperInbox.items)) return sync.paperInbox.items.slice().sort((a, b) => String(b.updated_at || b.created_at || "").localeCompare(String(a.updated_at || a.created_at || "")));
  return Array.isArray(state.localInbox) ? state.localInbox : [];
}

async function loadRecordsFromApi() {
  try {
    const [paperRecords, paperInbox, topicFocusRecord] = await Promise.all([
      apiJson("/api/records/paper-records"),
      apiJson("/api/records/paper-inbox"),
      apiJson("/api/records/topic-focus")
    ]);
    sync.apiAvailable = true;
    sync.syncChecked = true;
    sync.lastError = "";
    sync.paperRecords = normalizePaperRecords(paperRecords);
    sync.paperInbox = normalizePaperInbox(paperInbox);
    sync.topicFocus = topicFocusRecord && typeof topicFocusRecord === "object" ? topicFocusRecord : null;
  } catch (error) {
    sync.apiAvailable = false;
    sync.syncChecked = true;
    sync.lastError = error && error.message ? error.message : "records API unavailable";
    sync.paperRecords = null;
    sync.paperInbox = normalizePaperInbox({ items: state.localInbox || [] });
    sync.topicFocus = null;
  }
  renderAll();
}

async function loadPaperInsights() {
  try {
    sync.paperInsights = await apiJson("./paper-insights.json");
  } catch (_error) {
    sync.paperInsights = null;
  }
  renderAll();
}

async function loadPaperLessons() {
  try {
    sync.paperLessons = await apiJson("./paper-lessons.json");
  } catch (_error) {
    sync.paperLessons = null;
  }
  renderAll();
}

async function loadPaperPreviewManifest() {
  try {
    sync.paperPreviewManifest = await apiJson("./assets/paper-figures/manifest.json");
  } catch (_error) {
    sync.paperPreviewManifest = null;
  }
  renderAll();
}

function normalizePaperRecords(raw) {
  const source = raw && raw.papers && !Array.isArray(raw.papers) ? Object.values(raw.papers) : (raw && Array.isArray(raw.papers) ? raw.papers : []);
  const map = {};
  source.forEach((item) => {
    const paperId = item.paper_id || item.id;
    if (!paperId) return;
    map[paperId] = { paper_id: paperId, title: item.title || findPaper(paperId).title, status: item.status || "want", disliked: !!item.disliked, updated_at: item.updated_at || "" };
  });
  return { raw: raw || {}, map };
}

function normalizePaperInbox(raw) {
  const items = raw && Array.isArray(raw.items) ? raw.items : [];
  return {
    raw: raw || {},
    items: items.map((item) => ({
      id: item.id || `inbox-${Math.random().toString(36).slice(2, 10)}`,
      title: item.title || "Untitled paper",
      link: item.link || "",
      venue: item.venue || item.source || "",
      year: item.year || "",
      why: item.why || item.reason || "",
      raw: item.raw || "",
      topic_focus: item.topic_focus || "",
      status: item.status || "new",
      created_at: item.created_at || "",
      updated_at: item.updated_at || item.created_at || ""
    }))
  };
}

function paperInsight(paperId) {
  const raw = sync.paperInsights;
  if (!raw) return null;
  if (Array.isArray(raw.papers)) {
    return raw.papers.find((item) => item.id === paperId) || null;
  }
  if (raw.papers && typeof raw.papers === "object") {
    return raw.papers[paperId] || null;
  }
  return raw[paperId] || null;
}

function paperLesson(paperId) {
  const raw = sync.paperLessons;
  if (!raw) return null;
  if (Array.isArray(raw.papers)) {
    return raw.papers.find((item) => item.id === paperId) || null;
  }
  if (raw.papers && typeof raw.papers === "object") {
    return raw.papers[paperId] || null;
  }
  return raw[paperId] || null;
}

function isQuickUnderstandOpen(paperId) {
  return !!(state.quickUnderstandOpen && state.quickUnderstandOpen[paperId]);
}

async function setPaperRecord(paperId, patch) {
  const paper = findPaper(paperId);
  const next = { ...mergedRecord(paperId), paper_id: paperId, title: paper.title, status: patch.status || mergedRecord(paperId).status || "want", disliked: typeof patch.disliked === "boolean" ? patch.disliked : !!mergedRecord(paperId).disliked, updated_at: new Date().toISOString(), source: "site" };
  state.paperStatuses = state.paperStatuses || {};
  state.paperFlags = state.paperFlags || {};
  state.paperStatuses[paperId] = next.status;
  state.paperFlags[paperId] = { disliked: next.disliked };
  saveState();
  if (sync.paperRecords) sync.paperRecords.map[paperId] = next;
  else sync.paperRecords = normalizePaperRecords({ papers: [next] });
  if (sync.apiAvailable) {
    try {
      await persistPaperRecords();
      sync.lastError = "";
    } catch (error) {
      sync.apiAvailable = false;
      sync.lastError = error && error.message ? error.message : "save failed";
    }
  }
}

async function addInboxItem(item) {
  const next = { id: `inbox-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, title: item.title, link: item.link || "", venue: item.venue || "", year: item.year || "", why: item.why || "", raw: item.raw || "", topic_focus: item.topic_focus || topicFocus().primary_topic, status: "new", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), source: "site" };
  state.localInbox = Array.isArray(state.localInbox) ? state.localInbox : [];
  state.localInbox.unshift(next);
  saveState();
  const items = sync.paperInbox ? sync.paperInbox.items.slice() : inboxItems();
  items.unshift(next);
  sync.paperInbox = normalizePaperInbox({ ...(sync.paperInbox ? sync.paperInbox.raw : { schema_version: 2 }), items });
  if (sync.apiAvailable) {
    try {
      await persistPaperInbox();
      sync.lastError = "";
    } catch (error) {
      sync.apiAvailable = false;
      sync.lastError = error && error.message ? error.message : "inbox save failed";
    }
  }
}

async function updateInboxItem(itemId, patch) {
  const items = inboxItems().map((item) => item.id === itemId ? { ...item, ...patch, updated_at: new Date().toISOString() } : item);
  state.localInbox = items;
  saveState();
  sync.paperInbox = normalizePaperInbox({ ...(sync.paperInbox ? sync.paperInbox.raw : { schema_version: 2 }), items });
  if (sync.apiAvailable) {
    try {
      await persistPaperInbox();
      sync.lastError = "";
    } catch (error) {
      sync.apiAvailable = false;
      sync.lastError = error && error.message ? error.message : "inbox update failed";
    }
  }
}

async function persistPaperRecords() {
  const payload = { ...(sync.paperRecords && sync.paperRecords.raw ? sync.paperRecords.raw : {}), schema_version: 2, updated_at: new Date().toISOString(), papers: Object.values(sync.paperRecords.map).sort((a, b) => a.title.localeCompare(b.title)) };
  const saved = await apiJson("/api/records/paper-records", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  sync.paperRecords = normalizePaperRecords(saved && Object.keys(saved).length ? saved : payload);
}

async function persistPaperInbox() {
  const payload = { ...(sync.paperInbox && sync.paperInbox.raw ? sync.paperInbox.raw : {}), schema_version: 2, updated_at: new Date().toISOString(), items: sync.paperInbox.items };
  const saved = await apiJson("/api/records/paper-inbox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  sync.paperInbox = normalizePaperInbox(saved && Object.keys(saved).length ? saved : payload);
}

async function apiJson(path, options) {
  const response = await fetch(path, options || {});
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

function syncBanner(mode) {
  const detail = sync.apiAvailable ? "Changes will sync into project records." : `Sync unavailable${sync.syncChecked && sync.lastError ? ` (${sync.lastError})` : ""}. Using local fallback.`;
  return `<section class="sync-banner ${sync.apiAvailable ? "online" : "offline"}${mode === "inline" ? " inline" : ""}"><strong>${sync.apiAvailable ? "Project sync is on" : "Project sync is off"}</strong><span>${detail}</span></section>`;
}

function navLabel(name) {
  return NAV_TITLES[name] || name;
}

function percent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function byId(id) {
  return document.getElementById(id);
}

function qsa(root, selector) {
  return Array.from(root.querySelectorAll(selector));
}

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function truncate(value, length) {
  return value.length > length ? `${value.slice(0, length - 3)}...` : value;
}

function renderFatalBootError(error) {
  const message = error && error.message ? error.message : String(error || "Unknown error");
  const shell = document.querySelector(".main") || document.body;
  if (!shell) return;
  shell.innerHTML = `
    <section class="sync-banner offline" style="margin: 24px;">
      <strong>Site startup failed</strong>
      <span>${escapeHtml(message)}</span>
    </section>
  `;
}

function renderQuickUnderstandSection(paper, insight) {
  const lesson = insight && insight.thesis ? insight : buildDeepUnderstandLesson(paper, insight, data.anchorNotes.find((item) => item.paperId === paper.id), comparePaper(paper.id));
  return `
    <section id="quick-understand" class="quick-understand-card ${isQuickUnderstandOpen(paper.id) ? "" : "collapsed"}">
      <div class="section-head">
        <div>
          <p class="eyebrow">\u5feb\u901f\u7406\u89e3</p>
          <h4>\u5148\u7528 90 \u79d2\u628a paper \u7684\u9aa8\u67b6\u6293\u4f4f</h4>
        </div>
        <span class="tag">understanding first</span>
      </div>
      <p class="quick-takeaway">${escapeHtml(lesson.thesis || paper.title)}</p>
      <div class="quick-understand-grid no-figure">
        <div class="quick-copy">
          ${quickBlock("\u9019\u7bc7 paper \u5728\u89e3\u6c7a\u4ec0\u9ebc", lesson.problemFrame || lesson.researchQuestion)}
          ${quickBlock("\u4f5c\u8005\u6700\u60f3\u8aaa\u670d\u4f60\u7684\u4e8b", lesson.authorClaim || lesson.coreClaim)}
          ${quickListBlock("\u5f15\u8a00\u61c9\u8a72\u9019\u6a23\u770b", lesson.introGuide)}
          ${quickBlock("\u65b9\u6cd5 / \u8a2d\u5b9a\u4e00\u53e5\u8a71", lesson.methodSummary || lesson.methodSetup)}
          ${quickBlock("\u8b80\u5b8c\u5f8c\u6700\u8a72\u5e36\u8d70\u7684\u7406\u89e3", lesson.coreInsight || lesson.readerValue)}
          ${quickListBlock("\u8b80\u5b8c\u5f8c\u4e0b\u4e00\u6b65", lesson.afterReading)}
        </div>
      </div>
    </section>
  `;
}

function renderDetailPreviewCard(paper, lesson) {
  if (!lesson.figure) return "";
  return `
    <button type="button" class="detail-preview-card" data-open-image="${escapeHtml(lesson.figure)}" data-open-image-title="${escapeHtml(paper.title)}" data-open-image-caption="${escapeHtml(lesson.figureCaption || "Representative figure")}">
      <span class="detail-preview-label">Paper preview</span>
      <img src="${escapeHtml(lesson.figure)}" alt="${escapeHtml(paper.title)} figure">
      <span class="detail-preview-caption">${escapeHtml(lesson.figureCaption || "Open paper preview")}</span>
    </button>
  `;
}

function renderQuickUnderstandSectionV2(paper, insight) {
  return renderQuickUnderstandSection(paper, insight);
}

function quickBlock(title, text) {
  if (!text) return "";
  return `<div class="quick-block"><h5>${escapeHtml(title)}</h5><p>${escapeHtml(text)}</p></div>`;
}

function quickListBlock(title, items) {
  if (!Array.isArray(items) || !items.length) return "";
  return `<div class="quick-block"><h5>${escapeHtml(title)}</h5><ul class="quick-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>`;
}

function buildDeepUnderstandLesson(paper, insight, note, related) {
  const storedLesson = paperLesson(paper.id);
  if (storedLesson) return storedLesson;
  const safeInsight = insight || {};
  const nextAfterSummary = Array.isArray(safeInsight.next_after_summary) && safeInsight.next_after_summary.length
    ? safeInsight.next_after_summary
    : [`Compare it with ${related.title}.`, "Write down one thing the paper clarifies and one thing it still leaves open."];
  const thesis = safeInsight.quick_takeaway || `${paper.title} is best read as a paper about ${paper.focus}, not as a generic score improvement story.`;
  const problemFrame = safeInsight.problem || paper.why;
  const methodSummary = safeInsight.method_or_setup || `The paper builds its case through a ${paper.focus} setup rather than only making a broad capability claim.`;
  const resultsSummary = safeInsight.why_it_matters || paper.why;
  return {
    subtitle: `${paper.venue} ${paper.year} | ${clusterName(paper.category)} | ${paper.focus}`,
    thesis,
    bigPicture: `${paper.title} sits inside ${clusterName(paper.category)}. The useful reading strategy is to follow the authors' argument from failure definition, to method/setup choice, to the one or two experiments that actually support the claim.`,
    figure: safeInsight.figure || "",
    figureCaption: safeInsight.figure_caption || "Use the figure as an entry point into the paper's framing and setup.",
    fastTakeaways: [
      { label: "\u554f\u984c", text: problemFrame },
      { label: "\u4e3b\u5f35", text: thesis },
      { label: "\u70ba\u4ec0\u9ebc\u91cd\u8981", text: resultsSummary }
    ],
    introGuide: [
      `Opening motivation: the paper starts from this friction point: ${problemFrame}`,
      `Gap statement: existing work still misses something about ${paper.focus}, so better generic video QA is not enough.`,
      `Author bet: ${methodSummary}`,
      `Promise check: the paper only succeeds if the experiments really support "${thesis}".`
    ],
    steps: [
      {
        title: "\u5148\u628a introduction \u8b80\u6210\u4e00\u500b argument",
        summary: "Do not memorize the prose. Track how the introduction moves from a field-level problem to one concrete claim.",
        points: [
          "Find the frustration with current methods or benchmarks.",
          "Find the exact gap the paper says prior work leaves unresolved.",
          "Underline the one sentence that states what the paper changes."
        ]
      },
      {
        title: "\u518d\u554f\u81ea\u5df1\u4e3b\u5f35\u662f\u5426\u5408\u7406",
        summary: "Translate the main claim into plain language a labmate could challenge.",
        points: [
          `The paper wants you to believe: ${thesis}`,
          `That belief depends on this setup: ${methodSummary}`,
          "Ask what evidence would falsify the claim."
        ]
      },
      {
        title: "\u628a method / benchmark \u62c6\u89e3\u6210\u53ef\u6559\u5b78\u7684\u7d44\u4ef6",
        summary: "A good reading is component-level: what enters, what is emphasized, and what is scored.",
        points: teachingMethodChecklist(paper, methodSummary)
      },
      {
        title: "\u6700\u5f8c\u7528 experiments \u6c7a\u5b9a\u8981\u4e0d\u8981\u76f8\u4fe1",
        summary: "The table matters only if it directly tests the paper's promised failure mode.",
        points: teachingResultsChecklist(paper, thesis, related)
      }
    ],
    methodSummary,
    methodChecklist: teachingMethodChecklist(paper, methodSummary),
    resultsSummary,
    resultsChecklist: teachingResultsChecklist(paper, thesis, related),
    skepticism: [
      `Does this paper really test ${paper.focus}, or only a nearby capability?`,
      "If you remove the authors' favorite setting, does the conclusion still hold?",
      note ? `Anchor note: ${note.hiddenLesson}` : "Was the strongest claim challenged by a strong enough baseline?"
    ],
    comparisonSummary: `${related.title} is the most natural next comparison because it answers a nearby question from the same cluster.`, 
    afterReading: nextAfterSummary,
    problemFrame,
    authorClaim: `${methodSummary} The authors want this to change how you think about ${paper.focus}.`,
    note: note ? note.hiddenLesson : "",
    researchQuestion: problemFrame,
    coreClaim: thesis,
    methodSetup: methodSummary,
    coreInsight: note ? note.hiddenLesson : resultsSummary,
    readerValue: resultsSummary,
    comparison: related ? { id: related.id, title: related.title, venue: related.venue, year: related.year, link: related.link } : null,
    whyItMatters: resultsSummary
  };
}

function teachingMethodChecklist(paper, methodSummary) {
  const categorySpecific = {
    evaluation: "Ask what shortcuts the benchmark blocks and which shortcuts may still survive.",
    localization: "Track how answers are bound to time spans rather than left as free-form text.",
    longvideo: "Focus on evidence selection, compression, or retrieval before reasoning quality.",
    causal: "Check how multi-step temporal evidence is represented and supervised.",
    ordering: "See whether order, duration, and state change are explicit or only indirectly implied."
  }[paper.category] || "Identify the mechanism that is supposed to fix the stated failure.";
  return [
    `Core mechanism: ${methodSummary}`,
    categorySpecific,
    "Translate each component into simple language: input, intermediate signal, output.",
    "Ask which piece is essential and which piece looks like support machinery."
  ];
}

function teachingResultsChecklist(paper, thesis, related) {
  return [
    `Look for the one table or figure that most directly supports "${thesis}".`,
    `Check whether the strongest baseline to compare against is really the nearest idea, often ${related.title}.`,
    `Ask whether the result demonstrates better ${paper.focus}, or only broader video-language competence.`,
    "Use ablations to see whether the claimed mechanism actually causes the gain."
  ];
}

function renderDeepUnderstand() {
  if (!deepRoot) return;
  if (!state.deepUnderstand || !state.deepUnderstand.paperId) {
    deepRoot.innerHTML = "";
    return;
  }
  const paper = findPaper(state.deepUnderstand.paperId);
  const insight = paperInsight(paper.id);
  const note = data.anchorNotes.find((item) => item.paperId === paper.id);
  const related = comparePaper(paper.id);
  const lesson = buildDeepUnderstandLesson(paper, insight, note, related);

  deepRoot.innerHTML = `
    <div class="deep-understand-backdrop" data-close-deep="1"></div>
    <div class="deep-understand-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(paper.title)} detailed understanding">
      <div class="section-head deep-understand-head">
        <div>
          <p class="eyebrow">Detailed Understand</p>
          <h3>${escapeHtml(paper.title)}</h3>
          <p class="muted">${escapeHtml(lesson.subtitle)}</p>
        </div>
        <div class="deep-understand-actions">
          <span class="tag">${escapeHtml(clusterName(paper.category))}</span>
          <button class="secondary-btn" data-close-deep="1">Close</button>
        </div>
      </div>
      <section class="teaching-hero">
        <div class="teaching-hero-copy">
          <p class="eyebrow">One Sentence First</p>
          <h4>${escapeHtml(lesson.thesis)}</h4>
          <p>${escapeHtml(lesson.bigPicture)}</p>
          <div class="tag-row">
            <span class="tag">${escapeHtml(paper.venue)} ${escapeHtml(paper.year)}</span>
            <span class="tag">${escapeHtml(paper.focus)}</span>
            ${note ? `<span class="tag">anchor lesson</span>` : ""}
          </div>
        </div>
        ${lesson.figure ? `
          <button type="button" class="teaching-hero-figure" data-open-image="${escapeHtml(lesson.figure)}" data-open-image-title="${escapeHtml(paper.title)}" data-open-image-caption="${escapeHtml(lesson.figureCaption)}">
            <img src="${escapeHtml(lesson.figure)}" alt="${escapeHtml(paper.title)} figure">
            <span>${escapeHtml(lesson.figureCaption)}</span>
          </button>
        ` : ""}
      </section>
      <section class="teaching-strip">
        ${lesson.fastTakeaways.map((item) => `<article class="teaching-chip-card"><h5>${escapeHtml(item.label)}</h5><p>${escapeHtml(item.text)}</p></article>`).join("")}
      </section>
      <section class="teaching-section">
        <div class="section-head">
          <div><p class="eyebrow">Lab Walkthrough</p><h4>Walk through the introduction like a lab presentation</h4></div>
          <span class="tag">step by step</span>
        </div>
        <div class="teaching-steps">
          ${lesson.steps.map((step, index) => `
            <article class="teaching-step-card">
              <div class="teaching-step-index">Step ${index + 1}</div>
              <h5>${escapeHtml(step.title)}</h5>
              <p>${escapeHtml(step.summary)}</p>
              ${Array.isArray(step.points) && step.points.length ? `<ul class="quick-list">${step.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>` : ""}
            </article>
          `).join("")}
        </div>
      </section>
      <section class="deep-understand-grid">
        <article class="teaching-panel">
          <p class="eyebrow">Method / Setup</p>
          <h4>What the authors actually do</h4>
          <ul class="quick-list">${lesson.methodChecklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </article>
        <article class="teaching-panel">
          <p class="eyebrow">Results</p>
          <h4>How to read the results</h4>
          <p>${escapeHtml(lesson.resultsSummary)}</p>
          <ul class="quick-list">${lesson.resultsChecklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </article>
      </section>
      <section class="deep-understand-grid">
        <article class="teaching-panel">
          <p class="eyebrow">Skepticism</p>
          <h4>What you should be skeptical about</h4>
          <ul class="quick-list">${lesson.skepticism.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </article>
        <article class="teaching-panel">
          <p class="eyebrow">Natural Comparison</p>
          <h4>What to read next after this paper</h4>
          <p>${escapeHtml(lesson.comparisonSummary)}</p>
          <div class="tag-row">
            <span class="tag">${escapeHtml(related.title)}</span>
            ${pill(statusOf(related.id))}
          </div>
          <div class="prompt-actions">
            <button class="secondary-btn" data-open-related-deep="${related.id}">\u6253\u958b\u5c0d\u7167 paper</button>
            <a class="detail-link detail-link-btn" href="${paper.link}" target="_blank" rel="noreferrer">\u6253\u958b\u539f\u6587</a>
          </div>
        </article>
      </section>
      <section class="teaching-panel">
        <p class="eyebrow">After Reading</p>
        <h4>After this, you should be able to answer these three questions</h4>
        <div class="teaching-questions">
          ${lesson.afterReading.map((item) => `<div class="decision-result">${escapeHtml(item)}</div>`).join("")}
        </div>
        ${lesson.note ? `<p class="sync-note"><strong>Anchor lesson:</strong> ${escapeHtml(lesson.note)}</p>` : ""}
      </section>
    </div>
  `;

  qsa(deepRoot, "[data-close-deep]").forEach((node) => node.addEventListener("click", () => {
    state.deepUnderstand = null;
    saveState();
    renderDeepUnderstand();
  }));
  qsa(deepRoot, "[data-open-related-deep]").forEach((node) => node.addEventListener("click", () => {
    openDeepUnderstand(node.dataset.openRelatedDeep);
    state.selectedPaperId = node.dataset.openRelatedDeep;
    saveState();
    renderPapers();
  }));
  qsa(deepRoot, "[data-open-image]").forEach((button) => button.addEventListener("click", () => {
    const images = paperPreviewImages(paper);
    state.imageViewer = {
      src: button.dataset.openImage,
      title: button.dataset.openImageTitle || paper.title,
      caption: button.dataset.openImageCaption || "Representative figure",
      images,
      index: 0
    };
    saveState();
    renderImageViewer();
  }));
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem("tv-research-navigator-state")) || {};
    parsed.paperStatuses = parsed.paperStatuses || {};
    parsed.paperFlags = parsed.paperFlags || {};
    parsed.localInbox = Array.isArray(parsed.localInbox) ? parsed.localInbox : [];
    parsed.quickUnderstandOpen = parsed.quickUnderstandOpen || {};
    parsed.deepUnderstand = parsed.deepUnderstand || null;
    parsed.imageViewer = parsed.imageViewer || null;
    return parsed;
  } catch (_error) {
    return { paperStatuses: {}, paperFlags: {}, localInbox: [], quickUnderstandOpen: {}, deepUnderstand: null, imageViewer: null };
  }
}

function saveState() {
  localStorage.setItem("tv-research-navigator-state", JSON.stringify(state));
}
})();


