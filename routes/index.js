var express = require('express');
var router = express.Router();
var xl_mongo = require('../public/js/XL_LUU_TRU_MONGO')
    //chuyển sang app.js
    /*var du_lieu = {}
    var pro_dien_thoai = xl_mongo.ds_doi_tuong('dien_thoai')
    var pro_cua_hang = xl_mongo.ds_doi_tuong('cua_hang')
    var pro_thuong_hieu = xl_mongo.ds_doi_tuong('thuong_hieu')
    pro_dien_thoai.then(result => {
        du_lieu.dien_thoai = result
        console.log(result);
    }).catch(err => {})

    pro_cua_hang.then(result => {
        du_lieu.cua_hang = result[0]
        console.log(result[0]);
    }).catch(err => {})

    pro_thuong_hieu.then(result => {
        du_lieu.thuong_hieu = result
        console.log(result);
    }).catch(err => {})
    */
    /* GET home page. */
router.get('/', function(req, res, next) {
    //res.send(JSON.stringify(du_lieu.cua_hang))
    res.render('trangchu', { tieude: 'Trang chủ', ds_dien_thoai: du_lieu.dien_thoai, thuong_hieu: du_lieu.thuong_hieu });
});

router.get('/dienthoai', function(req, res, next) {
    //res.send(JSON.stringify(du_lieu.cua_hang))
    res.render('sanpham', { tieude: 'Điện thoại', trangthai: ' Điện thoại', ds_dien_thoai: du_lieu.dien_thoai });
});

router.get('/dienthoai/iphone', function(req, res, next) {
    //res.send(JSON.stringify(du_lieu.cua_hang))
    var ds_iphone = du_lieu.dien_thoai.filter(x => x.Nhom_Dien_thoai.Ma_so == "IPHONE")
    res.render('sanpham', { tieude: 'Trang chủ', trangthai: ' Điện thoại / Iphone', ds_dien_thoai: ds_iphone });
});

router.get('/dienthoai/android', function(req, res, next) {
    //res.send(JSON.stringify(du_lieu.cua_hang))
    var ds_android = du_lieu.dien_thoai.filter(x => x.Nhom_Dien_thoai.Ma_so == "ANDROID")
    res.render('sanpham', { tieude: 'Trang chủ', trangthai: ' Điện thoại / Android', ds_dien_thoai: ds_android });
});

router.post('/tim_kiem', function(req, res, next) {
    var gtri = req.body.q.trim()
    var ds_tim = du_lieu.dien_thoai.filter(x => x.Ten.toLowerCase().includes(gtri.toLowerCase()))
    res.render('sanpham', { tieude: 'Trang chủ', trangthai: ' Chi tiết / Tìm kiếm', ds_dien_thoai: ds_tim });
});

router.get('/chi-tiet/:ten/:ma', function(req, res, next) {
    var ma = req.params.ma
    var sp = du_lieu.dien_thoai.find(x => x.Ma_so == `${ma}`)
    var sp_cung_loai = du_lieu.dien_thoai.filter(x => x.Nhom_Dien_thoai.Ma_so == sp.Nhom_Dien_thoai.Ma_so)
    res.render('chitiet', { tieude: 'Chi tiết', trangthai: ' Chi tiết', san_pham: sp, cung_loai: sp_cung_loai });
});

router.get("/dien-thoai/sap-tang", function(req, res, next) {
    /*var dsSap_xep_gia_tang = du_lieu.dien_thoai.sort((a, b) => {
            return Number(a.Don_gia_Ban) - Number(b.Don_gia_Ban)
        })*/
    var dsSap_xep_ten_tang = du_lieu.dien_thoai.sort((a, b) => a.Ten.localeCompare(b.Ten))
    res.render('sanpham', { tieude: 'Điện thoại', trangthai: ' Điện thoại', ds_dien_thoai: dsSap_xep_ten_tang });
})
router.get("/dien-thoai/sap-giam", function(req, res, next) {
    // Du_lieu.Danh_sach_Dien_thoai.sort((a,b)=>{
    //     //return b.Don_gia_Ban-a.Don_gia_Ban
    // })
    Danh_sach_Dien_thoai = du_lieu.dien_thoai.sort((a, b) => b.Ten.localeCompare(a.Ten))
    res.render('sanpham', { tieude: 'Điện thoại', trangthai: ' Điện thoại', ds_dien_thoai: Danh_sach_Dien_thoai });
})

router.post('/them-gio-hang', function(req, res) {
    // Thêm vào giỏ
    var Dien_thoai = du_lieu.dien_thoai.find(x => x.Ma_so == req.body.Ma_so);
    var Dien_thoai_tmp = {
        Ma_so: Dien_thoai.Ma_so,
        Ten: Dien_thoai.Ten,
        Nhom_Dien_thoai: Dien_thoai.Nhom_Dien_thoai.Ma_so,
        So_luong: req.body.So_luong,
        Don_gia_Ban: Number(Dien_thoai.Don_gia_Ban),
        Thanh_tien: req.body.So_luong * Number(Dien_thoai.Don_gia_Ban)
    }

    var ds = []

    if (typeof req.gio_hang.Gio_hang !== "undefined") {
        ds = req.gio_hang.Gio_hang
        var kiem_tra = 0
        ds.forEach(function(dt) {
            if (dt.Ma_so == Dien_thoai.Ma_so) {
                dt.So_luong = req.body.So_luong
                dt.Thanh_tien = req.body.So_luong * Number(Dien_thoai.Don_gia_Ban)
                kiem_tra = 1
            }
        })
        if (kiem_tra == 0) {
            ds.push(Dien_thoai_tmp)
        }
    } else {
        ds.push(Dien_thoai_tmp)
    }


    req.gio_hang.Gio_hang = ds
    res.send(JSON.stringify(req.gio_hang.Gio_hang))
})

router.get('/xem-gio-hang', function(req, res) {
    res.render('xemgiohang', { tieude: 'Điện thoại', trangthai: ' Điện thoại' });
})

// Xử lý Xóa giỏ hàng
router.get('/xoa-gio-hang', function(req, res) {
        req.gio_hang.reset()
            //req.gio_hang.Gio_hang = null;
            //res.locals.Gio_hang = req.gio_hang.Gio_hang
        res.redirect('/');
    })
    // Xử lý Khách đặt hàng
router.post('/khach-dat-hang', function(req, res) {
    var dsDat = req.body
    dsDat.forEach(p => {
        var Dien_thoai = du_lieu.dien_thoai.find(x => x.Ma_so == p.Ma_so)
        var So_Phieu_Dat = Dien_thoai.Danh_sach_Phieu_Dat.length + 1
        p.Phieu_Dat.So_Phieu_Dat = So_Phieu_Dat
        Dien_thoai.Danh_sach_Phieu_Dat.push(p.Phieu_Dat)

        var Dieu_kien = { "Ma_so": Dien_thoai.Ma_so }
        var Gia_tri_Cap_nhat = {
            $set: { Danh_sach_Phieu_Dat: Dien_thoai.Danh_sach_Phieu_Dat }
        }
        var Kq = xl_mongo.cap_nhat_doi_tuong("Dien_thoai", Dieu_kien, Gia_tri_Cap_nhat)
    })

    // xóa session
    req.gio_hang.reset()
    res.send(JSON.stringify({ "Thong_bao": "OK" }))
})

module.exports = router;