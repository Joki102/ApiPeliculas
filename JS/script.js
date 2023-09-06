$(document).ready(function() {
    let apiKey = '53de2804ae617a513601e127e6963170'; 
    let language = 'es';
    let currentPage = 1; 
    let totalPages = 1; 
    let genreId = ''; 

    // URL base para las películas populares
    let baseUrl = 'https://api.themoviedb.org/3/movie/popular';

    // Obtener el select de género y el botón de idioma
    let genreSelect = $('#genre-select');
    let languageButton = $('#language-button');
    let prevButton = $('#prev-button');
    let nextButton = $('#next-button');

    // Obtener la lista de géneros y llenar el select
    $.ajax({
        url: `https://api.themoviedb.org/3/genre/movie/list?language=${language}&api_key=${apiKey}`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            let genres = data.genres;
            for (let genre of genres) {
                genreSelect.append(`<option value="${genre.id}">${genre.name}</option>`);
            }
        },
        error: function(error) {
            console.error('Error al obtener los géneros:', error);
        }
    });

    // Función para cargar películas populares con filtros y paginación
    function loadMovies(page) {
        $.ajax({
            url: `${baseUrl}?language=${language}&api_key=${apiKey}&with_genres=${genreId}&page=${page}`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                let movies = data.results;
                let moviesList = $('#movies-list');
                moviesList.empty(); // Limpiar la lista antes de agregar nuevas películas
                for (let movie of movies) {
                    let movieContainer = $('<div class="movie-container"></div>');
                    let movieTitle = $(`<h2>${movie.title}</h2>`);
                    let movieOverview = $(`<p>${movie.overview}</p>`);
                    let moviePoster = $(`<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">`);
                    movieContainer.append(movieTitle, movieOverview, moviePoster);
                    moviesList.append(movieContainer);
                }
                currentPage = data.page;
                totalPages = data.total_pages;
                updatePaginationButtons();
            },
            error: function(error) {
                console.error('Error al obtener las películas populares:', error);
            }
        });
    }

    // Actualizar los botones de paginación según la página actual
    function updatePaginationButtons() {
        prevButton.prop('disabled', currentPage <= 1);
        nextButton.prop('disabled', currentPage >= totalPages);
    }

    // Cargar películas populares al cargar la página
    loadMovies(currentPage);

    // Manejar el cambio de género
    genreSelect.on('change', function() {
        genreId = $(this).val();
        currentPage = 1; // Volver a la página 1 al cambiar el género
        loadMovies(currentPage);
    });

    // Manejar el cambio de idioma
    languageButton.on('click', function() {
        if (language === 'es') {
            language = 'en';
        } else {
            language = 'es';
        }
        loadMovies(currentPage);
    });

    // Manejar el botón de página siguiente
    nextButton.on('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            loadMovies(currentPage);
        }
    });

    // Manejar el botón de página anterior
    prevButton.on('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadMovies(currentPage);
        }
    });
});