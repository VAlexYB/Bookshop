const AuthService = require('../core/services/authService');

class AuthController {
    async registration(req, res) {
        try {
            const data = req.body;
            console.log(data);
            const result = await AuthService.registration(data);
            if(result) {
                return res.json({message: "Регистрация прошла успешно"});
            }
            return res.json({message: "Неизвестная ошибка"});
        } catch (error) {
            if(error.isUserError) {
                return res.json({ message: error.message });
            }
            else {
                console.log(error);
            }
        }
    }

    async login(req, res) {
        try {
            const data = req.body;
            const {token} = await AuthService.login(data);
            return res.json({token});
        } catch (error) {
            if(error.isUserError) {
                return res.json({ message: error.message });
            }
            else {
                console.log(error);
            }
        }
    }

}

module.exports = new AuthController();