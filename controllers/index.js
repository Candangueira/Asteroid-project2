module.exports = {
    index,
    date,
    addDate,
};

function index(req, res) {
    res.render('index.ejs');
}

async function date(req, res) {
    res.render('date.ejs');
}

function addDate(req, res) {
    const dates = req.body;
    const initialDate = dates['initial-date'];
    const endDate = dates['end-date'];
    console.log(initialDate + endDate);

    res.redirect('/asteroids');
}
