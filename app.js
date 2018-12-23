var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
session = require('client-sessions')
fileUpload = require('express-fileupload')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();
//khởi tạo thư viện session-client: đăng nhập quản trị
app.use(session({
    cookieName: 'Nguoi_dung',
    secret: '2eca38b4-28d1-11e7-93ae-92361f002671',
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));

//khởi tạo thư viện session-client: Giỏ hàng
app.use(session({
    cookieName: 'gio_hang',
    secret: '2bca65b4-28b1-12e7-93ae-92361f002739',
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));


app.use(function(req, res, next) {
    res.locals.Nguoi_dung = req.Nguoi_dung.Nguoi_dung;
    res.locals.Gio_hang = req.gio_hang.Gio_hang;
    next();
})


// default options
app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var xl_mongo = require('./public/js/XL_LUU_TRU_MONGO')
du_lieu = {}
var pro_dien_thoai = xl_mongo.ds_doi_tuong('dien_thoai')
var pro_cua_hang = xl_mongo.ds_doi_tuong('cua_hang')
var pro_thuong_hieu = xl_mongo.ds_doi_tuong('thuong_hieu')
var pro_nguoi_dung = xl_mongo.ds_doi_tuong('nguoi_dung')
pro_dien_thoai.then(result => {
    du_lieu.dien_thoai = result
        //console.log(result);
}).catch(err => {})

pro_cua_hang.then(result => {
    du_lieu.cua_hang = result[0]
        //console.log(result[0]);
}).catch(err => {})

pro_thuong_hieu.then(result => {
    du_lieu.thuong_hieu = result
        //console.log(result);
}).catch(err => {})

pro_nguoi_dung.then(result => {
    du_lieu.Nguoi_dung = result
    console.log(result);
}).catch(err => {})


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;