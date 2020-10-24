$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    var q = {
        pagenum: 1,
        pagesize: 1,
        cate_id: '',
        state: ''
    }
    initTable()
    initCate()

    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // layer.msg('获取文章列表成功')
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    template.defaults.imports.dataFormat = function(date) {
        var dt = new Date(date)

        var y = dt.getFullYear()
        var h = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var h = padZero(dt.getHours())
        var m = padZero(dt.getMinutes())
        var s = padZero(dt.getSeconds())

        return y + '-' + h + '-' + d + ' ' + h + ':' + m + ':' + s
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败')
                }
                // layer.msg('获取文章分类列表成功')
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', "skip"],
            limits: [1, 2, 5, 10],
            jump: function(obj, first) {
                // console.log(obj.curr);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }

    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length
        console.log(len);
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        })

    });

})