const FileService = require('../core/services/fileService');

class FileController {
    async addFile(req, res) {
        try {
            const data = {
                file: req.files.file,
                bookId: req.body.bookId,
                choice: req.body.fileType
            }
            const result = await FileService.upload(data);
            if (result) 
                return res.json({ message: 'Файл успешно добавлен'});
        } catch (error) {
            if(error.isUserError) {
                return res.status(400).json({ message: error.message });
            }
            else {
                console.log(error);
                return res.status(500).json({ message: 'Внутренняя ошибка сервера'});
            }
        }        
    }
}

module.exports = new FileController();