const sanitizeValue = (value) => {
    if (value instanceof Object) {
        for (const key in value) {
            if (key.startsWith('$') || key.includes('.')) {
                delete value[key]
            } else {
                sanitizeValue(value[key])
            }
        }
    }
    return value
}

const mongoSanitize = (req, res, next) => {
    if (req.body) sanitizeValue(req.body)
    if (req.query) sanitizeValue(req.query)
    if (req.params) sanitizeValue(req.params)
    next()
}

module.exports = mongoSanitize