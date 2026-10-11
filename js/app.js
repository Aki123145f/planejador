"use strict";


/* =========================
   ELEMENTOS PRINCIPAIS
========================= */

const weekButton =
    document.getElementById(
        "week-button"
    );

const travelButton =
    document.getElementById(
        "travel-button"
    );

const studyButton =
    document.getElementById(
        "study-button"
    );

const weekSection =
    document.getElementById(
        "week-section"
    );

const travelSection =
    document.getElementById(
        "travel-section"
    );

const studySection =
    document.getElementById(
        "study-section"
    );

const themeButton =
    document.getElementById(
        "theme-button"
    );

const exportButton =
    document.getElementById(
        "export-button"
    );

const importButton =
    document.getElementById(
        "import-button"
    );

const printButton =
    document.getElementById(
        "print-button"
    );

const importFile =
    document.getElementById(
        "import-file"
    );


/* =========================
   SEMANA
========================= */

const weekForm =
    document.getElementById(
        "week-form"
    );

const weekDay =
    document.getElementById(
        "week-day"
    );

const weekTask =
    document.getElementById(
        "week-task"
    );

const weekSubmitButton =
    weekForm.querySelector(
        'button[type="submit"]'
    );

const weekTasks = [];

const MAX_WEEK_TASKS = 100;
const MAX_WEEK_TASK_LENGTH = 160;

let editingWeekTaskId = null;


/* =========================
   VIAGEM
========================= */

const travelForm =
    document.getElementById(
        "travel-form"
    );

const travelDate =
    document.getElementById(
        "travel-date"
    );

const travelTime =
    document.getElementById(
        "travel-time"
    );

const travelPlace =
    document.getElementById(
        "travel-place"
    );

const travelNotes =
    document.getElementById(
        "travel-notes"
    );

const travelSubmitButton =
    travelForm.querySelector(
        'button[type="submit"]'
    );

const travelItems = [];

const MAX_TRAVEL_ITEMS = 100;
const MAX_TRAVEL_PLACE_LENGTH = 80;
const MAX_TRAVEL_NOTES_LENGTH = 300;

let editingTravelItemId = null;


/* =========================
   ESTUDOS
========================= */

const studyForm =
    document.getElementById(
        "study-form"
    );

const studyDay =
    document.getElementById(
        "study-day"
    );

const studySubject =
    document.getElementById(
        "study-subject"
    );

const studyContent =
    document.getElementById(
        "study-content"
    );

const studySubmitButton =
    studyForm.querySelector(
        'button[type="submit"]'
    );

const studyItems = [];

const MAX_STUDY_ITEMS = 100;
const MAX_STUDY_SUBJECT_LENGTH = 60;
const MAX_STUDY_CONTENT_LENGTH = 300;

let editingStudyItemId = null;


/* =========================
   DIAS
========================= */

const dayNames = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo"
};


/* =========================
   GERADOR DE ID
========================= */

function createPlannerId() {
    if (
        window.crypto &&
        typeof window.crypto.randomUUID ===
            "function"
    ) {
        return window.crypto.randomUUID();
    }

    if (
        window.crypto &&
        typeof window.crypto.getRandomValues ===
            "function"
    ) {
        const bytes =
            new Uint8Array(16);

        window.crypto.getRandomValues(
            bytes
        );

        bytes[6] =
            (bytes[6] & 0x0f) |
            0x40;

        bytes[8] =
            (bytes[8] & 0x3f) |
            0x80;

        const hex =
            Array.from(
                bytes,
                function (byte) {
                    return byte
                        .toString(16)
                        .padStart(
                            2,
                            "0"
                        );
                }
            );

        return (
            hex.slice(0, 4).join("") +
            "-" +
            hex.slice(4, 6).join("") +
            "-" +
            hex.slice(6, 8).join("") +
            "-" +
            hex.slice(8, 10).join("") +
            "-" +
            hex.slice(10, 16).join("")
        );
    }

    return (
        "id-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 12)
    );
}


/* =========================
   SALVAR / CARREGAR
========================= */

function saveAllData() {
    const saved =
        PlannerStorage.save({
            weekTasks:
                weekTasks,

            travelItems:
                travelItems,

            studyItems:
                studyItems
        });

    if (!saved) {
        alert(
            "Não foi possível salvar os dados."
        );
    }
}

function clearCurrentData() {
    weekTasks.splice(
        0,
        weekTasks.length
    );

    travelItems.splice(
        0,
        travelItems.length
    );

    studyItems.splice(
        0,
        studyItems.length
    );
}

function applyData(data) {
    clearCurrentData();

    data.weekTasks.forEach(
        function (item) {
            weekTasks.push({
                id: item.id,

                day: item.day,

                dayName:
                    dayNames[
                        item.day
                    ],

                text:
                    item.text
            });
        }
    );

    data.travelItems.forEach(
        function (item) {
            travelItems.push({
                id:
                    item.id,

                date:
                    item.date,

                formattedDate:
                    formatTravelDate(
                        item.date
                    ),

                time:
                    item.time,

                place:
                    item.place,

                notes:
                    item.notes
            });
        }
    );

    data.studyItems.forEach(
        function (item) {
            studyItems.push({
                id:
                    item.id,

                day:
                    item.day,

                dayName:
                    dayNames[
                        item.day
                    ],

                subject:
                    item.subject,

                content:
                    item.content
            });
        }
    );
}

function loadAllData() {
    const savedData =
        PlannerStorage.load();

    applyData(
        savedData
    );
}


/* =========================
   TROCA DE MODO
========================= */

function showMode(mode) {
    weekSection.hidden = true;
    travelSection.hidden = true;
    studySection.hidden = true;

    if (
        mode === "week"
    ) {
        weekSection.hidden =
            false;
    }

    if (
        mode === "travel"
    ) {
        travelSection.hidden =
            false;
    }

    if (
        mode === "study"
    ) {
        studySection.hidden =
            false;
    }
}


/* =========================
   TEMA
========================= */

function toggleTheme() {
    const darkModeActive =
        document.body
            .classList
            .toggle(
                "dark-mode"
            );

    if (
        darkModeActive
    ) {
        themeButton.textContent =
            "Modo claro";

        themeButton.setAttribute(
            "aria-label",
            "Ativar modo claro"
        );
    } else {
        themeButton.textContent =
            "Modo escuro";

        themeButton.setAttribute(
            "aria-label",
            "Ativar modo escuro"
        );
    }
}


/* =========================
   SEMANA
========================= */

function renderWeekTasks() {
    PlannerUI.renderWeekTasks(
        weekTasks,
        startEditingWeekTask,
        removeWeekTask
    );
}

function resetWeekForm() {
    editingWeekTaskId = null;

    weekForm.reset();

    weekSubmitButton.textContent =
        "Adicionar tarefa";
}

function handleWeekFormSubmit(
    event
) {
    event.preventDefault();

    const selectedDay =
        weekDay.value;

    const taskText =
        weekTask.value
            .trim()
            .slice(
                0,
                MAX_WEEK_TASK_LENGTH
            );

    if (
        !Object.hasOwn(
            dayNames,
            selectedDay
        )
    ) {
        alert(
            "Selecione um dia válido."
        );

        return;
    }

    if (
        taskText.length === 0
    ) {
        alert(
            "Digite uma tarefa."
        );

        return;
    }

    if (
        editingWeekTaskId !== null
    ) {
        const task =
            weekTasks.find(
                function (item) {
                    return (
                        item.id ===
                        editingWeekTaskId
                    );
                }
            );

        if (!task) {
            resetWeekForm();
            return;
        }

        task.day =
            selectedDay;

        task.dayName =
            dayNames[
                selectedDay
            ];

        task.text =
            taskText;
    } else {
        if (
            weekTasks.length >=
            MAX_WEEK_TASKS
        ) {
            alert(
                "Limite de 100 tarefas atingido."
            );

            return;
        }

        weekTasks.push({
            id:
                createPlannerId(),

            day:
                selectedDay,

            dayName:
                dayNames[
                    selectedDay
                ],

            text:
                taskText
        });
    }

    saveAllData();

    renderWeekTasks();

    resetWeekForm();
}

function startEditingWeekTask(
    taskId
) {
    const task =
        weekTasks.find(
            function (item) {
                return (
                    item.id ===
                    taskId
                );
            }
        );

    if (!task) {
        return;
    }

    editingWeekTaskId =
        task.id;

    weekDay.value =
        task.day;

    weekTask.value =
        task.text;

    weekSubmitButton.textContent =
        "Salvar alteração";

    weekTask.focus();
}

function removeWeekTask(
    taskId
) {
    const index =
        weekTasks.findIndex(
            function (item) {
                return (
                    item.id ===
                    taskId
                );
            }
        );

    if (
        index === -1
    ) {
        return;
    }

    if (
        !confirm(
            "Deseja remover esta tarefa?"
        )
    ) {
        return;
    }

    weekTasks.splice(
        index,
        1
    );

    saveAllData();

    renderWeekTasks();

    resetWeekForm();
}


/* =========================
   VIAGEM
========================= */

function formatTravelDate(
    dateValue
) {
    const parts =
        dateValue.split("-");

    if (
        parts.length !== 3
    ) {
        return dateValue;
    }

    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );
}

function renderTravelItems() {
    PlannerUI.renderTravelItems(
        travelItems,
        startEditingTravelItem,
        removeTravelItem
    );
}

function resetTravelForm() {
    editingTravelItemId = null;

    travelForm.reset();

    travelSubmitButton.textContent =
        "Adicionar ao roteiro";
}

function handleTravelFormSubmit(
    event
) {
    event.preventDefault();

    const date =
        travelDate.value
            .trim();

    const time =
        travelTime.value
            .trim();

    const place =
        travelPlace.value
            .trim()
            .slice(
                0,
                MAX_TRAVEL_PLACE_LENGTH
            );

    const notes =
        travelNotes.value
            .trim()
            .slice(
                0,
                MAX_TRAVEL_NOTES_LENGTH
            );

    if (
        !PlannerStorage
            .isValidDate(
                date
            )
    ) {
        alert(
            "Selecione uma data válida."
        );

        return;
    }

    if (
        !PlannerStorage
            .isValidTime(
                time
            )
    ) {
        alert(
            "Selecione um horário válido."
        );

        return;
    }

    if (
        place.length === 0
    ) {
        alert(
            "Digite o local."
        );

        return;
    }

    if (
        editingTravelItemId !==
        null
    ) {
        const item =
            travelItems.find(
                function (
                    travelItem
                ) {
                    return (
                        travelItem.id ===
                        editingTravelItemId
                    );
                }
            );

        if (!item) {
            resetTravelForm();
            return;
        }

        item.date =
            date;

        item.formattedDate =
            formatTravelDate(
                date
            );

        item.time =
            time;

        item.place =
            place;

        item.notes =
            notes;
    } else {
        if (
            travelItems.length >=
            MAX_TRAVEL_ITEMS
        ) {
            alert(
                "Limite de 100 itens atingido."
            );

            return;
        }

        travelItems.push({
            id:
                createPlannerId(),

            date:
                date,

            formattedDate:
                formatTravelDate(
                    date
                ),

            time:
                time,

            place:
                place,

            notes:
                notes
        });
    }

    saveAllData();

    renderTravelItems();

    resetTravelForm();
}

function startEditingTravelItem(
    itemId
) {
    const item =
        travelItems.find(
            function (
                travelItem
            ) {
                return (
                    travelItem.id ===
                    itemId
                );
            }
        );

    if (!item) {
        return;
    }

    editingTravelItemId =
        item.id;

    travelDate.value =
        item.date;

    travelTime.value =
        item.time;

    travelPlace.value =
        item.place;

    travelNotes.value =
        item.notes;

    travelSubmitButton.textContent =
        "Salvar alteração";

    travelPlace.focus();
}

function removeTravelItem(
    itemId
) {
    const index =
        travelItems.findIndex(
            function (item) {
                return (
                    item.id ===
                    itemId
                );
            }
        );

    if (
        index === -1
    ) {
        return;
    }

    if (
        !confirm(
            "Deseja remover este item do roteiro?"
        )
    ) {
        return;
    }

    travelItems.splice(
        index,
        1
    );

    saveAllData();

    renderTravelItems();

    resetTravelForm();
}


/* =========================
   ESTUDOS
========================= */

function renderStudyItems() {
    PlannerUI.renderStudyItems(
        studyItems,
        startEditingStudyItem,
        removeStudyItem
    );
}

function resetStudyForm() {
    editingStudyItemId = null;

    studyForm.reset();

    studySubmitButton.textContent =
        "Adicionar estudo";
}

function handleStudyFormSubmit(
    event
) {
    event.preventDefault();

    const day =
        studyDay.value;

    const subject =
        studySubject.value
            .trim()
            .slice(
                0,
                MAX_STUDY_SUBJECT_LENGTH
            );

    const content =
        studyContent.value
            .trim()
            .slice(
                0,
                MAX_STUDY_CONTENT_LENGTH
            );

    if (
        !Object.hasOwn(
            dayNames,
            day
        )
    ) {
        alert(
            "Selecione um dia válido."
        );

        return;
    }

    if (
        subject.length === 0
    ) {
        alert(
            "Digite a matéria."
        );

        return;
    }

    if (
        content.length === 0
    ) {
        alert(
            "Digite o que estudar."
        );

        return;
    }

    if (
        editingStudyItemId !==
        null
    ) {
        const item =
            studyItems.find(
                function (
                    studyItem
                ) {
                    return (
                        studyItem.id ===
                        editingStudyItemId
                    );
                }
            );

        if (!item) {
            resetStudyForm();
            return;
        }

        item.day =
            day;

        item.dayName =
            dayNames[
                day
            ];

        item.subject =
            subject;

        item.content =
            content;
    } else {
        if (
            studyItems.length >=
            MAX_STUDY_ITEMS
        ) {
            alert(
                "Limite de 100 estudos atingido."
            );

            return;
        }

        studyItems.push({
            id:
                createPlannerId(),

            day:
                day,

            dayName:
                dayNames[
                    day
                ],

            subject:
                subject,

            content:
                content
        });
    }

    saveAllData();

    renderStudyItems();

    resetStudyForm();
}

function startEditingStudyItem(
    itemId
) {
    const item =
        studyItems.find(
            function (
                studyItem
            ) {
                return (
                    studyItem.id ===
                    itemId
                );
            }
        );

    if (!item) {
        return;
    }

    editingStudyItemId =
        item.id;

    studyDay.value =
        item.day;

    studySubject.value =
        item.subject;

    studyContent.value =
        item.content;

    studySubmitButton.textContent =
        "Salvar alteração";

    studySubject.focus();
}

function removeStudyItem(
    itemId
) {
    const index =
        studyItems.findIndex(
            function (item) {
                return (
                    item.id ===
                    itemId
                );
            }
        );

    if (
        index === -1
    ) {
        return;
    }

    if (
        !confirm(
            "Deseja remover este estudo?"
        )
    ) {
        return;
    }

    studyItems.splice(
        index,
        1
    );

    saveAllData();

    renderStudyItems();

    resetStudyForm();
}


/* =========================
   EXPORTAÇÃO
========================= */

function exportData() {
    const success =
        PlannerStorage
            .exportToFile({
                weekTasks:
                    weekTasks,

                travelItems:
                    travelItems,

                studyItems:
                    studyItems
            });

    if (
        !success
    ) {
        alert(
            "Não foi possível exportar os dados."
        );
    }
}


/* =========================
   IMPORTAÇÃO
========================= */

function openImportFile() {
    importFile.click();
}

async function handleImportFile() {
    const file =
        importFile.files[0];

    if (!file) {
        return;
    }

    try {
        const importedData =
            await PlannerStorage
                .importFromFile(
                    file
                );

        const confirmed =
            confirm(
                "A importação substituirá os planejamentos atuais. Deseja continuar?"
            );

        if (
            !confirmed
        ) {
            importFile.value =
                "";

            return;
        }

        applyData(
            importedData
        );

        saveAllData();

        renderWeekTasks();
        renderTravelItems();
        renderStudyItems();

        resetWeekForm();
        resetTravelForm();
        resetStudyForm();

        alert(
            "Dados importados com sucesso."
        );
    } catch (error) {
        alert(
            error.message
        );
    }

    importFile.value =
        "";
}


/* =========================
   IMPRESSÃO
========================= */

function printPlanner() {
    window.print();
}


/* =========================
   EVENTOS
========================= */

weekButton.addEventListener(
    "click",
    function () {
        showMode(
            "week"
        );
    }
);

travelButton.addEventListener(
    "click",
    function () {
        showMode(
            "travel"
        );
    }
);

studyButton.addEventListener(
    "click",
    function () {
        showMode(
            "study"
        );
    }
);

themeButton.addEventListener(
    "click",
    toggleTheme
);

weekForm.addEventListener(
    "submit",
    handleWeekFormSubmit
);

travelForm.addEventListener(
    "submit",
    handleTravelFormSubmit
);

studyForm.addEventListener(
    "submit",
    handleStudyFormSubmit
);

exportButton.addEventListener(
    "click",
    exportData
);

importButton.addEventListener(
    "click",
    openImportFile
);

importFile.addEventListener(
    "change",
    handleImportFile
);

printButton.addEventListener(
    "click",
    printPlanner
);


/* =========================
   INICIAR
========================= */

loadAllData();

renderWeekTasks();
renderTravelItems();
renderStudyItems();

showMode(
    "week"
);