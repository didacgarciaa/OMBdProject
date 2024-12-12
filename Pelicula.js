export class Pelicula {

    constructor(id,title,duration,year,genre,director,plot,country,imdbRating) {
        this.id = id;
        this.title = title;
        this.duration = duration;
        this.year = year;
        this.genre = genre;
        this.director = director;
        this.plot = plot;
        this.country = country;
        this.imdbRating = imdbRating;
    }

    toString() {
        return `Pelicula:
    - ID: ${this.id}
    - Título: ${this.title}
    - Duración: ${this.duration} minutos
    - Año: ${this.year}
    - Género: ${this.genre}
    - Director: ${this.director}
    - Sinopsis: ${this.plot}
    - País: ${this.country}
    - Calificación en IMDb: ${this.imdbRating}`;
    }

}