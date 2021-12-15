# SkuTable 组件

## 简介

基于 Layui 的商品规格组件。

**主要功能：**

- 规则/规格值可添加、删除
- 规格行允许拖拽排序
- SKU表同一列可批量赋值
- SKU表允许上传图片
- SKU表相同属性值可开启合并行



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

