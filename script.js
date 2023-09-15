const express = require('express');
const path = require('path');
const multer = require('multer')
const fs = require('fs');
const zopfli = require('node-zopfli');

const app = express();
const upload = multer();
const port = process.env.port || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./views'));
app.use(express.static('./public'));

app.get('/', (req,res) => {
    res.render("upload");
});

const storage = multer.diskStorage({
    des: './views/upload',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.post('/smash', upload.single('blank'), function(req,res) {  

    const file = req.file;

    const options = {
        verbose: false,
        verbose_more: false,
        numiterations: 15,
        blocksplitting: true,
        blocksplittinglast: false,
        blocksplittingmax: 15
    }

    fs.createReadStream(file.originalname)
    .pipe(zopfli.createGzip(options))
    .pipe(fs.createWriteStream(`${file.originalname}.gz`));

    res.redirect('/');
})


app.listen(port, (req,res) => {
    console.log('Server started', port)
});
