const providerEl = document.getElementById("provider");
const gradeEl = document.getElementById("grade");
const subjectEl = document.getElementById("subject");
const yearEl = document.getElementById("year");
const monthEl = document.getElementById("month");
const paperTypeEl = document.getElementById("paperType");
const selectedSubjectEl = document.getElementById("selectedSubject");

const paperTypeFieldEl = document.getElementById("paperTypeField");
const selectedSubjectFieldEl = document.getElementById("selectedSubjectField");

const searchBtnEl = document.getElementById("searchBtn");
const resultAreaEl = document.getElementById("resultArea");
const shareUrlEl = document.getElementById("shareUrl");
const copyUrlBtnEl = document.getElementById("copyUrlBtn");

const siteTitleEl = document.getElementById("siteTitle");
const siteSubtitleEl = document.getElementById("siteSubtitle");
const metaDescriptionEl = document.getElementById("metaDescription");
const ogTitleEl = document.getElementById("ogTitle");
const ogDescriptionEl = document.getElementById("ogDescription");

const TXT_SELECT = "\uC120\uD0DD";
const TXT_COMMON = "\uACF5\uD1B5";
const TXT_NONE = "\uC5C6\uC74C";

const VAL_KICE = "\uD3C9\uAC00\uC6D0";
const VAL_OFFICE = "\uAD50\uC721\uCCAD";
const VAL_CSAT = "\uC218\uB2A5";
const VAL_MOCK_KICE = "\uBAA8\uC758\uD3C9\uAC00";
const VAL_MOCK_OFFICE = "\uBAA8\uC758\uACE0\uC0AC";

const VAL_KOR = "\uAD6D\uC5B4";
const VAL_MATH = "\uC218\uD559";
const VAL_ENG = "\uC601\uC5B4";

const VAL_ODD = "\uD640\uC218\uD615";
const VAL_EVEN = "\uC9DD\uC218\uD615";

const VAL_HW = "\uD654\uBC95\uACFC \uC791\uBB38";
const VAL_LM = "\uC5B8\uC5B4\uC640 \uB9E4\uCCB4";
const VAL_PROB = "\uD655\uB960\uACFC \uD1B5\uACC4";
const VAL_CALC = "\uBBF8\uC801\uBD84";
const VAL_GEO = "\uAE30\uD558";

const DEFAULT_TITLE = "\uBAA8\uC758\uACE0\uC0AC \uB2F5\uC9C0 \uC0AC\uC774\uD2B8";
const DEFAULT_SUBTITLE = "\uD3C9\uAC00\uC6D0 \u00B7 \uAD50\uC721\uCCAD \uAE30\uCD9C\uBB38\uC81C \uC815\uB2F5 \uC870\uD68C";
const DEFAULT_DESC = "\uD3C9\uAC00\uC6D0\uACFC \uAD50\uC721\uCCAD \uAE30\uCD9C\uBB38\uC81C \uC815\uB2F5\uC744 \uACFC\uBAA9, \uD559\uB144, \uC2DC\uD589\uB144\uB3C4, \uC2DC\uD589\uC6D4\uBCC4\uB85C \uD655\uC778\uD560 \uC218 \uC788\uB294 \uC0AC\uC774\uD2B8";

function uniqueValues(arr, key) {
  return [...new Set(arr.map(item => item[key]).filter(v => v !== undefined && v !== null))];
}

function sortNumbersAsc(arr) {
  return [...arr].sort((a, b) => a - b);
}

function fillSelect(selectEl, values, placeholder = TXT_SELECT) {
  selectEl.innerHTML = `<option value="">${placeholder}</option>`;
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectEl.appendChild(option);
  });
}

function getFilteredData() {
  return examData.filter(item => {
    const providerMatch = !providerEl.value || item.provider === providerEl.value;
    const gradeMatch = !gradeEl.value || item.grade === gradeEl.value;
    const subjectMatch = !subjectEl.value || item.subject === subjectEl.value;
    const yearMatch = !yearEl.value || String(item.year) === yearEl.value;
    const monthMatch = !monthEl.value || String(item.month) === monthEl.value;
    return providerMatch && gradeMatch && subjectMatch && yearMatch && monthMatch;
  });
}

function updateSelectOptions() {
  const currentProvider = providerEl.value;
  const currentGrade = gradeEl.value;
  const currentSubject = subjectEl.value;
  const currentYear = yearEl.value;
  const currentMonth = monthEl.value;
  const currentPaperType = paperTypeEl.value;
  const currentSelectedSubject = selectedSubjectEl.value;

  const providerValues = uniqueValues(examData, "provider");
  fillSelect(providerEl, providerValues, TXT_SELECT);
  providerEl.value = providerValues.includes(currentProvider) ? currentProvider : "";

  const gradeValues = uniqueValues(
    examData.filter(item => !providerEl.value || item.provider === providerEl.value),
    "grade"
  );
  fillSelect(gradeEl, gradeValues, TXT_SELECT);
  gradeEl.value = gradeValues.includes(currentGrade) ? currentGrade : "";

  const subjectValues = uniqueValues(
    examData.filter(item => {
      const providerMatch = !providerEl.value || item.provider === providerEl.value;
      const gradeMatch = !gradeEl.value || item.grade === gradeEl.value;
      return providerMatch && gradeMatch;
    }),
    "subject"
  );
  fillSelect(subjectEl, subjectValues, TXT_SELECT);
  subjectEl.value = subjectValues.includes(currentSubject) ? currentSubject : "";

  const yearValues = sortNumbersAsc(
    uniqueValues(
      examData.filter(item => {
        const providerMatch = !providerEl.value || item.provider === providerEl.value;
        const gradeMatch = !gradeEl.value || item.grade === gradeEl.value;
        const subjectMatch = !subjectEl.value || item.subject === subjectEl.value;
        return providerMatch && gradeMatch && subjectMatch;
      }),
      "year"
    )
  );
  fillSelect(yearEl, yearValues, TXT_SELECT);
  yearEl.value = yearValues.map(String).includes(currentYear) ? currentYear : "";

  const monthValues = sortNumbersAsc(
    uniqueValues(
      examData.filter(item => {
        const providerMatch = !providerEl.value || item.provider === providerEl.value;
        const gradeMatch = !gradeEl.value || item.grade === gradeEl.value;
        const subjectMatch = !subjectEl.value || item.subject === subjectEl.value;
        const yearMatch = !yearEl.value || String(item.year) === yearEl.value;
        return providerMatch && gradeMatch && subjectMatch && yearMatch;
      }),
      "month"
    )
  );
  fillSelect(monthEl, monthValues, TXT_SELECT);
  monthEl.value = monthValues.map(String).includes(currentMonth) ? currentMonth : "";

  updateConditionalFields();

  const visibleData = getFilteredData();

  const paperTypeValues = uniqueValues(visibleData, "paperType").filter(
    value => value && value !== TXT_COMMON
  );
  fillSelect(paperTypeEl, paperTypeValues, TXT_SELECT);
  paperTypeEl.value = paperTypeValues.includes(currentPaperType) ? currentPaperType : "";

  const selectedSubjectValues = uniqueValues(visibleData, "selectedSubject").filter(
    value => value && value !== TXT_NONE
  );
  fillSelect(selectedSubjectEl, selectedSubjectValues, TXT_SELECT);
  selectedSubjectEl.value = selectedSubjectValues.includes(currentSelectedSubject)
    ? currentSelectedSubject
    : "";
}

function updateConditionalFields() {
  const visibleData = getFilteredData();

  const paperTypeValues = uniqueValues(visibleData, "paperType").filter(
    value => value && value !== TXT_COMMON
  );
  const selectedSubjectValues = uniqueValues(visibleData, "selectedSubject").filter(
    value => value && value !== TXT_NONE
  );

  if (paperTypeValues.length > 0) {
    paperTypeFieldEl.classList.remove("hidden");
  } else {
    paperTypeFieldEl.classList.add("hidden");
    paperTypeEl.value = "";
  }

  if (selectedSubjectValues.length > 0) {
    selectedSubjectFieldEl.classList.remove("hidden");
  } else {
    selectedSubjectFieldEl.classList.add("hidden");
    selectedSubjectEl.value = "";
  }
}

function createAnswerTables(answers, itemsPerRow = 5) {
  const chunks = [];

  for (let i = 0; i < answers.length; i += itemsPerRow) {
    chunks.push(answers.slice(i, i + itemsPerRow));
  }

  return chunks.map((chunk, chunkIndex) => {
    const startNumber = chunkIndex * itemsPerRow + 1;
    let headerRow = "";
    let answerRow = "";

    chunk.forEach((answer, index) => {
      headerRow += `<th>${startNumber + index}</th>`;
      answerRow += `<td>${answer}</td>`;
    });

    return `
      <div class="answer-table-wrap">
        <table>
          <thead>
            <tr>${headerRow}</tr>
          </thead>
          <tbody>
            <tr>${answerRow}</tr>
          </tbody>
        </table>
      </div>
    `;
  }).join("");
}

function getExamTitle(exam) {
  if (exam.provider === VAL_KICE && exam.examType === VAL_CSAT) {
    return `${exam.year}\uD559\uB144\uB3C4 \uB300\uD559\uC218\uD559\uB2A5\uB825\uC2DC\uD5D8 ${exam.subject} \uC815\uB2F5`;
  }

  if (exam.provider === VAL_KICE && exam.examType === VAL_MOCK_KICE) {
    return `${exam.year}\uB144 ${exam.month}\uC6D4 ${VAL_KICE} ${exam.grade} ${exam.subject} \uC815\uB2F5`;
  }

  if (exam.provider === VAL_OFFICE && exam.examType === VAL_MOCK_OFFICE) {
    return `${exam.year}\uB144 ${exam.month}\uC6D4 ${VAL_OFFICE} ${exam.grade} ${exam.subject} \uC815\uB2F5`;
  }

  return `${exam.year}\uB144 ${exam.month}\uC6D4 ${exam.provider} ${exam.subject} \uC815\uB2F5`;
}

function getExamSubtitle(exam) {
  const parts = [
    `\uAE30\uAD00: ${exam.provider}`,
    `\uC2DC\uD5D8: ${exam.examType}`,
    `\uD559\uB144: ${exam.grade}`,
    `\uACFC\uBAA9: ${exam.subject}`
  ];

  if (exam.paperType && exam.paperType !== TXT_COMMON) {
    parts.push(`\uC720\uD615: ${exam.paperType}`);
  }

  if (exam.selectedSubject && exam.selectedSubject !== TXT_NONE && exam.selectedSubject !== TXT_COMMON) {
    parts.push(`\uC120\uD0DD\uACFC\uBAA9: ${exam.selectedSubject}`);
  }

  return parts.join(" \u00B7 ");
}

function getSeoTitle(exam) {
  let title = "";

  if (exam.provider === VAL_KICE && exam.examType === VAL_CSAT) {
    title = `${exam.year}\uD559\uB144\uB3C4 \uC218\uB2A5 ${exam.subject}`;
  } else if (exam.provider === VAL_KICE && exam.examType === VAL_MOCK_KICE) {
    title = `${exam.year}\uB144 ${exam.month}\uC6D4 ${VAL_KICE} ${exam.grade} ${exam.subject}`;
  } else if (exam.provider === VAL_OFFICE) {
    title = `${exam.year}\uB144 ${exam.month}\uC6D4 ${VAL_OFFICE} ${exam.grade} ${exam.subject}`;
  } else {
    title = `${exam.year}\uB144 ${exam.month}\uC6D4 ${exam.subject}`;
  }

  if (exam.paperType && exam.paperType !== TXT_COMMON) {
    title += ` ${exam.paperType}`;
  }

  if (exam.selectedSubject && exam.selectedSubject !== TXT_NONE && exam.selectedSubject !== TXT_COMMON) {
    title += ` ${exam.selectedSubject}`;
  }

  title += ` \uC815\uB2F5 | ${DEFAULT_TITLE}`;
  return title;
}

function getSeoDescription(exam) {
  let desc = `${getExamTitle(exam)}`;

  if (exam.paperType && exam.paperType !== TXT_COMMON) {
    desc += ` ${exam.paperType}`;
  }

  if (exam.selectedSubject && exam.selectedSubject !== TXT_NONE && exam.selectedSubject !== TXT_COMMON) {
    desc += ` ${exam.selectedSubject}`;
  }

  desc += ` \uC815\uB2F5\uD45C\uC785\uB2C8\uB2E4.`;
  return desc;
}

function updateSeo(exam = null) {
  if (!exam) {
    document.title = DEFAULT_TITLE;
    metaDescriptionEl.setAttribute("content", DEFAULT_DESC);
    ogTitleEl.setAttribute("content", DEFAULT_TITLE);
    ogDescriptionEl.setAttribute("content", DEFAULT_DESC);

    siteTitleEl.textContent = DEFAULT_TITLE;
    siteSubtitleEl.textContent = DEFAULT_SUBTITLE;
    return;
  }

  const seoTitle = getSeoTitle(exam);
  const seoDesc = getSeoDescription(exam);

  document.title = seoTitle;
  metaDescriptionEl.setAttribute("content", seoDesc);
  ogTitleEl.setAttribute("content", seoTitle);
  ogDescriptionEl.setAttribute("content", seoDesc);

  siteTitleEl.textContent = getExamTitle(exam);
  siteSubtitleEl.textContent = getExamSubtitle(exam);
}

function providerToSlug(provider) {
  if (provider === VAL_KICE) return "kice";
  if (provider === VAL_OFFICE) return "office";
  return provider.toLowerCase();
}

function subjectToSlug(subject) {
  if (subject === VAL_KOR) return "kor";
  if (subject === VAL_MATH) return "math";
  if (subject === VAL_ENG) return "eng";
  return subject.toLowerCase();
}

function paperTypeToSlug(paperType) {
  if (paperType === VAL_ODD) return "odd";
  if (paperType === VAL_EVEN) return "even";
  return "";
}

function selectedSubjectToSlug(selectedSubject) {
  if (selectedSubject === VAL_HW) return "hw";
  if (selectedSubject === VAL_LM) return "lm";
  if (selectedSubject === VAL_PROB) return "prob";
  if (selectedSubject === VAL_CALC) return "calc";
  if (selectedSubject === VAL_GEO) return "geo";
  return "";
}

function createExamSlug(exam) {
  const parts = [
    providerToSlug(exam.provider),
    String(exam.year),
    String(exam.month).padStart(2, "0"),
    subjectToSlug(exam.subject)
  ];

  if (exam.paperType && exam.paperType !== TXT_COMMON) {
    parts.push(paperTypeToSlug(exam.paperType));
  }

  if (exam.selectedSubject && exam.selectedSubject !== TXT_NONE && exam.selectedSubject !== TXT_COMMON) {
    const selectedSlug = selectedSubjectToSlug(exam.selectedSubject);
    if (selectedSlug) parts.push(selectedSlug);
  }

  return parts.join("-");
}

function findExamBySlug(slug) {
  return examData.find(exam => createExamSlug(exam) === slug) || null;
}

function renderResult(exam) {
  const answerTables = createAnswerTables(exam.answers, 5);

  resultAreaEl.innerHTML = `
    <h2 class="result-title">${getExamTitle(exam)}</h2>
    <p class="result-subtitle">${getExamSubtitle(exam)}</p>

    <div class="meta">
      <span>${exam.provider}</span>
      <span>${exam.examType}</span>
      <span>${exam.grade}</span>
      <span>${exam.subject}</span>
      <span>${exam.year}\uB144</span>
      <span>${exam.month}\uC6D4</span>
      ${exam.paperType && exam.paperType !== TXT_COMMON ? `<span>${exam.paperType}</span>` : ""}
      ${exam.selectedSubject && exam.selectedSubject !== TXT_NONE && exam.selectedSubject !== TXT_COMMON ? `<span>${exam.selectedSubject}</span>` : ""}
    </div>

    <div class="answer-section">
      <h3>\uC815\uB2F5\uD45C</h3>
      <div class="answer-grid">
        ${answerTables}
      </div>
    </div>
  `;

  updateSeo(exam);
  updateUrl(exam);
}

function renderError(message) {
  resultAreaEl.innerHTML = `<div class="message error">${message}</div>`;
}

function updateUrl(exam) {
  const prettyUrl = `${window.location.origin}/answer/${createExamSlug(exam)}`;
  history.replaceState(null, "", prettyUrl);
  shareUrlEl.value = prettyUrl;
}

function getMatchedExamFromCurrentSelection() {
  const provider = providerEl.value;
  const grade = gradeEl.value;
  const subject = subjectEl.value;
  const year = yearEl.value;
  const month = monthEl.value;
  const paperTypeVisible = !paperTypeFieldEl.classList.contains("hidden");
  const selectedSubjectVisible = !selectedSubjectFieldEl.classList.contains("hidden");

  return examData.find(item => {
    const basicMatch =
      item.provider === provider &&
      item.grade === grade &&
      item.subject === subject &&
      String(item.year) === year &&
      String(item.month) === month;

    if (!basicMatch) return false;

    if (paperTypeVisible && item.paperType !== paperTypeEl.value) {
      return false;
    }

    if (selectedSubjectVisible && item.selectedSubject !== selectedSubjectEl.value) {
      return false;
    }

    return true;
  }) || null;
}

function searchExam() {
  const provider = providerEl.value;
  const grade = gradeEl.value;
  const subject = subjectEl.value;
  const year = yearEl.value;
  const month = monthEl.value;
  const paperTypeVisible = !paperTypeFieldEl.classList.contains("hidden");
  const selectedSubjectVisible = !selectedSubjectFieldEl.classList.contains("hidden");

  if (!provider || !grade || !subject || !year || !month) {
    renderError("\uAE30\uAD00, \uD559\uB144, \uACFC\uBAA9, \uC2DC\uD589\uB144\uB3C4, \uC2DC\uD589\uC6D4\uC744 \uBAA8\uB450 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
    return;
  }

  if (paperTypeVisible && !paperTypeEl.value) {
    renderError("\uC720\uD615\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
    return;
  }

  if (selectedSubjectVisible && !selectedSubjectEl.value) {
    renderError("\uC120\uD0DD\uACFC\uBAA9\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
    return;
  }

  const matchedExam = getMatchedExamFromCurrentSelection();

  if (!matchedExam) {
    renderError("\uD574\uB2F9 \uC870\uAC74\uC758 \uC2DC\uD5D8 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");
    return;
  }

  renderResult(matchedExam);
}

function applyExamToForm(exam) {
  updateSelectOptions();

  providerEl.value = exam.provider;
  updateSelectOptions();

  gradeEl.value = exam.grade;
  updateSelectOptions();

  subjectEl.value = exam.subject;
  updateSelectOptions();

  yearEl.value = String(exam.year);
  updateSelectOptions();

  monthEl.value = String(exam.month);
  updateSelectOptions();

  if (exam.paperType && exam.paperType !== TXT_COMMON) {
    paperTypeEl.value = exam.paperType;
    updateSelectOptions();
  }

  if (exam.selectedSubject && exam.selectedSubject !== TXT_NONE && exam.selectedSubject !== TXT_COMMON) {
    selectedSubjectEl.value = exam.selectedSubject;
    updateSelectOptions();
  }
}

function applyPathOrQuery() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const pathMatch = path.match(/^\/answer\/([^/]+)$/);

  if (pathMatch) {
    const slug = decodeURIComponent(pathMatch[1]);
    const exam = findExamBySlug(slug);

    if (exam) {
      applyExamToForm(exam);
      renderResult(exam);
      return;
    }
  }

  const params = new URLSearchParams(window.location.search);
  const provider = params.get("provider");
  const grade = params.get("grade");
  const subject = params.get("subject");
  const year = params.get("year");
  const month = params.get("month");
  const paperType = params.get("paperType");
  const selectedSubject = params.get("selectedSubject");

  updateSelectOptions();

  if (provider) {
    providerEl.value = provider;
    updateSelectOptions();
  }

  if (grade) {
    gradeEl.value = grade;
    updateSelectOptions();
  }

  if (subject) {
    subjectEl.value = subject;
    updateSelectOptions();
  }

  if (year) {
    yearEl.value = year;
    updateSelectOptions();
  }

  if (month) {
    monthEl.value = month;
    updateSelectOptions();
  }

  if (paperType) {
    paperTypeEl.value = paperType;
    updateSelectOptions();
  }

  if (selectedSubject) {
    selectedSubjectEl.value = selectedSubject;
    updateSelectOptions();
  }

  const shouldAutoSearch = provider && grade && subject && year && month;
  if (shouldAutoSearch) {
    const matchedExam = getMatchedExamFromCurrentSelection();
    if (matchedExam) {
      renderResult(matchedExam);
      return;
    }
  }

  updateSeo(null);
}

async function copyShareUrl() {
  if (!shareUrlEl.value) return;

  try {
    await navigator.clipboard.writeText(shareUrlEl.value);
    copyUrlBtnEl.textContent = "\uBCF5\uC0AC \uC644\uB8CC";
    setTimeout(() => {
      copyUrlBtnEl.textContent = "\uB9C1\uD06C \uBCF5\uC0AC";
    }, 1200);
  } catch (error) {
    shareUrlEl.select();
    document.execCommand("copy");
    copyUrlBtnEl.textContent = "\uBCF5\uC0AC \uC644\uB8CC";
    setTimeout(() => {
      copyUrlBtnEl.textContent = "\uB9C1\uD06C \uBCF5\uC0AC";
    }, 1200);
  }
}

providerEl.addEventListener("change", updateSelectOptions);
gradeEl.addEventListener("change", updateSelectOptions);
subjectEl.addEventListener("change", updateSelectOptions);
yearEl.addEventListener("change", updateSelectOptions);
monthEl.addEventListener("change", updateSelectOptions);
paperTypeEl.addEventListener("change", updateSelectOptions);
selectedSubjectEl.addEventListener("change", updateSelectOptions);
searchBtnEl.addEventListener("click", searchExam);
copyUrlBtnEl.addEventListener("click", copyShareUrl);

updateSelectOptions();
applyPathOrQuery();