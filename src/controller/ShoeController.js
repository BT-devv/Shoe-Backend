const ShoeDAO = require('../DAOs/ShoesDAO')
const ImgDAO = require('../DAOs/ImgDAO')
const SizeDAO = require('../DAOs/SizeDAO')

exports.checkId = async (req, res, next, val) => {
    try{
        const id = val;
        let shoe = await ShoeDAO.getShoeById(id);
        if (!shoe){
            return res.status(404)     /// 404 - NOT FOUND!
                .json({
                    code: 404,
                    msg: `Not found shoe with id ${id}`,
                });
        }
        req.shoe = shoe;
    }catch (e) {
        console.error(e);
        return res
            .status(500)        // 500 - Internal Error
            .json({
                code: 500,
                msg: e.toString()
            });
    }
    next();
}
//CRUD 
exports.getAllShoe = async (req, res) => {
    try{
        // console.log(req.query);
        const {page,pageSize,totalPage,totalItem,shoes} = await ShoeDAO.getAllShoes(req.query);
        res.status(200).json({
            //200 - OK
            code: 200,
            msg: 'OK',
            page,
            pageSize,
            totalPage,
            totalItem,
            data: {
                shoes
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
exports.getShoe = async (req, res) => {
    try{
        const shoe = req.shoe
        res.status(200)
            .json({
                code: 200,
                msg: 'OK',
                data: {shoe}
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
exports.updateShoe = async (req, res) => {
    try{
        const id = req.params.id * 1;
        const updateShoe = req.body;
        await ShoeDAO.updateShoe(id, updateShoe);
        const shoe = await ShoeDAO.getShoeById(id);
        res
            .status(200)
            .json({
                code: 200,
                msg: `Update shoe with id: ${id} successfully!`,
                data: {
                    shoe
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
exports.createShoe = async (req, res) => {
    const newShoe = req.body
    try {
        await ShoeDAO.createShoe(newShoe)
        let shoe = await ShoeDAO.getShoeByName(newShoe.name)
        if (newShoe.images && newShoe.images.length > 0){
            for (let j = 0; j < newShoe.images.length; j++) {
                await ImgDAO.addImageIfNotExisted(shoe.id, newShoe.images[j])
            }
        }
        if (newShoe.size && newShoe.size.length > 0){
            for (let j = 0; j < newShoe.size.length; j++) {
                await SizeDAO.addSizeIfNotExisted(shoe.id, newShoe.size[j])
            }
        }
        shoe = await ShoeDAO.getShoeById(shoe.id)
        return res
            .status(200)
            .json({
                code: 200,
                msg: `Create new Shoe successfully!`,
                data: {shoe}
            })
    }catch (e){
        console.log(e)
        res
            .status(500)
            .json({
                code: 500,
                msg: e.toString()
            });
    }

}
exports.deleteShoe = async (req,res) => {
    const id = req.params.id
    try {
        await SizeDAO.deleteByShoeId(id)
        await ImgDAO.deleteByShoeId(id)
        await ShoeDAO.deleteShoe(id)
        return res
        .status(200)
        .json({
            code: 200,
            msg: `Delete Shoe successfully!`
        })
    }catch (e){
        console.log(e)
        res
        .status(500)
        .json({
            code: 500,
            msg: e.toString()
        });
    }
                    
}