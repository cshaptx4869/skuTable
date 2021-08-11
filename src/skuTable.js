/*
 * Name: skuTable
 * Author: cshaptx4869
 * Project: https://github.com/cshaptx4869/skuTable
 */
layui.define(['jquery', 'form', 'upload', 'layer'], function (exports) {
    "use strict";
    var $ = layui.jquery,
        form = layui.form,
        upload = layui.upload,
        layer = layui.layer,
        MOD_NAME = 'skuTable';

    class SkuTable {
        options = {
            rowspan: true,
            skuIcon: '',
            uploadUrl: '',
            specCreateUrl: '',
            specValueCreateUrl: '',
            specData: [],
            skuData: {},
            skuTableConfig: {
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
                    {type: 'select', field: 'status', option: [{key: '启用', value: '1'}, {key: '禁用', value: '0'}], verify: '', reqtext: ''},
                ]
            }
        };

        constructor(options) {
            this.options = $.extend(this.options, options);
            this.renderSpecTable();
            this.renderSkuTable();
            this.listen();
        }

        listen() {
            var that = this;

            /**
             * 监听所选规格值的变化
             */
            form.on('checkbox(fairy-spec-filter)', function (data) {
                var specData = [];
                $.each($('.fairy-spec-table tbody tr'), function () {
                    var child = [];
                    $.each($(this).find('input[type=checkbox]'), function () {
                        child.push({id: $(this).val(), title: $(this).attr('title'), checked: $(this).is(':checked')});
                    });
                    var specItem = {id: $(this).find('td').eq(0).data('id'), title: $(this).find('td').eq(0).text(), child: child};
                    specData.push(specItem);
                });
                that.options.specData = specData;
                that.options.skuData = $.extend(that.options.skuData, that.getFormSkuData());
                that.renderSkuTable();
            });

            /**
             * 监听批量赋值
             */
            $(document).on('click', '.fairy-sku-table thead tr th i', function () {
                var thisI = this;
                layer.prompt({title: $(thisI).parent().text().trim() + '批量赋值'}, function (value, index, elem) {
                    $.each($('.fairy-sku-table tbody tr'), function () {
                        var index = that.options.rowspan ?
                            $(thisI).parent().index() - ($('.fairy-sku-table thead th.fairy-spec-name').length - $(this).children('td.fairy-spec-value').length) :
                            $(thisI).parent().index();
                        $(this).find('td').eq(index).children('input').val(value);
                    });
                    layer.close(index);
                });
            });

            /**
             * 监听添加规格
             */
            $(document).on('click', '.fairy-spec-table .fairy-spec-create', function () {
                layer.prompt({title: '规格'}, function (value, index, elem) {
                    that.request(
                        {type: 'post', url: that.options.specCreateUrl, data: {title: value}},
                        function (res) {
                            that.options.specData.push({id: res.data.id, title: value, child: []});
                            that.renderSpecTable();
                        });
                    layer.close(index);
                });
            });

            /**
             * 监听添加规格值
             */
            $(document).on('click', '.fairy-spec-table .fairy-spec-value-create', function () {
                var specId = $(this).parent('td').prev().data('id');
                layer.prompt({title: '规格值'}, function (value, index, elem) {
                    that.request(
                        {type: 'post', url: that.options.specValueCreateUrl, data: {spec_id: specId, title: value}},
                        function (res) {
                            that.options.specData.forEach(function (v, i) {
                                if (v.id == specId) {
                                    v.child.push({id: res.data.id, title: value, checked: false});
                                }
                            });
                            that.renderSpecTable();
                        });
                    layer.close(index);
                });
            });
        }

        /**
         * 渲染规格表
         */
        renderSpecTable() {
            var that = this, table = '<table class="layui-table fairy-spec-table"><thead><tr><th>规格名</th><th>规格值</th></tr></thead><tbody>';

            $.each(this.options.specData, function (index, item) {
                table += '<tr>';
                table += `<td data-id="${item.id}">${item.title}</td>`;
                table += '<td>';
                $.each(item.child, function (key, value) {
                    table += `<input type="checkbox" title="${value.title}" lay-filter="fairy-spec-filter" value="${value.id}" ${value.checked ? 'checked' : ''}>`;
                });
                that.options.specValueCreateUrl && (table += '<button type="button" class="layui-btn layui-btn-primary layui-border-blue layui-btn-sm fairy-spec-value-create"><i class="layui-icon layui-icon-addition"></i>规格值</button>');
                table += '</td>';
                table += '</tr>';
            });
            table += '</tbody>';

            this.options.specCreateUrl && (table += '<tfoot><tr><td colspan="2"><button type="button" class="layui-btn layui-btn-primary layui-border-blue layui-btn-sm fairy-spec-create"><i class="layui-icon layui-icon-addition"></i>规格</button></td></tr></tfoot>');

            table += '</table>';

            $('.fairy-spec-table').replaceWith(table);

            form.render();
        }

        /**
         * 渲染sku表
         */
        renderSkuTable() {
            var that = this, table = '<table class="layui-table fairy-sku-table">';

            if ($('.fairy-spec-table tbody input[type=checkbox]:checked').length) {
                var prependThead = [], prependTbody = [];
                $.each(this.options.specData, function (index, item) {
                    var isShow = item.child.some(function (value, index, array) {
                        return value.checked;
                    });
                    if (isShow) {
                        prependThead.push(item.title);
                        var prependTbodyItem = [];
                        $.each(item.child, function (key, value) {
                            if (value.checked) {
                                prependTbodyItem.push({id: value.id, title: value.title});
                            }
                        });
                        prependTbody.push(prependTbodyItem);
                    }
                });

                table += '<colgroup>' + '<col width="70">'.repeat(prependThead.length + 1) + '</colgroup>';

                table += '<thead>';
                if (prependThead.length > 0) {
                    var theadTr = '<tr>';

                    theadTr += prependThead.map(function (t, i, a) {
                        return '<th class="fairy-spec-name">' + t + '</th>';
                    }).join('');

                    this.options.skuTableConfig.thead.forEach(function (item) {
                        theadTr += '<th>' + item.title + (item.icon ? ' <i class="layui-icon ' + item.icon + '" style="cursor: pointer;" title="批量赋值"></i>' : '') + '</th>';
                    });

                    theadTr += '</tr>';

                    table += theadTr;
                }
                table += '</thead>';

                if (this.options.rowspan) {
                    var skuRowspanArr = [];
                    prependTbody.forEach(function (v, i, a) {
                        var num = 1, index = i;
                        while (index < a.length - 1) {
                            num *= a[index + 1].length;
                            index++;
                        }
                        skuRowspanArr.push(num);
                    });
                }

                var prependTbodyTrs = [];
                prependTbody.reduce(function (prev, cur, index, array) {
                    var tmp = [];
                    prev.forEach(function (a) {
                        cur.forEach(function (b) {
                            tmp.push({id: a.id + '-' + b.id, title: a.title + '-' + b.title});
                        })
                    });
                    return tmp;
                }).forEach(function (item, index, array) {
                    var tr = '<tr>';

                    tr += item.title.split('-').map(function (t, i, a) {
                        if (that.options.rowspan) {
                            if (index % skuRowspanArr[i] === 0 && skuRowspanArr[i] > 1) {
                                return '<td class="fairy-spec-value" rowspan="' + skuRowspanArr[i] + '">' + t + '</td>';
                            } else if (skuRowspanArr[i] === 1) {
                                return '<td class="fairy-spec-value">' + t + '</td>';
                            } else {
                                return '';
                            }
                        } else {
                            return '<td>' + t + '</td>';
                        }
                    }).join('');

                    that.options.skuTableConfig.tbody.forEach(function (c) {
                        switch (c.type) {
                            case "image":
                                tr += '<td><input type="hidden" name="skus[' + item.id + '][' + c.field + ']" value="' + (that.options.skuData[that.makeSkuName(item.id, c.field)] ? that.options.skuData[that.makeSkuName(item.id, c.field)] : c.value) + '" lay-verify="' + c.verify + '" lay-reqtext="' + c.reqtext + '"><img class="fairy-sku-img" style="cursor: pointer;" src="' + (that.options.skuData[that.makeSkuName(item.id, c.field)] ? that.options.skuData[that.makeSkuName(item.id, c.field)] : that.options.skuIcon) + '" alt="' + c.field + '图片"></td>';
                                break;
                            case "select":
                                tr += '<td><select name="skus[' + item.id + '][' + c.field + ']" lay-verify="' + c.verify + '" lay-reqtext="' + c.reqtext + '">';
                                c.option.forEach(function (o) {
                                    tr += '<option value="' + o.value + '" ' + (that.options.skuData[that.makeSkuName(item.id, c.field)] == o.value ? 'selected' : '') + '>' + o.key + '</option>';
                                });
                                tr += '</select></td>';
                                break;
                            case "input":
                            default:
                                tr += '<td><input type="text" name="skus[' + item.id + '][' + c.field + ']" value="' + (that.options.skuData[that.makeSkuName(item.id, c.field)] ? that.options.skuData[that.makeSkuName(item.id, c.field)] : c.value) + '" class="layui-input" lay-verify="' + c.verify + '" lay-reqtext="' + c.reqtext + '"></td>';
                                break;
                        }
                    });
                    tr += '</tr>';

                    tr && prependTbodyTrs.push(tr);
                });

                table += '<tbody>';
                if (prependTbodyTrs.length > 0) {
                    table += prependTbodyTrs.join('');
                }
                table += '</tbody>';

            } else {
                table += '<thead></thead><tbody></tbody>';
            }

            table += '</table>';

            $('.fairy-sku-table').replaceWith(table);

            form.render();

            upload.render({
                elem: '.fairy-sku-img',
                url: this.options.uploadUrl,
                exts: 'png|jpg|ico|jpeg|gif',
                accept: 'images',
                acceptMime: 'image/*',
                multiple: false,
                done: function (res) {
                    if (res.code === 200) {
                        var url = res.data.url;
                        $(this.item).attr('src', url).prev().val(url);
                        layer.msg(res.msg);
                    } else {
                        layer.msg(res.msg);
                    }
                    return false;
                }
            });
        }

        makeSkuName(value, field) {
            return 'skus[' + value + '][' + field + ']';
        }

        getSpecData() {
            return this.options.specData;
        }

        getFormFilter() {
            var fariyForm = $('form.fairy-form');
            if (!fariyForm.attr('lay-filter')) {
                fariyForm.attr('lay-filter', 'fairy-form-filter');
            }
            return fariyForm.attr('lay-filter');
        }

        getFormSkuData() {
            var skuData = {};
            $.each(form.val(this.getFormFilter()), function (key, value) {
                if (key.startsWith('skus')) {
                    skuData[key] = value;
                }
            });

            return skuData;
        }

        request(option, ok, no, ex) {
            option.type = option.type || 'get';
            option.url = option.url || '';
            option.data = option.data || {};
            option.statusName = option.statusName || 'code';
            option.statusCode = option.statusCode || 200;

            ok = ok || function (res) {
            };
            no = no || function (res) {
            };
            ex = ex || function (res) {
            };

            if (option.url == '') {
                layer.msg('请求地址不能为空', {icon: 2, time: 3000});
                return false;
            }

            $.ajax({
                url: option.url,
                type: option.type,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType: "json",
                data: option.data,
                timeout: 60000,
                success: function (res) {
                    if (res[option.statusName] == option.statusCode) {
                        return ok(res);
                    } else {
                        return no(res);
                    }
                },
                error: function (xhr, textstatus, thrown) {
                    ex(xhr);
                    return false;
                }
            });
        }
    }

    exports(MOD_NAME, {
        render: function (options) {
            return new SkuTable(options);
        }
    })
});