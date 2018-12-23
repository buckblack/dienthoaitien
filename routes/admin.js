var express = require('express');
var router = express.Router();

var xl_mongo = require('../public/js/XL_LUU_TRU_MONGO')

function Lay_Ma_so_cuoi(nhom) {
    Nhom_Dien_thoai = nhom;
    var Danh_sach_Ma_so = []
    du_lieu.dien_thoai.forEach(Dien_thoai => {
        if (Dien_thoai.Nhom_Dien_thoai.Ma_so == Nhom_Dien_thoai) {
            var Thanh_phan_con = Dien_thoai.Ma_so.trim().split("_")
            Danh_sach_Ma_so.push(parseInt(Thanh_phan_con[1]))
        }

    })

    Danh_sach_Ma_so.sort(function(a, b) {
        return a - b
    })

    var Ma_so_Sau_cung = Danh_sach_Ma_so[Danh_sach_Ma_so.length - 1]
    Ma_so_Sau_cung += 1
    var Ma_so = Nhom_Dien_thoai + "_" + Ma_so_Sau_cung.toString()
    return Ma_so
}

router.get('/', function(req, res, next) {
    //res.send("Login")
    res.render("admin/dang_nhap", { Thong_bao: "", tieude: "Đăng nhập admin" })
});

router.get('/quan-tri', function(req, res, next) {
    //res.send("Login")
    res.render("admin/quan_tri", { tieude: "Quản trị", Nguoi_dung: req.Nguoi_dung.Nguoi_dung, Danh_sach_Dien_thoai: du_lieu.dien_thoai })
});

// Xử lý đăng nhập
router.post("/dang-nhap", function(req, res, next) {
    var Ten = req.body.Ten_Dang_nhap
    var Mat_khau = req.body.Mat_khau
    var Nguoi_dung = du_lieu.Nguoi_dung.find(x => x.Ten_Dang_nhap.toLowerCase() == Ten.toLowerCase())
    if (!Nguoi_dung) {
        res.render('admin/dang_nhap', {
            tieude: "Đăng nhập admin",
            Thong_bao: "Người dùng không tồn tại"
        });
    } else {
        if (Mat_khau.toLowerCase() === Nguoi_dung.Mat_khau.toLowerCase()) {
            // sets a cookie with the user's info
            req.Nguoi_dung.Nguoi_dung = Nguoi_dung;
            res.redirect('/admin/quan-tri'); // Đăng nhập thành công chuyển trang
            //res.send("Chào: " + req.Nguoi_dung.Nguoi_dung.Ten)


        } else {
            res.render('admin/dang_nhap', {
                tieude: "Đăng nhập admin",
                Thong_bao: "Mật khẩu không đúng"
            });
        }
    }
});

router.get('/them-dien-thoai', function(req, res) {

    res.render("admin/themdienthoai", { tieude: "Thêm điện thoại", Nguoi_dung: req.Nguoi_dung.Nguoi_dung })
})

router.post('/ghi-dien-thoai-moi', function(req, res) {
    var Ma_so = Lay_Ma_so_cuoi(req.body.Nhom_Dien_thoai)
    var Ten = req.body.Ten
    var Don_gia_Nhap = Number(req.body.Don_gia_Nhap)
    var Don_gia_Ban = Number(req.body.Don_gia_Ban)
    var Nhom_Dien_thoai_Ten = req.body.Nhom_Dien_thoai
    var Nhom_Dien_thoai_Ma_so = req.body.Nhom_Dien_thoai
    var Dien_thoai = {
        "Ten": Ten,
        "Ma_so": Ma_so,
        "Don_gia_Ban": Don_gia_Ban,
        "Don_gia_Nhap": Don_gia_Nhap,
        "Nhom_Dien_thoai": {
            "Ten": Nhom_Dien_thoai_Ten,
            "Ma_so": Nhom_Dien_thoai_Ma_so
        },
        "Danh_sach_Phieu_Dat": [],
        "Danh_sach_Phieu_Ban": [],
        "Danh_sach_Phieu_Nhap": []
    }

    // Thêm vào CSDL
    var kq = xl_mongo.them_doi_tuong("dien_thoai", Dien_thoai)
        // Upload hình
    var hinh = req.files.hinh;
    var ten_hinh = `${Ma_so}.png`
    hinh.mv(`./public/images/dienthoai/${ten_hinh}`, function(err) {
        if (err)
            return res.status(500).send(err);

        //res.send('File uploaded!');
    });
    du_lieu.dien_thoai.push(Dien_thoai)
        //console.log(Dien_thoai)
    res.redirect('/admin/quan-tri')

})

router.put('/cap-nhat-dien-thoai', function(req, res) {
    var pMa_so = req.body.Ma_so
    var pTen = req.body.Ten
    var pDon_gia_Ban = req.body.Don_gia_Ban
    var pDon_gia_Nhap = req.body.Don_gia_Nhap

    var dieu_kien = { Ma_so: pMa_so }
    var cap_nhat = {
        $set: {
            Ten: pTen,
            Don_gia_Ban: pDon_gia_Ban,
            Don_gia_Nhap: pDon_gia_Nhap
        }
    }

    var kq = xl_mongo.cap_nhat_doi_tuong("Dien_thoai", dieu_kien, cap_nhat)

    var vt = du_lieu.dien_thoai.findIndex(x => x.Ma_so == pMa_so)
    du_lieu.dien_thoai[vt].Ten = pTen
    du_lieu.dien_thoai[vt].Don_gia_Ban = pDon_gia_Ban
    du_lieu.dien_thoai[vt].Don_gia_Nhap = pDon_gia_Nhap

    res.send(JSON.stringify(Du_lieu.dien_thoai[vt]))

})

router.delete('/xoa-dien-thoai', function(req, res) {
    var pMa_so = req.body.Ma_so
    var dieu_kien = { Ma_so: pMa_so }
    var kq = xl_mongo.xoa_doi_tuong("Dien_thoai", dieu_kien)
    var vt = du_lieu.dien_thoai.findIndex(x => x.Ma_so == pMa_so)
    du_lieu.dien_thoai.splice(vt, 1)
    res.send(JSON.stringify({ ok: "OK" }))
})

router.post('/quan-tri', function(req, res, next) {
    //res.send("Login")
    var gt_tim = req.body.Th_gia_tri_tim
    var Danh_sach_Dien_thoai = du_lieu.dien_thoai.filter(x => x.Ten.toLowerCase().includes(gt_tim.toLowerCase()))
    res.render("admin/quan_tri", { tieude: "Quản trị", Nguoi_dung: req.Nguoi_dung.Nguoi_dung, Danh_sach_Dien_thoai: Danh_sach_Dien_thoai })
});

module.exports = router;