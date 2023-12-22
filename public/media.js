function logButtonCheck() {
    let userID = sessionStorage.getItem("userID")
    if (userID) {
        document.getElementById("log-button").innerHTML = "Logout"
    } else {
        document.getElementById("log-button").innerHTML = "Login"
    }
}
logButtonCheck()

const mediaTypeToPlural = {
    movie: "movies",
    show: "shows",
    music: "music",
    book: "books",
    audiobook: "audiobooks",
}
function getMedia(mediaType) {
    console.log(mediaType)
    const mediaTypePlural = mediaTypeToPlural[mediaType] || `${mediaType}`
    const mediaList = document.querySelector(`#${mediaTypePlural}-list`)
    if (!mediaList) {
        console.error(`Element with ID ${mediaType}s-list not found`)
        return
    }
    mediaList.innerHTML = ""
    axios
        .get(`/api/media/${mediaTypePlural}`)
        .then(response => {
            response.data.forEach(item => {
                let mediaCard = `
                    <div class="${mediaType}-card">
                        <h2>${item.title}</h2>
                        <img src="${item.image}" alt="${item.title}">
                        <p>${item.status}</p>
                        <button onclick="deleteMediaItem('${mediaType}', ${item.id})">Delete</button>
                    </div>
                `
                mediaList.innerHTML += mediaCard
            })
        })
        .catch((error) => {
            console.log(error)
        })
}

function deleteMediaItem(mediaType, id) {
    axios
        .delete(`/api/media/${mediaType}/${id}`)
        .then(() => {
            getMedia(mediaType)
        })
        .catch((error) => {
            console.log(error)
        })
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
            getMedia(mediaTypePlural)
        })
        .catch((error) => {
            console.error("Error adding media item:", error)
            if (error.response) {
                console.error("Server responded with:", error.response.data)
            }
        })
}

/*axios.get('/api/protected-route')
       .then(response => {
         // Handle successful response
       })
       .catch(error => {
         if (error.response && error.response.status === 401) {
           // Redirect to login page
           window.location.href = '/login.html'; // Make sure this path is correct
         } else {
           // Handle other errors
           console.error('An error occurred:', error);
         }
       });*/
document.addEventListener("DOMContentLoaded", () => {
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
getMedia("movies")
getMedia("shows")
getMedia("music")
getMedia("books")
getMedia("audiobooks")
})
