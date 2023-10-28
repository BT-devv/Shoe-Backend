const UserDAO = require('../DAOs/UsersDAO')
const OrderDAO = require('../DAOs/OrderDAO')
const ReviewDAO = require('../DAOs/ReviewDAO')


//check ID middleware
exports.checkID = async (req, res, next, val) => {
    try{
        const id = val
        let user = await UserDAO.getUser(id)
        if (!user){
            return res.status(404)     /// 404 - NOT FOUND!
                .json({
                    code: 404,
                    msg: `Not found user with id ${id}`,
                });
        }
        req.user = user
    }catch (e) {
        console.error(e)
        return res
            .status(500)        // 500 - Internal Error
            .json({
                code: 500,
                msg: e.toString()
            })
    }
    next()
}
//CRUD
exports.getAllUsers = async (req, res) => {
    try{
        // console.log(req.query);
        const {page,pageSize,totalPage,totalItem,users} = await UserDAO.getAllUsers(req.query);
        res.status(200).json({
            //200 - OK
            code: 200,
            msg: 'OK',
            page,
            pageSize,
            totalPage,
            totalItem,
            data: {
                users
            },
        });
    }catch (e) {
        console.error(e);
        res
            .status(500)        // 500 - Internal Error
            .json({
                code: 500,
                msg: e.toString()
            });
    }
}
exports.getUser = async (req, res) => {
    try{
        const user = req.user
        res.status(200)
            .json({
                code: 200,
                msg: 'OK',
                data: {user}
            });
    }catch (e) {
        console.error(e);
        res
            .status(500)        // 500 - Internal Error
            .json({
                code: 500,
                msg: e.toString()
            });
    }
}
exports.creatUser = async (req,res) =>{
    const newuser = req.body
    try{
        await UserDAO.createUser(newuser)
        let user = await UserDAO.getUserByUserName(newuser.username)
        user = await UserDAO.getUser(user.id)
        res
            .status(200)
            .json({
                code: 200,
                msg: 'Create User Successfully!!!',
                data: {user}
            })
    }
    catch (e) {
        console.error(e)
        res
            .status(500)        // 500 - Internal Error
            .json({
                code: 500,
                msg: e.toString()
            })
    }
}
exports.updateUser = async (req, res) => {
    try{
        const id = req.params.id * 1
        const updateUser = req.body
        await UserDAO.updateUser(id , updateUser)
        const user = await UserDAO.getUser(id)
        res
            .status(200)
            .json({
                code: 200,
                msg: `Update user with id: ${id} successfully!`,
                data: {
                    user
                }
            })
    }catch (e) {
        console.error(e);
        res
            .status(500)        // 500 - Internal Error
            .json({
                code: 500,
                msg: e.toString()
            });
    }
}
exports.deleteUser = async (req, res) => {
    //const user = req.user;
    try{
        let id = req.params.id*1;
        await OrderDAO.deleteOrderbyUserId(id)
        await ReviewDAO.deleteOrderbyUserId(id)
        await UserDAO.deleteUser(id);

        res
            .status(200)
            .json({
                code: 200,
                msg: `Delete user with ${id} successfully!`,
            })
    }catch (e) {
        console.error(e);
        res
            .status(500)        // 500 - Internal Error
            .json({
                code: 500,
                msg: e.toString()
            });
    }
}