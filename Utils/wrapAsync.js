module.exports = (fn) => {
    return(req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

//exporting directing instead of writing the entire wrapAsync func.\\