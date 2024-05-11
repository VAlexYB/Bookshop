const path = require('path');
const fs = require('fs');

class FileController {
    async addFile(req, res) {
        const file = req.files.file;
        const choice = req.body.fileType; // Используем req.body.fileType
        let filePath;
        if (choice === 'cover') {
            filePath = `/public/images/covers/${file.originalname}`; 
        } else if (choice === 'book') {
            filePath = `/public/books/${file.originalname}`; 
        } else {
            return res.status(400).send('Ошибка при выборе типа файла'); 
        }

        try {
            await fs.promises.writeFile(filePath, file.buffer); 
            res.send('Файл загружен успешно');
        } catch (err) {
            console.error(err);
            res.status(500).send('Ошибка при сохранении файла');
        }
    }
}

module.exports = new FileController();