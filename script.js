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

const TXT_SELECT = "선택";
const TXT_COMMON = "공통";
const TXT_NONE = "없음";

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
  if (exam.provider === "평가원" && exam.examType === "수능") {
    return `${exam.year}학년도 대학수학능력시험 ${exam.subject} 정답`;
  }

  if (exam.provider === "평가원" && exam.examType === "모의평가") {
    return `${exam.year}년 ${exam.month}월 평가원 ${exam.grade} ${exam.subject} 정답`;
  }

  if (exam.provider === "교육청" && exam.examType === "모의고사") {
    return `${exam.year}년 ${exam.month}월 교육청 ${exam.grade} ${exam.subject} 정답`;
  }

  return `${exam.year}년 ${exam.month}월 ${exam.provider} ${exam.subject} 정답`;
}

function getExamSubtitle(exam) {
  const parts = [
    `기관: ${exam.provider}`,
    `시험: ${exam.examType}`,
    `학년: ${exam.grade}`,
    `과목: ${exam.subject}`
  ];

  if (exam.paperType && exam.paperType !== TXT_COMMON) {
    parts.push(`유형: ${exam.paperType}`);
  }

  if (exam.selectedSubject && exam.selectedSubject !== TXT_NONE) {
    parts.push(`선택과목: ${exam.selectedSubject}`);
  }

  return parts.join(" · ");
}

function getSeoTitle(exam) {
  let title = "";

  if (exam.provider === "평가원" && exam.examType === "수능") {
    title = `${exam.year}학년도 수능 ${exam.subject}`;
  } else if (exam.provider === "평가원" && exam.examType === "모의평가") {
    title = `${exam.year}년 ${exam.month}월 평가원 ${exam.grade} ${exam.subject}`;
  } else if (exam.provider === "교육청") {
    title = `${exam.year}년 ${exam.month}월 교육청 ${exam.grade} ${exam.subject}`;
  } else {
    title = `${exam.year}년 ${exam.month}월 ${exam.subject}`;
  }

  if (exam.paperType && exam.paperType !== TXT_COMMON) {
    title += ` ${exam.paperType}`;
  }

  if (exam.selectedSubject && exam.selectedSubject !== TXT_NONE) {
    title += ` ${exam.selectedSubject}`;
  }

  title += ` 정답 | 모의고사 답지 사이트`;

  return title;
}

function getSeoDescription(exam) {
  let desc = `${getExamTitle(exam)}`;

  if (exam.paperType && exam.paperType !== TXT_COMMON) {
    desc += ` ${exam.paperType}`;
  }

  if (exam.selectedSubject && exam.selectedSubject !== TXT_NONE) {
    desc += ` ${exam.selectedSubject}`;
  }

  desc += ` 정답표입니다.`;

  return desc;
}

function updateSeo(exam = null) {
  if (!exam) {
    const defaultTitle = "모의고사 답지 사이트";
    const defaultDesc = "평가원과 교육청 기출문제 정답을 과목, 학년, 시행년도, 시행월별로 확인할 수 있는 사이트";

    document.title = defaultTitle;
    metaDescriptionEl.setAttribute("content", defaultDesc);
    ogTitleEl.setAttribute("content", defaultTitle);
    ogDescriptionEl.setAttribute("content", defaultDesc);

    siteTitleEl.textContent = defaultTitle;
    siteSubtitleEl.textContent = "평가원 · 교육청 기출문제 정답 조회";
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
      <span>${exam.year}년</span>
      <span>${exam.month}월</span>
      ${exam.paperType && exam.paperType !== TXT_COMMON ? `<span>${exam.paperType}</span>` : ""}
      ${exam.selectedSubject && exam.selectedSubject !== TXT_NONE ? `<span>${exam.selectedSubject}</span>` : ""}
    </div>

    <div class="answer-section">
      <h3>정답표</h3>
      <div class="answer-grid">
        ${answerTables}
      </div>
    </div>
  `;

  updateSeo(exam);
  updateUrlParams(exam);
}

function renderError(message) {
  resultAreaEl.innerHTML = `<div class="message error">${message}</div>`;
}

function updateUrlParams(exam) {
  const params = new URLSearchParams();
  params.set("provider", exam.provider);
  params.set("grade", exam.grade);
  params.set("subject", exam.subject);
  params.set("year", exam.year);
  params.set("month", exam.month);

  if (exam.paperType && exam.paperType !== TXT_COMMON) {
    params.set("paperType", exam.paperType);
  }

  if (exam.selectedSubject && exam.selectedSubject !== TXT_NONE) {
    params.set("selectedSubject", exam.selectedSubject);
  }

  const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  history.replaceState(null, "", url);
  shareUrlEl.value = url;
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
  });
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
    renderError("기관, 학년, 과목, 시행년도, 시행월을 모두 선택해 주세요.");
    return;
  }

  if (paperTypeVisible && !paperTypeEl.value) {
    renderError("유형을 선택해 주세요.");
    return;
  }

  if (selectedSubjectVisible && !selectedSubjectEl.value) {
    renderError("선택과목을 선택해 주세요.");
    return;
  }

  const matchedExam = getMatchedExamFromCurrentSelection();

  if (!matchedExam) {
    renderError("해당 조건의 시험 데이터가 없습니다.");
    return;
  }

  renderResult(matchedExam);
}

function applyUrlParamsToForm() {
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
    copyUrlBtnEl.textContent = "복사 완료";
    setTimeout(() => {
      copyUrlBtnEl.textContent = "링크 복사";
    }, 1200);
  } catch (error) {
    shareUrlEl.select();
    document.execCommand("copy");
    copyUrlBtnEl.textContent = "복사 완료";
    setTimeout(() => {
      copyUrlBtnEl.textContent = "링크 복사";
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
applyUrlParamsToForm();