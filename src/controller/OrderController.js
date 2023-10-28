const OrderDAO = require('../DAOs/OrderDAO')

//check ID middleware
exports.checkID = async (req, res, next, val) => {
    try{
        const id = val
        let order = await OrderDAO.getOrder(id)
        if (!order){
            return res.status(404)     /// 404 - NOT FOUND!
                .json({
                    code: 404,
                    msg: `Not found Order with id ${id}`,
                });
        }
        req.order = order
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
exports.getAllOrder = async (req, res, next) => {
    try{
        console.log(req.query)

        const {page,pageSize,totalPage,totalItem,order} = await OrderDAO.getAllOrder(req.query)
        res.status(200).json({
            //200 - OK
            code: 200,
            msg: 'OK',
            page,
            pageSize,
            totalPage,
            totalItem,
            data: {
                order
            },
        });
    }catch (e) {
        console.error(e)
        res
            .status(500)        // 500 - Internal Error
            .json({
                code: 500,
                msg: e.toString()
            });
    }
}
exports.getOrder = async (req, res, next) => {
    try{
        const order = req.order

        res.status(200)
            .json({
                code: 200,
                msg: 'OK',
                data: {order}
            })
    }catch (e) {
        console.error(e)
        res
            .status(500)        // 500 - Internal Error
            .json({
                code: 500,
                msg: e.toString()
            })
    }
}
exports.updateOrder = async (req,res) => {
    const id = req.params.id
    const updateOrder = req.body
    try {
        await OrderDAO.updateOrder(id,updateOrder)
        const order = await OrderDAO.getOrder(id) 
        return res
        .status(200)
        .json({
            code: 200,
            msg: 'Update order successfully!',
            data: {order}
        })
    }catch (e){
        console.log(e)
        res
        .status(500)
        .json({
            code: 500,
            msg: e.toString()
        })
    }
}
exports.createOrder = async (req, res, next) => {
    const newOrder = req.body;
    try {
        await OrderDAO.createOrder(newOrder)
        return res
            .status(200)
            .json({
                code: 200,
                msg: `Create new order successfully!`,
            })
    }catch (e){
        console.log(e)
        res
            .status(500)
            .json({
                code: 500,
                msg: e.toString()
            })
    }
}
exports.deleteOrder = async (req,res) => {
    const id = req.params.id
    try {
        await OrderDAO.deleteOrder(id)
        return res
        .status(200)
        .json({
            code: 200,
            msg: 'Delete order successfully!'
        })
        }catch (e){
            console.log(e);
            res
            .status(500)
            .json({
                code: 500,
                msg: e.toString()
            })
        }
}