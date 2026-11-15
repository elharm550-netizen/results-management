// ===== الخطوة 2: الكلاس مع الكبسلة (Private Fields + set) =====
class Student {
    #name;
    #grade1;
    #grade2;
    #grade3;
    #attendance;

    constructor(name, grade1, grade2, grade3, attendance) {
        this.name = name;
        this.grade1 = grade1;
        this.grade2 = grade2;
        this.grade3 = grade3;
        this.attendance = attendance;
    }

    // دالة مساعدة (حارس الأمان): تتحقق من أن القيمة رقم بين 0 و 100
    static #validate(value, label) {
        if (value === "" || value === null || value === undefined || String(value).trim() === "") {
            throw new Error(`حقل ${label} فارغ، من فضلك أدخل قيمة.`);
        }
        const num = Number(value);
        if (Number.isNaN(num)) {
            throw new Error(`حقل ${label} يجب أن يكون رقماً.`);
        }
        if (num < 0 || num > 100) {
            throw new Error(`${label} يجب أن تكون بين 0 و 100.`);
        }
        return num;
    }

    get name() {
        return this.#name;
    }
    set name(value) {
        if (typeof value !== "string" || value.trim() === "") {
            throw new Error("اسم الطالب فارغ، من فضلك أدخل الاسم.");
        }
        this.#name = value.trim();
    }

    get grade1() {
        return this.#grade1;
    }
    set grade1(value) {
        this.#grade1 = Student.#validate(value, "درجة المادة الأولى");
    }

    get grade2() {
        return this.#grade2;
    }
    set grade2(value) {
        this.#grade2 = Student.#validate(value, "درجة المادة الثانية");
    }

    get grade3() {
        return this.#grade3;
    }
    set grade3(value) {
        this.#grade3 = Student.#validate(value, "درجة المادة الثالثة");
    }

    get attendance() {
        return this.#attendance;
    }
    set attendance(value) {
        this.#attendance = Student.#validate(value, "نسبة الحضور");
    }

    // متوسط الدرجات الثلاث
    get average() {
        return (this.#grade1 + this.#grade2 + this.#grade3) / 3;
    }
}

// ===== الخطوة 3: سلة الطلاب + الإمساك بعناصر الشاشة =====
const studentsList = [];

const nameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");

const addBtn = document.getElementById("addBtn");
const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");
const studentsBox = document.getElementById("studentsBox");
const reportBox = document.getElementById("reportBox");

// منع حقن HTML من الأسماء المدخلة
function escapeHTML(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderStudents() {
    if (studentsList.length === 0) {
        studentsBox.innerHTML = `<p class="empty-hint">لم تتم إضافة أي طالب بعد.</p>`;
        return;
    }
    studentsBox.innerHTML = studentsList
        .map((s, i) => `
            <div class="student-item list-group-item bg-white border rounded p-2 mb-2 d-flex justify-content-between align-items-center">
                <span><strong>${i + 1}.</strong> ${escapeHTML(s.name)}</span>
                <span class="badge text-bg-primary">المتوسط: ${s.average.toFixed(2)}</span>
            </div>`)
        .join("");
}

// زر إضافة طالب
addBtn.onclick = function () {
    try {
        const student = new Student(
            nameInput.value,
            grade1Input.value,
            grade2Input.value,
            grade3Input.value,
            attendanceInput.value
        );

        studentsList.push(student);
        errorBox.textContent = "";
        renderStudents();

        nameInput.value = "";
        grade1Input.value = "";
        grade2Input.value = "";
        grade3Input.value = "";
        attendanceInput.value = "";
        nameInput.focus();
    } catch (error) {
        errorBox.textContent = error.message;
    }
};

// ===== الخطوة 4: لجنة الرأفة =====
mercyBtn.onclick = function () {
    errorBox.textContent = "";

    // Filter: الطلاب الذين متوسطهم بين 40 و 49
    const struggling = studentsList.filter(s => s.average >= 40 && s.average <= 49);

    // Map: إضافة 5 درجات رأفة
    const afterMercy = struggling.map(s => ({
        name: s.name,
        newAverage: s.average + 5
    }));

    // Reduce: مجموع المتوسطات الجديدة ثم القسمة على العدد (مع منع القسمة على صفر)
    const total = afterMercy.reduce((sum, s) => sum + s.newAverage, 0);
    const overallAverage = afterMercy.length > 0 ? total / afterMercy.length : 0;

    if (afterMercy.length === 0) {
        reportBox.innerHTML = `
            <div class="report-summary">
                <p class="mb-0">لا يوجد طلاب متعثرون (متوسطهم بين 40 و 49) في القائمة حالياً.</p>
            </div>`;
        return;
    }

    reportBox.innerHTML = `
        <div class="report-summary">
            <p><strong>عدد الطلاب المتعثرين:</strong> ${afterMercy.length}</p>
            <p class="mb-1"><strong>الأسماء:</strong></p>
            <ul>
                ${afterMercy.map(s => `<li>${escapeHTML(s.name)} — المتوسط بعد الرأفة: ${s.newAverage.toFixed(2)}</li>`).join("")}
            </ul>
            <p class="mb-0"><strong>المتوسط العام بعد الرأفة:</strong> ${overallAverage.toFixed(2)}</p>
        </div>`;
};

// عرض الحالة الابتدائية
renderStudents();
