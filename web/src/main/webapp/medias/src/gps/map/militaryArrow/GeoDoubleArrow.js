define([
    "RXMap/mapGlobal",
    "RXMap/mapUtil",
    'esri/geometry/Point',
    "esri/symbols/SimpleFillSymbol",
    'esri/geometry/Polygon'
], function (mapGlobal, MapUtil, Point, SimpleFillSymbol, Polygon) {
    var GeoDoubleArrow = {

        /**
         * 获取双箭头
         * @param tempControlPt
         */
        getPolygon: function (tempControlPt) {
            var me = this;
            var polygon = me._getPolygonBy4Pt(tempControlPt);
            return polygon;
        },

        /**
         * 用于通过控制点计算箭头的所有绘制点
         * 四个控制点就可以构成双箭头
         */
        _getPolygonBy4Pt: function (tempControlPt) {
            var controlPois = tempControlPt;
            console.log(controlPois.length);
            //判定少于四个点或者为空，则直接返回
            if (controlPois == null || controlPois.length < 4) {
                return;
            }

            //定义四个用户输入点
            var pointU_1 = controlPois[0];
            var pointU_2 = controlPois[1];
            var pointU_3 = controlPois[2];
            var pointU_4 = controlPois[3];

            //计算控制点
            //计算中间用户点
            var pointU_C = new Point(((pointU_1.x + pointU_2.x) * 5 + (pointU_3.x + pointU_4.x)) / 12, ((pointU_1.y + pointU_2.y) * 5 + (pointU_3.y + pointU_4.y)) / 12);
            //计算左边外弧的控制点
            var pointC_l_out = MapUtil.calculateIntersectionFromTwoCorner(pointU_1, pointU_4, Math.PI / 8, Math.PI / 6)[0];
            //计算左边内弧的控制点
            var pointC_l_inner = MapUtil.calculateIntersectionFromTwoCorner(pointU_C, pointU_4, Math.PI / 8, Math.PI / 16)[0];
            //计算右边外弧的控制点
            var pointC_r_out = MapUtil.calculateIntersectionFromTwoCorner(pointU_2, pointU_3, Math.PI / 8, Math.PI / 6)[1];
            //计算右边内弧的控制点
            var pointC_r_inner = MapUtil.calculateIntersectionFromTwoCorner(pointU_C, pointU_3, Math.PI / 8, Math.PI / 16)[1];

            //

            var v_l_out = new Point(pointC_l_out.x - pointU_4.x, pointC_l_out.y - pointU_4.y);
            var d_l_out = Math.sqrt(v_l_out.x * v_l_out.x + v_l_out.y * v_l_out.y);
            //单位向量
            var v_l_out_1 = new Point(v_l_out.x / d_l_out, v_l_out.y / d_l_out);

            var v_l_inner = new Point(pointC_l_inner.x - pointU_4.x, pointC_l_inner.y - pointU_4.y);
            var d_l_inner = Math.sqrt(v_l_inner.x * v_l_inner.x + v_l_inner.y * v_l_inner.y);
            //单位向量
            var v_l_inner_1 = new Point(v_l_inner.x / d_l_inner, v_l_inner.y / d_l_inner);

            //定义箭头头部的大小比例
            var ab = 0.25;

            //取最短的，除以5是一个经验值，这样效果比较好
            var d_l_a = d_l_out < d_l_inner ? d_l_out * ab : d_l_inner * ab;
            //
            var pointC_l_out_2 = new Point(v_l_out_1.x * d_l_a + pointU_4.x, v_l_out_1.y * d_l_a + pointU_4.y);
            var pointC_l_inner_2 = new Point(v_l_inner_1.x * d_l_a + pointU_4.x, v_l_inner_1.y * d_l_a + pointU_4.y);

            //左箭头左边点
            var pointC_l_a_l = new Point(pointC_l_out_2.x * 1.5 - pointC_l_inner_2.x * 0.5, pointC_l_out_2.y * 1.5 - pointC_l_inner_2.y * 0.5);
            //左箭头右边点
            var pointC_l_a_r = new Point(pointC_l_inner_2.x * 1.5 - pointC_l_out_2.x * 0.5, pointC_l_inner_2.y * 1.5 - pointC_l_out_2.y * 0.5);

            var v_r_out = new Point(pointC_r_out.x - pointU_3.x, pointC_r_out.y - pointU_3.y);
            var d_r_out = Math.sqrt(v_r_out.x * v_r_out.x + v_r_out.y * v_r_out.y);
            var v_r_out_1 = new Point(v_r_out.x / d_r_out, v_r_out.y / d_r_out);

            var v_r_inner = new Point(pointC_r_inner.x - pointU_3.x, pointC_r_inner.y - pointU_3.y);
            var d_r_inner = Math.sqrt(v_r_inner.x * v_r_inner.x + v_r_inner.y * v_r_inner.y);
            var v_r_inner_1 = new Point(v_r_inner.x / d_r_inner, v_r_inner.y / d_r_inner);

            //取最短的，除以5是一个经验值，这样效果比较好
            var d_r_a = d_r_out < d_r_inner ? d_r_out * ab : d_r_inner * ab;
            var pointC_r_out_2 = new Point(v_r_out_1.x * d_r_a + pointU_3.x, v_r_out_1.y * d_r_a + pointU_3.y);
            var pointC_r_inner_2 = new Point(v_r_inner_1.x * d_r_a + pointU_3.x, v_r_inner_1.y * d_r_a + pointU_3.y);

            //右箭头箭头右边点
            var pointC_r_a_r = new Point(pointC_r_out_2.x * 1.5 - pointC_r_inner_2.x * 0.5, pointC_r_out_2.y * 1.5 - pointC_r_inner_2.y * 0.5);
            //左箭头左边点
            var pointC_r_a_l = new Point(pointC_r_inner_2.x * 1.5 - pointC_r_out_2.x * 0.5, pointC_r_inner_2.y * 1.5 - pointC_r_out_2.y * 0.5);

            //计算坐边外弧所有点
            var points_l = MapUtil.createBezier2([pointU_1, pointC_l_out, pointC_l_out_2]);

            //计算控制点
            //定义向量
            var v_U_4_3 = new Point(pointU_3.x - pointU_4.x, pointU_3.y - pointU_4.y);

            //取部分
            //需要优化，不能左右都取一样，需要按照左右的长度取值，这样更合理一些
            //取u4和C的向量模
            //取u3和C的向量模
            //根据模的大小来取左右向量的长度，；来定位置
            var v_U_4_C = new Point(pointU_C.x - pointU_4.x, pointU_C.y - pointU_4.y);
            //求模
            var d_U_4_C = Math.sqrt(v_U_4_C.x * v_U_4_C.x + v_U_4_C.y * v_U_4_C.y);
            var v_U_3_C = new Point(pointU_C.x - pointU_3.x, pointU_C.y - pointU_3.y);
            //求模
            var d_U_3_C = Math.sqrt(v_U_3_C.x * v_U_3_C.x + v_U_3_C.y * v_U_3_C.y);

            var percent = 0.4;
            var v_U_4_3_ = new Point(v_U_4_3.x * percent, v_U_4_3.y * percent);
            var v_U_4_3_l = new Point(v_U_4_3_.x * d_U_4_C / (d_U_4_C + d_U_3_C), v_U_4_3_.y * d_U_4_C / (d_U_4_C + d_U_3_C));
            var v_U_4_3_r = new Point(v_U_4_3_.x * d_U_3_C / (d_U_4_C + d_U_3_C), v_U_4_3_.y * d_U_3_C / (d_U_4_C + d_U_3_C));
            //中心点的左控制点
            var pointC_c_l = new Point(pointU_C.x - v_U_4_3_l.x, pointU_C.y - v_U_4_3_l.y);
            //中心点右边的控制点
            var pointC_c_r = new Point(pointU_C.x + v_U_4_3_r.x, pointU_C.y + v_U_4_3_r.y);

            //测试
            var arr = [pointC_l_inner_2, pointC_l_inner, pointC_c_l, pointU_C, pointC_c_r, pointC_r_inner, pointC_r_inner_2];

            var points_c = MapUtil.createBezier1(arr, 0, 20);
            //var points_c = LineString.createBezier(arr,0.05).components;

            //计算右边外弧的所有点
            var points_r = MapUtil.createBezier2([pointC_r_out_2, pointC_r_out, pointU_2]);

            //定义结果数组
            var result = points_l;
            result.push(pointC_l_a_l);
            result.push(pointU_4);
            result.push(pointC_l_a_r);
            result = result.concat(points_c);
            result.push(pointC_r_a_l);
            result.push(pointU_3);
            result.push(pointC_r_a_r);
            result = result.concat(points_r);

            var poly = new Polygon(mapGlobal.map.spatialReference);
            var rings = [];
            for (var i = 0; i < result.length; i++) {
                rings.push([result[i].x, result[i].y]);
            }
            poly.addRing(rings);
            return poly;
        }
    };

    return GeoDoubleArrow;
});