/**
* Created by Grunt on 29/06/2017.
*/
module.exports = function(fields){
    return function(req, res, next){
        var requiredFields = (fields instanceof Array)? fields : [fields];
        var missingFields = [];

        requiredFields.forEach(function(field){
            if (!req.body[field])
                missingFields.push(field);
        });

        if (missingFields.length > 0)
            return res.status(400).send({
                error: 'Missing fields',
                data: {
                    missings: missingFields
                }
            });

        next();
    }
};
