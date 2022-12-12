const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalURL}`);
    next();
}

module.exports = logger;