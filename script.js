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

const TXT_SELECT = "\uC120\uD0DD";
const TXT_COMMON = "\uACF5\uD1B5";
const TXT_NONE = "\uC5C6\uC74C";

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
  if (
    exam.provider === "\uD3C9\uAC00\uC6D0" &&
    exam.examType === "\uC218\uB2A5"
  ) {
    return `${exam.year}\uD559\uB144\uB3C4 \uB300\uD559\uC218\uD559\uB2A5\uB825\uC2DC\uD5D8 ${exam.subject} \uC815\uB2F5`;
  }

  if (
    exam.provider === "\uD3C9\uAC00\uC6D0" &&
    exam.examType === "\uBAA8\uC758\uD3C9\uAC00"
  ) {
    return `${exam.year}\uB144 ${exam.month}\uC6D4 \uD3C9\uAC00\uC6D0 ${exam.grade} ${exam.subject} \uC815\uB2F5`;
  }

  if (
    exam.provider === "\uAD50\uC721\uCCAD" &&
    exam.examType === "\uBAA8\uC758\uACE0\uC0AC"
  ) {
    return `${exam.year}\uB144 ${exam.month}\uC6D4 \uAD50\uC721\uCCAD ${exam.grade} ${exam.subject} \uC815\uB2F5`;
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

  if (exam.selectedSubject && exam.selectedSubject !== TXT_NONE) {
    parts.push(`\uC120\uD0DD\uACFC\uBAA9: ${exam.selectedSubject}`);
  }

  return parts.join(" \u00B7 ");
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
      ${exam.selectedSubject && exam.selectedSubject !== TXT_NONE ? `<span>${exam.selectedSubject}</span>` : ""}
    </div>

    <div class="answer-section">
      <h3>\uC815\uB2F5\uD45C</h3>
      <div class="answer-grid">
        ${answerTables}
      </div>
    </div>
  `;
}

function renderError(message) {
  resultAreaEl.innerHTML = `<div class="message error">${message}</div>`;
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

  const matchedExam = examData.find(item => {
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

  if (!matchedExam) {
    renderError("\uD574\uB2F9 \uC870\uAC74\uC758 \uC2DC\uD5D8 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");
    return;
  }

  renderResult(matchedExam);
}

providerEl.addEventListener("change", updateSelectOptions);
gradeEl.addEventListener("change", updateSelectOptions);
subjectEl.addEventListener("change", updateSelectOptions);
yearEl.addEventListener("change", updateSelectOptions);
monthEl.addEventListener("change", updateSelectOptions);
paperTypeEl.addEventListener("change", updateSelectOptions);
selectedSubjectEl.addEventListener("change", updateSelectOptions);
searchBtnEl.addEventListener("click", searchExam);

updateSelectOptions();