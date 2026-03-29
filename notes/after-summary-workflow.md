# Summary-After Workflow

這份文件定義的是：一篇 paper 的摘要寫完之後，接下來要做什麼。

## 1. 先判讀摘要有沒有「可用」

- 檢查 `Venue / Year / Topic fit / Status` 是否和 `paper-library/manifest/paper-manifest.json` 一致。
- 檢查 `One-line takeaway` 是否真的能用一句話講清楚 paper 的核心。
- 檢查 `Why it matters for temporal hallucination` 是否有明確對應到時間錯誤、順序錯誤、不穩定 grounding、或 unsupported claim。
- 如果摘要只是在重述論文標題，先補成「可讀、可比、可用」的版本，再進下一步。

## 2. 補 evidence，不只補感想

- 每篇摘要至少要留下 3 類 evidence。
- 先找「作者真的做了什麼」: benchmark、method、dataset、tuning、diagnostic、probe。
- 再找「作者怎麼證明」: 實驗設定、比較對象、重要數字、失敗案例。
- 最後找「哪裡可能站不住」: limitation、curated setting、evaluation bias、generalization gap。
- 如果看完摘要還不能回答「這篇 paper 的證據在哪裡」，就回頭補摘要，不要直接進決策。

## 3. 看圖要在這一步做

- 優先看 Figure 1、method overview、pipeline、benchmark taxonomy。
- 如果 paper 有明顯的 failure example、paired case、architecture diagram，就先抓那張圖。
- 圖的用途不是裝飾，而是讓網站上的使用者 10 秒內理解 paper 在做什麼。
- 若可能，為每篇 paper 準備一張代表圖，作為網站上的 quick preview。

## 4. 把摘要轉成網站可點的「快速理解入口」

- 在網站的 paper item / detail card 上加一個 button。
- button 的目的不是打開全文，而是直接打開「快速理解面板」。
- 面板內容至少要有：
- `One-line takeaway`
- `What problem it solves`
- `Reading highlights`
- `Why it matters for temporal hallucination`
- `Next action`
- 如果有圖，就把圖放在面板上方或右側，先看圖再看字。
- button label 建議固定成簡單、可掃描的詞，例如 `Quick read`、`看摘要`、`看圖解`。

## 5. 何時進 decision / problem framing

- 如果摘要顯示這篇是 benchmark paper，先問它暴露的是什麼 failure mode。
- 如果摘要顯示這篇是 method paper，先問它改善的是 perception、reasoning、retrieval，還是只是 score。
- 如果摘要顯示這篇是 mitigation paper，先問它有沒有真的處理 temporal faithfulness，而不是只修外觀。
- 只有當一篇 paper 能回答「它改變了哪個 failure mode」時，才進 decision / problem framing。

## 6. 何時更新 records

- 摘要完成後，先確認 `records/paper-records.json` 的狀態是否合理。
- `want` 表示還要看，但還沒進入穩定閱讀狀態。
- `reading` 表示已經開始做 evidence 驗證、圖檢查、或比較。
- `read` 表示摘要、evidence、圖、以及定位都已經足夠，可以直接當 anchor 用。
- 如果 paper 是不再優先的方向，才考慮 `pause` 或 `not_now`。
- `disliked` 只在真的確定不想再推薦時使用。

## 7. 何時更新網站

- 每次新增或大改摘要後，都要讓網站上的 paper card 能直接通往這份理解。
- 當 figure 已經準備好，網站應該顯示圖，而不是只顯示文字連結。
- 當 summary 還沒補完，網站至少要顯示 `quick takeaway` 和 `next action`。
- 當某篇 paper 變成 anchor，網站應該讓它更容易被點到，而不是藏在清單裡。

## 8. 最後輸出

- 一篇合格的摘要，不只是存檔。
- 它應該同時能支援：
- 快速理解
- 研究比較
- 網站展示
- 後續 decision making

## 9. 最小完成條件

- 摘要已寫完。
- evidence 已補齊。
- 圖已補或已決定不補。
- 網站有 button 可以快速打開這篇 paper 的理解入口。
- records 已同步。
- update log 已記錄這次完成的狀態。
