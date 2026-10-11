"use strict";

const PlannerStorage = {
    STORAGE_KEY: "planejador_data_v1",

    MAX_ITEMS: 100,

    MAX_IMPORT_FILE_SIZE:
        512 * 1024,

    validDays: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ],

    getEmptyData() {
        return {
            weekTasks: [],
            travelItems: [],
            studyItems: []
        };
    },

    isPlainObject(value) {
        return (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
        );
    },

    hasExactKeys(
        object,
        expectedKeys
    ) {
        if (
            !PlannerStorage
                .isPlainObject(object)
        ) {
            return false;
        }

        const keys =
            Object.keys(object).sort();

        const expected =
            [...expectedKeys].sort();

        if (
            keys.length !==
            expected.length
        ) {
            return false;
        }

        return keys.every(
            function (key, index) {
                return (
                    key ===
                    expected[index]
                );
            }
        );
    },

    isValidId(value) {
        return (
            typeof value === "string" &&
            value.length > 0 &&
            value.length <= 100
        );
    },

    isValidDay(value) {
        return (
            typeof value === "string" &&
            PlannerStorage
                .validDays
                .includes(value)
        );
    },

    isValidText(
        value,
        maxLength,
        allowEmpty = false
    ) {
        if (
            typeof value !== "string"
        ) {
            return false;
        }

        if (
            value.length >
            maxLength
        ) {
            return false;
        }

        if (
            !allowEmpty &&
            value.trim().length === 0
        ) {
            return false;
        }

        return true;
    },

    isValidDate(value) {
        if (
            typeof value !== "string"
        ) {
            return false;
        }

        const match =
            /^(\d{4})-(\d{2})-(\d{2})$/
                .exec(value);

        if (!match) {
            return false;
        }

        const year =
            Number(match[1]);

        const month =
            Number(match[2]);

        const day =
            Number(match[3]);

        if (
            year < 1000 ||
            year > 9999
        ) {
            return false;
        }

        const date =
            new Date(
                Date.UTC(
                    year,
                    month - 1,
                    day
                )
            );

        return (
            date.getUTCFullYear() ===
                year &&
            date.getUTCMonth() ===
                month - 1 &&
            date.getUTCDate() ===
                day
        );
    },

    isValidTime(value) {
        return (
            typeof value === "string" &&
            /^([01]\d|2[0-3]):[0-5]\d$/
                .test(value)
        );
    },

    validateWeekItem(item) {
        return (
            PlannerStorage.hasExactKeys(
                item,
                [
                    "id",
                    "day",
                    "text"
                ]
            ) &&
            PlannerStorage.isValidId(
                item.id
            ) &&
            PlannerStorage.isValidDay(
                item.day
            ) &&
            PlannerStorage.isValidText(
                item.text,
                160
            )
        );
    },

    validateTravelItem(item) {
        return (
            PlannerStorage.hasExactKeys(
                item,
                [
                    "id",
                    "date",
                    "time",
                    "place",
                    "notes"
                ]
            ) &&
            PlannerStorage.isValidId(
                item.id
            ) &&
            PlannerStorage.isValidDate(
                item.date
            ) &&
            PlannerStorage.isValidTime(
                item.time
            ) &&
            PlannerStorage.isValidText(
                item.place,
                80
            ) &&
            PlannerStorage.isValidText(
                item.notes,
                300,
                true
            )
        );
    },

    validateStudyItem(item) {
        return (
            PlannerStorage.hasExactKeys(
                item,
                [
                    "id",
                    "day",
                    "subject",
                    "content"
                ]
            ) &&
            PlannerStorage.isValidId(
                item.id
            ) &&
            PlannerStorage.isValidDay(
                item.day
            ) &&
            PlannerStorage.isValidText(
                item.subject,
                60
            ) &&
            PlannerStorage.isValidText(
                item.content,
                300
            )
        );
    },

    hasUniqueIds(items) {
        const ids =
            new Set();

        for (
            const item of items
        ) {
            if (
                ids.has(item.id)
            ) {
                return false;
            }

            ids.add(item.id);
        }

        return true;
    },

    validateData(data) {
        if (
            !PlannerStorage
                .hasExactKeys(
                    data,
                    [
                        "version",
                        "weekTasks",
                        "travelItems",
                        "studyItems"
                    ]
                )
        ) {
            return null;
        }

        if (
            data.version !== 1
        ) {
            return null;
        }

        if (
            !Array.isArray(
                data.weekTasks
            ) ||
            !Array.isArray(
                data.travelItems
            ) ||
            !Array.isArray(
                data.studyItems
            )
        ) {
            return null;
        }

        if (
            data.weekTasks.length >
                PlannerStorage.MAX_ITEMS ||
            data.travelItems.length >
                PlannerStorage.MAX_ITEMS ||
            data.studyItems.length >
                PlannerStorage.MAX_ITEMS
        ) {
            return null;
        }

        if (
            !data.weekTasks.every(
                PlannerStorage
                    .validateWeekItem
            )
        ) {
            return null;
        }

        if (
            !data.travelItems.every(
                PlannerStorage
                    .validateTravelItem
            )
        ) {
            return null;
        }

        if (
            !data.studyItems.every(
                PlannerStorage
                    .validateStudyItem
            )
        ) {
            return null;
        }

        if (
            !PlannerStorage
                .hasUniqueIds(
                    data.weekTasks
                ) ||
            !PlannerStorage
                .hasUniqueIds(
                    data.travelItems
                ) ||
            !PlannerStorage
                .hasUniqueIds(
                    data.studyItems
                )
        ) {
            return null;
        }

        return {
            weekTasks:
                data.weekTasks.map(
                    function (item) {
                        return {
                            id: item.id,
                            day: item.day,
                            text:
                                item.text.trim()
                        };
                    }
                ),

            travelItems:
                data.travelItems.map(
                    function (item) {
                        return {
                            id: item.id,
                            date: item.date,
                            time: item.time,
                            place:
                                item.place
                                    .trim(),
                            notes:
                                item.notes
                                    .trim()
                        };
                    }
                ),

            studyItems:
                data.studyItems.map(
                    function (item) {
                        return {
                            id: item.id,
                            day: item.day,
                            subject:
                                item.subject
                                    .trim(),
                            content:
                                item.content
                                    .trim()
                        };
                    }
                )
        };
    },

    createSafeData(data) {
        const candidate = {
            version: 1,

            weekTasks:
                data.weekTasks.map(
                    function (item) {
                        return {
                            id: item.id,
                            day: item.day,
                            text: item.text
                        };
                    }
                ),

            travelItems:
                data.travelItems.map(
                    function (item) {
                        return {
                            id: item.id,
                            date: item.date,
                            time: item.time,
                            place: item.place,
                            notes: item.notes
                        };
                    }
                ),

            studyItems:
                data.studyItems.map(
                    function (item) {
                        return {
                            id: item.id,
                            day: item.day,
                            subject:
                                item.subject,
                            content:
                                item.content
                        };
                    }
                )
        };

        const validated =
            PlannerStorage
                .validateData(candidate);

        if (!validated) {
            return null;
        }

        return candidate;
    },

    save(data) {
        try {
            const safeData =
                PlannerStorage
                    .createSafeData(data);

            if (!safeData) {
                return false;
            }

            localStorage.setItem(
                PlannerStorage.STORAGE_KEY,
                JSON.stringify(
                    safeData
                )
            );

            return true;
        } catch (error) {
            console.error(
                "Erro ao salvar:",
                error
            );

            return false;
        }
    },

    load() {
        try {
            const saved =
                localStorage.getItem(
                    PlannerStorage
                        .STORAGE_KEY
                );

            if (saved === null) {
                return PlannerStorage
                    .getEmptyData();
            }

            const parsed =
                JSON.parse(saved);

            const validated =
                PlannerStorage
                    .validateData(parsed);

            if (!validated) {
                return PlannerStorage
                    .getEmptyData();
            }

            return validated;
        } catch (error) {
            console.error(
                "Erro ao carregar:",
                error
            );

            return PlannerStorage
                .getEmptyData();
        }
    },

    exportToFile(data) {
        try {
            const safeData =
                PlannerStorage
                    .createSafeData(data);

            if (!safeData) {
                return false;
            }

            const json =
                JSON.stringify(
                    safeData,
                    null,
                    2
                );

            const blob =
                new Blob(
                    [json],
                    {
                        type:
                            "application/json"
                    }
                );

            const url =
                URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement(
                    "a"
                );

            const today =
                new Date()
                    .toISOString()
                    .slice(0, 10);

            link.href = url;

            link.download =
                "planejador-backup-" +
                today +
                ".json";

            document.body
                .appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(
                url
            );

            return true;
        } catch (error) {
            console.error(
                "Erro ao exportar:",
                error
            );

            return false;
        }
    },

    async importFromFile(file) {
        if (!file) {
            throw new Error(
                "Nenhum arquivo selecionado."
            );
        }

        if (
            file.size === 0
        ) {
            throw new Error(
                "O arquivo está vazio."
            );
        }

        if (
            file.size >
            PlannerStorage
                .MAX_IMPORT_FILE_SIZE
        ) {
            throw new Error(
                "O arquivo é muito grande."
            );
        }

        const fileName =
            file.name.toLowerCase();

        if (
            !fileName.endsWith(
                ".json"
            )
        ) {
            throw new Error(
                "Selecione um arquivo JSON."
            );
        }

        let text;

        try {
            text =
                await file.text();
        } catch (error) {
            throw new Error(
                "Não foi possível ler o arquivo."
            );
        }

        let parsed;

        try {
            parsed =
                JSON.parse(text);
        } catch (error) {
            throw new Error(
                "O arquivo não contém JSON válido."
            );
        }

        const validated =
            PlannerStorage
                .validateData(parsed);

        if (!validated) {
            throw new Error(
                "O arquivo não possui a estrutura esperada."
            );
        }

        return validated;
    }
};