function logButtonCheck() {
    let userID = sessionStorage.getItem("userID")
    if (userID) {
        document.getElementById("log-button").innerHTML = "Logout"
    } else {
        document.getElementById("log-button").innerHTML = "Login"
    }
}
logButtonCheck()

function sanitizeClassName(className) {
    return className.toLowerCase().replace(/[\s()]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
}

const mediaTypeToPlural = {
    movie: "movies",
    show: "shows",
    music: "music",
    book: "books",
    audiobook: "audiobooks",
}
function getMedia(mediaType, sortBy = "title", sortOrder = "asc") {
    const mediaTypePlural = mediaTypeToPlural[mediaType] || `${mediaType}`
    const mediaList = document.querySelector(`#${mediaTypePlural}-list`)
    if (!mediaList) {
        console.error(`Element with ID ${mediaTypePlural}-list not found`)
        return
    }
    mediaList.innerHTML = ""
    axios
        .get(`/api/media/${mediaType}?sortBy=${sortBy}&sortOrder=${sortOrder}`)
        .then(response => {
            if (response.data.length === 0) {
                mediaList.innerHTML = `<p>No ${mediaTypePlural} found.</p>`
            } else {
            response.data.forEach(item => {
                let mediaCard = `
                    <div class="${mediaType}-card" ${item.checkStatus ? "checked-media-card" : ""} id="${item[`${mediaType}ID`]}">
                        <div class="status-circle status-${sanitizeClassName(item.status)}" title="${item.status}"></div>
                        <h2>${item.title}</h2>
                        <img src="${item[`${mediaType}Img`]}" alt="${item.title}">
                        <p><b>Status: </b>${item.status}</p>
                        <p><b>Added: </b>${new Date(item.createdAt).toLocaleDateString()}</p>
                        <p><b>Updated: </b>${new Date(item.updatedAt).toLocaleDateString()}</p>
                        <div class="media-edit-form" id="edit-${mediaType}-form-${item[`${mediaType}ID`]}" style="display: none;">
                            <input type="text" id="edit-title-${item[`${mediaType}ID`]}" value="${item.title}">
                            <input type="text" id="edit-image-${item[`${mediaType}ID`]}" value="${item[`${mediaType}Img`]}">
                            <select id="edit-status-${item[`${mediaType}ID`]}">
                                <option value="Untouched">Untouched</option>
                                <option value="Complete">Complete</option>
                                <option value="Complete (Low Quality)">Complete (Low Quality)</option>
                                <option value="Unfinished (Still Airing)">Unfinished (Still Airing)</option>
                                <option value ="Unfinished (Incomplete)">Unfinished (Incomplete)</option>
                                <option value="Unreleased">Unreleased</option>
                                <option value="White Whale">White Whale</option>
                            </select>
                            <input type="checkbox" id="edit-check-status-${item[`${mediaType}ID`]}" name="edit-check-status-${item[`${mediaType}ID`]}" value="${item.checkStatus}">
                            <button id="update-${mediaType}-${item[`${mediaType}ID`]}" type="button" onclick="updateMediaItem('${mediaType}', ${item[`${mediaType}ID`]})">Update</button>
                            <button id="cancel-${mediaType}-${item[`${mediaType}ID`]}" type="button" onclick="cancelEditMediaItem('${mediaType}', ${item[`${mediaType}ID`]})">Cancel</button>
                        </div>
                        <button id="delete-${mediaType}-button-${item[`${mediaType}ID`]}" onclick="deleteMediaItem('${mediaType}', ${item[`${mediaType}ID`]})">Delete</button>
                        <button id="edit-${mediaType}-button-${item[`${mediaType}ID`]}" onclick="editMediaItem('${mediaType}', ${item[`${mediaType}ID`]})">Edit</button>
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
}

function updateMediaItem(mediaType, id) {
    const mediaTypePlural = mediaTypeToPlural[mediaType] || `${mediaType}`
    const title = document.getElementById(`edit-title-${id}`).value
    const imageUrl = document.getElementById(`edit-image-${id}`).value
    const status = document.getElementById(`edit-status-${id}`).value
    const checkStatus = document.getElementById(`edit-check-status-${id}`).checked


    const updatedMediaItem = {
        title,
        [`${mediaType}Img`]: imageUrl,
        checkStatus,
        status
    }

    axios
        .put(`/api/media/${mediaType}/${id}`, updatedMediaItem)
        .then(response => {
            getMedia(mediaTypePlural[mediaType] || mediaType)
            const editForm = document.getElementById(`edit-${mediaType}-form-${id}`)
            editForm.style.display = "none"
            const editButton = document.getElementById(`edit-${mediaType}-button-${id}`)
            editButton.style.display = "block"
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
}

function addMediaItem(event) {
    event.preventDefault()
    const title = document.getElementById("media-title").value
    const imageUrl = document.getElementById("media-image").value
    let mediaType = document.getElementById("media-type").value
    mediaType = mediaType.endsWith("s") ? mediaType.slice(0, -1) : mediaType
    const checkStatus = document.getElementById("media-check-status").checked
    const status = document.getElementById("media-status").value
    console.log("submitting media type:", mediaType)

    const body = {
        title: title,
        image: imageUrl,
        checkStatus: checkStatus,
        status: status
    }
    console.log(body)
    console.log("submitted media type:", mediaType)

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

/*document.addEventListener("DOMContentLoaded", () => {
    let collapse = document.getElementsByClassName("collapsible")
    for (let i = 0; i < collapse.length; i++) {
        collapse[i].addEventListener("click", function () {
            this.classList.toggle("active")
            let content = this.nextElementSibling
            if (content.style.display === "block") {
                content.style.display = "none"
            } else {
                content.style.display = "block"
            }
        })
    }

document.getElementById("media-form").addEventListener("submit", addMediaItem)
getMedia("movie")
getMedia("show")
getMedia("music")
getMedia("book")
getMedia("audiobook")
})*/

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
/*
document.getElementById("other-sort-form").addEventListener("submit", (event) => {
    event.preventDefault()
    const sortBy = document.getElementById("other-sort-by").value
    const sortOrder = document.getElementById("other-sort-order").value
    getMedia("other", sortBy, sortOrder)
})*/
