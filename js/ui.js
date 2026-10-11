"use strict";

const PlannerUI = {
    createWeekCard(task, onEdit, onRemove) {
        const card = document.createElement("article");
        card.classList.add("planner-card");

        const dayTitle = document.createElement("h3");
        dayTitle.textContent = task.dayName;

        const taskText = document.createElement("p");
        taskText.textContent = task.text;

        const actions = document.createElement("div");
        actions.classList.add("planner-actions");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Editar";

        editButton.addEventListener("click", function () {
            onEdit(task.id);
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remover";

        removeButton.addEventListener("click", function () {
            onRemove(task.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(removeButton);

        card.appendChild(dayTitle);
        card.appendChild(taskText);
        card.appendChild(actions);

        return card;
    },

    renderWeekTasks(tasks, onEdit, onRemove) {
        const weekList =
            document.getElementById("week-list");

        weekList.replaceChildren();

        tasks.forEach(function (task) {
            const card = PlannerUI.createWeekCard(
                task,
                onEdit,
                onRemove
            );

            weekList.appendChild(card);
        });
    },

    createTravelCard(item, onEdit, onRemove) {
        const card = document.createElement("article");
        card.classList.add("planner-card");

        const placeTitle = document.createElement("h3");
        placeTitle.textContent = item.place;

        const dateText = document.createElement("p");
        dateText.textContent =
            "Data: " + item.formattedDate;

        const timeText = document.createElement("p");
        timeText.textContent =
            "Horário: " + item.time;

        card.appendChild(placeTitle);
        card.appendChild(dateText);
        card.appendChild(timeText);

        if (item.notes.length > 0) {
            const notesText =
                document.createElement("p");

            notesText.textContent =
                "Observações: " + item.notes;

            card.appendChild(notesText);
        }

        const actions = document.createElement("div");
        actions.classList.add("planner-actions");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Editar";

        editButton.addEventListener("click", function () {
            onEdit(item.id);
        });

        const removeButton =
            document.createElement("button");

        removeButton.type = "button";
        removeButton.textContent = "Remover";

        removeButton.addEventListener(
            "click",
            function () {
                onRemove(item.id);
            }
        );

        actions.appendChild(editButton);
        actions.appendChild(removeButton);

        card.appendChild(actions);

        return card;
    },

    renderTravelItems(items, onEdit, onRemove) {
        const travelList =
            document.getElementById("travel-list");

        travelList.replaceChildren();

        items.forEach(function (item) {
            const card = PlannerUI.createTravelCard(
                item,
                onEdit,
                onRemove
            );

            travelList.appendChild(card);
        });
    },

    createStudyCard(item, onEdit, onRemove) {
        const card = document.createElement("article");
        card.classList.add("planner-card");

        const subjectTitle =
            document.createElement("h3");

        subjectTitle.textContent = item.subject;

        const dayText = document.createElement("p");
        dayText.textContent =
            "Dia: " + item.dayName;

        const contentText =
            document.createElement("p");

        contentText.textContent =
            "Estudar: " + item.content;

        const actions = document.createElement("div");
        actions.classList.add("planner-actions");

        const editButton =
            document.createElement("button");

        editButton.type = "button";
        editButton.textContent = "Editar";

        editButton.addEventListener(
            "click",
            function () {
                onEdit(item.id);
            }
        );

        const removeButton =
            document.createElement("button");

        removeButton.type = "button";
        removeButton.textContent = "Remover";

        removeButton.addEventListener(
            "click",
            function () {
                onRemove(item.id);
            }
        );

        actions.appendChild(editButton);
        actions.appendChild(removeButton);

        card.appendChild(subjectTitle);
        card.appendChild(dayText);
        card.appendChild(contentText);
        card.appendChild(actions);

        return card;
    },

    renderStudyItems(items, onEdit, onRemove) {
        const studyList =
            document.getElementById("study-list");

        studyList.replaceChildren();

        items.forEach(function (item) {
            const card = PlannerUI.createStudyCard(
                item,
                onEdit,
                onRemove
            );

            studyList.appendChild(card);
        });
    }
};