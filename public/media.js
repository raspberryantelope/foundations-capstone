function logButtonCheck() {
    let userID = sessionStorage.getItem("userID")
    if (userID) {
        document.getElementById("log-button").innerHTML = "Logout"
    } else {
        document.getElementById("log-button").innerHTML = "Login"
    }
}
logButtonCheck()

function getMedia(mediaType) {
    const mediaList = document.querySelector(`#${mediaType}-list`)
    mediaList.innerHTML = ""
    axios
        .get(`/api/media/${mediaType}`)
        .then(response => {
            response.data.forEach(item => {
                let mediaCard = `
                    <div class="${mediaType}-card">
                        <h2>${item.title}</h2>
                        <p>${item.description}</p>
                        <img src="${item.image}" alt="${item.title}">
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

function submitHandler(event) {
    event.preventDefault()
    //form validation and body structure

    axios
        .post("/api/media", body)
        .then(() => {
            // Clear the form
            getMedia()
        })
        .catch((error) => {
            console.log(error)
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
    getMedia("movie")
    getMedia("shows")
    getMedia("music")
    getMedia("books")
    getMedia("audiobooks")
})