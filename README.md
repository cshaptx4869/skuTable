# SkuTable 组件

## 简介

基于 Layui 的商品规格组件。[v1.x](https://gitee.com/cshaptx4869/sku-table/tree/v1/)版本地址(数据表简单些)，[v2.x](https://gitee.com/cshaptx4869/sku-table/tree/v2/)版本地址(数据表复杂些)。

**主要功能：**

- 支持商品单规格和多规格切换
- 支持商品属性配置
- 支持规则/规格值添加、删除
- 支持规格行拖拽排序
- 支持SKU表同一列批量赋值
- 支持SKU表上传图片
- 支持SKU表相同属性值行合并



## 演示

<u>**注意：因示例中调用了本地json数据，需要在服务端预览，本地直接预览会有跨域问题！**</u>

[在线演示](https://www.jq22.com/yanshi24163)

### 单规格

![](https://s3.bmp.ovh/imgs/2021/12/149b1ebd0c1e9640.png)

### **多规格**

![](https://s3.bmp.ovh/imgs/2021/12/b4b94b777937150a.png)

## 数据表

<u>**注：表结构参考 [RageFrame](https://github.com/jianyan74/rageframe2) 项目！**</u>



### 系统规格表

```sql
CREATE TABLE `shop_base_spec` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `merchant_id` int(10) unsigned DEFAULT '0' COMMENT '商户id',
 `title` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '规格名称',
 `sort` int(11) NOT NULL DEFAULT '999' COMMENT '排列次序',
 `explain` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '规格说明',
 `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态(-1:已删除,0:禁用,1:正常)',
 `created_at` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
 `updated_at` int(10) unsigned DEFAULT '0' COMMENT '修改时间',
 PRIMARY KEY (`id`),
 KEY `product_attribute_category_id_name_index` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统规格表'
```



### 系统规格值表

```sql
CREATE TABLE `shop_base_spec_value` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `merchant_id` int(10) unsigned DEFAULT '0' COMMENT '商户id',
 `spec_id` int(11) NOT NULL COMMENT '规格id',
 `title` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '选项名称',
 `sort` int(11) NOT NULL DEFAULT '999' COMMENT '排序',
 `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态(-1:已删除,0:禁用,1:正常)',
 `created_at` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
 `updated_at` int(10) unsigned DEFAULT '0' COMMENT '修改时间',
 PRIMARY KEY (`id`),
 KEY `product_attribute_option_name_attr_id_index` (`title`,`spec_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统规格值表'
```



### 系统商品类型表

```sql
CREATE TABLE `shop_base_product_type` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `merchant_id` int(10) unsigned DEFAULT '0' COMMENT '商户id',
 `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '类型名称',
 `sort` int(11) DEFAULT '999' COMMENT '排序',
 `spec_ids` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '关联规格ids',
 `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态(-1:已删除,0:禁用,1:正常)',
 `created_at` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
 `updated_at` int(10) unsigned DEFAULT '0' COMMENT '修改时间',
 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统商品类型表'
```



### 系统商品类型属性表

```sql
CREATE TABLE `shop_base_product_type_attribute` (
 `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
 `merchant_id` int(10) unsigned DEFAULT '0' COMMENT '商户id',
 `product_type_id` int(11) NOT NULL COMMENT '商品类型id',
 `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '属性值名称',
 `value` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '属性对应相关选项数据',
 `type` int(11) NOT NULL DEFAULT '1' COMMENT '属性对应输入类型1.文本2.单选3.多选',
 `sort` int(11) NOT NULL DEFAULT '999' COMMENT '排序号',
 `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态(-1:已删除,0:禁用,1:正常)',
 `created_at` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
 `updated_at` int(10) unsigned DEFAULT '0' COMMENT '修改时间',
 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统商品类型属性值'
```



### 商品表

```sql
CREATE TABLE `shop_product` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `merchant_id` int(11) NOT NULL DEFAULT '0' COMMENT '商家编号',
 `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品标题',
 `picture` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '商品主图',
 `cate_id` int(11) unsigned NOT NULL COMMENT '商品分类id',
 `brand_id` int(11) unsigned DEFAULT '0' COMMENT '品牌id',
 `sketch` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '简述',
 `intro` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品描述',
 `keywords` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '商品关键字',
 `tags` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '标签',
 `marque` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '商品型号',
 `barcode` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '仓库条码',
 `sales` int(11) NOT NULL DEFAULT '0' COMMENT '虚拟购买量',
 `real_sales` int(10) NOT NULL DEFAULT '0' COMMENT '实际销量',
 `total_sales` int(11) DEFAULT '0' COMMENT '总销量',
 `price` decimal(8,2) NOT NULL COMMENT '商品价格',
 `market_price` decimal(8,2) DEFAULT '0.00' COMMENT '市场价格',
 `cost_price` decimal(19,2) DEFAULT '0.00' COMMENT '成本价',
 `wholesale_price` decimal(10,2) unsigned DEFAULT '0.00' COMMENT '拼团价格',
 `stock` int(11) NOT NULL DEFAULT '0' COMMENT '库存量',
 `warning_stock` int(11) NOT NULL DEFAULT '0' COMMENT '库存警告',
 `covers` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '幻灯片',
 `posters` json DEFAULT NULL COMMENT '宣传海报',
 `state` tinyint(4) NOT NULL DEFAULT '0' COMMENT '审核状态 -1 审核失败 0 未审核 1 审核成功',
 `is_package` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '是否是套餐',
 `is_attribute` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '启用商品规格',
 `sort` int(11) NOT NULL DEFAULT '999' COMMENT '排序',
 `product_status` tinyint(4) DEFAULT '1' COMMENT '商品状态 0下架，1正常，10违规（禁售）',
 `shipping_type` tinyint(2) DEFAULT '1' COMMENT '运费类型 1免邮2买家付邮费',
 `shipping_fee` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '运费',
 `shipping_fee_id` int(11) NOT NULL DEFAULT '0' COMMENT '物流模板id',
 `shipping_fee_type` int(11) NOT NULL DEFAULT '1' COMMENT '计价方式1.计件2.体积3.重量',
 `product_weight` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '商品重量',
 `product_volume` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '商品体积',
 `marketing_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '促销类型',
 `marketing_id` int(11) NOT NULL DEFAULT '0' COMMENT '促销活动ID',
 `marketing_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品促销价格',
 `point_exchange_type` tinyint(3) NOT NULL DEFAULT '1' COMMENT '积分兑换类型',
 `point_exchange` int(11) NOT NULL DEFAULT '0' COMMENT '积分兑换',
 `max_use_point` int(11) NOT NULL DEFAULT '0' COMMENT '积分抵现最大可用积分数 0为不可使用',
 `integral_give_type` int(1) NOT NULL DEFAULT '0' COMMENT '积分赠送类型 0固定值 1按比率',
 `give_point` int(11) NOT NULL DEFAULT '0' COMMENT '购买商品赠送积分',
 `min_buy` int(11) NOT NULL DEFAULT '1' COMMENT '最少买几件',
 `max_buy` int(11) NOT NULL DEFAULT '0' COMMENT '限购 0 不限购',
 `view` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '商品点击数量',
 `star` int(10) unsigned NOT NULL DEFAULT '5' COMMENT '好评星级',
 `collect_num` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '收藏数量',
 `comment_num` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '评价数',
 `transmit_num` int(11) NOT NULL DEFAULT '0' COMMENT '分享数',
 `province_id` int(10) unsigned DEFAULT '0' COMMENT '一级地区id',
 `city_id` int(10) unsigned DEFAULT '0' COMMENT '二级地区id',
 `area_id` int(10) DEFAULT '0' COMMENT '三级地区',
 `address_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '地址',
 `is_stock_visible` int(1) NOT NULL DEFAULT '1' COMMENT '库存显示 0不显示1显示',
 `is_hot` int(1) NOT NULL DEFAULT '0' COMMENT '是否热销商品',
 `is_recommend` int(1) NOT NULL DEFAULT '0' COMMENT '是否推荐',
 `is_new` int(1) NOT NULL DEFAULT '0' COMMENT '是否新品',
 `is_bill` int(1) NOT NULL DEFAULT '0' COMMENT '是否开具增值税发票 1是，0否',
 `product_type_id` int(11) NOT NULL DEFAULT '0' COMMENT '商品类型',
 `spec_data` text COLLATE utf8mb4_unicode_ci COMMENT '商品规格',
 `match_point` float DEFAULT '5' COMMENT '实物与描述相符（根据评价计算）',
 `match_ratio` float DEFAULT '100' COMMENT '实物与描述相符（根据评价计算）百分比',
 `sale_date` int(11) DEFAULT '0' COMMENT '上下架时间',
 `is_virtual` tinyint(1) DEFAULT '0' COMMENT '是否虚拟商品',
 `production_date` int(11) DEFAULT '0' COMMENT '生产日期',
 `shelf_life` int(11) DEFAULT '0' COMMENT '保质期',
 `is_open_presell` tinyint(4) DEFAULT '0' COMMENT '是否支持预售',
 `presell_time` int(11) DEFAULT '0' COMMENT '预售发货时间',
 `presell_day` int(11) DEFAULT '0' COMMENT '预售发货天数',
 `presell_delivery_type` int(11) DEFAULT '1' COMMENT '预售发货方式1. 按照预售发货时间 2.按照预售发货天数',
 `presell_price` decimal(10,2) DEFAULT '0.00' COMMENT '预售金额',
 `unit` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '商品单位',
 `video_url` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '展示视频',
 `supplier_id` int(11) DEFAULT '0' COMMENT '供货商id',
 `is_open_commission` tinyint(4) DEFAULT '0' COMMENT '是否支持分销',
 `status` tinyint(4) DEFAULT '1' COMMENT '状态',
 `created_at` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
 `updated_at` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
 PRIMARY KEY (`id`),
 KEY `price` (`price`),
 KEY `cate_id` (`cate_id`),
 KEY `brand_id` (`brand_id`),
 KEY `view` (`view`),
 KEY `star` (`star`),
 KEY `comment_num` (`comment_num`),
 KEY `sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表'
```



### 商品属性表

```sql
CREATE TABLE `shop_product_attribute` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `merchant_id` int(10) unsigned DEFAULT '0' COMMENT '商户id',
 `product_id` int(11) NOT NULL COMMENT '商品id',
 `product_type_attribute_id` int(11) NOT NULL DEFAULT '0' COMMENT '系统商品类型属性id',
 `title` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '属性名称',
 `value` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '属性值',
 `sort` int(11) NOT NULL DEFAULT '999' COMMENT '排序',
 `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态(-1:已删除,0:禁用,1:正常)',
 `created_at` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
 `updated_at` int(10) unsigned DEFAULT '0' COMMENT '修改时间',
 PRIMARY KEY (`id`),
 KEY `product_supplier_attribute_name_product_id_index` (`title`,`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品属性表'
```



### 商品规格表

```sql
CREATE TABLE `shop_product_spec` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `merchant_id` int(10) unsigned DEFAULT '0' COMMENT '商户id',
 `product_id` int(11) NOT NULL COMMENT '商品id',
 `spec_id` int(11) NOT NULL DEFAULT '0' COMMENT '系统规格id',
 `title` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '规格名称',
 `sort` int(11) NOT NULL DEFAULT '999' COMMENT '排序',
 `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态(-1:已删除,0:禁用,1:正常)',
 `created_at` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
 `updated_at` int(10) unsigned DEFAULT '0' COMMENT '修改时间',
 PRIMARY KEY (`id`),
 KEY `product_supplier_attribute_name_product_id_index` (`title`,`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品规格表'
```



### 商品规格值表

```sql
CREATE TABLE `shop_product_spec_value` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `merchant_id` int(10) DEFAULT '0' COMMENT '商户id',
 `product_id` int(11) NOT NULL COMMENT '商品id',
 `spec_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '系统规格id',
 `spec_value_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '系统规格值id',
 `title` varchar(125) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '属性标题',
 `data` varchar(125) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '属性值',
 `sort` int(11) NOT NULL DEFAULT '999' COMMENT '排序',
 `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态(-1:已删除,0:禁用,1:正常)',
 `created_at` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
 `updated_at` int(10) unsigned DEFAULT '0' COMMENT '修改时间',
 PRIMARY KEY (`id`),
 KEY `product_attribute_and_option_sku_id_option_id_attribute_id_index` (`base_spec_value_id`,`base_spec_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品规格值表'
```



### 商品sku表

```sql
CREATE TABLE `shop_product_sku` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `merchant_id` int(10) unsigned DEFAULT '0' COMMENT '商户id',
 `product_id` int(11) unsigned DEFAULT '0' COMMENT '商品id',
 `name` varchar(600) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'sku串名称',
 `picture` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '主图',
 `price` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
 `market_price` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '市场价格',
 `cost_price` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '成本价',
 `wholesale_price` decimal(10,2) unsigned DEFAULT '0.00' COMMENT '拼团价格',
 `stock` int(11) NOT NULL DEFAULT '0' COMMENT '库存',
 `code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '商品编码',
 `barcode` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '商品条形码',
 `product_weight` decimal(8,2) DEFAULT '0.00' COMMENT '商品重量',
 `product_volume` decimal(8,2) DEFAULT '0.00' COMMENT '商品体积',
 `sort` int(11) DEFAULT '1999' COMMENT '排序',
 `data` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT 'sku串',
 `status` tinyint(4) DEFAULT '1' COMMENT '状态[-1:删除;0:禁用;1启用]',
 `created_at` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
 `updated_at` int(10) unsigned DEFAULT '0' COMMENT '更新时间',
 PRIMARY KEY (`id`),
 KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品sku表'
```



## 示例

```html
<!doctype html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>动态SKU表</title>
    <!-- 引入 layui.css -->
    <link rel="stylesheet" type="text/css" href="./layui/css/layui.css"/>
</head>
<body>

<div class="layui-container" id="app">
    <form action="" class="layui-form fairy-form">
        <!--商品规格选项-->
        <div id="fairy-is-attribute"></div>
        <!--商品类型选择-->
        <div id="fairy-product-type"></div>
        <!--商品属性表-->
        <div id="fairy-attribute-table"></div>
        <!--商品规格表-->
        <div id="fairy-spec-table"></div>
        <!--商品库存表-->
        <div id="fairy-sku-table"></div>

        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit lay-filter="submit">立即提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
            </div>
        </div>
    </form>
</div>
<!-- 引入 layui.js -->
<script src="./layui/layui.js"></script>
<script>
    layui.config({
        base: './lay-module/', // 设定扩展的 layui 模块的所在目录，一般用于外部模块扩展
    }).use(['layer', 'form', 'skuTable',], function () {
        var layer = layui.layer,
            form = layui.form,
            skuTable = layui.skuTable;

        var skuTableObj = skuTable.render({
            isAttributeElemId: 'fairy-is-attribute',
            productTypeElemId: 'fairy-product-type',
            attributeTableElemId: 'fairy-attribute-table',
            specTableElemId: 'fairy-spec-table',
            skuTableElemId: 'fairy-sku-table',
            //商品规格模式 0单规格 1多规格
            mode: 0,
            //是否开启sku表行合并
            rowspan: true,
            //图片上传接口
            uploadUrl: './json/upload.json',
            //获取商品类型接口
            productTypeUrl: './json/productTypeData.json',
            //获取商品类型下的规格和属性接口
            attrSpecUrl: './json/attrSpecData.json',
            //创建规格接口
            specCreateUrl: './json/specCreate.json',
            //删除规格接口
            specDeleteUrl: './json/specDelete.json',
            //创建规格值接口
            specValueCreateUrl: './json/specValueCreate.json',
            //删除规格值接口
            specValueDeleteUrl: './json/specValueDelete.json',
            //sku数据接口
            skuDataUrl: './json/skuData.json',
            //单规格SKU表配置
            singleSkuTableConfig: {
                thead: [
                    {title: '销售价(元)', icon: 'layui-icon-cols'},
                    {title: '市场价(元)', icon: 'layui-icon-cols'},
                    {title: '成本价(元)', icon: 'layui-icon-cols'},
                    {title: '库存', icon: 'layui-icon-cols'},
                    {title: '状态', icon: ''},
                ],
                tbody: [
                    {type: 'input', field: 'price', value: '0', verify: 'required|number', reqtext: '销售价不能为空'},
                    {type: 'input', field: 'market_price', value: '0', verify: 'required|number', reqtext: '市场价不能为空'},
                    {type: 'input', field: 'cost_price', value: '0', verify: 'required|number', reqtext: '成本价不能为空'},
                    {type: 'input', field: 'stock', value: '0', verify: 'required|number', reqtext: '库存不能为空'},
                    {type: 'select', field: 'status', option: [{key: '启用', value: '1'}, {key: '禁用', value: '0'}], verify: 'required', reqtext: '状态不能为空'},
                ]
            },
            //多规格SKU表配置
            multipleSkuTableConfig: {
                thead: [
                    {title: '图片', icon: ''},
                    {title: '销售价(元)', icon: 'layui-icon-cols'},
                    {title: '市场价(元)', icon: 'layui-icon-cols'},
                    {title: '成本价(元)', icon: 'layui-icon-cols'},
                    {title: '库存', icon: 'layui-icon-cols'},
                    {title: '状态', icon: ''},
                ],
                tbody: [
                    {type: 'image', field: 'picture', value: '', verify: '', reqtext: ''},
                    {type: 'input', field: 'price', value: '0', verify: 'required|number', reqtext: '销售价不能为空'},
                    {type: 'input', field: 'market_price', value: '0', verify: 'required|number', reqtext: '市场价不能为空'},
                    {type: 'input', field: 'cost_price', value: '0', verify: 'required|number', reqtext: '成本价不能为空'},
                    {type: 'input', field: 'stock', value: '0', verify: 'required|number', reqtext: '库存不能为空'},
                    {
                        type: 'select',
                        field: 'status',
                        option: [{key: '启用', value: '1'}, {key: '禁用', value: '0'}],
                        verify: '',
                        reqtext: ''
                    },
                ]
            },
        });

        form.on('submit(submit)', function (data) {
            //获取表单数据
            console.log(data.field);

            if (skuTableObj.getMode() == 0) {
                //单规格
                layer.alert(JSON.stringify(data.field), {title: '提交的数据'});
            } else {
                //多规格
                var state = Object.keys(data.field).some(function (item, index, array) {
                    return item.startsWith('skus');
                });
                state ? layer.alert(JSON.stringify(data.field), {title: '提交的数据'}) : layer.msg('sku表数据不能为空', {icon: 5, anim: 6});
            }

            return false;
        });
    });
</script>
</body>
</html>
```

