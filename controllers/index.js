module.exports = {
    index,
};

function index(req, res) {
    res.render('index.ejs');
}

// DIDNT WORK
// async function addDate(req, res) {
//     const dates = req.body;
//     const initialDate = dates['initial-date'];
//     const endDate = dates['end-date'];
//     console.log(initialDate + endDate);

//     res.redirect('/asteroids');
// }
