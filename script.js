import { Pelicula } from './Pelicula.js';

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-by-title-button");
    const resultsContainer = document.getElementById("search-results");
    const outputContainer1 = document.getElementById("response-output1");
    const outputContainer2 = document.getElementById("response-output2");
    const outputContainer3 = document.getElementById("response-output3");
    const movieImage = document.getElementById("movieImage");
    const movieText = document.getElementById("movieText");
    const label2 = document.getElementById("lbTitle2");
    const label3 = document.getElementById("lbTitle3");
    const title1 = document.getElementById("t1");
    const title2 = document.getElementById("t2");
    const title3 = document.getElementById("t3");

    let arrayPelicules = [];

    function updateVisibility() {
        if (title1.value.trim() === "") {
            title2.style.display = "none";
            label2.style.display = "none";
            title3.style.display = "none";
            label3.style.display = "none";
        } else {
            title2.style.display = "inline";
            label2.style.display = "inline";

            if (title2.value.trim() !== "") {
                title3.style.display = "inline";
                label3.style.display = "inline";
            } else {
                title3.style.display = "none";
                label3.style.display = "none";
            }
        }
    }

    title1.addEventListener("input", updateVisibility);
    title2.addEventListener("input", updateVisibility);

    searchButton.addEventListener("click", () => {
        const title1Value = title1.value.trim();
        const title2Value = title2.value.trim();
        const title3Value = title3.value.trim();

        let arrayTitles = [];
        if (title1Value) arrayTitles.push(title1Value);
        if (title2Value) arrayTitles.push(title2Value);
        if (title3Value) arrayTitles.push(title3Value);

        if (!title1Value) {
            alert("Please enter a title.");
            return;
        }

        const cbFetchAPI = document.getElementById("cbFetchAPI").checked;
        const cbXHR = document.getElementById("cbXHR").checked;

        if (cbFetchAPI) {
            if (arrayTitles.length > 1) {
                fetchMultipleQueries(arrayTitles);
            } else {
                fetchQuery(title1Value);
            }
        }

        if (cbXHR) {
            if (arrayTitles.length > 1) {
                fetchMultipleQueriesXHR(arrayTitles);
            } else {
                xhrQuery(title1Value);
            }
        }
    });

    async function fetchQuery(title) {
        const apiKey = "d08ce4be";
        const apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

        outputContainer1.style.visibility = "visible";

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            if (data.Response === "True") {
                movieImage.setAttribute("src", data.Poster);
                movieText.textContent = `${data.Title} - ${data.Year}`;
                addPeliculaToArray(data);
            } else {
                outputContainer1.textContent = `Error: ${data.Error}`;
            }
        } catch (error) {
            outputContainer1.textContent = `An error occurred: ${error.message}`;
        }
    }


    function xhrQuery(title) {
        const apiKey = "d08ce4be";
        const apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
    
        outputContainer1.style.visibility = "visible";
    
        const xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl, true);
    
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                if (data.Response === "True") {
                    // Fetch the poster image as a binary blob
                    fetchPosterImage(data.Poster, function (blobUrl) {
                        movieImage.setAttribute("src", blobUrl);
                    });
    
                    movieText.textContent = `${data.Title} - ${data.Year}`;
                    addPeliculaToArray(data);
                } else {
                    outputContainer1.textContent = `Error: ${data.Error}`;
                }
            } else {
                outputContainer1.textContent = "Error: Failed to fetch data.";
            }
        };
    
        xhr.onerror = function () {
            outputContainer1.textContent = "Error: Network issue.";
        };
    
        xhr.send();
    }
    
    function fetchPosterImage(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob"; // Set response type to blob for binary data
    
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Convert blob to a URL and pass it to the callback
                const blobUrl = URL.createObjectURL(xhr.response);
                callback(blobUrl);
            } else {
                console.error("Error fetching the poster image.");
                callback(""); // Provide an empty fallback
            }
        };
    
        xhr.onerror = function () {
            console.error("Network error while fetching the poster image.");
            callback("");
        };
    
        xhr.send();
    }

    async function fetchMultipleQueries(titles) {
        const apiKey = "d08ce4be";

        const promises = titles.map((title) => {
            const apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
            return fetch(apiUrl).then((response) => {
                if (!response.ok) {
                    throw new Error(`Error fetching ${title}`);
                }
                return response.json();
            });
        });

        try {
            const results = await Promise.all(promises);
            let arrayContainer = [outputContainer1, outputContainer2, outputContainer3];
            outputContainer1.style.visibility = "visible";
            outputContainer2.style.visibility = "visible";
            outputContainer3.style.visibility = "visible";

            results.forEach((data, index) => {
                if (data.Response === "True") {
                    const movieFoundDiv = arrayContainer[index].querySelector(".movieFound");

                    const movieImage = document.createElement("img");
                    movieImage.setAttribute("src", data.Poster);
                    movieImage.setAttribute("alt", `${data.Title} Poster`);

                    const textElement = document.createElement("p");
                    textElement.textContent = `${data.Title} - ${data.Year}`;

                    movieFoundDiv.innerHTML = '';
                    movieFoundDiv.appendChild(movieImage);
                    movieFoundDiv.appendChild(textElement);
                    resultsContainer.style.display = "flex";
                    addPeliculaToArray(data);
                } else {
                    console.log(`Error for ${titles[index]}: ${data.Error}`);
                }
            });
        } catch (error) {
            console.error("An error occurred while fetching multiple queries:", error);
        }
    }


    function fetchMultipleQueriesXHR(titles) {
        const apiKey = "d08ce4be";
        let arrayContainer = [outputContainer1, outputContainer2, outputContainer3];
        outputContainer1.style.visibility = "visible";
        outputContainer2.style.visibility = "visible";
        outputContainer3.style.visibility = "visible";
        titles.forEach((title, index) => {
            const apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", apiUrl, true);
            xhr.responseType = "json";
    
            xhr.onload = function () {
                if (xhr.status === 200) {
                    const data = xhr.response;
                    if (data.Response === "True") {
                        const movieFoundDiv = arrayContainer[index].querySelector(".movieFound");
    
                        // Fetch the poster image as a binary blob
                        fetchPosterImage(data.Poster, function (blobUrl) {
                            const movieImage = document.createElement("img");
                            movieImage.setAttribute("src", blobUrl);
                            movieImage.setAttribute("alt", `${data.Title} Poster`);
    
                            const textElement = document.createElement("p");
                            textElement.textContent = `${data.Title} - ${data.Year}`;
    
                            movieFoundDiv.innerHTML = '';
                            movieFoundDiv.appendChild(movieImage);
                            movieFoundDiv.appendChild(textElement);
                            resultsContainer.style.display = "flex";
                            addPeliculaToArray(data);
                        });
                    } else {
                        console.log(`Error for ${title}: ${data.Error}`);
                    }
                } else {
                    console.log(`Error fetching ${title}: Hi ha hagut un error amb la consulta`);
                }
            };
    
            xhr.onerror = function () {
                console.error(`Error fetching ${title}: No es pot connectar al servidor`);
            };
    
            xhr.send();
        });
    }

   function addPeliculaToArray(data) {
        let pelicula = new Pelicula(data.imdbID, data.Title, data.Runtime, data.Year, data.Genre, data.Director, data.Plot, data.Country, data.imbdRating);

        if (!arrayPelicules.find(peliArray => peliArray.id === pelicula.id)) {
            arrayPelicules.push(pelicula);
            console.log(pelicula)
        }
    }



});