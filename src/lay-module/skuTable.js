/*
 * Name: skuTable
 * Author: cshaptx4869
 * Project: https://github.com/cshaptx4869/skuTable
 */
layui.define(['jquery', 'form', 'upload', 'layer', 'sortable'], function (exports) {
    "use strict";
    var $ = layui.jquery,
        form = layui.form,
        upload = layui.upload,
        layer = layui.layer,
        sortable = layui.sortable,
        MOD_NAME = 'skuTable';

    //工具类
    class Util {

        static config = {
            shade: [0.02, '#000'],
            time: 2000
        };

        static msg = {
            // 成功消息
            success: function (msg, callback = null) {
                return layer.msg(msg, {
                    icon: 1,
                    shade: Util.config.shade,
                    scrollbar: false,
                    time: Util.config.time,
                    shadeClose: true
                }, callback);
            },
            // 失败消息
            error: function (msg, callback = null) {
                return layer.msg(msg, {
                    icon: 2,
                    shade: Util.config.shade,
                    scrollbar: false,
                    time: Util.config.time,
                    shadeClose: true
                }, callback);
            },
            // 警告消息框
            alert: function (msg, callback = null) {
                return layer.alert(msg, {end: callback, scrollbar: false});
            },
            // 对话框
            confirm: function (msg, ok, no) {
                var index = layer.confirm(msg, {title: '操作确认', btn: ['确认', '取消']}, function () {
                    typeof ok === 'function' && ok.call(this);
                }, function () {
                    typeof no === 'function' && no.call(this);
                    Util.msg.close(index);
                });
                return index;
            },
            // 消息提示
            tips: function (msg, callback = null) {
                return layer.msg(msg, {
                    time: Util.config.time,
                    shade: Util.config.shade,
                    end: callback,
                    shadeClose: true
                });
            },
            // 加载中提示
            loading: function (msg, callback = null) {
                return msg ? layer.msg(msg, {
                    icon: 16,
                    scrollbar: false,
                    shade: Util.config.shade,
                    time: 0,
                    end: callback
                }) : layer.load(2, {time: 0, scrollbar: false, shade: Util.config.shade, end: callback});
            },
            // 输入框
            prompt: function (option, callback = null) {
                return layer.prompt(option, callback);
            },
            // 关闭消息框
            close: function (index) {
                return layer.close(index);
            }
        };

        static request = {
            post: function (option, ok, no, ex) {
                return Util.request.ajax('post', option, ok, no, ex);
            },
            get: function (option, ok, no, ex) {
                return Util.request.ajax('get', option, ok, no, ex);
            },
            ajax: function (type, option, ok, no, ex) {
                type = type || 'get';
                option.url = option.url || '';
                option.data = option.data || {};
                option.statusName = option.statusName || 'code';
                option.statusCode = option.statusCode || 200;
                ok = ok || function (res) {
                };
                no = no || function (res) {
                    var msg = res.msg == undefined ? '返回数据格式有误' : res.msg;
                    Util.msg.error(msg);
                    return false;
                };
                ex = ex || function (res) {
                };
                if (option.url == '') {
                    Util.msg.error('请求地址不能为空');
                    return false;
                }

                var index = Util.msg.loading('加载中');
                $.ajax({
                    url: option.url,
                    type: type,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    dataType: "json",
                    data: option.data,
                    timeout: 60000,
                    success: function (res) {
                        Util.msg.close(index);
                        if (res[option.statusName] == option.statusCode) {
                            return ok(res);
                        } else {
                            return no(res);
                        }
                    },
                    error: function (xhr, textstatus, thrown) {
                        Util.msg.error('Status:' + xhr.status + '，' + xhr.statusText + '，请稍后再试！', function () {
                            ex(xhr);
                        });
                        return false;
                    }
                });
            }
        };
    }

    class SkuTable {
        options = {
            specTableElemId: 'fairy-spec-table',
            skuTableElemId: 'fairy-sku-table',
            rowspan: false,
            skuIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjczN0RFNzU1MTk1RTExRTlBMEQ5OEEwMEM5NDNFOEE4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjczN0RFNzU2MTk1RTExRTlBMEQ5OEEwMEM5NDNFOEE4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzM3REU3NTMxOTVFMTFFOUEwRDk4QTAwQzk0M0U4QTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzM3REU3NTQxOTVFMTFFOUEwRDk4QTAwQzk0M0U4QTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5NHmJUAAAA+0lEQVR42pySPwsBYRzH7zk3KIP34CVIKSOrELLJdpuymyzew90kIwMZvACDsCldWZTFn5WQpPN5rlPXlXJ39en7/J57fn+fR9i2rYT5NNM0B2gC3n/6qHBQDMOwZNYg4LOQ3vcQld40/w6lC13Xbd/eHElC3G1JqL4DFWSNprz7BMpAFJ6YkW+jThaosuxAD/rY6R9lCmeq8IAmtKBA1A1OW9YjtIS9QvPYRZkcXo43EzqjF/mDQ5an7ALShTFk4eQOsgFTWeoNKl4nt68J0oYc1LHLbmtDp1IyLgPe4QCuMkIsyAWSuYbs5HD29DML8OTkHR9F2Ef+EWAAdwmkvBAtw94AAAAASUVORK5CYII=',
            uploadUrl: '',
            specCreateUrl: '',
            specCreateParams: {},
            specDeleteUrl: '',
            specValueCreateUrl: '',
            specValueDeleteUrl: '',
            specDataDelete: false,
            specData: [],
            specDataUrl: '',
            skuData: {},
            skuDataUrl: '',
            skuNameType: 0,
            skuNameDelimiter: '-',
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
                    {
                        type: 'select',
                        field: 'status',
                        option: [{key: '启用', value: '1'}, {key: '禁用', value: '0'}],
                        verify: '',
                        reqtext: ''
                    },
                ]
            }
        };

        constructor(options) {
            this.options = $.extend(this.options, options);
            if (this.options.specDataUrl) {
                Util.request.get({url: this.options.specDataUrl}, (res) => {
                    this.options.specData = res.data;
                    this.renderSpecTable();
                    if (this.options.skuDataUrl) {
                        Util.request.get({url: this.options.skuDataUrl}, (res) => {
                            this.options.skuData = res.data;
                            this.renderSkuTable();
                        });
                    } else {
                        this.renderSkuTable();
                    }
                });
            } else if (this.options.skuDataUrl) {
                this.renderSpecTable();
                Util.request.get({url: this.options.skuDataUrl}, (res) => {
                    this.options.skuData = res.data;
                    this.renderSkuTable();
                });
            } else {
                this.renderSpecTable();
                this.renderSkuTable();
            }

            this.css();
            this.listen();
        }

        css() {
            $('head').append(`<style>
                #${this.options.specTableElemId} tbody tr {
                  cursor: move;
                  transition:unset;
                  -webkit-transition:unset;
                }
                #${this.options.specTableElemId} tbody tr td:last-child > i.layui-icon-delete {
                  margin-right:15px;
                  margin-left:-12px;
                  vertical-align: top;
                }
                #${this.options.specTableElemId} tbody tr td div.fairy-spec-value-create,
                #${this.options.specTableElemId} tfoot tr td div.fairy-spec-create {
                  display: inline-block;
                  color: #1E9FFF;
                  vertical-align: middle;
                  padding: 4px 6px;
                }
                #${this.options.specTableElemId} tfoot tr td div.layui-form-checkbox {
                  margin-top: 0;
                }
                #${this.options.specTableElemId} tfoot tr td div.layui-form-checkbox > span{
                  color: #1E9FFF;
                }
                #${this.options.skuTableElemId} tbody tr td > img.fairy-sku-img{
                  width: 16px;
                  height: 16px;
                  padding: 6px;
                  border: 1px solid #eceef1;
                  vertical-align: middle;
                }
                #${this.options.specTableElemId} tbody tr td > i.layui-icon-delete,
                #${this.options.specTableElemId} tbody tr td div.fairy-spec-value-create,
                #${this.options.specTableElemId} tfoot tr td div.fairy-spec-create,
                #${this.options.skuTableElemId} thead tr th > i.layui-icon,
                #${this.options.skuTableElemId} tbody tr td > img.fairy-sku-img {
                  cursor: pointer;
                }
                </style>`
            );
        }

        listen() {
            var that = this;

            /**
             * 监听所选规格值的变化
             */
            form.on('checkbox(fairy-spec-filter)', function (data) {
                var specData = [];
                $.each($(`#${that.options.specTableElemId} tbody tr`), function () {
                    var child = [];
                    $.each($(this).find('input[type=checkbox]'), function () {
                        child.push({id: $(this).val(), title: $(this).attr('title'), checked: $(this).is(':checked')});
                    });
                    var specItem = {
                        id: $(this).find('td').eq(0).data('id'),
                        title: $(this).find('td').eq(0).text(),
                        child: child
                    };
                    specData.push(specItem);
                });
                that.options.specData = specData;
                that.options.skuData = $.extend(that.options.skuData, that.getFormSkuData());
                that.renderSkuTable();
            });

            /**
             * 监听批量赋值
             */
            $(document).on('click', `#${this.options.skuTableElemId} thead tr th i`, function () {
                var thisI = this;
                Util.msg.prompt({title: $(thisI).parent().text().trim() + '批量赋值'}, function (value, index, elem) {
                    $.each($(`#${that.options.skuTableElemId} tbody tr`), function () {
                        var index = that.options.rowspan ?
                            $(thisI).parent().index() - ($(`#${that.options.skuTableElemId} thead th.fairy-spec-name`).length - $(this).children('td.fairy-spec-value').length) :
                            $(thisI).parent().index();
                        $(this).find('td').eq(index).children('input').val(value);
                    });
                    Util.msg.close(index);
                });
            });

            /**
             * 监听添加规格
             */
            $(document).on('click', `#${this.options.specTableElemId} .fairy-spec-create`, function () {
                layer.prompt({title: '规格'}, function (value, index, elem) {
                    Util.request.post(
                        {url: that.options.specCreateUrl, data: {title: value, ...that.options.specCreateParams}},
                        function (res) {
                            that.options.specData.push({id: res.data.id, title: value, child: []});
                            that.renderSpecTable();
                        });
                    Util.msg.close(index);
                });
            });

            /**
             * 监听添加规格值
             */
            $(document).on('click', `#${this.options.specTableElemId} .fairy-spec-value-create`, function () {
                var specId = $(this).parent('td').prev().data('id');
                layer.prompt({title: '规格值'}, function (value, index, elem) {
                    Util.request.post(
                        {url: that.options.specValueCreateUrl, data: {spec_id: specId, title: value}},
                        function (res) {
                            that.options.specData.forEach(function (v, i) {
                                if (v.id == specId) {
                                    v.child.push({id: res.data.id, title: value, checked: false});
                                }
                            });
                            that.renderSpecTable();
                        });
                    Util.msg.close(index);
                });
            });

            /**
             * 监听删除规格/规格值
             */
            $(document).on('click', `#${this.options.specTableElemId} i.layui-icon-delete`, function () {
                if (typeof $(this).attr('data-spec-index') !== "undefined") {
                    if (that.options.specDeleteUrl) {
                        Util.request.post({
                            url: that.options.specDeleteUrl,
                            data: {id: that.options.specData[$(this).data('spec-index')]['id']}
                        }, function (res) {
                            that.options.specData.splice($(this).data('spec-index'), 1);
                            that.renderSpecTable();
                            that.renderSkuTable();
                        });
                    } else {
                        that.options.specData.splice($(this).data('spec-index'), 1);
                        that.renderSpecTable();
                        that.renderSkuTable();
                    }
                } else if (typeof $(this).attr('data-spec-value-index') !== "undefined") {
                    var [i, ii] = $(this).data('spec-value-index').split('-');
                    if (that.options.specValueDeleteUrl) {
                        Util.request.post({
                            url: that.options.specValueDeleteUrl,
                            data: {id: that.options.specData[i].child[ii].id}
                        }, function (res) {
                            that.options.specData[i].child.splice(ii, 1);
                            that.renderSpecTable();
                            that.renderSkuTable();
                        });
                    } else {
                        that.options.specData[i].child.splice(ii, 1);
                        that.renderSpecTable();
                        that.renderSkuTable();
                    }
                }
            });

            /**
             * 监听规格表是否开启删除
             */
            form.on('checkbox(fairy-spec-delete-filter)', function (data) {
                that.options.specDataDelete = data.elem.checked;
                if (data.elem.checked) {
                    $(`#${that.options.specTableElemId} tbody tr i.layui-icon-delete`).removeClass('layui-hide');
                } else {
                    $(`#${that.options.specTableElemId} tbody tr i.layui-icon-delete`).addClass('layui-hide')
                }
            });

            /**
             * 图片移入放大/移出恢复
             */
            var imgLayerIndex = null;
            $(document).on('mouseenter', '.fairy-sku-img', function () {
                imgLayerIndex = layer.tips('<img src="' + $(this).attr('src') + '" style="max-width:200px;"  alt=""/>', this, {
                    tips: [2, 'rgba(41,41,41,.5)'],
                    time: 0
                });
            }).on('mouseleave', '.fairy-sku-img', function () {
                layer.close(imgLayerIndex);
            })
        }

        /**
         * 渲染规格表
         */
        renderSpecTable() {
            var that = this,
                table = `<table class="layui-table" id="${this.options.specTableElemId}"><thead><tr><th>规格名</th><th>规格值</th></tr></thead><colgroup><col width="140"></colgroup><tbody>`;

            $.each(this.options.specData, function (index, item) {
                table += `<tr data-id="${item.id}">`;
                table += `<td data-id="${item.id}">${item.title} <i class="layui-icon layui-icon-delete layui-anim layui-anim-scale ${that.options.specDataDelete ? '' : 'layui-hide'}" data-spec-index="${index}"></i></td>`;
                table += '<td>';
                $.each(item.child, function (key, value) {
                    table += `<input type="checkbox" title="${value.title}" lay-filter="fairy-spec-filter" value="${value.id}" ${value.checked ? 'checked' : ''} /> <i class="layui-icon layui-icon-delete layui-anim layui-anim-scale ${that.options.specDataDelete ? '' : 'layui-hide'}" data-spec-value-index="${index}-${key}"></i> `;
                });
                that.options.specValueCreateUrl && (table += '<div class="fairy-spec-value-create"><i class="layui-icon layui-icon-addition"></i>规格值</div>');
                table += '</td>';
                table += '</tr>';
            });
            table += '</tbody>';

            table += '<tfoot><tr><td colspan="2">';
            table += `<input type="checkbox" title="开启删除" lay-skin="primary" lay-filter="fairy-spec-delete-filter" ${that.options.specDataDelete ? 'checked' : ''}/>`;
            if (this.options.specCreateUrl) {
                table += `<div class="fairy-spec-create"><i class="layui-icon layui-icon-addition"></i>规格</div>`;
            }
            table += '</td></tr></tfoot>';

            table += '</table>';

            $(`#${this.options.specTableElemId}`).replaceWith(table);

            form.render();

            /**
             * 拖拽
             */
            var sortableObj = sortable.create($(`#${this.options.specTableElemId} tbody`)[0], {
                animation: 1000,
                onEnd: (evt) => {
                    //获取拖动后的排序
                    var sortArr = sortableObj.toArray(),
                        sortSpecData = [];
                    this.options.specData.forEach((item) => {
                        sortSpecData[sortArr.indexOf(String(item.id))] = item;
                    });
                    this.options.specData = sortSpecData;
                    this.renderSkuTable();
                },
            });
        }

        /**
         * 渲染sku表
         */
        renderSkuTable() {
            var that = this, table = `<table class="layui-table" id="${this.options.skuTableElemId}">`;

            if ($(`#${this.options.specTableElemId} tbody input[type=checkbox]:checked`).length) {
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
                        theadTr += '<th>' + item.title + (item.icon ? ' <i class="layui-icon ' + item.icon + '"></i>' : '') + '</th>';
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
                            tmp.push({id: a.id + that.options.skuNameDelimiter + b.id, title: a.title + that.options.skuNameDelimiter + b.title});
                        })
                    });
                    return tmp;
                }).forEach(function (item, index, array) {
                    var tr = '<tr>';

                    tr += item.title.split(that.options.skuNameDelimiter).map(function (t, i, a) {
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
                                tr += '<td><input type="hidden" name="' + that.makeSkuName(item, c) + '" value="' + (that.options.skuData[that.makeSkuName(item, c)] ? that.options.skuData[that.makeSkuName(item, c)] : c.value) + '" lay-verify="' + c.verify + '" lay-reqtext="' + c.reqtext + '"><img class="fairy-sku-img" src="' + (that.options.skuData[that.makeSkuName(item, c)] ? that.options.skuData[that.makeSkuName(item, c)] : that.options.skuIcon) + '" alt="' + c.field + '图片"></td>';
                                break;
                            case "select":
                                tr += '<td><select name="' + that.makeSkuName(item, c) + '" lay-verify="' + c.verify + '" lay-reqtext="' + c.reqtext + '">';
                                c.option.forEach(function (o) {
                                    tr += '<option value="' + o.value + '" ' + (that.options.skuData[that.makeSkuName(item, c)] == o.value ? 'selected' : '') + '>' + o.key + '</option>';
                                });
                                tr += '</select></td>';
                                break;
                            case "input":
                            default:
                                tr += '<td><input type="text" name="' + that.makeSkuName(item, c) + '" value="' + (that.options.skuData[that.makeSkuName(item, c)] ? that.options.skuData[that.makeSkuName(item, c)] : c.value) + '" class="layui-input" lay-verify="' + c.verify + '" lay-reqtext="' + c.reqtext + '"></td>';
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

            $(`#${that.options.skuTableElemId}`).replaceWith(table);

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
                        Util.msg.success(res.msg);
                    } else {
                        var msg = res.msg == undefined ? '返回数据格式有误' : res.msg;
                        Util.msg.error(msg);
                    }
                    return false;
                }
            });
        }

        makeSkuName(sku, conf) {
            return 'skus[' + (this.options.skuNameType === 0 ? sku.id : sku.title) + '][' + conf.field + ']';
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

    }

    exports(MOD_NAME, {
        render: function (options) {
            return new SkuTable(options);
        }
    })
});
