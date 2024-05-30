let selectedGenre = '';

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/genres')
    .then(response => response.json())
    .then(genres => {
        const genresList = document.getElementById('genresList');
        genresList.innerHTML = ''; 
        genres.forEach(genre => {
            const genreLink = document.createElement('a');
            genreLink.href = '#';
            genreLink.dataset.genre = genre.value;
            genreLink.textContent = genre.value;
            genresList.appendChild(genreLink);

            genreLink.addEventListener('click', (event) => {
                event.preventDefault();
                selectedGenre = genre.value;
                document.getElementById('searchInput').value = '';
                loadBooks(1, 20, '', selectedGenre); 
            });
        });
    })
    .catch(error => console.error('Ошибка при загрузке жанров:', error));

    document.getElementById('openCatalogCheckbox').addEventListener('change', (event) => {
        isOpenCatalogChecked = document.getElementById('openCatalogCheckbox').checked;
        document.getElementById('searchInput').value = '';
        loadBooks(1, 20, '', selectedGenre);
    });
    
    document.getElementById('restrictedCatalogCheckbox').addEventListener('change', (event) => {
        isRestrictedCatalogChecked = document.getElementById('restrictedCatalogCheckbox').checked;
        document.getElementById('searchInput').value = '';
        loadBooks(1, 20, '', selectedGenre);
    });
});

