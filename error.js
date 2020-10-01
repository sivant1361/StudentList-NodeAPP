module.exports = function(val){
    return function(req, res,next){
        switch (val){
            case 400:
                res.send("Page Not Found");
            case 203:{
                res.send("Success");
            }
        }
    }
}