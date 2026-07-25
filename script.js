// ============================================================
// NEXA OS - COMPLETE SCRIPT.JS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // HELPERS
    // ============================================================

    const $ = (id) => document.getElementById(id);

    const lockScreen = $("lockScreen");
    const unlockBtn = $("unlockBtn");
    const desktop = $("desktop");

    const clock = $("clock");
    const date = $("date");
    const lockTime = $("lockTime");
    const lockDate = $("lockDate");

    const startBtn = $("startBtn");
    const startMenu = $("startMenu");

    const notificationBtn = $("notificationBtn");
    const notificationCenter = $("notificationCenter");
    const notificationList = $("notificationList");
    const clearNotifications = $("clearNotifications");

    const powerBtn = $("powerBtn");
    const powerMenu = $("powerMenu");
    const powerLock = $("powerLock");
    const powerRestart = $("powerRestart");
    const powerShutdown = $("powerShutdown");

    const startLockBtn = $("startLockBtn");
    const startPowerBtn = $("startPowerBtn");

    // ============================================================
    // APP WINDOWS
    // ============================================================

    const appWindows = {
        browser: $("browserWindow"),
        calculator: $("calculatorWindow"),
        notes: $("notesWindow"),
        files: $("filesWindow"),
        settings: $("settingsWindow"),
        trash: $("trashWindow")
    };

    let highestZIndex = 100;

    // ============================================================
    // CLOCK AND DATE
    // ============================================================

    function updateDateTime() {

        const now = new Date();

        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const period = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;

        if (hours === 0) {
            hours = 12;
        }

        const shortTime =
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            " " +
            period;

        const fullTime =
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0") +
            " " +
            period;

        const dateText = now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        if (clock) {
            clock.textContent = shortTime;
        }

        if (date) {
            date.textContent = dateText;
        }

        if (lockTime) {
            lockTime.textContent = fullTime;
        }

        if (lockDate) {
            lockDate.textContent = dateText;
        }
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    // ============================================================
    // LOCK SCREEN
    // ============================================================

    let isLocked =
        localStorage.getItem("nexaLocked") !== "false";

    function lockNexaOS() {

        isLocked = true;

        localStorage.setItem(
            "nexaLocked",
            "true"
        );

        if (lockScreen) {
            lockScreen.style.display = "flex";
        }

        document.body.classList.add(
            "is-locked"
        );

        closeAllMenus();
        updateDateTime();
    }

    function unlockNexaOS() {

        isLocked = false;

        localStorage.setItem(
            "nexaLocked",
            "false"
        );

        if (lockScreen) {
            lockScreen.style.display = "none";
        }

        document.body.classList.remove(
            "is-locked"
        );
    }

    if (unlockBtn) {
        unlockBtn.addEventListener(
            "click",
            unlockNexaOS
        );
    }

    // ============================================================
    // WINDOW SYSTEM
    // ============================================================

    function bringToFront(windowElement) {

        if (!windowElement) return;

        highestZIndex++;

        windowElement.style.zIndex =
            highestZIndex;
    }

    function openApp(appName) {

        const windowElement =
            appWindows[appName];

        if (!windowElement) return;

        windowElement.style.display = "flex";

        windowElement.classList.remove(
            "minimized"
        );

        bringToFront(windowElement);

        closeAllMenus();

        if (appName === "files") {
            renderFileExplorer();
        }

        if (appName === "trash") {
            renderTrash();
        }

        if (appName === "notes") {
            renderNotesList();
        }
    }

    function closeApp(windowElement) {

        if (!windowElement) return;

        windowElement.style.display =
            "none";

        windowElement.classList.remove(
            "minimized"
        );
    }

    function minimizeApp(windowElement) {

        if (!windowElement) return;

        windowElement.classList.add(
            "minimized"
        );

        windowElement.style.display =
            "none";
    }

    // ============================================================
    // DESKTOP ICONS
    // ============================================================

    document
        .querySelectorAll(".desktop-icon")
        .forEach(icon => {

            icon.addEventListener(
                "dblclick",
                () => {

                    openApp(
                        icon.dataset.app
                    );

                }
            );

        });

    // ============================================================
    // START MENU APPS
    // ============================================================

    document
        .querySelectorAll(
            ".start-apps [data-app]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openApp(
                        button.dataset.app
                    );

                }
            );

        });

    // ============================================================
    // TASKBAR APPS
    // ============================================================

    document
        .querySelectorAll(
            "#taskbarApps [data-app]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const appName =
                        button.dataset.app;

                    const windowElement =
                        appWindows[appName];

                    if (!windowElement) return;

                    if (
                        windowElement.style.display ===
                        "flex"
                    ) {

                        minimizeApp(
                            windowElement
                        );

                    } else {

                        openApp(appName);

                    }

                }
            );

        });

    // ============================================================
    // WINDOW CLOSE AND MINIMIZE
    // ============================================================

    document
        .querySelectorAll(".app-window")
        .forEach(windowElement => {

            const closeButton =
                windowElement.querySelector(
                    ".close-btn"
                );

            const minimizeButton =
                windowElement.querySelector(
                    ".minimize-btn"
                );

            if (closeButton) {

                closeButton.addEventListener(
                    "click",
                    () => {

                        closeApp(
                            windowElement
                        );

                    }
                );

            }

            if (minimizeButton) {

                minimizeButton.addEventListener(
                    "click",
                    () => {

                        minimizeApp(
                            windowElement
                        );

                    }
                );

            }

            windowElement.addEventListener(
                "mousedown",
                () => {

                    bringToFront(
                        windowElement
                    );

                }
            );

        });

    // ============================================================
    // MENUS
    // ============================================================

    function closeAllMenus() {

        if (startMenu) {
            startMenu.style.display =
                "none";
        }

        if (powerMenu) {
            powerMenu.style.display =
                "none";
        }

        if (notificationCenter) {
            notificationCenter.style.display =
                "none";
        }
    }

    if (startBtn) {

        startBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const isOpen =
                    startMenu.style.display ===
                    "flex";

                closeAllMenus();

                if (!isOpen) {
                    startMenu.style.display =
                        "flex";
                }

            }
        );

    }

    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const isOpen =
                    notificationCenter.style.display ===
                    "flex";

                closeAllMenus();

                if (!isOpen) {
                    notificationCenter.style.display =
                        "flex";
                }

            }
        );

    }

    if (powerBtn) {

        powerBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const isOpen =
                    powerMenu.style.display ===
                    "flex";

                closeAllMenus();

                if (!isOpen) {
                    powerMenu.style.display =
                        "flex";
                }

            }
        );

    }

    document.addEventListener(
        "click",
        event => {

            if (
                startMenu &&
                !startMenu.contains(event.target) &&
                event.target !== startBtn
            ) {
                startMenu.style.display =
                    "none";
            }

            if (
                powerMenu &&
                !powerMenu.contains(event.target) &&
                event.target !== powerBtn
            ) {
                powerMenu.style.display =
                    "none";
            }

            if (
                notificationCenter &&
                !notificationCenter.contains(event.target) &&
                event.target !== notificationBtn
            ) {
                notificationCenter.style.display =
                    "none";
            }

        }
    );

    // ============================================================
    // GOOGLE TOP SEARCH
    // ============================================================

    const googleSearch =
        $("googleSearch");

    const searchBtn =
        $("searchBtn");

    function googleSearchNow() {

        if (!googleSearch) return;

        const query =
            googleSearch.value.trim();

        if (!query) return;

        window.open(
            "https://www.google.com/search?q=" +
            encodeURIComponent(query),
            "_blank"
        );
    }

    if (searchBtn) {
        searchBtn.addEventListener(
            "click",
            googleSearchNow
        );
    }

    if (googleSearch) {

        googleSearch.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {
                    googleSearchNow();
                }

            }
        );

    }

    // ============================================================
    // CALCULATOR
    // ============================================================

    const calcDisplay =
        $("calcDisplay");

    let calculatorValue = "";

    function updateCalculator() {

        if (calcDisplay) {

            calcDisplay.value =
                calculatorValue || "0";

        }

    }

    document
        .querySelectorAll(".calc-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const value =
                        button.dataset.value;

                    if (value === "C") {

                        calculatorValue = "";

                        updateCalculator();

                        return;
                    }

                    if (value === "=") {

                        if (!calculatorValue) {
                            return;
                        }

                        try {

                            if (
                                !/^[0-9+\-*/().%\s]+$/
                                    .test(
                                        calculatorValue
                                    )
                            ) {
                                throw new Error();
                            }

                            const result =
                                Function(
                                    "return (" +
                                    calculatorValue +
                                    ")"
                                )();

                            if (
                                !Number.isFinite(
                                    result
                                )
                            ) {
                                throw new Error();
                            }

                            calculatorValue =
                                String(result);

                        } catch {

                            calculatorValue =
                                "Error";

                            setTimeout(
                                () => {

                                    calculatorValue =
                                        "";

                                    updateCalculator();

                                },
                                1000
                            );

                        }

                        updateCalculator();

                        return;
                    }

                    if (
                        calculatorValue ===
                        "Error"
                    ) {
                        calculatorValue = "";
                    }

                    calculatorValue += value;

                    updateCalculator();

                }
            );

        });

    // ============================================================
    // NOTES SYSTEM
    // ============================================================

    const noteTitle =
        $("noteTitle");

    const noteContent =
        $("noteContent");

    const notesStatus =
        $("notesStatus");

    const newNoteBtn =
        $("newNoteBtn");

    const saveNoteBtn =
        $("saveNoteBtn");

    const deleteNoteBtn =
        $("deleteNoteBtn");

    let notes =
        JSON.parse(
            localStorage.getItem(
                "nexaNotes"
            ) || "[]"
        );

    let selectedNoteId = null;

    function saveNotesData() {

        localStorage.setItem(
            "nexaNotes",
            JSON.stringify(notes)
        );

    }

    function renderNotesList() {

        const list =
            $("notesList");

        if (!list) return;

        list.innerHTML = "";

        notes.forEach(note => {

            const item =
                document.createElement(
                    "button"
                );

            item.className =
                "note-list-item";

            item.textContent =
                note.title ||
                "Untitled Note";

            if (
                note.id ===
                selectedNoteId
            ) {
                item.classList.add(
                    "active"
                );
            }

            item.addEventListener(
                "click",
                () => {

                    selectedNoteId =
                        note.id;

                    if (noteTitle) {
                        noteTitle.value =
                            note.title;
                    }

                    if (noteContent) {
                        noteContent.value =
                            note.content;
                    }

                    renderNotesList();

                }
            );

            list.appendChild(item);

        });

    }

    function clearNoteEditor() {

        selectedNoteId = null;

        if (noteTitle) {
            noteTitle.value = "";
        }

        if (noteContent) {
            noteContent.value = "";
        }

        if (notesStatus) {
            notesStatus.textContent =
                "New note";
        }

        renderNotesList();
    }

    if (newNoteBtn) {

        newNoteBtn.addEventListener(
            "click",
            clearNoteEditor
        );

    }

    if (saveNoteBtn) {

        saveNoteBtn.addEventListener(
            "click",
            () => {

                const title =
                    noteTitle
                        ? noteTitle.value.trim()
                        : "";

                const content =
                    noteContent
                        ? noteContent.value
                        : "";

                if (!title && !content) {
                    return;
                }

                if (selectedNoteId) {

                    const note =
                        notes.find(
                            item =>
                                item.id ===
                                selectedNoteId
                        );

                    if (note) {

                        note.title =
                            title ||
                            "Untitled Note";

                        note.content =
                            content;

                    }

                } else {

                    const newNote = {

                        id:
                            Date.now(),

                        title:
                            title ||
                            "Untitled Note",

                        content:
                            content

                    };

                    notes.push(
                        newNote
                    );

                    selectedNoteId =
                        newNote.id;

                }

                saveNotesData();

                renderNotesList();

                if (notesStatus) {
                    notesStatus.textContent =
                        "Saved successfully";
                }

                showNotification(
                    "Notes",
                    "Note saved successfully."
                );

            }
        );

    }

    if (deleteNoteBtn) {

        deleteNoteBtn.addEventListener(
            "click",
            () => {

                if (!selectedNoteId) {

                    clearNoteEditor();

                    return;

                }

                const note =
                    notes.find(
                        item =>
                            item.id ===
                            selectedNoteId
                    );

                if (note) {

                    moveToTrash(
                        "note",
                        note.title ||
                        "Untitled Note",
                        note
                    );

                }

                notes =
                    notes.filter(
                        item =>
                            item.id !==
                            selectedNoteId
                    );

                saveNotesData();

                clearNoteEditor();

                showNotification(
                    "Notes",
                    "Note moved to Trash."
                );

            }
        );

    }

    renderNotesList();

    // ============================================================
    // BROWSER
    // ============================================================

    const browserAddress =
        $("browserAddress");

    const browserGo =
        $("browserGo");

    const browserSearchInput =
        $("browserSearchInput");

    const browserSearchBtn =
        $("browserSearchBtn");

    const browserPage =
        $("browserPage");

    const browserBack =
        $("browserBack");

    const browserForward =
        $("browserForward");

    const browserReload =
        $("browserReload");

    let browserHistory = [];

    let browserHistoryIndex = -1;

    function isWebsite(value) {

        return (
            /^https?:\/\//i.test(value) ||
            (
                value.includes(".") &&
                !value.includes(" ")
            )
        );

    }

    function getBrowserURL(value) {

        if (
            /^https?:\/\//i.test(value)
        ) {
            return value;
        }

        if (
            value.includes(".") &&
            !value.includes(" ")
        ) {
            return "https://" + value;
        }

        return (
            "https://www.google.com/search?q=" +
            encodeURIComponent(value)
        );

    }

    function showBrowserHome() {

        if (!browserPage) return;

        browserPage.innerHTML = `

            <div class="browser-home">

                <div class="browser-logo">
                    <i class="fa-solid fa-globe"></i>
                </div>

                <h2>Nexa Browser</h2>

                <p>
                    Search Google or enter a website.
                </p>

                <div class="browser-search">

                    <i class="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        id="browserSearchInput"
                        placeholder="Search the web..."
                    >

                    <button id="browserSearchBtn">
                        Search
                    </button>

                </div>

            </div>

        `;

        connectBrowserHomeSearch();

    }

    function openBrowserURL(
        url,
        addHistory = true
    ) {

        if (!browserPage) return;

        if (browserAddress) {
            browserAddress.value =
                url;
        }

        if (addHistory) {

            browserHistory =
                browserHistory.slice(
                    0,
                    browserHistoryIndex + 1
                );

            browserHistory.push(url);

            browserHistoryIndex =
                browserHistory.length - 1;

        }

        if (
            !isWebsite(url)
        ) {

            browserPage.innerHTML = `
                <div class="browser-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <h2>Unable to open page</h2>
                    <p>Invalid website address.</p>
                </div>
            `;

            return;
        }

        browserPage.innerHTML = `

            <div class="browser-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <p>Loading page...</p>

            </div>

        `;

        const iframe =
            document.createElement(
                "iframe"
            );

        iframe.src =
            url;

        iframe.style.width =
            "100%";

        iframe.style.height =
            "100%";

        iframe.style.border =
            "none";

        iframe.setAttribute(
            "allow",
            "fullscreen"
        );

        iframe.addEventListener(
            "load",
            () => {

                browserPage.innerHTML = "";

                browserPage.appendChild(
                    iframe
                );

            }
        );

        iframe.addEventListener(
            "error",
            () => {

                showBrowserBlockedPage(
                    url
                );

            }
        );

        setTimeout(
            () => {

                if (
                    browserPage.contains(
                        iframe
                    )
                ) {

                    return;

                }

                browserPage.innerHTML = "";

                browserPage.appendChild(
                    iframe
                );

            },
            1500
        );

    }

    function showBrowserBlockedPage(url) {

        if (!browserPage) return;

        browserPage.innerHTML = `

            <div class="browser-error">

                <i class="fa-solid fa-shield-halved"></i>

                <h2>This website cannot be displayed here</h2>

                <p>
                    The website may block embedded browsers.
                </p>

                <button id="openExternalBrowser">
                    Open in New Tab
                </button>

            </div>

        `;

        const externalBtn =
            $("openExternalBrowser");

        if (externalBtn) {

            externalBtn.addEventListener(
                "click",
                () => {

                    window.open(
                        url,
                        "_blank"
                    );

                }
            );

        }

    }

    function browserNavigate(value) {

        value =
            String(value || "")
                .trim();

        if (!value) return;

        const url =
            getBrowserURL(value);

        openBrowserURL(
            url,
            true
        );

    }

    function connectBrowserHomeSearch() {

        const input =
            $("browserSearchInput");

        const button =
            $("browserSearchBtn");

        if (button) {

            button.addEventListener(
                "click",
                () => {

                    browserNavigate(
                        input.value
                    );

                }
            );

        }

        if (input) {

            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        browserNavigate(
                            input.value
                        );

                    }

                }
            );

        }

    }

    if (browserGo) {

        browserGo.addEventListener(
            "click",
            () => {

                browserNavigate(
                    browserAddress.value
                );

            }
        );

    }

    if (browserAddress) {

        browserAddress.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    browserNavigate(
                        browserAddress.value
                    );

                }

            }
        );

    }

    if (browserSearchBtn) {

        browserSearchBtn.addEventListener(
            "click",
            () => {

                browserNavigate(
                    browserSearchInput.value
                );

            }
        );

    }

    if (browserSearchInput) {

        browserSearchInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    browserNavigate(
                        browserSearchInput.value
                    );

                }

            }
        );

    }

    if (browserBack) {

        browserBack.addEventListener(
            "click",
            () => {

                if (
                    browserHistoryIndex >
                    0
                ) {

                    browserHistoryIndex--;

                    openBrowserURL(
                        browserHistory[
                            browserHistoryIndex
                        ],
                        false
                    );

                }

            }
        );

    }

    if (browserForward) {

        browserForward.addEventListener(
            "click",
            () => {

                if (
                    browserHistoryIndex <
                    browserHistory.length - 1
                ) {

                    browserHistoryIndex++;

                    openBrowserURL(
                        browserHistory[
                            browserHistoryIndex
                        ],
                        false
                    );

                }

            }
        );

    }

    if (browserReload) {

        browserReload.addEventListener(
            "click",
            () => {

                if (
                    browserHistoryIndex >=
                    0
                ) {

                    openBrowserURL(
                        browserHistory[
                            browserHistoryIndex
                        ],
                        false
                    );

                } else {

                    showBrowserHome();

                }

            }
        );

    }

    connectBrowserHomeSearch();

    // ============================================================
    // FILE SYSTEM
    // ============================================================

    let fileSystem =
        JSON.parse(
            localStorage.getItem(
                "nexaFileSystem"
            ) || "null"
        );

    if (!fileSystem) {

        fileSystem = {

            Home: [
                {
                    id: 1,
                    type: "folder",
                    name: "Documents"
                },
                {
                    id: 2,
                    type: "folder",
                    name: "Downloads"
                },
                {
                    id: 3,
                    type: "folder",
                    name: "Pictures"
                },
                {
                    id: 4,
                    type: "file",
                    name: "index.html"
                }
            ],

            Desktop: [],

            Documents: [],

            Downloads: [],

            Pictures: []

        };

        saveFileSystem();

    }

    let currentFolder =
        "Home";

    function saveFileSystem() {

        localStorage.setItem(
            "nexaFileSystem",
            JSON.stringify(
                fileSystem
            )
        );

    }

    function getCurrentFiles() {

        if (
            !fileSystem[
                currentFolder
            ]
        ) {

            fileSystem[
                currentFolder
            ] = [];

        }

        return fileSystem[
            currentFolder
        ];

    }

    function renderFileExplorer() {

        const grid =
            $("fileGrid");

        const title =
            document.querySelector(
                ".file-toolbar span"
            );

        if (!grid) return;

        grid.innerHTML = "";

        if (title) {
            title.textContent =
                currentFolder;
        }

        const files =
            getCurrentFiles();

        if (files.length === 0) {

            const empty =
                document.createElement(
                    "div"
                );

            empty.className =
                "empty-folder";

            empty.innerHTML = `

                <i class="fa-solid fa-folder-open"></i>

                <p>This folder is empty</p>

            `;

            grid.appendChild(
                empty
            );

            return;

        }

        files.forEach(item => {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "file-item";

            element.dataset.id =
                item.id;

            const icon =
                document.createElement(
                    "i"
                );

            icon.className =
                item.type === "folder"
                    ? "fa-solid fa-folder"
                    : "fa-solid fa-file";

            const name =
                document.createElement(
                    "span"
                );

            name.textContent =
                item.name;

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.className =
                "file-delete-btn";

            deleteButton.title =
                "Move to Trash";

            deleteButton.innerHTML =
                '<i class="fa-solid fa-trash"></i>';

            deleteButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    deleteFileItem(
                        item
                    );

                }
            );

            element.appendChild(
                icon
            );

            element.appendChild(
                name
            );

            element.appendChild(
                deleteButton
            );

            if (
                item.type ===
                "folder"
            ) {

                element.addEventListener(
                    "dblclick",
                    () => {

                        openFolder(
                            item
                        );

                    }
                );

            }

            grid.appendChild(
                element
            );

        });

    }

    function openFolder(folder) {

        if (
            !fileSystem[
                folder.name
            ]
        ) {

            fileSystem[
                folder.name
            ] = [];

            saveFileSystem();

        }

        currentFolder =
            folder.name;

        renderFileExplorer();

    }

    function deleteFileItem(item) {

        const files =
            getCurrentFiles();

        const index =
            files.findIndex(
                file =>
                    file.id ===
                    item.id
            );

        if (index === -1) return;

        const deleted =
            files.splice(
                index,
                1
            )[0];

        moveToTrash(
            deleted.type,
            deleted.name,
            {
                item: deleted,
                location:
                    currentFolder
            }
        );

        saveFileSystem();

        renderFileExplorer();

        showNotification(
            "File Explorer",
            deleted.name +
            " moved to Trash."
        );

    }

    const fileLocations =
        document.querySelectorAll(
            ".file-location"
        );

    fileLocations.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    fileLocations.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );

                    button.classList.add(
                        "active"
                    );

                    const text =
                        button.textContent
                            .trim();

                    if (
                        fileSystem[
                            text
                        ]
                    ) {

                        currentFolder =
                            text;

                    } else {

                        currentFolder =
                            "Home";

                    }

                    renderFileExplorer();

                }
            );

        }
    );

    // ============================================================
    // CREATE FOLDER
    // ============================================================

    const createFolderBtn =
        $("createFolderBtn");

    if (createFolderBtn) {

        createFolderBtn.addEventListener(
            "click",
            () => {

                const name =
                    prompt(
                        "Enter folder name:"
                    );

                if (
                    !name ||
                    !name.trim()
                ) {
                    return;
                }

                const cleanName =
                    name.trim();

                const files =
                    getCurrentFiles();

                const exists =
                    files.some(
                        item =>
                            item.name
                                .toLowerCase() ===
                            cleanName
                                .toLowerCase()
                    );

                if (exists) {

                    alert(
                        "A file or folder with this name already exists."
                    );

                    return;

                }

                const folder = {

                    id:
                        Date.now(),

                    type:
                        "folder",

                    name:
                        cleanName

                };

                files.push(
                    folder
                );

                if (
                    !fileSystem[
                        cleanName
                    ]
                ) {

                    fileSystem[
                        cleanName
                    ] = [];

                }

                saveFileSystem();

                renderFileExplorer();

                showNotification(
                    "File Explorer",
                    "Folder created."
                );

            }
        );

    }

    // ============================================================
    // TRASH SYSTEM
    // ============================================================

    let trash =
        JSON.parse(
            localStorage.getItem(
                "nexaTrash"
            ) || "[]"
        );

    function saveTrash() {

        localStorage.setItem(
            "nexaTrash",
            JSON.stringify(
                trash
            )
        );

    }

    function moveToTrash(
        type,
        name,
        data
    ) {

        trash.push({

            id:
                Date.now() +
                Math.random(),

            type:
                type,

            name:
                name,

            data:
                data,

            deletedAt:
                new Date()
                    .toISOString()

        });

        saveTrash();

    }

    function renderTrash() {

        const trashContent =
            document.querySelector(
                ".trash-app"
            );

        if (!trashContent) return;

        let existing =
            trashContent.querySelector(
                ".trash-items"
            );

        if (existing) {
            existing.remove();
        }

        if (
            trash.length ===
            0
        ) {
            return;
        }

        const list =
            document.createElement(
                "div"
            );

        list.className =
            "trash-items";

        trash.forEach(item => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "trash-item";

            const name =
                document.createElement(
                    "span"
                );

            name.textContent =
                item.name;

            const restore =
                document.createElement(
                    "button"
                );

            restore.textContent =
                "Restore";

            restore.addEventListener(
                "click",
                () => {

                    restoreTrashItem(
                        item
                    );

                }
            );

            const permanent =
                document.createElement(
                    "button"
                );

            permanent.textContent =
                "Delete Forever";

            permanent.addEventListener(
                "click",
                () => {

                    trash =
                        trash.filter(
                            trashItem =>
                                trashItem.id !==
                                item.id
                        );

                    saveTrash();

                    renderTrash();

                }
            );

            row.appendChild(
                name
            );

            row.appendChild(
                restore
            );

            row.appendChild(
                permanent
            );

            list.appendChild(
                row
            );

        });

        trashContent.appendChild(
            list
        );

    }

    function restoreTrashItem(item) {

        if (
            item.type ===
            "note"
        ) {

            notes.push(
                item.data
            );

            saveNotesData();

        } else {

            const originalLocation =
                item.data.location ||
                "Home";

            if (
                !fileSystem[
                    originalLocation
                ]
            ) {

                fileSystem[
                    originalLocation
                ] = [];

            }

            fileSystem[
                originalLocation
            ].push(
                item.data.item
            );

            saveFileSystem();

        }

        trash =
            trash.filter(
                trashItem =>
                    trashItem.id !==
                    item.id
            );

        saveTrash();

        renderTrash();

        renderFileExplorer();

        renderNotesList();

        showNotification(
            "Trash",
            item.name +
            " restored."
        );

    }

    const emptyTrashBtn =
        $("emptyTrashBtn");

    if (emptyTrashBtn) {

        emptyTrashBtn.addEventListener(
            "click",
            () => {

                if (
                    trash.length ===
                    0
                ) {

                    showNotification(
                        "Trash",
                        "Trash is already empty."
                    );

                    return;

                }

                if (
                    confirm(
                        "Permanently delete all items in Trash?"
                    )
                ) {

                    trash = [];

                    saveTrash();

                    renderTrash();

                    showNotification(
                        "Trash",
                        "Trash emptied."
                    );

                }

            }
        );

    }

    renderFileExplorer();

    renderTrash();

    // ============================================================
    // SETTINGS / THEME
    // ============================================================

    const themeToggle =
        $("themeToggle");

    const savedTheme =
        localStorage.getItem(
            "nexaTheme"
        ) || "dark";

    function applyTheme(theme) {

        if (theme === "light") {

            document.body.classList.add(
                "light-mode"
            );

            if (themeToggle) {
                themeToggle.checked =
                    false;
            }

        } else {

            document.body.classList.remove(
                "light-mode"
            );

            if (themeToggle) {
                themeToggle.checked =
                    true;
            }

        }

        localStorage.setItem(
            "nexaTheme",
            theme
        );

    }

    applyTheme(
        savedTheme
    );

    if (themeToggle) {

        themeToggle.addEventListener(
            "change",
            () => {

                applyTheme(
                    themeToggle.checked
                        ? "dark"
                        : "light"
                );

            }
        );

    }

    // ============================================================
    // LOCK BUTTONS
    // ============================================================

    const lockBtn =
        $("lockBtn");

    if (lockBtn) {
        lockBtn.addEventListener(
            "click",
            lockNexaOS
        );
    }

    if (powerLock) {

        powerLock.addEventListener(
            "click",
            () => {

                lockNexaOS();

            }
        );

    }

    if (startLockBtn) {

        startLockBtn.addEventListener(
            "click",
            () => {

                lockNexaOS();

            }
        );

    }

    // ============================================================
    // POWER MENU
    // ============================================================

    if (startPowerBtn) {

        startPowerBtn.addEventListener(
            "click",
            () => {

                closeAllMenus();

                if (powerMenu) {
                    powerMenu.style.display =
                        "flex";
                }

            }
        );

    }

    if (powerRestart) {

        powerRestart.addEventListener(
            "click",
            () => {

                showNotification(
                    "Nexa OS",
                    "Restarting..."
                );

                setTimeout(
                    () => {

                        location.reload();

                    },
                    800
                );

            }
        );

    }

    if (powerShutdown) {

        powerShutdown.addEventListener(
            "click",
            () => {

                if (!desktop) return;

                closeAllMenus();

                desktop.classList.add(
                    "nexa-shutdown"
                );

                setTimeout(
                    () => {

                        if (desktop) {

                            desktop.classList.remove(
                                "nexa-shutdown"
                            );

                        }

                        lockNexaOS();

                        showNotification(
                            "Nexa OS",
                            "Nexa OS is back online."
                        );

                    },
                    2500
                );

            }
        );

    }

    // ============================================================
    // NOTIFICATIONS
    // ============================================================

    let notifications =
        JSON.parse(
            localStorage.getItem(
                "nexaNotifications"
            ) || "[]"
        );

    function saveNotifications() {

        localStorage.setItem(
            "nexaNotifications",
            JSON.stringify(
                notifications
            )
        );

    }

    function renderNotifications() {

        if (!notificationList) return;

        notificationList.innerHTML =
            "";

        if (
            notifications.length ===
            0
        ) {

            notificationList.innerHTML = `

                <div class="notification-empty">
                    <i class="fa-solid fa-bell-slash"></i>
                    <p>No notifications</p>
                </div>

            `;

            return;

        }

        notifications.forEach(
            notification => {

                const element =
                    document.createElement(
                        "div"
                    );

                element.className =
                    "notification";

                const icon =
                    document.createElement(
                        "i"
                    );

                icon.className =
                    "fa-solid fa-bell";

                const content =
                    document.createElement(
                        "div"
                    );

                const title =
                    document.createElement(
                        "strong"
                    );

                title.textContent =
                    notification.title;

                const message =
                    document.createElement(
                        "p"
                    );

                message.textContent =
                    notification.message;

                content.appendChild(
                    title
                );

                content.appendChild(
                    message
                );

                element.appendChild(
                    icon
                );

                element.appendChild(
                    content
                );

                notificationList.appendChild(
                    element
                );

            }
        );

    }

    function showNotification(
        title,
        message
    ) {

        notifications.unshift({

            id:
                Date.now(),

            title:
                title,

            message:
                message

        });

        notifications =
            notifications.slice(
                0,
                30
            );

        saveNotifications();

        renderNotifications();

    }

    if (clearNotifications) {

        clearNotifications.addEventListener(
            "click",
            () => {

                notifications = [];

                saveNotifications();

                renderNotifications();

            }
        );

    }

    renderNotifications();

    // ============================================================
    // APP SEARCH
    // ============================================================

    const appSearch =
        $("appSearch");

    if (appSearch) {

        appSearch.addEventListener(
            "input",
            () => {

                const query =
                    appSearch.value
                        .toLowerCase()
                        .trim();

                document
                    .querySelectorAll(
                        ".start-apps [data-app]"
                    )
                    .forEach(
                        button => {

                            const text =
                                button.textContent
                                    .toLowerCase();

                            button.style.display =
                                text.includes(
                                    query
                                )
                                    ? "flex"
                                    : "none";

                        }
                    );

            }
        );

    }

    // ============================================================
    // DRAGGABLE WINDOWS
    // ============================================================

    document
        .querySelectorAll(
            ".app-window"
        )
        .forEach(
            windowElement => {

                const header =
                    windowElement.querySelector(
                        ".window-header"
                    );

                if (!header) return;

                let dragging = false;

                let offsetX = 0;
                let offsetY = 0;

                header.addEventListener(
                    "mousedown",
                    event => {

                        if (
                            event.target.closest(
                                "button"
                            )
                        ) {
                            return;
                        }

                        dragging = true;

                        bringToFront(
                            windowElement
                        );

                        const rect =
                            windowElement.getBoundingClientRect();

                        offsetX =
                            event.clientX -
                            rect.left;

                        offsetY =
                            event.clientY -
                            rect.top;

                        event.preventDefault();

                    }
                );

                document.addEventListener(
                    "mousemove",
                    event => {

                        if (!dragging) {
                            return;
                        }

                        const width =
                            windowElement.offsetWidth;

                        const height =
                            windowElement.offsetHeight;

                        const maxX =
                            window.innerWidth -
                            width;

                        const maxY =
                            window.innerHeight -
                            height -
                            55;

                        let x =
                            event.clientX -
                            offsetX;

                        let y =
                            event.clientY -
                            offsetY;

                        x =
                            Math.max(
                                0,
                                Math.min(
                                    x,
                                    maxX
                                )
                            );

                        y =
                            Math.max(
                                0,
                                Math.min(
                                    y,
                                    Math.max(
                                        0,
                                        maxY
                                    )
                                )
                            );

                        windowElement.style.left =
                            x + "px";

                        windowElement.style.top =
                            y + "px";

                        windowElement.style.transform =
                            "none";

                    }
                );

                document.addEventListener(
                    "mouseup",
                    () => {

                        dragging = false;

                    }
                );

            }
        );

    // ============================================================
    // KEYBOARD SHORTCUTS
    // ============================================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeAllMenus();

            }

            // Only allow Enter to unlock
            // when the lock screen itself is focused.
            // This prevents accidental unlocking
            // while typing elsewhere.

        }
    );

    // ============================================================
    // INITIAL UI STATE
    // ============================================================

    if (startMenu) {
        startMenu.style.display =
            "none";
    }

    if (powerMenu) {
        powerMenu.style.display =
            "none";
    }

    if (notificationCenter) {
        notificationCenter.style.display =
            "none";
    }

    // ============================================================
    // RESTORE LOCK STATE
    // ============================================================

    if (isLocked) {

        if (lockScreen) {
            lockScreen.style.display =
                "flex";
        }

        document.body.classList.add(
            "is-locked"
        );

    } else {

        if (lockScreen) {
            lockScreen.style.display =
                "none";
        }

        document.body.classList.remove(
            "is-locked"
        );

    }

    // ============================================================
    // STARTUP
    // ============================================================

    updateDateTime();

    console.log(
        "Nexa OS loaded successfully."
    );

});