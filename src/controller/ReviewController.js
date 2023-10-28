const ReviewDAO = require('../DAOs/ReviewDAO')

//check ID middleware
exports.checkID = async (req, res, next, val) => {
    try{
        const id = val
        let review = await ReviewDAO.getReview(id);
        if (!review){
            return res.status(404)     /// 404 - NOT FOUND!
                .json({
                    code: 404,
                    msg: `Not found review with id ${id}`,
                });
        }
        req.review = review;
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
exports.getAllReviews = async (req, res, next) => {
    try{
        console.log(req.query)

        const {page,pageSize,totalPage,totalItem,reviews} = await ReviewDAO.getAllReviews(req.query);
        res.status(200).json({
            //200 - OK
            code: 200,
            msg: 'OK',
            page,
            pageSize,
            totalPage,
            totalItem,
            data: {
                reviews
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
exports.getReview = async (req, res, next) => {
    try{
        // console.log(req.params);
        const review = req.review;

        res.status(200)
            .json({
                code: 200,
                msg: 'OK',
                data: {review}
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
exports.createReview = async (req, res, next) => {
    const newReview = req.body;
    try {
        await ReviewDAO.createReview(newReview)
        return res
            .status(200)
            .json({
                code: 200,
                msg: `Create new review successfully!`,
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
exports.updateReview = async (req,res) => {
    const id = req.params.id
        const review = req.review
        const updateReview = req.body
    try {
        await ReviewDAO.updateReview(id,updateReview)
        return res
        .status(200)
        .json({
            code: 200,
            msg: 'Update review successfully!',
            data: {review}
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
exports.deleteReview = async (req,res) => {
    const id = req.params.id
    try {
        await ReviewDAO.deleteReview(id)
        return res
        .status(200)
        .json({
            code: 200,
            msg: 'Delete review successfully!'
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