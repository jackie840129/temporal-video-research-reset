﻿(function () {
const data = window.RESEARCH_DATA;
const state = loadState();
const sync = {
  apiAvailable: false,
  syncChecked: false,
  paperRecords: null,
  paperInbox: null,
  topicFocus: null,
  paperInsights: null,
  lastError: ""
};

const LABELS = {
  status: {
    want: "?唾?",
    reading: "?刻?",
    read: "撌脰?",
    pause: "?怠?",
    not_now: "??霈",
    disliked: "銝??閎"
  },
  triage: {
    new: "?啣???,
    shortlisted: "撌脣??,
    imported: "撌脣??,
    rejected: "?仿?"
  }
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

bindShell();
renderAll();
setView(state.view || "dashboard");
loadPaperInsights();
loadRecordsFromApi();

function bindShell() {
  byId("reset-state-btn").addEventListener("click", () => {
    localStorage.removeItem("tv-research-navigator-state");
    location.reload();
  });
  byId("quick-jump-btn").addEventListener("click", togglePalette);
  byId("ask-codex-btn").addEventListener("click", togglePromptBuilder);
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
    }
  });
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
}

function setView(name) {
  state.view = name;
  saveState();
  Object.entries(views).forEach(([key, node]) => node.classList.toggle("active", key === name));
  qsa(document, ".nav-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === name);
  });
  viewTitle.textContent = navLabel(name);
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
          <span class="tag">${sync.apiAvailable ? "撠?蝝??甇乩葉" : "雿輻?祆??怠?"}</span>
        </div>
        <div class="progress-wrap">
          <div class="section-head"><strong>?脣漲</strong><span class="muted">${Math.round((readCount / data.papers.length) * 100)}%</span></div>
          <div class="progress-track"><div class="progress-bar" style="width:${Math.round((readCount / data.papers.length) * 100)}%"></div></div>
        </div>
        <div class="micro-stats">
          <div class="micro-stat"><strong>${readCount}</strong><span class="muted">撌脰?</span></div>
          <div class="micro-stat"><strong>${readingCount}</strong><span class="muted">?刻?</span></div>
          <div class="micro-stat"><strong>${inboxItems().length}</strong><span class="muted">?嗡辣??/span></div>
        </div>
      </div>
      <div class="card">
        <p class="eyebrow">?桀?銝駁?</p>
        <h3>${focus.primary_topic}</h3>
        <p class="muted">${focus.summary}</p>
        <div class="tag-row">${focus.practical_failure_modes.map((item) => `<span class="tag">${item}</span>`).join("")}</div>
      </div>
    </section>
    <section class="dashboard-grid">
      <div class="card">
        <div class="section-head"><div><p class="eyebrow">Field Map</p><h3>銝駁?蝢斤?</h3></div></div>
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
        <div class="section-head"><div><p class="eyebrow">Temporal Hallucination</p><h3>??隢?</h3></div></div>
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
    <section class="summary-actions">
      <article class="summary-action" data-jump="taskboard"><p class="eyebrow">?祇?/p><h3>?祇曹遙?</h3><p>?亦????梁?隢?????/p></article>
      <article class="summary-action" data-jump="inbox"><p class="eyebrow">?嗡辣??/p><h3>敺??/h3><p>???函??啁? paper 鞎潮脖?銝血??脣?獢???/p></article>
      <article class="summary-action" data-jump="decision"><p class="eyebrow">瘙箇?</p><h3>銝?甇亙遣霅?/h3><p>???曉?????銝?擃?銝甇乓?/p></article>
    </section>
  `;
  qsa(views.dashboard, "[data-cluster]").forEach((node) => node.addEventListener("click", () => {
    state.categoryFilter = node.dataset.cluster;
    state.selectedPaperId = "";
    saveState();
    renderPapers();
    setView("papers");
  }));
  qsa(views.dashboard, "[data-paper]").forEach((node) => node.addEventListener("click", () => {
    state.selectedPaperId = node.dataset.paper;
    saveState();
    renderPapers();
    setView("papers");
  }));
  qsa(views.dashboard, "[data-jump]").forEach((node) => node.addEventListener("click", () => setView(node.dataset.jump)));
}

function renderPapers() {
  const papers = filteredPapers();
  const selectedId = papers.find((paper) => paper.id === state.selectedPaperId)?.id || (papers[0] && papers[0].id) || data.papers[0].id;
  const focus = topicFocus();
  views.papers.innerHTML = `
    ${syncBanner("inline")}
    <section class="topic-spotlight">
      <div class="section-head">
        <div><p class="eyebrow">銝駁??阡?</p><h3>${focus.primary_topic}</h3></div>
        <span class="tag">temporal hallucination</span>
      </div>
      <p class="muted">${focus.summary}</p>
      <div class="tag-row">${focus.practical_failure_modes.map((item) => `<span class="tag">${item}</span>`).join("")}</div>
      <div class="tag-row">${focusSeedPapers().slice(0, 4).map((paper) => `<button class="secondary-btn" data-focus-paper="${paper.id}">${paper.title}</button>`).join("")}</div>
    </section>
    <div class="filters-bar">
      <input id="paper-search" class="search-input" type="search" placeholder="?? title?enue?ocus">
      <div class="filter-row">${["All", "A", "B", "C"].map((tier) => `<button class="filter-chip ${tierFilter() === tier ? "active" : ""}" data-tier="${tier}">${tier === "All" ? "?券??" : `Tier ${tier}`}</button>`).join("")}</div>
      <div class="status-filter-row">${["all", "want", "reading", "read", "pause", "not_now", "disliked"].map((status) => `<button class="filter-chip ${statusFilter() === status ? "active" : ""}" data-status="${status}">${status === "all" ? "?券??? : LABELS.status[status]}</button>`).join("")}</div>
      <select id="category-filter" class="select-input">
        <option value="all">?券憿</option>
        ${data.clusters.map((cluster) => `<option value="${cluster.id}" ${categoryFilter() === cluster.id ? "selected" : ""}>${cluster.name}</option>`).join("")}
      </select>
    </div>
    <div class="papers-layout">
      <div class="card">
        <div class="section-head"><div><p class="eyebrow">Paper Queue</p><h3>隢?</h3></div><span class="tag">${papers.length} 蝑???/span></div>
        <div class="paper-list">
          ${papers.length ? papers.map((paper) => `
            <article class="paper-item ${paper.id === selectedId ? "active" : ""}" data-paper="${paper.id}">
              <div class="paper-item-top"><h4>${paper.title}</h4><span class="tier-badge tier-${paper.tier}">${paper.tier}</span></div>
              <p class="paper-subline">${paper.venue} ${paper.year} 繚 ${paper.focus}</p>
              <p class="muted">${paper.why}</p>
              <div class="tag-row">
                <span class="tag">${clusterName(paper.category)}</span>
                ${focusRelated(paper) ? '<span class="tag">topic match</span>' : ""}
                ${paper.anchor ? '<span class="tag">anchor</span>' : ""}
                ${pill(statusOf(paper.id))}
              </div>
            </article>
          `).join("") : '<p class="muted">?桀?瘝?蝚血?蝭拚璇辣????/p>'}
        </div>
      </div>
      <div id="paper-detail" class="detail-card"></div>
    </div>
  `;
  byId("paper-search").value = state.paperQuery || "";
  byId("paper-search").addEventListener("input", (event) => {
    state.paperQuery = event.target.value;
    saveState();
    renderPapers();
  });
  qsa(views.papers, "[data-tier]").forEach((button) => button.addEventListener("click", () => {
    state.tierFilter = button.dataset.tier;
    saveState();
    renderPapers();
  }));
  qsa(views.papers, "[data-status]").forEach((button) => button.addEventListener("click", () => {
    state.paperStatusFilter = button.dataset.status;
    saveState();
    renderPapers();
  }));
  byId("category-filter").addEventListener("change", (event) => {
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
  const paper = findPaper(paperId);
  const note = data.anchorNotes.find((item) => item.paperId === paper.id);
  const related = comparePaper(paper.id);
  const status = statusOf(paper.id);
  const record = mergedRecord(paper.id);
  const insight = paperInsight(paper.id);
  byId("paper-detail").innerHTML = `
    <div class="section-head">
      <div><p class="eyebrow">?弦閰喳</p><h3>${paper.title}</h3></div>
      ${pill(status)}
    </div>
    <div class="meta-row">
      <span class="tag">${paper.venue} ${paper.year}</span>
      <span class="tag">${clusterName(paper.category)}</span>
      <span class="tag">${focusRelated(paper) ? "hallucination-related" : "general"}</span>
    </div>
    <p>${paper.why}</p>
    <div class="status-buttons">${["want", "reading", "read", "pause", "not_now"].map((key) => `<button class="status-btn ${status === key ? "active" : ""}" data-status-set="${key}">${LABELS.status[key]}</button>`).join("")}</div>
    <div class="status-buttons">
      <button class="secondary-btn ${record.disliked ? "active-soft" : ""}" data-dislike="${paper.id}">銝??閎 / ?思??賊?</button>
      <button class="secondary-btn" data-undislike="${paper.id}">皜璅?</button>
    </div>
    <p class="sync-note">${record.disliked ? "?? paper 撌脰◤璅??箔??芸?嚗?敺??queue ???身?仿??? : "????芸??郊?啣?獢???憒? API ?急?銝?剁???璈摮?}</p>
    ${detailSection("summary", "敹恍?閬?, `<p>${paper.title} is a ${paper.venue} ${paper.year} paper focused on ${paper.focus}. Use it to test whether the gain is truly temporal or benchmark-shaped.</p>`)}
    ${detailSection("read", "?梯???", `<p>Track the temporal assumption, benchmark dependency, and what would likely break in realistic use.</p>`)}
    ${note ? detailSection("anchor", "?詨??", `<p><strong>Verdict:</strong> ${note.verdict}</p><p><strong>Hidden lesson:</strong> ${note.hiddenLesson}</p>`) : ""}
    ${detailSection("compare", "?芰瘥?撠情", `<div class="tag-row"><span class="tag">${related.venue} ${related.year}</span>${pill(statusOf(related.id))}</div><p>${related.title}</p><button class="secondary-btn" data-related="${related.id}">??瘥?隢?</button>`)}
    <p style="margin-top:16px;"><a class="detail-link" href="${paper.link}" target="_blank" rel="noreferrer">打開原始論文</a></p>
  `;
  if (insight) {
    const detailRoot = byId("paper-detail");
    const syncNote = detailRoot.querySelector(".sync-note");
    if (syncNote) {
      syncNote.insertAdjacentHTML("beforebegin", `
        <div class="status-buttons quick-brief-actions">
          <button class="primary-btn" data-toggle-quick-understand="${paper.id}">${isQuickUnderstandOpen(paper.id) ? "收合快速理解" : "快速理解這篇"}</button>
          <a class="secondary-btn detail-link-btn" href="${paper.link}" target="_blank" rel="noreferrer">打開原始論文</a>
        </div>
      `);
      syncNote.insertAdjacentHTML("afterend", renderQuickUnderstandSection(paper, insight));
    }
  }
  qsa(byId("paper-detail"), "[data-status-set]").forEach((button) => button.addEventListener("click", async () => {
    await setPaperRecord(paper.id, { status: button.dataset.statusSet, disliked: false });
    renderAll();
    setView("papers");
  }));
  qsa(byId("paper-detail"), "[data-dislike]").forEach((button) => button.addEventListener("click", async () => {
    await setPaperRecord(paper.id, { status: "not_now", disliked: true });
    renderAll();
    setView("papers");
  }));
  qsa(byId("paper-detail"), "[data-undislike]").forEach((button) => button.addEventListener("click", async () => {
    await setPaperRecord(paper.id, { status: "pause", disliked: false });
    renderAll();
    setView("papers");
  }));
  qsa(byId("paper-detail"), ".detail-section-toggle").forEach((button) => button.addEventListener("click", () => {
    state.detailSections = state.detailSections || {};
    state.detailSections[button.dataset.section] = !state.detailSections[button.dataset.section];
    saveState();
    renderPaperDetail(paper.id);
  }));
  const relatedButton = byId("paper-detail").querySelector("[data-related]");
  if (relatedButton) {
    relatedButton.addEventListener("click", () => {
      state.selectedPaperId = relatedButton.dataset.related;
      saveState();
      renderPapers();
    });
  }
  qsa(byId("paper-detail"), "[data-toggle-quick-understand]").forEach((button) => button.addEventListener("click", () => {
    state.quickUnderstandOpen = state.quickUnderstandOpen || {};
    state.quickUnderstandOpen[button.dataset.toggleQuickUnderstand] = !isQuickUnderstandOpen(button.dataset.toggleQuickUnderstand);
    saveState();
    renderPaperDetail(paper.id);
  }));
}

function renderRoadmap() {
  views.roadmap.innerHTML = `
    ${syncBanner("soft")}
    <div class="timeline-grid">
      ${data.weeks.map((week) => `
        <article class="timeline-card timeline-item" data-week-card="${week.week}">
          <div class="section-head"><h3><span class="week-number">Week ${week.week}</span> 繚 ${week.title}</h3><span class="tag">${week.week === currentWeek().week ? "?祇? : "閬?"}</span></div>
          <p><strong>Read:</strong> ${week.reads.join(", ")}</p>
          <p><strong>Deliverable:</strong> ${week.deliverable}</p>
          <div class="timeline-actions">
            <button class="secondary-btn" data-week-task="${week.week}">?祇曹遙?</button>
            <button class="secondary-btn" data-week-papers="${week.week}">?祇梯???/button>
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
        <div class="section-head"><div><p class="eyebrow">憭隢?</p><h3>?嗡辣??/ 敺??/h3></div><span class="tag">${items.length} 蝑?/span></div>
        <p class="muted">???典隞?寧??啁? paper 鞎潮脖??PI ?舐??撖恍脣?獢???銝?冽???摮?祆???/p>
        <div class="topic-spotlight compact">
          <div class="section-head"><div><p class="eyebrow">?桀??阡?</p><h4>${focus.primary_topic}</h4></div><span class="tag">topic focus</span></div>
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
            <button type="submit" class="primary-btn">摮?嗡辣??/button>
            <button type="button" id="fill-topic-focus" class="secondary-btn">撣嗅銝駁??阡?</button>
          </div>
        </form>
      </section>
      <section class="card inbox-list-card">
        <div class="section-head"><div><p class="eyebrow">撌脰蕭頩日???/p><h3>敺??/h3></div></div>
        ${items.length ? `<div class="paper-list">${items.map(renderInboxItem).join("")}</div>` : `<div class="empty-state"><h4>?桀??????刻???/h4><p>??title?ink ??citation 鞎潮脖?嚗?敺??queue ?停?賭?韏瑁??/p></div>`}
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
      <div class="section-head"><div><h4>${item.title}</h4><p class="paper-subline">${[item.venue, item.year].filter(Boolean).join(" 繚 ") || "撠??靘?"}</p></div><span class="status-pill inbox-status inbox-${item.status}">${LABELS.triage[item.status] || item.status}</span></div>
      ${item.why ? `<p>${item.why}</p>` : ""}
      ${item.raw ? `<p class="muted">${truncate(item.raw, 220)}</p>` : ""}
      <div class="tag-row">${item.topic_focus ? `<span class="tag">${item.topic_focus}</span>` : ""}<span class="tag">${sync.apiAvailable ? "records API" : "?祆??怠?"}</span></div>
      <div class="timeline-actions">
        <button class="secondary-btn" data-inbox-status="shortlisted" data-inbox-id="${item.id}">??</button>
        <button class="secondary-btn" data-inbox-status="imported" data-inbox-id="${item.id}">撌脣??/button>
        <button class="secondary-btn" data-inbox-status="rejected" data-inbox-id="${item.id}">?仿?</button>
        ${item.link ? `<button class="secondary-btn" data-open-link="${item.id}">?????</button>` : ""}
      </div>
    </article>
  `;
}

function renderTaskboard() {
  const week = currentWeek();
  const tasks = weeklyTasks(week);
  const progress = Math.round((tasks.filter((task) => task.done).length / tasks.length) * 100);
  views.taskboard.innerHTML = `
    ${syncBanner("soft")}
    <div class="card">
      <div class="section-head"><div><p class="eyebrow">?祇梯???/p><h3>?祇曹遙?</h3></div><span class="tag">Week ${week.week}</span></div>
      <p class="muted">隞餃????望活???????????/p>
      <div class="progress-wrap"><div class="section-head"><strong>?脣漲</strong><span class="muted">${progress}%</span></div><div class="progress-track"><div class="progress-bar" style="width:${progress}%"></div></div></div>
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
        <h3>?豢?璅∪?</h3>
        <p class="muted">???桀??????銝?擃?銝甇乓?/p>
        <label for="goal-select">?格?</label>
        <select id="goal-select" class="select-input">
          <option value="map">?遣 field map</option>
          <option value="project">?嗆???蝛園???/option>
          <option value="taste">?? research taste</option>
        </select>
        <label for="energy-select">蝎曉?</label>
        <select id="energy-select" class="select-input">
          <option value="low">雿?/option>
          <option value="medium">銝?/option>
          <option value="high">擃?/option>
        </select>
        <label for="confusion-select">銝餉??⊿?</label>
        <select id="confusion-select" class="select-input">
          <option value="too-broad">?????臬云撱?/option>
          <option value="what-read">???仿?銝?蝭府霈隞暻?/option>
          <option value="what-idea">???仿??芸?憿澆?餈?/option>
        </select>
        <div style="margin-top:14px"><button id="recommend-btn" class="primary-btn">?Ｙ?銝?甇亙遣霅?/button></div>
      </section>
      <section class="decision-card"><h3>撱箄降</h3><div id="decision-output"></div></section>
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
      <p class="eyebrow">敹恍歲頧?/p>
      <h3>???????/h3>
      <div class="command-grid">${items.map((item, index) => `<article class="command-item" data-cmd="${index}"><strong>${item.title}</strong><small>${item.subtitle}</small><div class="tag-row"><span class="tag">${item.kind}</span></div></article>`).join("")}</div>
    </div>
  `;
  qsa(cmdRoot, "[data-close]").forEach((node) => node.addEventListener("click", () => { state.palette = false; saveState(); renderPalette(); }));
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
  if (!state.promptBuilder) {
    promptRoot.innerHTML = "";
    return;
  }
  const ctx = promptContext();
  const prompt = buildPrompt(ctx);
  promptRoot.innerHTML = `
    <div class="prompt-backdrop" data-close-prompt="1"></div>
    <div class="prompt-modal">
      <div class="section-head"><div><p class="eyebrow">Ask Codex</p><h3>?寞??桀??恍?Ｙ? prompt</h3></div><div class="tag-row"><span class="tag">Ctrl/Cmd + J</span><span class="tag">${navLabel(state.view || "dashboard")}</span></div></div>
      <div class="prompt-grid">
        <section class="prompt-panel">
          <h4>雿???</h4>
          <textarea id="codex-question" class="prompt-textarea" placeholder="???桀??恍??">${escapeHtml(state.codexQuestion || "")}</textarea>
          <div class="prompt-actions">
            <button id="build-codex-prompt" class="primary-btn">?湔 prompt</button>
            <button id="copy-codex-prompt" class="secondary-btn">銴ˊ</button>
            <button id="close-codex-prompt" class="secondary-btn">??</button>
          </div>
        </section>
        <section class="prompt-panel">
          <h4>Prompt</h4>
          <div id="codex-prompt-output" class="prompt-output">${escapeHtml(prompt)}</div>
        </section>
      </div>
    </div>
  `;
  qsa(promptRoot, "[data-close-prompt]").forEach((node) => node.addEventListener("click", () => { state.promptBuilder = false; saveState(); renderPromptBuilder(); }));
  byId("close-codex-prompt").addEventListener("click", () => { state.promptBuilder = false; saveState(); renderPromptBuilder(); });
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
      byId("copy-codex-prompt").textContent = "撌脰?鋆?;
      setTimeout(() => {
        const button = byId("copy-codex-prompt");
        if (button) button.textContent = "銴ˊ";
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
    <div class="decision-result"><p><strong>銵?:</strong> ${choice.action}</p><p>${choice.why}</p></div>
    <div class="decision-result"><p><strong>銝?蝭遣霅?</strong> ${choice.papers.join(", ")}</p></div>
    <div class="decision-result"><p><strong>頛詨:</strong> ${choice.output}</p></div>
    <div class="decision-result"><p><strong>??:</strong> ${choice.guardrail}</p></div>
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
    type: "?祇曹蜓蝺?,
    title: week.title,
    body: `Read ${week.reads.join(", ")} and finish: ${week.deliverable}`,
    done: read.length === papers.length && papers.length > 0,
    action: "week-papers",
    week: week.week
  }];
  reading.forEach((paper) => tasks.push({ type: "?刻?", title: `霈摰?${paper.title}`, body: "??撌脩??券脰?銝准?, done: false, action: "paper", paperId: paper.id }));
  want.forEach((paper) => tasks.push({ type: "?唾?", title: `??霈 ${paper.title}`, body: "?? first pass嚗?瘙箏?閬?閬??霈??, done: false, action: "paper", paperId: paper.id }));
  if (!papers.length) tasks.push({ type: "?頝臬?", title: "???祇梯???, body: "???梁??瘝?摰撠?嚗?隞亙?敺???????, done: false, action: "papers" });
  if (!want.length && !reading.length && !read.length) tasks.push({ type: "????, title: "?? 2-3 蝭?梯???, body: "雿?璅嗾蝭?隞餃??踵??鞎潸?雿??脣漲??, done: false, action: "week-papers", week: week.week });
  tasks.push({ type: "?祇望??, title: "?湔?勗??, body: read.length >= 2 ? "撖思?隞賣?頛?note ??斗 memo?? : "??銝蝭?benchmark paper ??蝭?method paper??, done: read.length >= 2, action: read.length >= 2 ? "decision" : "papers" });
  return tasks;
}

function renderTask(task) {
  return `<article class="task-item ${task.action ? "clickable" : ""}" ${task.action ? `data-task-action="${task.action}"` : ""} ${task.paperId ? `data-task-paper="${task.paperId}"` : ""} ${task.week ? `data-task-week="${task.week}"` : ""}><div class="task-head"><div class="task-meta"><span class="tag">${task.type}</span>${task.paperId ? pill(statusOf(task.paperId)) : ""}</div>${task.done ? '<span class="tag">?脣漲甇?虜</span>' : ""}</div><h4>${task.title}</h4><p class="muted">${task.body}</p>${task.action ? `<div class="tag-row"><span class="tag">${taskActionLabel(task.action)}</span></div>` : ""}</article>`;
}

function taskActionLabel(action) {
  return ({ paper: "??隢?", papers: "??隢???, decision: "??銝?甇亙遣霅?, "week-papers": "???祇梯??? })[action] || "??";
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
  state.paperQuery = "";
  state.tierFilter = "All";
  state.paperStatusFilter = "all";
  state.categoryFilter = list[0] ? list[0].category : "all";
  state.selectedPaperId = list[0] ? list[0].id : data.papers[0].id;
  saveState();
  renderPapers();
  setView("papers");
}

function papersForWeek(week) {
  return (week.reads || []).map((title) => data.papers.find((paper) => paper.title.toLowerCase().includes(title.toLowerCase().split(":")[0].trim()))).filter(Boolean);
}

function filteredPapers() {
  const query = (state.paperQuery || "").trim().toLowerCase();
  return data.papers.filter((paper) => {
    const haystack = `${paper.title} ${paper.venue} ${paper.focus} ${paper.why}`.toLowerCase();
    return (tierFilter() === "All" || paper.tier === tierFilter())
      && (categoryFilter() === "all" || paper.category === categoryFilter())
      && (statusFilter() === "all" || statusOf(paper.id) === statusFilter())
      && (!query || haystack.includes(query));
  });
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

function detailSection(key, title, body) {
  const collapsed = !!(state.detailSections && state.detailSections[key]);
  return `<section class="detail-section ${collapsed ? "collapsed" : ""}"><button class="detail-section-toggle" data-section="${key}"><h4>${title}</h4><span>${collapsed ? "撅?" : "?嗅?"}</span></button><div class="detail-body">${body}</div></section>`;
}

function pill(status) {
  return `<span class="status-pill status-${status}">${LABELS.status[status]}</span>`;
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
  const list = topicFocus().seed_papers.map((seed) => data.papers.find((paper) => paper.id === seed || paper.title.toLowerCase().includes(String(seed).toLowerCase()))).filter(Boolean);
  return list.length ? list : data.papers.filter((paper) => focusRelated(paper)).slice(0, 4);
}

function focusRelated(paper) {
  const text = `${paper.title} ${paper.focus} ${paper.why}`.toLowerCase();
  return text.includes("hallucination") || text.includes("consistency") || text.includes("temporal benchmark");
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

function normalizePaperRecords(raw) {
  const items = raw && Array.isArray(raw.papers) ? raw.papers : [];
  const map = {};
  items.forEach((item) => {
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
    try { await persistPaperRecords(); sync.lastError = ""; }
    catch (error) { sync.apiAvailable = false; sync.lastError = error && error.message ? error.message : "save failed"; }
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
    try { await persistPaperInbox(); sync.lastError = ""; }
    catch (error) { sync.apiAvailable = false; sync.lastError = error && error.message ? error.message : "inbox save failed"; }
  }
}

async function updateInboxItem(itemId, patch) {
  const items = inboxItems().map((item) => item.id === itemId ? { ...item, ...patch, updated_at: new Date().toISOString() } : item);
  state.localInbox = items;
  saveState();
  sync.paperInbox = normalizePaperInbox({ ...(sync.paperInbox ? sync.paperInbox.raw : { schema_version: 2 }), items });
  if (sync.apiAvailable) {
    try { await persistPaperInbox(); sync.lastError = ""; }
    catch (error) { sync.apiAvailable = false; sync.lastError = error && error.message ? error.message : "inbox update failed"; }
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

function renderQuickUnderstandSection(paper, insight) {
  const open = isQuickUnderstandOpen(paper.id);
  return `
    <section id="quick-understand" class="detail-section quick-understand-card ${open ? "" : "collapsed"}">
      <div class="section-head">
        <div><h4>Quick Understand</h4></div>
        <span>${open ? "展開中" : "已收合"}</span>
      </div>
      <div class="detail-body">
        <p class="quick-takeaway">${escapeHtml(insight.quick_takeaway || paper.why)}</p>
        <div class="quick-understand-grid ${insight.figure ? "with-figure" : "no-figure"}">
          ${insight.figure ? `
            <figure class="quick-figure">
              <img src="${escapeHtml(insight.figure)}" alt="${escapeHtml(paper.title)} figure">
              <figcaption>${escapeHtml(insight.figure_caption || "Representative figure")}</figcaption>
            </figure>
          ` : ""}
          <div class="quick-copy">
            ${quickBlock("這篇在做什麼", insight.problem)}
            ${quickBlock("方法 / 設定", insight.method_or_setup)}
            ${quickListBlock("你應該先抓住的重點", insight.key_points)}
            ${quickBlock("為什麼跟你的題目有關", insight.why_it_matters)}
            ${quickListBlock("摘要寫完後下一步", insight.next_after_summary)}
          </div>
        </div>
      </div>
    </section>
  `;
}

function quickBlock(title, text) {
  if (!text) return "";
  return `<div class="quick-block"><h5>${escapeHtml(title)}</h5><p>${escapeHtml(text)}</p></div>`;
}

function quickListBlock(title, items) {
  if (!Array.isArray(items) || !items.length) return "";
  return `<div class="quick-block"><h5>${escapeHtml(title)}</h5><ul class="quick-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>`;
}

function isQuickUnderstandOpen(paperId) {
  return !!(state.quickUnderstandOpen && state.quickUnderstandOpen[paperId]);
}

function syncBanner(mode) {
  const detail = sync.apiAvailable ? "霈??甇亙撠?蝝?? : `?郊?急?銝??{sync.syncChecked && sync.lastError ? ` (${sync.lastError})` : ""}嚗?雿輻?祆??怠??;
  return `<section class="sync-banner ${sync.apiAvailable ? "online" : "offline"}${mode === "inline" ? " inline" : ""}"><strong>${sync.apiAvailable ? "撠??郊撌脣??? : "撠??郊?芸???}</strong><span>${detail}</span></section>`;
}

function navLabel(name) {
  const button = document.querySelector(`.nav-link[data-view="${name}"]`);
  return button ? button.textContent.trim() : name;
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

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem("tv-research-navigator-state")) || {};
    parsed.paperStatuses = parsed.paperStatuses || {};
    parsed.paperFlags = parsed.paperFlags || {};
    parsed.quickUnderstandOpen = parsed.quickUnderstandOpen || {};
    parsed.localInbox = Array.isArray(parsed.localInbox) ? parsed.localInbox : [];
    return parsed;
  } catch (_error) {
    return { paperStatuses: {}, paperFlags: {}, quickUnderstandOpen: {}, localInbox: [] };
  }
}

function saveState() {
  localStorage.setItem("tv-research-navigator-state", JSON.stringify(state));
}
})();



