const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const app = express();
const libre = require('libreoffice-convert');
const shortid = require('shortid');
const util = require('util')
const convertSync = util.promisify(libre.convert)

// body-parser 用于解析post数据  application/x-www.form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static("./public"));
app.use(multer({ dest: './dist' }).array('file'));

app.post('/upload', async (req, res) => {
    try {
        const data = fs.readFileSync(req.files[0].path);
        const fileName = shortid.generate();
        const outputPath = path.join(__dirname, `./public/${fileName}.pdf`)
        const done = await convertSync(data, '.pdf', undefined);
        fs.unlinkSync(req.files[0].path)
        fs.writeFileSync(outputPath, done);
        res.jsonp({
            Result: true,
            ErrorMsg: '',
            ErrorCode: '',
            Data: {
                FilePath: `http://xxx.xxxx:7878/${fileName}.pdf`
            }
        })
    } catch (err) {
        res.jsonp({
            Result: false,
            ErrorMsg: err,
            ErrorCode: '3.1'
        })
    }
})
app.listen(7878, function () {
    console.log('Server is running at http://localhost:7878');
})
