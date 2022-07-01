# SkuTable 组件

## 简介

基于 Layui 的 SkuTable 组件。根据配置动态生成 sku 表。

**主要功能：**

- 规则/规格值可添加、删除
- 规格行允许拖拽排序
- SKU表同一列可批量赋值
- SKU表允许上传图片
- SKU表相同属性值可开启合并行



## 效果

在线体验地址：

- [JQ22](https://www.jq22.com/yanshi23988) 
- [GitHub](https://cshaptx4869.github.io/mypage/skuTable/v1/skuTable.html)（优先更新!）

![](https://s3.bmp.ovh/imgs/2021/12/ca228dbe3f5caa9c.png)



![](https://s3.bmp.ovh/imgs/2021/12/a1e44e7893b29251.gif)



## SQL参考

**商品表：**

```sql
CREATE TABLE `product` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL COMMENT '商品标题' COLLATE 'utf8mb4_unicode_ci',
	`cover` VARCHAR(100) NULL DEFAULT '' COMMENT '封面图' COLLATE 'utf8mb4_unicode_ci',
	`category_id` INT(11) UNSIGNED NOT NULL COMMENT '分类id',
	`sketch` VARCHAR(200) NULL DEFAULT '' COMMENT '简述' COLLATE 'utf8mb4_unicode_ci',
	`intro` TEXT NOT NULL COMMENT '商品描述' COLLATE 'utf8mb4_unicode_ci',
	`keywords` VARCHAR(200) NULL DEFAULT '' COMMENT '商品关键字' COLLATE 'utf8mb4_unicode_ci',
	`tags` VARCHAR(200) NULL DEFAULT '' COMMENT '标签' COLLATE 'utf8mb4_unicode_ci',
	`sales` INT(11) NOT NULL DEFAULT '0' COMMENT '虚拟购买量',
	`real_sales` INT(10) NOT NULL DEFAULT '0' COMMENT '实际销量',
	`total_sales` INT(11) NULL DEFAULT '0' COMMENT '总销量',
	`price` DECIMAL(8,2) NOT NULL COMMENT '商品价格',
	`market_price` DECIMAL(8,2) NULL DEFAULT '0.00' COMMENT '市场价格',
	`cost_price` DECIMAL(19,2) NULL DEFAULT '0.00' COMMENT '成本价',
	`stock` INT(11) NOT NULL DEFAULT '0' COMMENT '库存量',
	`warning_stock` INT(11) NOT NULL DEFAULT '0' COMMENT '库存警告',
	`covers` TEXT NOT NULL COMMENT '幻灯片' COLLATE 'utf8mb4_unicode_ci',
	`is_attribute` ENUM('0','1') NULL DEFAULT '0' COMMENT '启用商品规格' COLLATE 'utf8mb4_unicode_ci',
	`min_buy` INT(11) NOT NULL DEFAULT '1' COMMENT '最少买几件',
	`max_buy` INT(11) NOT NULL DEFAULT '0' COMMENT '限购 0 不限购',
	`view` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '商品点击数量',
	`star` INT(10) UNSIGNED NOT NULL DEFAULT '5' COMMENT '好评星级',
	`collect_num` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '收藏数量',
	`comment_num` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '评价数',
	`transmit_num` INT(11) NOT NULL DEFAULT '0' COMMENT '分享数',
	`is_stock_visible` INT(1) NOT NULL DEFAULT '1' COMMENT '库存显示 0不显示1显示',
	`is_hot` INT(1) NOT NULL DEFAULT '0' COMMENT '是否热销商品',
	`is_recommend` INT(1) NOT NULL DEFAULT '0' COMMENT '是否推荐',
	`is_new` INT(1) NOT NULL DEFAULT '0' COMMENT '是否新品',
	`sale_date` INT(11) NULL DEFAULT '0' COMMENT '上下架时间',
	`unit` VARCHAR(20) NULL DEFAULT '' COMMENT '商品单位' COLLATE 'utf8mb4_unicode_ci',
	`video_url` VARCHAR(100) NULL DEFAULT '' COMMENT '展示视频' COLLATE 'utf8mb4_unicode_ci',
	`supplier_id` INT(11) NULL DEFAULT '0' COMMENT '供货商id',
	`is_open_commission` TINYINT(4) NULL DEFAULT '0' COMMENT '是否支持分销',
	`sort` INT(11) NOT NULL DEFAULT '999' COMMENT '排序',
	`status` TINYINT(4) NULL DEFAULT '1' COMMENT '商品状态 0下架，1正常，10违规（禁售）',
	`state` TINYINT(4) NOT NULL DEFAULT '0' COMMENT '审核状态 -1 审核失败 0 未审核 1 审核成功',
	`create_time` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
	`update_time` INT(10) UNSIGNED NULL DEFAULT '0' COMMENT '更新时间',
	`delete_time` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`id`),
	INDEX `price` (`price`),
	INDEX `cate_id` (`category_id`),
	INDEX `view` (`view`),
	INDEX `star` (`star`),
	INDEX `comment_num` (`comment_num`),
	INDEX `sort` (`sort`)
) COMMENT='商品表' COLLATE='utf8mb4_general_ci' ENGINE=InnoDB;
```

**规格表：**

```sql
CREATE TABLE `product_spec` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`product_id` INT(11) NOT NULL COMMENT '商品id',
	`title` VARCHAR(125) NOT NULL DEFAULT '' COMMENT '规格名称' COLLATE 'utf8mb4_unicode_ci',
	`create_time` INT(10) UNSIGNED NULL DEFAULT '0' COMMENT '创建时间',
	`update_time` INT(10) UNSIGNED NULL DEFAULT '0' COMMENT '修改时间',
	PRIMARY KEY (`id`),
	INDEX `product_id` (`product_id`)
) COMMENT='商品规格表' COLLATE='utf8mb4_general_ci' ENGINE=InnoDB;
```

**规格值表：**

```sql
CREATE TABLE `product_spec_value` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`product_id` INT(11) NOT NULL COMMENT '商品id',
	`spec_id` INT(11) NOT NULL COMMENT '规格id',
	`title` VARCHAR(125) NOT NULL DEFAULT '' COMMENT '规格值标题' COLLATE 'utf8mb4_unicode_ci',
	`is_checked` TINYINT(4) NOT NULL DEFAULT '0' COMMENT '是否选中',
	`create_time` INT(10) UNSIGNED NULL DEFAULT '0' COMMENT '创建时间',
	`update_time` INT(10) UNSIGNED NULL DEFAULT '0' COMMENT '修改时间',
	PRIMARY KEY (`id`)
) COMMENT='商品规格值表' COLLATE='utf8mb4_general_ci' ENGINE=InnoDB;
```

**SKU表：**

```sql
CREATE TABLE `product_sku` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`product_id` INT(11) UNSIGNED NULL DEFAULT '0' COMMENT '商品id',
	`name` VARCHAR(600) NULL DEFAULT '' COMMENT 'sku名称 如:红-S-男款' COLLATE 'utf8mb4_unicode_ci',
	`picture` VARCHAR(200) NULL DEFAULT '' COMMENT '主图' COLLATE 'utf8mb4_unicode_ci',
	`price` DECIMAL(8,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
	`market_price` DECIMAL(8,2) NOT NULL DEFAULT '0.00' COMMENT '市场价格',
	`cost_price` DECIMAL(8,2) NOT NULL DEFAULT '0.00' COMMENT '成本价',
	`wholesale_price` DECIMAL(10,2) UNSIGNED NULL DEFAULT '0.00' COMMENT '拼团价格',
	`stock` INT(11) NOT NULL DEFAULT '0' COMMENT '库存',
	`code` VARCHAR(100) NULL DEFAULT '' COMMENT '商品编码' COLLATE 'utf8mb4_unicode_ci',
	`barcode` VARCHAR(100) NULL DEFAULT '' COMMENT '商品条形码' COLLATE 'utf8mb4_unicode_ci',
	`product_weight` DECIMAL(8,2) NULL DEFAULT '0.00' COMMENT '商品重量',
	`product_volume` DECIMAL(8,2) NULL DEFAULT '0.00' COMMENT '商品体积',
	`sort` INT(11) NULL DEFAULT '1999' COMMENT '排序',
	`data` VARCHAR(300) NULL DEFAULT '' COMMENT 'sku串 如:1-4-8' COLLATE 'utf8mb4_unicode_ci',
	`status` TINYINT(4) NULL DEFAULT '1' COMMENT '状态[-1:删除;0:禁用;1启用]',
	`create_time` INT(10) UNSIGNED NULL DEFAULT '0' COMMENT '创建时间',
	`update_time` INT(10) UNSIGNED NULL DEFAULT '0' COMMENT '更新时间',
	PRIMARY KEY (`id`),
	INDEX `product_id` (`product_id`)
) COMMENT='商品sku表' COLLATE='utf8mb4_general_ci' ENGINE=InnoDB;
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

<div class="layui-container">
    <form action="" class="layui-form fairy-form">
        <!-- 规格类型 -->
        <div id="fairy-is-attribute"></div>
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
    }).use(['form', 'skuTable'], function () {
        var form = layui.form, skuTable = layui.skuTable;

        //注意！！！ 注意！！！ 注意！！！
        //如果配置了相关接口请求的参数，请置本示例于服务器中预览，不然会有浏览器跨域问题
        //示例中的json文件仅做格式返回参考，若多次执行添加规格后再为新增后的规格添加规格值，会发现所有新增的规格都增加了该规格值。注意！此处并非是bug，原因是因为示例中返回的新增规格值id是重复的，而在正常接口请求每次返回的新增规则id是不一样的
        var obj = skuTable.render({
            //规格类型 0统一规格 1多规格
            isAttributeValue: 0,
            //规格类型容器id
            isAttributeElemId: 'fairy-is-attribute',
            //规格表容器id
            specTableElemId: 'fairy-spec-table',
            //sku表容器id
            skuTableElemId: 'fairy-sku-table',
            //规格拖拽排序
            sortable: true,
            //sku表相同属性值是否合并行
            rowspan: true,
            //请求成功返回状态码值
            requestSuccessCode: 200,
            //上传接口地址
            //接口要求返回格式参考 upload.json
            uploadUrl: './json/upload.json',
            //统一规格配置项
            singleSkuTableConfig: {
                thead: [
                    {title: '销售价(元)', icon: 'layui-icon-cols'},
                    {title: '市场价(元)', icon: 'layui-icon-cols'},
                    {title: '成本价(元)', icon: 'layui-icon-cols'},
                    {title: '库存', icon: 'layui-icon-cols'},
                    {title: '状态', icon: ''},
                ],
                tbody: [
                    {type: 'input', field: 'price', value: '', verify: 'required|number', reqtext: '销售价不能为空'},
                    {type: 'input', field: 'market_price', value: '0', verify: 'required|number', reqtext: '市场价不能为空'},
                    {type: 'input', field: 'cost_price', value: '0', verify: 'required|number', reqtext: '成本价不能为空'},
                    {type: 'input', field: 'stock', value: '0', verify: 'required|number', reqtext: '库存不能为空'},
                    {type: 'select', field: 'status', option: [{key: '启用', value: '1'}, {key: '禁用', value: '0'}], verify: 'required', reqtext: '状态不能为空'},
                ]
            },
            //多规格配置项
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
                    {type: 'input', field: 'price', value: '', verify: 'required|number', reqtext: '销售价不能为空'},
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
            //商品id 配合specDataUrl和skuDataUrl使用
            productId: '',
            //规格数据, 一般从后台获取
            specData: [
                {
                    id: "1",
                    title: "颜色",
                    child: [
                        {id: "1", title: "红", checked: true},
                        {id: "2", title: "黄", checked: false},
                        {id: "3", title: "蓝", checked: false}
                    ]
                }, {
                    id: "2",
                    title: "尺码",
                    child: [
                        {id: "4", title: "S", checked: true},
                        {id: "5", title: "M", checked: true},
                        {id: "6", title: "L", checked: false},
                        {id: "7", title: "XL", checked: false}
                    ]
                }, {
                    id: "3",
                    title: "款式",
                    child: [
                        {id: "8", title: "男款", checked: true},
                        {id: "9", title: "女款", checked: true}
                    ]
                }
            ],
            //获取规格数据接口地址，如果为空或者不配置则使用 specData 参数配置
            //接口要求返回格式参考 specData.json
            // specDataUrl: './json/specData.json',
            //sku数据
            //新增的时候为空对象
            //编辑的时候可以从后台接收，会自动填充sku表，可以去掉注释看效果
            //多规格格式
            // skuData: {
            //     "skus[1-4-8][picture]": "https://www.baidu.com/img/flexible/logo/pc/result.png",
            //     "skus[1-4-8][price]": "100",
            //     "skus[1-4-8][market_price]": "200",
            //     "skus[1-4-8][cost_price]": "50",
            //     "skus[1-4-8][stock]": "18",
            //     "skus[1-4-8][status]": "0",
            //     "skus[1-4-9][picture]": "",
            //     "skus[1-4-9][price]": "0",
            //     "skus[1-4-9][market_price]": "0",
            //     "skus[1-4-9][cost_price]": "0",
            //     "skus[1-4-9][stock]": "0",
            //     "skus[1-4-9][status]": "1",
            //     "skus[1-5-8][picture]": "",
            //     "skus[1-5-8][price]": "0",
            //     "skus[1-5-8][market_price]": "0",
            //     "skus[1-5-8][cost_price]": "0",
            //     "skus[1-5-8][stock]": "0",
            //     "skus[1-5-8][status]": "1",
            //     "skus[1-5-9][picture]": "",
            //     "skus[1-5-9][price]": "0",
            //     "skus[1-5-9][market_price]": "0",
            //     "skus[1-5-9][cost_price]": "0",
            //     "skus[1-5-9][stock]": "0",
            //     "skus[1-5-9][status]": "1"
            // },
            //统一规格格式
            // skuData: {
            //     'price': '80',
            //     'market_price': '100',
            //     'cost_price': '60',
            //     'stock': '999',
            //     'status': '0',
            // }
            //获取SKU数据接口地址，如果为空或者不配置则使用skuData配置
            //接口要求返回格式参考 skuData.json
            // skuDataUrl: './json/skuData.json',
        });

        form.on('submit(submit)', function (data) {
            //获取表单数据
            console.log(data.field);

            if (data.field.is_attribute == 1) {
                //获取规格数据
                console.log(obj.getSpecData());

                var state = Object.keys(data.field).some(function (item, index, array) {
                    return item.startsWith('skus');
                });
                state ? layer.alert(JSON.stringify(data.field), {title: '提交的数据'}) : layer.msg('sku表数据不能为空', {icon: 5, anim: 6});
            } else {
                layer.alert(JSON.stringify(data.field), {title: '提交的数据'});
            }

            return false;
        });
    });
</script>
</body>
</html>
```

