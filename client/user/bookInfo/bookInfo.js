document.addEventListener('DOMContentLoaded', function() {
    async function fetchBookData() {
        const queryParams = new URLSearchParams(window.location.search);
        const bookId = queryParams.get('bookId');
        
        if (!bookId) {
            console.error('ID книги не указан.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/bookById?id=${bookId}`);
            const bookData = await response.json();

            document.getElementById('bookCoverImage').src = bookData.Extension ? `http://localhost:3000/images/covers/${bookData.Id}.${bookData.Extension}` : 'http://localhost:3000/images/covers/default.jpg';
            document.getElementById('bookTitle').textContent = bookData.Title;
            document.getElementById('bookAuthor').textContent = bookData.Author;
            document.getElementById('bookDescription').textContent = bookData.Description;
            document.getElementById('bookGenres').textContent = bookData.Genres.join(', ');

            if (bookData.IsOpen) {
                document.getElementById('buyButton').style.display = 'block';
            }


        } catch (error) {
            console.error('Ошибка при загрузке информации о книге:', error);
        }
    }

    fetchBookData();
});
