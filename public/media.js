function showToast(message) {
    const toast = document.createElement("div")
    toast.textContent = message
    toast.className = "toast-message"
    document.body.appendChild(toast)
    setTimeout(() => {
        toast.classList.add("show")
    }, 100)
    setTimeout(() => {
        toast.classList.remove("show")
        setTimeout(() => {
            document.body.removeChild(toast)
        }, 500)
    }, 5000)
}

function checkLoginStatus() {
    axios
        .get("/api/check-login")
        .then(response => {
            if (response.data.loggedIn) {
                sessionStorage.setItem("userID", response.data.userID)
                sessionStorage.setItem("username", response.data.username)
                displayUsername()
            } else {
                showToast("You must be logged in to view this page")
                setTimeout(() => {
                    window.location.href = "/login"
                }, 5000)
            }
        })
        .catch(error => {
            console.log("Error checking login status:", error)
        })
}
checkLoginStatus()

function displayUsername() {
    const username = sessionStorage.getItem("username")
    if (username) {
        const welcomeMessage = document.getElementById("header-welcome-message")
        welcomeMessage.textContent = `Welcome, ${username}`
    }
}

function logout() {
    axios
        .get("/logout")
        .then(() => {
            sessionStorage.clear()
            window.location.href = "/index.html/?logoutSuccess=1"
        })
        .catch(error => {
            console.log("Error logging out:", error)
        })
}

function sanitizeClassName(className) {
    return className.toLowerCase().replace(/[\s()]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
}

const mediaTypeToPlural = {
    movie: "movies",
    show: "shows",
    music: "music",
    book: "books",
    audiobook: "audiobooks",
    other: "other",
}
function getMedia(mediaType, sortBy = "title", sortOrder = "asc") {
    const mediaTypePlural = mediaTypeToPlural[mediaType] || `${mediaType}`
    const mediaList = document.querySelector(`#${mediaTypePlural}-list`)
    if (!mediaList) {
        console.error(`Element with ID ${mediaTypePlural}-list not found`)
        return
    }
    mediaList.innerHTML = ""
    return axios
        .get(`/api/media/${mediaType}?sortBy=${sortBy}&sortOrder=${sortOrder}`)
        .then(response => {
            if (response.data.length === 0) {
                mediaList.innerHTML = `<p>No ${mediaTypePlural} found.</p>`
            } else {
            response.data.forEach(item => {
                let mediaCard = `
                    <div class="${mediaType}-card ${item.checkStatus ? 'checked-media-card' : ''}" id="${mediaType}-${item[`${mediaType}ID`]}">
                        <div class="status-circle status-${sanitizeClassName(item.status)}" title="${item.status}"></div>
                        <h2>${item.title}</h2>
                        <img src="${item[`${mediaType}Img`]}" alt="${item.title}">
                        <p><b>Status: </b>${item.status}</p>
                        <p><b>Added: </b>${new Date(item.createdAt).toLocaleDateString()}</p>
                        <p><b>Updated: </b>${new Date(item.updatedAt).toLocaleDateString()}</p>
                        <div class="media-edit-form" id="edit-${mediaType}-form-${item[`${mediaType}ID`]}" style="display: none;">
                            <input type="text" id="edit-${mediaType}-title-${item[`${mediaType}ID`]}" value="${item.title}">
                            <input type="text" id="edit-${mediaType}-image-${item[`${mediaType}ID`]}" value="${item[`${mediaType}Img`]}">
                            <select id="edit-${mediaType}-status-${item[`${mediaType}ID`]}">
                                <option value="Untouched">Untouched</option>
                                <option value="Complete">Complete</option>
                                <option value="Complete (Low Quality)">Complete (Low Quality)</option>
                                <option value="Unfinished (Still Airing)">Unfinished (Still Airing)</option>
                                <option value ="Unfinished (Incomplete)">Unfinished (Incomplete)</option>
                                <option value="Unreleased">Unreleased</option>
                                <option value="White Whale">White Whale</option>
                            </select>
                            <input type="checkbox" id="edit-${mediaType}-check-status-${item[`${mediaType}ID`]}" name="edit-check-status-${item[`${mediaType}ID`]}" ${item.checkStatus ? 'checked' : ''}>
                            <button id="update-${mediaType}-${item[`${mediaType}ID`]}" type="button" onclick="updateMediaItem('${mediaType}', ${item[`${mediaType}ID`]})">Update</button>
                            <button id="cancel-${mediaType}-${item[`${mediaType}ID`]}" type="button" onclick="cancelEditMediaItem('${mediaType}', ${item[`${mediaType}ID`]})">Cancel</button>
                        </div>
                        <button id="edit-${mediaType}-button-${item[`${mediaType}ID`]}" class="edit-button" onclick="editMediaItem('${mediaType}', ${item[`${mediaType}ID`]})">Edit</button>
                        <button id="delete-${mediaType}-button-${item[`${mediaType}ID`]}" class="delete-button" onclick="deleteMediaItem('${mediaType}', ${item[`${mediaType}ID`]})">Delete</button>
                    </div>
                `

                mediaList.innerHTML += mediaCard
            })
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

function getAllMedia(sortBy = "title", sortOrder = "asc") {
    const serverSortBy = sortBy === "type" ? "title" : sortBy

    const mediaTypes = Object.keys(mediaTypeToPlural)
    const mediaPromises = mediaTypes.map(type => axios.get(`/api/media/${type}?sortBy=${serverSortBy}&sortOrder=${sortOrder}`))

    Promise.all(mediaPromises)
        .then(responses => {
            const allMediaList = document.querySelector("#all-media-list")
            allMediaList.innerHTML = ""
            let combinedMediaItems = []

            responses.forEach((response, index) => {
                const mediaType = mediaTypes[index]
                const typedMediaItems = response.data.map(item => ({ ...item, mediaType }))
                combinedMediaItems = combinedMediaItems.concat(typedMediaItems)
            })
            if (sortBy === "type") {
                combinedMediaItems.sort((a, b) => {
                    let aValue = a.mediaType.toLowerCase()
                    let bValue = b.mediaType.toLowerCase()
                    if (sortOrder === "asc") {
                        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
                    } else {
                        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
                    }
                })
            } else {
            combinedMediaItems.sort((a, b) => {
                let aValue = a[sortBy]
                let bValue = b[sortBy]
                if (typeof aValue === "string") {
                    aValue = aValue.toLowerCase()
                    bValue = bValue.toLowerCase()
                }
                if (sortOrder === "asc") {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
                } else {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
                }
            })
        }
                combinedMediaItems.forEach(item => {
                const mediaType = item.mediaType
                let mediaCard = `
                    <div class="${mediaType}-card ${item.checkStatus ? 'checked-media-card' : ''}" id="all-${mediaType}-${item[`${mediaType}ID`]}">
                        <div class="media-type-circle media-type-${mediaType}" title="${mediaType}"></div>
                        <div class="status-circle status-${sanitizeClassName(item.status)}" title="${item.status}"></div>
                        <h2>${item.title}</h2>
                        <img src="${item[`${mediaType}Img`]}" alt="${item.title}">
                        <p><b>Type: </b>${mediaType}</p>
                        <p><b>Status: </b>${item.status}</p>
                        <p><b>Added: </b>${new Date(item.createdAt).toLocaleDateString()}</p>
                        <p><b>Updated: </b>${new Date(item.updatedAt).toLocaleDateString()}</p>
                    </div>
                    `
                    allMediaList.innerHTML += mediaCard
                })
        })
        .catch((error) => {
            console.error("Error fetching all media:", error)
        })
}


function deleteMediaItem(mediaType, id) {
    const mediaTypePlural = mediaTypeToPlural[mediaType] || `${mediaType}`
    axios
        .delete(`/api/media/${mediaType}/${id}`)
        .then(() => {
            getMedia(mediaTypePlural[mediaType] || mediaType)
        })
        .catch((error) => {
            console.log(error)
        })
}

function editMediaItem(mediaType, id) {
    const editForm = document.getElementById(`edit-${mediaType}-form-${id}`)
    editForm.style.display = "block"
    const editButton = document.getElementById(`edit-${mediaType}-button-${id}`)
    if (editButton) {
    editButton.style.display = "none"
    }
    const deleteButton = document.getElementById(`delete-${mediaType}-button-${id}`)
    if (deleteButton) {
    deleteButton.style.display = "none"
    }
}

function updateMediaItem(mediaType, id) {
    const mediaTypePlural = mediaTypeToPlural[mediaType] || `${mediaType}`
    const title = document.getElementById(`edit-${mediaType}-title-${id}`).value
    const imageUrl = document.getElementById(`edit-${mediaType}-image-${id}`).value
    const status = document.getElementById(`edit-${mediaType}-status-${id}`).value
    const checkStatus = document.getElementById(`edit-${mediaType}-check-status-${id}`).checked


    const updatedMediaItem = {
        title,
        [`${mediaType}Img`]: imageUrl,
        checkStatus,
        status
    }

    axios.put(`/api/media/${mediaType}/${id}`, updatedMediaItem)
        .then(response => {
            return getMedia(mediaTypePlural[mediaType] || mediaType)
        })
        .then(() => {
            const editForm = document.getElementById(`edit-${mediaType}-form-${id}`)
            if (editForm) {
                editForm.style.display = "none"
            } else {
                console.error(`Failed to find edit form with ID: edit-${mediaType}-form-${id}`)
            }
            const editButton = document.getElementById(`edit-${mediaType}-button-${id}`)
            if (editButton) {
                editButton.style.display = "block"
            } else {
                console.error(`Failed to find edit button with ID: edit-${mediaType}-button-${id}`)
            }
        })
        .catch(error => {
            console.error("Error updating media item:", error)
        })
}

function cancelEditMediaItem(mediaType, id) {
    const editForm = document.getElementById(`edit-${mediaType}-form-${id}`)
    if (editForm) {
        editForm.style.display = "none"
    }
    const editButton = document.getElementById(`edit-${mediaType}-button-${id}`)
    if (editButton) {
        editButton.style.display = "block"
    }
    const deleteButton = document.getElementById(`delete-${mediaType}-button-${id}`)
    if (deleteButton) {
        deleteButton.style.display = "block"
    }
}

function toggleAddMediaForm() {
    const form = document.getElementById("media-form")
    form.style.display = form.style.display === "none" ? "flex" : "none"
}

function addMediaItem(event) {
    event.preventDefault()
    const title = document.getElementById("media-title").value
    const imageUrl = document.getElementById("media-image").value
    let mediaType = document.getElementById("media-type").value
    mediaType = mediaType.endsWith("s") ? mediaType.slice(0, -1) : mediaType
    const checkStatus = document.getElementById("media-check-status").checked
    const status = document.getElementById("media-status").value

    const body = {
        title: title,
        image: imageUrl,
        checkStatus: checkStatus,
        status: status
    }

    axios
        .post(`/api/media/${mediaType}`, body)
        .then(() => {
            document.getElementById("media-form").reset()
            const mediaTypePlural = mediaTypeToPlural[mediaType] || `${mediaType}`
            getMedia(mediaTypePlural[mediaType] || mediaType)
        })
        .catch((error) => {
            console.error("Error adding media item:", error)
            if (error.response) {
                console.error("Server responded with:", error.response.data)
            }
        })
}

document.addEventListener("DOMContentLoaded", () => {
    let collapsibles = document.getElementsByClassName("collapsible")
    for (let i = 0; i < collapsibles.length; i++) {
        collapsibles[i].addEventListener("click", function () {
            this.classList.toggle("active")
            let content = this.nextElementSibling
            if (content.style.display === "block") {
                content.style.display = "none"
                content.style.marginBottom = "0"
            } else {
                content.style.display = "block"
                content.style.marginBottom = "1em"
            }
        })
    }
    document.getElementById("media-form").addEventListener("submit", addMediaItem)
    getMedia("movie")
    getMedia("show")
    getMedia("music")
    getMedia("book")
    getMedia("audiobook")
    getMedia("other")
})

document.getElementById("movie-sort-form").addEventListener("submit", (event) => {
    event.preventDefault()
    const sortBy = document.getElementById("movie-sort-by").value
    const sortOrder = document.getElementById("movie-sort-order").value
    getMedia("movie", sortBy, sortOrder)
})
document.getElementById("show-sort-form").addEventListener("submit", (event) => {
    event.preventDefault()
    const sortBy = document.getElementById("show-sort-by").value
    const sortOrder = document.getElementById("show-sort-order").value
    getMedia("show", sortBy, sortOrder)
})
document.getElementById("music-sort-form").addEventListener("submit", (event) => {
    event.preventDefault()
    const sortBy = document.getElementById("music-sort-by").value
    const sortOrder = document.getElementById("music-sort-order").value
    getMedia("music", sortBy, sortOrder)
})
document.getElementById("audiobook-sort-form").addEventListener("submit", (event) => {
    event.preventDefault()
    const sortBy = document.getElementById("audiobook-sort-by").value
    const sortOrder = document.getElementById("audiobook-sort-order").value
    getMedia("audiobook", sortBy, sortOrder)
})
document.getElementById("book-sort-form").addEventListener("submit", (event) => {
    event.preventDefault()
    const sortBy = document.getElementById("book-sort-by").value
    const sortOrder = document.getElementById("book-sort-order").value
    getMedia("book", sortBy, sortOrder)
})
document.getElementById("other-sort-form").addEventListener("submit", (event) => {
    event.preventDefault()
    const sortBy = document.getElementById("other-sort-by").value
    const sortOrder = document.getElementById("other-sort-order").value
    getMedia("other", sortBy, sortOrder)
})

document.getElementById("all-media-sort-form").addEventListener("submit", (event) => {
    event.preventDefault()
    const sortBy = document.getElementById("all-media-sort-by").value === 'mediaType' ? 'type' : document.getElementById("all-media-sort-by").value
    const sortOrder = document.getElementById("all-media-sort-order").value
    getAllMedia(sortBy, sortOrder)
})

document.getElementById("logout-button").addEventListener("click", (event) => {
    event.preventDefault()
    logout()
})