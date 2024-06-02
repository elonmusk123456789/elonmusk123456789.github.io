var frameUi_vueExtend = window.frameUi_vueExtend || {};
if (window.SparkMD5 == undefined) {
    document.write("<script src=\"/FrameUi/1.0/spark-md5.js\"></script>");
}
Vue.mixin({
    data:function(){
        //抽屉公共属性
        return {
            drawerConfig: { show: false, title: "",modal:true,url: "",loading: true, size: "94%" },
        }
    },
    methods: {
        //抽屉回调
        openDrawerCallBack: function () {
            var _this = this;
            _this.drawerConfig.loading = false;
        },
        //抽屉公共方法
        openDrawer: function (config) {
            var _this = this;
            _this.drawerConfig.loading = true;
            this.drawerConfig.url = config.url;
            this.drawerConfig.show = true;
            this.drawerConfig.title = config.title;
        },
        //抽屉公共方法
        closeDrawer: function (refreshList) {
            parent.vue.drawerConfig.show = false;
            if (refreshList) {
                try {
                    parent.vue.loadData();
                }
                catch (err) {
                    console.log(err);
                }
            }
        },
        //弹出窗口
        dialog: function (options) {
            var vue = this;
            var defaultParams = { title: "标题", url: "", data: {}, additionals: "", width: "100%", height: "100%", target: 'self', beforeExecute: "", shadeClose: true };
            defaultParams = extend(defaultParams, options);
            var canExecuting = true;
            var beforeExecute = defaultParams.beforeExecute;
            try {
                if (typeof (beforeExecute) == "string") {
                    if (beforeExecute != "") {
                        canExecuting = eval(beforeExecute);
                    }
                }
                else if (typeof (beforeExecute) == "function") {
                    canExecuting = beforeExecute();
                }
            }
            catch (err) {
                canExecuting = false;
                console.log(err)
            }
            if (canExecuting == false) { return; }
            frameUi_ui.dialog(defaultParams);
        },
        ajax: function (options) {
            var loadingInstance = this.$loading();
            var completeFun = options.complete;
            options.complete = function () {
                if (completeFun != undefined && typeof (completeFun) == "function") {
                    completeFun();
                }
                loadingInstance.close();
            };
            return ajax(options);
        },
        submit:function (options) {
            var defaultParams = { type: "post", contentType: "application/x-www-form-urlencoded;charset=utf-8", url: "", data: {}, async: true, beforeExecute: "", beforeRequest: "", success: "", failTipsType: "notification", failCallback: "", showSuccessMsg: true, showFailMsg: true, confirmMsg: "", successMsg: "提交成功！", cancel: false, cancelMsg: "提交被取消" };
            defaultParams = extend(defaultParams, options);
            var confirmMsg = defaultParams.confirmMsg;
            var successMsg = defaultParams.successMsg;
            var async = defaultParams.async;
            var beforeExecute = defaultParams.beforeExecute;
            var beforeRequest = defaultParams.beforeRequest;
            var successCallback = defaultParams.success;
            var failCallBack = defaultParams.failCallback;
            var ajaxUrl = defaultParams.url;
            var showSuccessMsg = defaultParams.showSuccessMsg;
            var showFailMsg = defaultParams.showFailMsg;
            var failTipsType = defaultParams.failTipsType; //提交返回失败后的错误提示方式，采用Notification组件或Message组件方式
            var canExecuting = true;
            var data = defaultParams.data;
            var cancel = defaultParams.cancel;
            var vue = this;
            if (cancel) {
                vue.$notify({
                    title: '提示',
                    message: defaultParams.cancelMsg,
                    type: 'warning'
                });
                return;
            }
            if (ajaxUrl == "") {
                alert("url参数未设置!")
            }
            try {
                if (typeof (beforeExecute) == "string") {
                    if (beforeExecute != "") {
                        canExecuting = eval(beforeExecute);
                    }

                }
                else if (typeof (beforeExecute) == "function") {
                    canExecuting = beforeExecute();
                }
            }
            catch (err) {
                console.log(err)
            }

            if (canExecuting == false) { return; }

            if (confirmMsg != "") {

                vue.$confirm(confirmMsg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action, instance) {
                        switch (action) {
                            case "confirm":
                                request();
                                break;
                            case "cancel":
                                break;
                            case "close":
                                break;
                        }
                    }
                })
            }
            else {
                request();
            }

            function request() {
                try {
                    if (typeof (beforeRequest) == "string") {
                        if (beforeRequest != "") {
                            canExecuting = eval(beforeRequest);
                        }
                    }
                    else if (typeof (beforeRequest) == "function") {
                        canExecuting = beforeRequest();
                    }
                }
                catch (err) {
                    console.log(err)
                }
                if (canExecuting == false) { return; }

                var callBack = function (data) {
                    try {
                        if (typeof (successCallback) == "string") {
                            if (successCallback != "") {
                                eval(successCallback);
                            }
                        }
                        else if (typeof (successCallback) == "function") {
                            successCallback.call(vue, data);
                        }
                    }
                    catch (err) {
                        console.log(err)
                    }
                }
                var notifyCallBack = function (data) {
                    if (typeof (data) != "object") {
                        data = jsonParse(data);
                    }
                    if (data.State == 1) {
                        var delayCallBack = 600;
                        if (showSuccessMsg) {
                            if (successMsg != "") {
                                successMsg = successMsg;
                            }
                            else if (data.Msg != "") {
                                successMsg = data.Msg;
                            }
                            vue.$notify({
                                title: '成功',
                                message: successMsg,
                                type: 'success',
                                position: 'top-right'
                            });
                            setTimeout(function () { callBack(data); }, delayCallBack);
                        }
                        else {
                            callBack(data);
                        }
                    }
                    else {
                        if (data.Msg != "" && showFailMsg) {
                            if (failTipsType == "notification") {
                                vue.$notify({
                                    title: '提示',
                                    message: data.Msg,
                                    type: 'error',
                                    position: 'top-left'
                                });
                            }
                            else {
                                vue.$message.error(data.Msg);
                            }

                        }
                        try {
                            if (typeof (failCallBack) == "string") {
                                if (failCallBack != "") {
                                    eval(failCallBack);
                                }
                            }
                            else if (typeof (failCallBack) == "function") {
                                failCallBack(data);
                            }
                        }
                        catch (err) {
                            console.log(err)
                        }
                    }
                }
                var error = function () {
                    vue.$message.error("ajax http请求错误，请联系管理员处理！")
                }
                var ajaxOptions = { type: defaultParams.type, contentType: defaultParams.contentType, url: ajaxUrl, data: data, async: async, error: error, success: function (data) { notifyCallBack(data); } }
                vue.ajax(ajaxOptions);
            }
        },
    }
})
//列表页外部的常用全局方法
var dataListExternal = {
    methods: {
        //对集合进行排序，支持多级数据集
        updateXuhao: function (options) {
            var defaultParams = { type: "", url: "", row: {}, dataList: [], keyField: "Id", sortField: "Xuhao", parentIdField: "ParentId", childrenField: "Children" };
            defaultParams = extend(defaultParams, options);
            var vue = this;
            var type = defaultParams.type;
            var url = defaultParams.url;
            var row = defaultParams.row;
            var dataList = defaultParams.dataList;
            //console.log(dataList)
            var sortField = defaultParams.sortField;
            var childrenField = defaultParams.childrenField;
            var keyField = defaultParams.keyField;
            var parentIdField = defaultParams.parentIdField;
            var id = row[keyField];
            var parentId = row[parentIdField];//获取当前行的父级id
            var prevIndex = 0;
            var nextIndex = 0;
            var currentIndex = 0;
            var newDataList = []; //构造一个新的数组,用于传输到后台，默认的数据属性太多没有必要都传递到后台去
            //列表序号对调
            var startSort = function (dataList) {
                newDataList = [];
                //1、先整理顺序
                dataList.forEach(function (item, index) {
                    var i = index + 1;
                    var currentParentId = item[parentIdField];
                    if (currentParentId == parentId)//同一级的数据才进行处理
                    {
                        item[sortField] = i;
                        if (item[keyField] == id) {
                            prevIndex = i - 1;
                            currentIndex = i;
                            nextIndex = i + 1;
                        }
                    }
                });
                //2、再进行顺序对调
                dataList.forEach(function (item, index) {
                    var i = index + 1;
                    var currentParentId = item[parentIdField];
                    if (currentParentId == parentId)//同一级的数据才进行处理
                    {
                        switch (type) {
                            case "-":
                            case "up":
                            case -1:
                                if (prevIndex == i) {
                                    item[sortField] = i + 1;
                                }
                                if (currentIndex == i && i > 1) {
                                    item[sortField] = i - 1;
                                }
                                break;
                            case "+":
                            case "down":
                            case 1:
                                if (currentIndex == i && i < dataList.length) {
                                    item[sortField] = i + 1;
                                }
                                if (nextIndex == i) {
                                    item[sortField] = i - 1;
                                }
                                break;
                        }
                        //重构减少http传输
                        var newRow = {}
                        newRow[keyField] = item[keyField];
                        newRow[sortField] = item[sortField]
                        newDataList.push(newRow);
                        index++;
                    }
                });
            }

            //对列表进行顺序排序
            var reSort = function (dataList, sortField, nodeField) {

                if (sortField == undefined) {
                    sortField = "Xuhao"; //默认序号字段
                }
                if (nodeField == undefined) {
                    nodeField = "Children"; //默认节点字段
                }

                dataList.sort(function (a, b) { return a[sortField] - b[sortField] });//1级排序
                //树形数据继续对数据进行递归排序
                dataList.some(function (item) {
                    if (parentId == item[parentIdField]) { //第一级或默认只有一级的情况
                        newDataList = dataList; //新的数组，提交到服务器进行更新的数据
                        return true;
                    }
                    else //第一级找不到继续往下找
                    {
                        var childrenList = item[nodeField];
                        if (Array.isArray(childrenList)) {
                            reSort(childrenList, sortField, nodeField); //递归排序
                        }
                    }
                });
            };

            if (type != "0" && type != "") {
                reSort(dataList, sortField, childrenField);
                startSort(newDataList);
            }

            reSort(dataList, sortField, childrenField);
            //console.log(dataList)
            vue.submit({ url: url, data: { data: JSON.stringify(newDataList) }, showSuccessMsg: false })

        },
        //获取选中列表的属性值，不填写属性默认读取Id
        getSelectedPropertys: function (selectedItem, prop) {
            if (!Array.isArray(selectedItem)) {
                throw "getSelectedPropertys的第2个参数必须是数组"
            }
            if (prop == undefined) {
                prop = "Id";
            }
            var props = [];
            selectedItem.map(function (item, index, ary) {
                if (item[prop] != undefined) {
                    props.push(item[prop]);
                }
            })
            return props.join();
        },
        //回调方法,设置列表页选中项目的属性
        setSelectedItem: function (dataList, selectedItems, setProperty, setValue) {
            var vue = this;
            var selectedItem = [];
            if (!Array.isArray(deleteItems)) {
                selectedItem.push(deleteItems);
            }
            else {
                selectedItem = deleteItems;
            }
            var selectedIds = [];
            selectedItems.forEach(function (item) {
                selectedIds.push(item[key]);
            });
            dataList.forEach(function (item, index) {
                if (selectedIds.indexOf(item[key]) >= 0) {
                    item[setProperty] = setValue;
                }
                else {
                    vue.$set(item, setProperty, setValue);
                }
            });
        },

        //删除列表项目的方法
        deleteItem: function (dataList, deleteItems, key) {
            if (key == undefined) {
                key = "Id";
            }
            var vue = this;
            var selectedItem = [];
            if (!Array.isArray(deleteItems)) {
                selectedItem.push(deleteItems);
            }
            else {
                selectedItem = deleteItems;
            }
            var selectedIds = [];
            selectedItem.forEach(function (item) {
                selectedIds.push(item[key]);
            });
            dataList.forEach(function (item, index) {
                if (selectedIds.indexOf(item[key]) >= 0) {
                    dataList.splice(index, 1);
                }
                if (item.Children != undefined) {
                    vue.deleteItem(item.Children, deleteItems);
                }
            });
        },

        //设置前的检测选中项目
        checkSelectedItems: function (selectedItem) {
            if (selectedItem.length == 0) {
                vue.$message.error("请选择要操作的项!")
                return false;
            }
            return true;
        }
    }
};
Vue.mixin(dataListExternal);

//百度编辑器
Vue.component("ui-editor", {
    props: {
        value: { default: "" },
        maxLength: { type: Number, default: 0 },
        action: { type: String, default: "/E/EditorUploadApi/", required: false },
        toolbars: { type: String, default: "normal", required: false },
        height: { type: Number, default: 300 },
        config: { type: Object, default: function () { return {} }, required: false },
        data: { type: Object, default: function () { return { guid:"",watermark:-1,maxImageWidth:0,fieldName:"", tableName:"", fieldName:""} }, required: true },
    },
    data: function () {
        return {
            instanceId: "ueditorObject",
            content: this.value,
            ueditor: {},
        }
    },
    methods: {
        reset: function () { //编辑器重置为可视化模式，源码模式下修改无法获取到修改的内容
            if (this.ueditor.queryCommandState('source') != 0) {
                this.ueditor.execCommand('source');
                vue.content = ueditor.getContent();
                vue.$emit("input", vue.content);
            }
        }
    },
    created: function () {
        if (window["ueditorInstanceNums"] == undefined) {
            window["ueditorInstanceNums"] = 1;
        }
        else {
            window["ueditorInstanceNums"] = window["ueditorInstanceNums"] + 1;
        }
        this.instanceId = "ueditorObject" + window["ueditorInstanceNums"];
    },
    mounted: function () {
        var vue = this;
        var defaultConfig = {
            autoHeightEnabled: false,
            serverUrl: vue.action,
            initialFrameWidth: null,
            initialFrameHeight: vue.height,  //初始化编辑器高度,默认320
            toolbars: _UeditorZdyConfig[vue.toolbars]
        };
        var config = extend(vue.config, defaultConfig);
        vue.ueditor = UE.getEditor(vue.instanceId, config);
        var ueditor = vue.ueditor;
        ueditor.ready(function () {
            ueditor.execCommand("serverparam", vue.data);
            ueditor.addListener('blur', function () {
                vue.content = ueditor.getContent();
                var currentLength = vue.content.strLength();
                if (vue.maxLength > 0 && currentLength > vue.maxLength) {
                    vue.content = vue.content.left(vue.maxLength);
                    ueditor.setContent(vue.content);
                }
                vue.$emit("input", vue.content);
            });
        });
    },
    template: '<textarea ref="editor" :id="instanceId" :name="instanceId" v-model="content"></textarea>'
});


//Id转文本组件
Vue.component("el-input-convert", {
    props: {
        convertUrl: { type: String, default: "", required: false },
        value: {//v-mode传递进来，内部不需要需用
            type: Number | undefined,
            default: 0,
            required: false
        },
        clearable: {
            type: Boolean,
            default: false,
            required: false
        },
    },
    data: function () {
        return {
            name: "",
        }
    },
    methods: {
        getName: function () {
            var vue = this;
            var data = this.serverData;
            var defaultOptions = { async: true, type: "get", url: this.convertUrl, data: data, cache: true };
            defaultOptions = extend(defaultOptions, this.config);
            defaultOptions.success = function (data) {
                if (data.Name != null && data.Name != undefined) {
                    vue.name = data.Name;
                }
            };
            if (defaultOptions.url == "") {
                return;
            }
            vue.ajax(defaultOptions);
        },
        clearName: function () {
            var vue = this;
            vue.name = "";
            vue.$emit('input', 0)
        }
    },
    watch: {
        convertUrl: {
            handler: function (newName, oldName) {
                if (newName != oldName) {
                    this.getName();
                }
            },
            immediate: true,
            deep: true
        },
    },
    template: '<el-input :value="name" v-bind="$attrs" v-on:clear="clearName" :clearable="clearable" :readonly="!clearable"><template slot="append"><slot></slot></template></el-input>'
});


//ui-page-panel
Vue.component("ui-page-panel", {
    props: {
        value: {
            type: Object,
            default: function () { return {} },
            required: false
        },
    },
    data: function () {
        return {
            pageInfo: this.value
        }
    },
    watch: {
        value: function (newValue, oldValue) {
            this.pageInfo = newValue;
        }
    },
    methods: {
        goPage: function (page) {
            if (page != undefined) {
                this.pageInfo.CurrentPage = page;
            }
            this.$emit("input", this.pageInfo);
            this.$emit("change");
        },
        changePageSize: function () {
            this.pageInfo.CurrentPage = 1;
            this.$emit("input", this.pageInfo);
            this.$emit("change");
        },

    },
    computed: {
        pageItem: function () {
            var pageItem = [];
            var pageInfo = this.pageInfo;
            var currentPage = pageInfo.CurrentPage;
            var recordCount = pageInfo.RecordCount;
            if (recordCount == 0) {
                return [{ value: 1, text: "第1页" }];
            }
            var pageSize = pageInfo.PageSize;
            var pageCount = 1;
            if (recordCount % pageSize > 0) {
                pageCount = Math.floor(recordCount / pageSize) + 1;
            }
            else {
                pageCount = recordCount / pageSize;
            }
            if (currentPage > pageCount) {
                currentPage = pageCount;
            }
            pageInfo.PageCount = pageCount;
            var startpage = currentPage - 10;
            if (startpage < 1) {
                startpage = 1;
            }
            var endpage = currentPage + 10;
            if (endpage >= pageCount) {
                endpage = pageCount;
            }
            for (var i = startpage; i <= endpage; i++) {
                pageItem.push({ value: i, text: "第" + i + "页" });
            }
            if (startpage > 1) {
                if (startpage > 2) {
                    pageItem.unshift({ value: startpage - 1, text: "..." });
                }
                pageItem.unshift({ value: 1, text: "首页" });
            }
            if (endpage < pageCount) {
                if (endpage < pageCount - 1) {
                    pageItem.push({ value: endpage + 1, text: "..." });
                }
                pageItem.push({ value: pageCount, text: "尾页" });
            }
            return pageItem;
        }
        , pageSizeItem: function () {
            var pageItem = [10, 15, 20, 30, 40, 50, 100];
            var pageSize = this.pageInfo.PageSize;
            if (pageItem.indexOf(pageSize) < 0) {
                pageItem.push(pageSize);
            }
            return pageItem.sort(function (a, b) { return a - b });
        }
    },
    template: '\
    <div class="ui-pagination clearfix"> \
        <div>\
                <span class="lb_recordcount input- group - addon">共{{pageInfo.RecordCount}}条</span>\
                <el-button type="button" size="mini"  v-bind:disabled="pageInfo.CurrentPage <= 1" v-on:click="goPage(pageInfo.CurrentPage - 1)">上一页</el-button><el-button type="button" size="mini"  v-bind:disabled="pageInfo.CurrentPage >= pageInfo.PageCount" v-on:click="goPage(pageInfo.CurrentPage + 1)">下一页</el-button>\
                <el-select  size="mini" v-model="pageInfo.CurrentPage" v-on:change="goPage()">\
                    <el-option  :value="item.value" v-for="(item, index) in pageItem" :key="index" :label="item.text"></el-option>\
                </el-select>\
                <el-select size="mini" v-model="pageInfo.PageSize" v-on:change="changePageSize()">\
                   <el-option :value="item" v-for="(item, index) in pageSizeItem" :key="index" :label="item+ \'条/页\'"></el-option>\
                </el-select>\
        </div>\
    </div>'
});

//ui-verificationCode验证码组件
Vue.component("ui-verification-code-image", {
    props: {
        src: { default: null },
    },
    data: function () {
        return {
            random: "",
            autoMinutes: 10,//自动刷新分钟数
            timer: null
        }
    },
    created: function () {
        this.autoRefresh();
    },
    methods: {
        change: function () {
            var _this = this;
            var r = Math.floor(Math.random() * 100000000);
            var imgSrc = this.src;
            if (imgSrc.indexOf("?") < 0) {
                r = "?" + r;
            }
            r = "&" + r;
            this.random = r;
            _this.autoRefresh();
        },
        autoRefresh: function () //定时刷新
        {
            var _this = this;
            if (_this.timer != null) {
                clearTimeout(_this.timer);
            }
            _this.timer = setTimeout(function () { _this.change() }, (this.autoMinutes) * 60 * 1000);
        }
    },
    template: '<img :src="src+random" class="ui-verification-code-cmage"  style="cursor:pointer;max-width:auto" v-on:click="change">'
});

//上传文件共有属性方法
var _uploadMixinsData_ = {
    data: function () {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            elementUiFileList: [],
            hideUpload: false,
            acceptExt: [".jpg", ".jpeg", ".png", ".gif"],
            uploadBtnState: false,
            multiple: false,
            watchFileList: true, //从内到外改变时设置为false，避免死循环
            watchValue: true, //从内到外改变v-model时设置为false，避免死循环
        }
    },
    props: {
        data: {
            type: Object,
            default: function () { return { fileType: "image" } },
            required: false,
            loadingInstance: null
        },
        btnTxt: {
            type: String,
            default: "点击上传"  //可选择array或string
        },
        disabled: {
            type: Boolean,
            default: false,
            required: false
        },
        returnType: {
            type: String,
            default: "array"  //可选择array或string
        },
        value: {//v-mode传递进来，内部不需要
            type: Array | String | undefined,
            default: function () { return [] },
            required: false
        },
        action: {//----------接口地址
            type: String,
            default: '#'
        },
        accept: {
            type: Array | String,
            default: [".jpg", ".jpeg", ".png", ".gif"],
            required: false
        },
        limit: {  //-------限制个数
            type: Number,
            default: 5
        },
        disabled: {  //------是否禁止
            type: Boolean,
            default: false
        },
        maxSize: {//------------最大尺寸限制，0则不限制，单位kb
            type: Number,
            default: 1
        },
        fileList: {  //-------------数据源(数据绑定时实现双向绑定:file-list.sync)
            type: Array,
            default: function () {
                return [];
            }
        },
        drag: {  //-----------是否启动拖拽
            type: Boolean,
            default: true
        }
    },
    methods: {
        formatFileList: function (fileList, modelValue) {//格式化FileList，以适应ui-element的规则
            var newFileList = [];
            if (Array.isArray(fileList)) {
                fileList.forEach(function (item) {
                    newFileList.push({ name: item.name || item.Name, url: item.url || item.Thumbnail || item.Path,path: item.Path });
                });
            }
            if (newFileList.length == 0 && !isNullOrEmpty(modelValue)) {
                var valueAray = [];
                if (Array.isArray(modelValue)) {
                    valueAray = modelValue;
                } else {
                    valueAray = modelValue.split(",");
                }
                valueAray.forEach(function (fileItem) {
                    if (!isNullOrEmpty(fileItem)) {
                        var fileName = fileItem.split("/")[fileItem.split("/").length - 1];
                        newFileList.push({ name: fileName, url: fileItem, path: fileItem });
                    }
                });
            }
            //console.log(newFileList)
            return newFileList;
        },
        columnDrop: function () {  // 左右拖动
            var _this = this;
            var sortBox = _this.$refs.upload.querySelector('.el-upload-list');
            if (sortBox != null && typeof (Sortable) != "undefined") {
                Sortable.create(sortBox, {
                    handle: "",
                    onEnd: function (evt) {
                        var newIndex = evt.newIndex;
                        if (newIndex == undefined) {
                            newIndex = 0;
                        }
                        var oldIndex = evt.oldIndex;
                        var currRow = _this.elementUiFileList.splice(oldIndex, 1)[0];
                        _this.elementUiFileList.splice(newIndex, 0, currRow) // 调整顺序
                        _this.updateImgSrc(_this.elementUiFileList);
                    }
                })
            }
        },
        getFileList: function () {
            return this.elementUiFileList;
        },
        getImgSrc: function (file) {
            var imageUrl = file.localUrl; //优先使用本地blob文件,ftp异步上传时候http图片不能实时返回
            if (isNullOrEmpty(imageUrl)) {
                imageUrl = file.url
            }
            return imageUrl;
        },
        //更新父级v-model
        updateImgSrc: function (fileLists) {
            var _this = this;
            var newdata = fileLists.map(function (item) {
                return item.url;
            })
            if (this.returnType == "string") {
                newdata = newdata.join(",");
            }
            this.watchFileList = false;
            this.watchValue = false;
            this.$emit('input', newdata);
        },
        //下载文件。
        downFile: function (file) {
            //console.log(file)
            console.log(file);
            var url = file.path || file.url;
            var fileName = file.name;
            if (isImage(url)) { //图片直接打开
                window.open(url, "_blank");
            }
            else {//其他格式直接下载
                window.open("/e/download?file=" + urlEncode(url) + "&name=" + urlEncode(fileName), "_blank");
            }
        },
        handleRemove: function (file) {  //-----------删除
            var _this = this
            _this.elementUiFileList.forEach(function (item, index) {
                if (item.uid == file.uid) {
                    _this.elementUiFileList.splice(index, 1)
                }
            })
            this.showUploadBthHandel();
            this.updateImgSrc(_this.elementUiFileList);
        },
        handlePictureCardPreview: function (file) {//----------预览
            //console.log("handlePictureCardPreview", file)
            var imageUrl = file.localUrl; //本地bob文件
            if (isNullOrEmpty(imageUrl)) {
                imageUrl = file.path || file.url;
            }
            this.dialogImageUrl = imageUrl;
            this.dialogVisible = true;
        },
        onImageError: function (err, file, fileList) {//-------上传失败,http服务器错误
            //console.log("onImageError")
            this.elementUiFileList = fileList;
            try {
                this.$store.getters.chunkedUploadXhr.forEach(function (item) {
                    item.abort();
                });
            }
            catch (err) {
            }
            if (err) {
                this.$message.error(err);
            }
        },
        onRequestOver: function (response, file, fileList) {  //--------http请求结束后的回调
            //console.log("onRequestOver----------", response, file, fileList)
            this.showUploadBthHandel();
            this.elementUiFileList = fileList;
            if (!response.State) //response.State==0时表示已被服务器端终止上传并返回提示
            {
                this.handleRemove(file);
                this.$message.error(response.Msg);
            }
            else {
                //ftp异步上传时url还没有上传成功，导致图片打不开
                file.localUrl = file.url; //格式：blob:http://localhost:8800/78e7c95e-2fa8-4759-bb5b-78724b6f9f74
                file.url = response.Thumbnail || response.Url;
                file.path = response.Url;
            }
        },
        handleUploadRequest: function (uploadFile) {//自定义上传。
            if (!uploadFile.file.allowUpload) {
                return;
            }
            //console.log("handleUploadRequest", uploadFile.file.allowUpload, uploadFile)
            var _this = this;
            var uploadTaskList = _this.$uploadTaskList;
            if (uploadTaskList == undefined) {
                _this.$uploadTaskList = [];
                uploadTaskList = _this.$uploadTaskList;
            }
            uploadFile.onProgress({ percent: 0 });//设置初始进度
            if (uploadTaskList.length == 0) {
                uploadTaskList.push(uploadFile);
                _this.loadingInstance = _this.$loading();
                startUpload(uploadFile,_this);
            }
            else
            {
                uploadTaskList.push(uploadFile); //只加入任务队列,否则会导致多个文件同时上传导致未知的ajax冲突。
                return;
            }
            function startUpload(uploadFile,_this) {
                //_this.elementUiFileList.push(uploadFile.file);//不能先添加，否则进度条不显示
                var action = _this.action;
                _this.uploadByPieces({
                    uploadFile: uploadFile,
                    pieceSize: 2,//分片大小，单位mb
                    chunkUrl: action,
                    fileUrl: action,
                    progress: function (num, response) {
                        uploadFile.onProgress({ percent: num });
                        if (num == 100) {
                            uploadFile.onSuccess(response)//显示完成按钮小图标,会触发on-success对应的函数
                            //继续下一个任务
                            uploadTaskList.splice(0,1);
                            if (uploadTaskList.length > 0) {
                                startUpload(uploadTaskList[0], _this);
                            } else
                            {
                                _this.loadingInstance.close();
                            }
                        }
                    },
                    success: function (data) {
                        //alert(_this.uploadTaskList.length)
                        //_this.elementUiFileList.push(uploadFile.file);//onSuccess后自动添加了
                    },
                    error: function (response) {
                        _this.loadingInstance.close();
                        uploadTaskList.forEach(function (item, index) {
                            var error = response.Msg;
                            if (index > 0) {
                                error = "";
                            }
                            item.onError(error);
                        });
                        uploadTaskList.splice(0, uploadTaskList.length);
                    }
                }) 
            }  
        },
        uploadByPieces: function (_ref) {//分片上传
            var _this = this;
            var uploadingFile = _ref.uploadFile,
                chunkUrl = _ref.chunkUrl,
                fileUrl = _ref.fileUrl,
                pieceSize = _ref.pieceSize,
                progress = _ref.progress,
                success = _ref.success,
                error = _ref.error;
            if (!uploadingFile) return; // 上传过程中用到的变量
            var progressNum = 1; // 进度
            var hasError = 0;//是否有报错
            var successAllCount = 0; // 上传成功的片数
            // let currentAllChunk = 0 // 当前上传的片数索引
            var AllChunk = 1; // 所有文件的chunk数之和
            // 获取md5
            var readFileMD5 = function (uploadFile) {
                var fileRederInstance = new FileReader();
                //var blob = uploadFile.file.slice(0, uploadFile.file.length);
                fileRederInstance.readAsArrayBuffer(uploadFile.file);
                fileRederInstance.addEventListener("load", function (e) {
                    readChunkMD5(uploadFile);
                }, false);

                function loadNext() {
                    var start = currentChunk * chunkSize,
                        end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                }
            };

            var getChunkInfo = function getChunkInfo(file, currentChunk, chunkSize) {
                var start = currentChunk * chunkSize;
                var end = Math.min(file.size, start + chunkSize);
                var chunk = file.slice(start, end);
                return { start: start, end: end, chunk: chunk };
            }; // 针对每个文件进行chunk处理
            var readChunkMD5 = function (currentFile) {
                var chunks = [];
                var chunksMd5 = [];
                var file = currentFile.file;
                var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;//
                chunkIdx = 0,
                spark = new SparkMD5.ArrayBuffer(),
                chunkSize = pieceSize * 1024 * 1024, // 单位字节
                chunkCount = Math.ceil(file.size / chunkSize); // 总片数
                fileReader = new FileReader();
                AllChunk = chunkCount;
                fileReader.onload = function (e) {
                    spark.append(e.target.result);
                    chunksMd5.push(SparkMD5.ArrayBuffer.hash(e.target.result));
                    chunkIdx++;
                    if (chunkIdx < chunkCount) {
                        loadNext();
                    } else {
                        //获取md5后，触发分片上传。
                        var md5 = spark.end();
                        currentFile.file.md5=md5;
                        startUpload(0);
                    }
                };
                function loadNext() {
                    var start = chunkIdx * chunkSize,
                        end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                    var currentChunk = blobSlice.call(file, start, end);
                    chunks.push(currentChunk);
                    fileReader.readAsArrayBuffer(currentChunk);
                }
                loadNext();
                function startUpload(i) {
                    try {
                        var currentChunk = chunks[i];
                        var chunkMD5 = chunksMd5[i];
                        uploadChunk(
                            currentFile,
                            { chunkMD5: chunkMD5, chunk: currentChunk, currentChunk: i, chunkCount: chunkCount },
                            function () {
                                var nextIdx = i + 1;
                                if (nextIdx <= AllChunk - 1) {
                                    startUpload(nextIdx);
                                }
                            }
                        );
                    }
                    catch (err) {
                        error && error({ State: 0, Msg:err.description });
                    }
                }
            };

            // 更新进度
            var progressFun = function progressFun(response) {
                progressNum = Math.ceil(successAllCount / AllChunk * 100);
                progress(progressNum, response);
            };

            // 分片上传完毕后再请求api进行合并。
            var uploadFile = function (currentFile, chucksCount) {
                var data = _this.data;
                data.fileMd5 = currentFile.file.md5;
                data.fileName = currentFile.file.name;
                data.isMerge = "true";
                data.chunksCount = chucksCount;
                ajax({
                    type: "post",
                    url: fileUrl + "?merge=1",
                    data: data,
                    error: function (xhr) {
                        error && error({ State: 0, Msg: "http error" });
                    },
                    success: function (res) {
                        if (res.State == 1) {
                            progressFun(res);
                            success && success(res);
                        } else
                        {
                           error && error(res);
                        }
                    }
                });
            };
            var uploadChunk = function (currentFile,chunkInfo,nextCallBack) {
                var fetchForm = new FormData();
                fetchForm.append("fileName", currentFile.file.name);
                fetchForm.append("data", chunkInfo.chunk);
                fetchForm.append("fileMd5", currentFile.file.md5);
                fetchForm.append("chunksCount", chunkInfo.chunkCount);
                fetchForm.append("chunkIdx", chunkInfo.currentChunk);
                fetchForm.append("chunkMd5", chunkInfo.chunkMD5);
                for (var key in _this.data) {
                    fetchForm.append(key, _this.data[key]);
                }
                ajax({
                    type: 'post',
                    url: chunkUrl,
                    data: fetchForm,
                    processData: false,
                    contentType: false, // 注意这里应设为false
                    error: function (xhr) {
                        error && error({ State: 0, Msg: "http error" });
                    },
                    success: function (responseData) {
                        var tipsInfo = responseData;
                        if (tipsInfo.State == 1) {
                            progressFun(responseData);
                            successAllCount++;
                            // 当分片上传完毕后
                            if (successAllCount >= chunkInfo.chunkCount) {
                                if (chunkInfo.chunkCount == 1) {//分片只有一片时不要请求合并api，后端已经处理
                                    progressFun(responseData);
                                    return;
                                }
                                else {
                                    uploadFile(currentFile, successAllCount);
                                }
                            }
                            else {
                                nextCallBack && nextCallBack();
                            }
                        }
                        else { //tipsInfo.State ==0
                            if (hasError == 0) {
                                hasError = 1;
                            }
                            error && error(responseData);
                        }
                    }
                });
            };
            readFileMD5(uploadingFile); // 开始执行代码
        },
        onChangeImageUpload: function (file, FileList) {  //-----------上传成功/失败,正在上传
            //console.log("onChangeImageUpload", file.status);
            this.showUploadBthHandel();
            this.updateImgSrc(FileList);
        },
        onLimItExceed: function (file, FileList) {  //-----------超出上传个数
            this.$message.error("最多只能上传" + this.limit + "个文件，请删除后再上传！");
        },
        beforeUpload: function (file) { //--------上传之前校验
           //console.log("beforeUpload",file)
            var _this = this;
            file.allowUpload = false;
            if (file.size == 0) {
                _this.$message.error("对不起，零字节文件不能上传!");
                return false;
            }
            if (!_this.validateSize(file) && _this.maxSize > 0) {
                var msg = "文件大小不能超过" + (_this.maxSize / 1024).toFixed(2) + "MB！"
                if (_this.maxSize < 1024) {
                    msg = "文件大小不能超过" + _this.maxSize + "KB！";
                }
                _this.$message.error(msg);
                return false;
            }
            if (!_this.validateExt(file)) {
                _this.$message.error("只能上传" + _this.acceptExt.join(",") + "格式文件！");
                return false;
            }
            file.allowUpload = true;
            return true;
        },
        validateSize: function (file, resolve, reject) { //---验证大小
            var isSizeM = file.size / 1024 < this.maxSize;
            return isSizeM ? true : false
        },
        validateExt: function (file, resolve, reject) { //---验证格式
            var fileName = file.name;
            var indexStart = fileName.lastIndexOf(".");
            var indexEnd = fileName.length;
            var fileExt = fileName.substring(indexStart, indexEnd);//后缀名
            var arrayAccept = this.accept;
            if (arrayAccept == "*") {
                return true;
            }
            if (!Array.isArray(arrayAccept)) {
                arrayAccept = arrayAccept.split(",");
                this.acceptExt = arrayAccept;
            }
            return arrayAccept.indexOf(fileExt.toLowerCase()) >= 0;
        },
        uploadOnProgress: function (event, file, fileList) {
            this.progress = event.percent;  //调用默认的进度条percentage
        },
        showUploadBthHandel: function () { //上传按钮显示和隐藏控制
            this.hideUpload = this.elementUiFileList.length >= this.limit && this.limit > 0;
            //console.log(this.elementUiFileList)
            //console.log(this.limit)
            if (this.hideUpload) {
                this.uploadBtnState = true;
            }
            else {
                this.uploadBtnState = false;
            }
        }
    },
    created: function () {
        if (this.limit > 1 || this.limit === 0) {
            this.multiple = true;
        }

    },
    mounted: function () {
        if (this.limit > 1 || this.limit === 0) {
            this.columnDrop();
        }
    },
    watch: {
        fileList: {
            handler: function (newVal, oldVal) {
                if (this.watchFileList) {
                    if (!equals(newVal, oldVal)) { //二次判断，避免组件之间互相影响
                        this.elementUiFileList = this.formatFileList(newVal, this.value);
                        this.showUploadBthHandel();
                        this.updateImgSrc(this.elementUiFileList);
                    }
                } else {
                    this.watchFileList = true;
                }
            },
            immediate: true
        }
        , value: {
            handler: function (newVal, oldVal) {
                if (this.watchValue) {
                    if (!equals(newVal, oldVal)) {//二次判断，避免组件之间互相影响
                        this.elementUiFileList = this.formatFileList(this.fileList, newVal);
                        this.showUploadBthHandel();
                    }
                } else {
                    this.watchValue = true;
                }

            },
            immediate: true
        }
    }
}

//带缩约图显示
Vue.component('ui-picture-upload', {
    template: "<div ref='upload' :class=\"{'el-upload-hide-btn':uploadBtnState}\"><el-upload  v-bind='$attrs'  :action='action' :data='data' list-type='picture-card' :on-success='onRequestOver'" +
    ":accept='accept' :multiple='multiple' :limit='limit' :before-upload='beforeUpload' :drag='false'" +
    ":on-change='onChangeImageUpload' :http-request=\"handleUploadRequest\" :on-exceed='onLimItExceed' :file-list='elementUiFileList'" +
    ":disabled='disabled' :on-error='onImageError'>" +
    "<i class='el-icon-plus'></i><div slot='file' slot-scope='file'><img class='el-upload-list__item-thumbnail' :src='getImgSrc(file.file)'>" +
    "<label class='el-upload-list__item-status-label'><i class='el-icon-upload-success el-icon-check'></i></label>" +
    "<div class='el-upload-list__item-actions' style='display:flex;justify-content:center;align-items:center;'>" +
    "<div style='flex:1;cursor:pointer'  v-on:click='handlePictureCardPreview(file.file)' >" +
    "<i class='el-icon-zoom-in'></i></div>" +
    "<div style='flex:1;cursor:pointer'   v-on:click='handleRemove(file.file)'>" +
    "<i class='el-icon-delete'></i></div>" +
    "</div></div></el-upload> " +
    "<el-dialog :visible.sync='dialogVisible'><a style='display:block;width:100%;text-align:center;overflow:hidden' :href='dialogImageUrl' target='_blank'><img style='max-width:100%;max-height:400px' :src='dialogImageUrl'></a></el-dialog></div>",
    mixins: [_uploadMixinsData_],
})

//不带缩约图
Vue.component('ui-file-upload', {
    template: "<div ref='upload' :class=\"{'el-upload-hide-btn':uploadBtnState}\"><el-upload  v-bind='$attrs'  :action='action' :drag='false' :data='data' :auto-upload='true' list-type='text' :on-success='onRequestOver'" +
    ":accept='accept' :multiple='multiple' :on-preview=\"downFile\" :limit='limit' :on-remove='handleRemove' :before-upload='beforeUpload'" +
    ":on-change='onChangeImageUpload'  :http-request=\"handleUploadRequest\" :on-exceed='onLimItExceed' :file-list='elementUiFileList'" +
    ":disabled='disabled' :on-error='onImageError'>" +
    "<el-button size=\"small\" type=\"primary\">{{btnTxt}}</el-button>" +
    "</el-upload></div>",
    mixins: [_uploadMixinsData_],
})

//tag标签
Vue.component('ui-tag', {
    template: "<span><el-tag :key='index' v-for='(item,index) in dataList' :closable='closable' :type='type'" +
    ":disable-transitions='disableTransitions' @close='handleClose(item)' :hit='hit' :color='color'" +
    ":size='size' :effect='effect' @click='handleClick(item)' style='margin-right:10px;'>{{item}}</el-tag>" +
    "<el-input class='input-new-tag' style='width:120px;' v-if='inputVisible' v-model='inputValue' ref='saveTagInput' size='small'" +
    "@keyup.enter.native='handleInputConfirm' @blur='handleInputConfirm'></el-input>" +
    "<el-button  v-else class='button-new-tag' size='small' @click='showInput'>{{buttonText}}</el-button></span>",
    data: function () {
        return {
            inputVisible: false,
            inputValue: '',
            dataList: [],
        }
    },
    props: {
        value: {  //-----------数据源
            type: Array | String,
            default: []
        },
        closable: {  //-------是否有关闭
            type: Boolean,
            default: true
        },
        type: { //------------类型success/info/warning/danger
            type: String,
            default: ''
        },
        disableTransitions: {  //------是否关闭动画
            type: Boolean,
            default: false
        },
        hit: {  //-----------是否有边框描边
            type: Boolean,
            default: false
        },
        color: {//----------------背景色
            type: String,
            default: ''
        },
        size: {  //------------尺寸medium / small / mini
            type: String,
            default: ''
        },
        effect: {//-----------主题dark / light / plain
            type: String,
            default: 'light'
        },
        buttonText: {  //------------按钮文本
            type: String,
            default: '+添加'
        },
        returnType: {
            type: String | Array,
            default: ''
        }
    },
    created: function () {
        this.handleInit(this.value);
    },
    methods: {
        handleInit: function (model) {
            //如果数据源不是数组则转换为数组
            var _this = this;
            var midList;
            if (model == undefined || model == null || model == "") {
                midList = [];
            }
            else if (!Array.isArray(model)) {
                midList = model.split(',')
            }
            else {
                midList = model;
            }
            this.dataList.splice(0, this.dataList.length);
            for (var i = 0; i < midList.length; i++) {
                var item = midList[i];
                if (!isNullOrEmpty(item)) {
                    _this.dataList.push(item);
                }
            }
        },
        handleUpdate: function (model) {
            //当v-model更改后，通过此方法更新
            this.handleInit(model);
            this.returnTypeFlag(this.dataList);
        },
        handleClose: function (val) {
            this.dataList.splice(this.dataList.indexOf(val), 1);
            this.returnTypeFlag(this.dataList)
        },
        handleClick: function (val) {

        },
        returnTypeFlag: function (dataList) {
            //如果传递的v-model是数组，则返回数组,反之则返回逗号隔开的字符串
            if (Array.isArray(this.value)) {
                this.$emit('input', dataList)
            }
            else {
                this.$emit('input', dataList.join(","))
            }
        },
        handleInputConfirm: function () {
            var inputValue = this.inputValue;
            if (inputValue) {
                this.dataList.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
            this.returnTypeFlag(this.dataList)
        },
        showInput: function () {
            this.inputVisible = true;
            //dom节点渲染完毕后执行
            this.$nextTick(function () {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        }
    }
})

//级联共有属性

var _cascaderMinix_ = {
    data: function () {
        return {
            timer: null,
            key: 0,
            optionsMiddleList: this.options, //optionsList的中间桥梁数据
            selectedMiddleModel: this.value,//selectedModel的中间桥梁数据，频繁给selectedModel赋值会频繁触发watch出现未知错误。
            optionsList: this.options,
            selectedModel: this.value,
            canUpdate: true,//是否触发更新
            watchValue: true,
            watchOptions: true,
            cascaderKey: 0,
            cascaderProps: this.props,//传递给el-cascader的props
        }
    },
    props: {
        options: {  //----------数据源
            type: Array,
            default: function () {
                return [];
            }
        },
        optionsUrl: { //----------数据源请求地址，options和optionsUrl只能定义一个
            type: String,
            default: ""
        },
        clearable: {  //--------------输入框可清空
            type: Boolean,
            default: true
        },
        props: {
            type: Object,
            default: function () {
                return {
                    expandTrigger: 'hover',
                    multiple: false,
                    label: 'label',
                    value: 'value',
                    remark: "",
                    children: "children"
                }
            }
        },
        value: {  //----------默认选中值
            type: String | Number,
            default: ''
        },
        placeholder: {  //-----提示
            type: String,
            default: '请选择'
        },
        disabled: {  //------是否禁用
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: ''
        },
        collapseTags: {  //------多选情况下是否折叠
            type: Boolean,
            default: false
        }
    },
    methods: {
        init: function () {
            var _this = this;
            _this.key = new Date().getTime();
            _this.formatOptions();
            _this.formatValue();//对数据进行转换
            _this.loadOptions(_this.selectedModel, _this.optionsUrl);
            _this.cascaderProps = deepCopy(_this.props);//深复制
            _this.cascaderProps.label = "label";
            _this.cascaderProps.value = "value";
            _this.cascaderProps.children = "children";
        },
        formatOptions: function () {//格式化optionsList属性
            var _this = this;
            var props = _this.props;
            props = extend({ label: "label", value: "value", remark: "", children: "children" }, props);
            var lableField = props.label; //label字段
            var valueField = props.value; //value字段
            var remarkField = props.remark; //remark字段
            var optionsList = _this.optionsMiddleList;
            if (isNullOrEmpty(optionsList)) {
                optionsList = [];
            }
            if (!Array.isArray(optionsList)) {
                optionsList = [optionsList];
            }
            //对options数据进行格式化
            optionsList.remove(function (item) { return isNullOrEmpty(item) }); //移除空项目
            optionsList.forEach(function (optionsItem, idx) {
                if (typeof (optionsItem) == "string") //options是字符数组
                {
                    optionsList[idx] = { label: optionsItem, value: optionsItem };
                }
                else {
                    if (!optionsItem.hasOwnProperty("label") && !isNullOrEmpty(lableField)) {
                        if (optionsItem.hasOwnProperty(lableField)) {
                            optionsItem["label"] = optionsItem[lableField];
                        }
                        else {
                            optionsItem["label"] = "props属性中未定义label属性";
                        }
                    }
                    if (!optionsItem.hasOwnProperty("value") && !isNullOrEmpty(valueField)) {
                        if (optionsItem.hasOwnProperty(valueField)) {
                            optionsItem["value"] = optionsItem[valueField];
                        } else {
                            optionsItem["value"] = 0;
                        }
                    }
                    if (!optionsItem.hasOwnProperty("remark") && !isNullOrEmpty(remarkField)) {
                        optionsItem["remark"] = optionsItem[remarkField];
                    }
                }
            });
            _this.optionsList = optionsList;
        },
        formatValue: function () {//格式化v-model对应的value,以符合emement-ui的格式
            var _this = this;
            var selectedModel = _this.selectedMiddleModel;
            var optionsNew = deepCopy(_this.optionsList);
            //定义递归查找函数
            function findValueFormOptions(options, value, emptyArray, selectedValueArrayNew, currentLevel) {
                var findedSuccess = false;
                for (var i = 0; i < options.length; i++) {
                    var item = options[i];
                    var parentValue = item.parentValue;
                    var itemValue = item.value;
                    if (parentValue == 0) {//重新从第一级开始找，清空arrayName。
                        emptyArray = [];
                        currentLevel = 0;
                    }
                    if (i == 0) {//循环的第一个
                        emptyArray.push(itemValue)
                    } else {
                        emptyArray.splice(currentLevel, emptyArray.length - currentLevel, itemValue); //从当前级别重新添加
                    }
                    var children = item.children;
                    if (itemValue.toString() == value.toString()) {
                        selectedValueArrayNew.push(emptyArray);//复制避免互相影响
                        findedSuccess = true;
                        return true; //找到了返回，不需要再次循环查找
                    }
                    else if (Array.isArray(children)) {
                        var theLevel = currentLevel + 1;
                        findedSuccess = findValueFormOptions(children, value, emptyArray, selectedValueArrayNew, theLevel);
                        if (findedSuccess) {
                            return true;
                        }
                    }
                }
                return findedSuccess;
            }
            //开发对数据进行转换
            var selectedValueArray = [];
            if (Array.isArray(selectedModel)) {
                selectedValueArray = selectedModel;
            }

            else if (typeof (selectedModel) == "string") {
                selectedValueArray = selectedModel.split(",");
            }
            else if (typeof (selectedModel) == "number") {
                selectedValueArray.push(selectedModel);
            }
            var selectedValueArrayNew = [];//转换为适合element-ui的格式
            selectedValueArray.forEach(function (item, index) {
                findValueFormOptions(optionsNew, item, [], selectedValueArrayNew, 0);
            });
            if (_this.props.multiple) {
                _this.selectedModel = deepCopy(selectedValueArrayNew);
            }
            else {
                if (selectedValueArrayNew.length > 0) {
                    _this.selectedModel = selectedValueArrayNew[0];
                }
                else {
                    _this.selectedModel = "";
                }
            }
        },
        updateModelValue: function (val) { //更新父级v-mode对应的value
            var data = val
            var selectedval;
            if (this.props.multiple) {
                if (Array.isArray(this.value)) {
                    selectedval = [];
                    val.forEach(function (item, inx) {
                        selectedval.push(item[item.length - 1]);
                    });
                } else {
                    selectedval = ''
                    val.forEach(function (item, inx) {
                        item.forEach(function (itemval, index) {
                            if (inx == val.length - 1) {
                                if (index == item.length - 1) {
                                    selectedval += itemval
                                    return
                                }
                            }
                            else {
                                if (inx != val.length - 1) {
                                    if (index == item.length - 1) {
                                        selectedval += itemval + ','
                                        return
                                    }
                                }
                                else {
                                    if (index == item.length - 1) {
                                        selectedval += itemval
                                        return
                                    }
                                }
                            }
                        })
                    })
                }

            }
            else {

                if (val.length == 0) {
                    selectedval = ''
                }
                else {
                    selectedval = val[val.length - 1]
                }
            }

            this.$emit('input', selectedval);
            this.$emit('change', selectedval);
            this.watchValue = false;
            this.watchOptions = false;
        },
        loadOptions: function (selectedValue, optionsUrl) { //ajax 根据OptionsUrl地址获取选项数据
            var _this = this;
            var value = selectedValue;
            if (isNullOrEmpty(value)) {
                value = "";
            } else if (Array.isArray(value)) {
                value = value.join(",");
            }
            if (!isNullOrEmpty(optionsUrl)) {
                var props = extend({ value: value, label: "label", value: "value", remark: "" }, _this.props);
                _this.ajax({
                    url: optionsUrl,
                    data: { value: value, valueField: props.value, labelField: props.label },
                    success: function (responseData) {
                        if (isNullOrEmpty(responseData)) {
                            responseData = [];
                        }
                        _this.optionsMiddleList = responseData;
                        _this.formatOptions();//格式化选项
                        _this.formatValue();//格式化数据

                    }
                });
            }
        },
    },
    watch: {
        options: {//监听options属性
            handler: function (newVal, oldVal) {
                //console.log("options-----改变")
                var _this = this;
                if (!equals(newVal, oldVal)) { //判断，避免object数据被父级组件变动影响
                    _this.optionsMiddleList = newVal;
                    if (isNullOrEmpty(_this.optionsMiddleList)) {
                        _this.optionsMiddleList = [];
                    }
                    if (_this.timer != null) {
                        clearTimeout(_this.timer);
                    }
                    _this.timer = setTimeout(function () { _this.init(); }, 100);//延迟执行，避免两个属性同时改变触发连多次
                }
            },
            immediate: true,
        },
        value: { //监听value属性
            handler: function (newVal, oldVal) {
                //console.log("value-----改变")
                var _this = this;
                if (!_this.watchValue) {//从内部触发的不监听，避免死循环
                    _this.watchValue = true;
                    return;
                }
                if (!equals(newVal, oldVal)) {
                    _this.selectedMiddleModel = newVal;
                    if (isNullOrEmpty(_this.selectedMiddleModel)) {
                        _this.selectedMiddleModel = [];
                    }
                    if (_this.timer != null) {
                        clearTimeout(_this.timer);
                    }
                    _this.timer = setTimeout(function () { _this.init(); }, 100); //延迟执行，避免两个属性同时改变触发连多次
                }
            },
            immediate: true,
        },
    },
}

// 级联多选单选

Vue.component('ui-cascader', {
    template: "<el-cascader :key='key' :size='size'  :collapse-tags='collapseTags' :clearable='clearable' :placeholder='placeholder' :disabled='disabled' v-model='selectedModel' @change='updateModelValue' :options='optionsList' :props='cascaderProps'></el-cascader>",
    mixins: [_cascaderMinix_]
})

// 级联面板多选单选

Vue.component('ui-cascader-panel', {
    template: "<el-cascader-panel  :key='key' :size='size' :placeholder='placeholder' :collapse-tags='collapseTags' :disabled='disabled' v-model='selectedModel' @change='updateModelValue' :options='optionsList' :props='cascaderProps'></el-cascader-panel>",
    mixins: [_cascaderMinix_]
})

//下拉菜单，单选，多选共用
//-----公用属性方法
var _selectCheckbox_ = {
    props: {
        multiple: {  //-----------true多选false单选
            type: Boolean,
            default: false
        },
        clearable: {  //--------------选择器清空,仅适用于单选
            type: Boolean,
            default: true
        },
        filterable: {  //
            type: Boolean,
            default: false
        },
        options: {  //选项，后期需要进行转换optionsList
            type: Array | Object,
            default: function () {
                return [];
            }
        },
        optionsUrl: {  // 获取options的地址。
            type: String,
            default: ""
        },
        size: {
            type: String,
            default: ''
        },
        value: {   //------------默认选中
            type: String | Array | Number,
            default: function () {
                return []
            }
        },
        disabled: {   //------------是否禁用
            type: Boolean,
            default: false
        },
        multipleLimit: {  //------------用户最多选择的个数,默认为0不限制
            type: Number,
            default: 0
        },
        placeholder: {  //----------------提示语句
            type: String,
            default: '请选择'
        },
        props: {   //属性配置
            type: Object,
            default: function () {
                return { label: 'label', value: 'value', remark: "", children: "children", checkStrictly: false }
            }
        },
        multiline: false, //v-model的值是否是采用换行分割。
        data: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    data: function () {
        return {
            key: 0, //prop options或value改变时同步修改key，重新渲染html
            timer: null,//延迟定时器
            isMultple: this.multiple,
            optionsMiddleList: [], //optionsList的中间桥梁
            selectedMiddleModel: "",//selectedModel的中间桥梁数据
            optionsList: [],
            selectedModel: "",
            isPopup: false,//是否是弹出选择框
            watchOptions: true, //是否监听options属性,避免内部改变时死循环
            watchValue: true,//是否监听value属性,避免组件内部改变时死循环
        }
    },
    watch: {
        value: { //监听value属性
            handler: function (newVal, oldVal) {
                //console.log("value 改变-------------");
                var _this = this;
                if (!_this.watchValue) {
                    _this.watchValue = true;
                    return;
                }
                if (!equals(newVal, oldVal)) { //判断是否相等，避免父级数据变动影响
                    _this.selectedMiddleModel = newVal;
                    if (isNullOrEmpty(_this.selectedMiddleModel)) {
                        _this.selectedMiddleModel = "";
                    }
                    if (_this.timer != null) {
                        clearTimeout(_this.timer);
                    }
                    _this.timer = setTimeout(function () { _this.init(); }, 100);//延迟执行，避免两个属性同时改变触发多次
                }
            },
            immediate: true,
        },
        options: {//监听options属性
            handler: function (newVal, oldVal) {
                //console.log("options 改变-------------", newVal, oldVal, equals(newVal, oldVal));
                var _this = this;
                if (!equals(newVal, oldVal)) { //判断是否相等，避免父级数据变动影响
                    _this.optionsMiddleList = newVal;
                    if (isNullOrEmpty(_this.optionsMiddleList)) {
                        _this.optionsMiddleList = [];
                    }
                    if (_this.timer != null) {
                        clearTimeout(_this.timer);
                    }
                    _this.timer = setTimeout(function () { _this.init(); }, 100);//延迟执行，避免两个属性同时改变触发多次
                }
            },
            immediate: true,
        },
    },
    methods: {
        init: function () {//初始化
            var _this = this;
            _this.key = new Date().getTime();
            if (_this.$options._componentTag && _this.$options._componentTag == "ui-select") {
                _this.getOptionsSlot();//导入select的自定义options
            }
            _this.formatOptions();//对选项进行格式化，兼容element格式
            _this.formatValue();//对数据进行转换
            if (_this.isPopup) {//弹出选择器
                if (!isNullOrEmpty(_this.value)) {
                    if (Array.isArray(_this.value) && _this.value.length == 0) {
                        return;
                    }
                    _this.loadOptions(_this.value, _this.optionsUrl);
                }
            } else {
                _this.loadOptions("", _this.optionsUrl);
            }
        },
        formatOptions: function () {//格式化optionsList属性
            var _this = this;
            var props = _this.props;
            props = extend({ label: "label", value: "value", remark: "" }, props);
            var lableField = props.label; //label字段
            var valueField = props.value; //value字段
            var remarkField = props.remark; //remark字段
            var optionsList = _this.optionsMiddleList;
            if (isNullOrEmpty(optionsList)) {
                optionsList = [];
            }
            if (!Array.isArray(optionsList)) {
                optionsList = [optionsList];
            }
            //对options数据进行格式化
            optionsList.remove(function (item) { return isNullOrEmpty(item) }); //移除空项目
            optionsList.forEach(function (optionsItem, idx) {
                if (typeof (optionsItem) == "string") //options是字符数组
                {
                    optionsList[idx] = { label: optionsItem, value: optionsItem };
                }
                else {
                    if (!optionsItem.hasOwnProperty("label") && !isNullOrEmpty(lableField)) {
                        if (optionsItem.hasOwnProperty(lableField)) {
                            optionsItem["label"] = optionsItem[lableField];
                        }
                        else {
                            optionsItem["label"] = "props中未定义label属性";
                        }
                    }
                    if (!optionsItem.hasOwnProperty("value") && !isNullOrEmpty(valueField)) {
                        if (optionsItem.hasOwnProperty(valueField)) {
                            optionsItem["value"] = optionsItem[valueField];
                        } else {
                            optionsItem["value"] = 0;
                        }
                    }
                    if (!optionsItem.hasOwnProperty("remark") && !isNullOrEmpty(remarkField)) {
                        optionsItem["remark"] = optionsItem[remarkField];
                    }
                }

            });
            _this.optionsList = optionsList;
        },
        formatValue: function () {//格式化v-model中的value数据
            var _this = this;
            var newModel = [];//转换后的值，
            var midModel = _this.selectedMiddleModel;
            if (this.isMultple) {
                if (isNullOrEmpty(midModel)) {
                    midModel = [];
                }
                else if (typeof midModel == 'object' || typeof midModel == 'array') {

                }
                else {
                    if (_this.multiline) {
                        midModel = midModel.toString().split(/[(\r\n)\r\n]+/);
                    } else {
                        midModel = midModel.toString().split(',');
                    }
                }
                midModel.forEach(function (val) {
                    _this.optionsList.forEach(function (item) {
                        if (item.value.toString() == val.toString()) {
                            newModel.push(item.value)
                        }
                    })

                })
            }
            else {
                newModel = "";
                var thisValue = midModel;
                if (isNullOrEmpty(thisValue)) {
                    thisValue = "";
                }
                _this.optionsList.forEach(function (item) {
                    if (item.value.toString() == thisValue.toString()) {
                        newModel = item.value
                    }

                })
            }
            _this.selectedModel = newModel;
        },
        updateModelValue: function (selectedText) {  //更新父级的v-model
            var _this = this;
            var selected = [];
            if (_this.isMultple) {
                if (!Array.isArray(selectedText)) {
                    if (isNullOrEmpty(selectedText)) {
                        selected = [];
                    }
                    else if (typeof (selectedText) == "string") {
                        if (_this.multiline) {
                            selected = selectedText.split(/[(\r\n)\r\n]+/);
                        }
                        else {
                            selected = selectedText.split(",");
                        }
                    }
                    else {
                        selected.push(selectedText);
                    }
                }
                else {
                    selected = selectedText;
                    //console.log(selected)
                }
            }
            else {
                if (Array.isArray(selectedText)) {
                    if (selectedText.length > 0) {
                        selected = selectedText[0];
                    } else {
                        selected = "";
                    }
                } else {
                    selected = selectedText;
                }
            }

            if (_this.isMultple && !Array.isArray(_this.value)) {
                //如果传递过来的v-model不是数组，那么就转为逗号隔开的字符串传回去。

                if (typeof (this.value) == "number") {
                    selected = parseInt(selected);
                }
                else {
                    if (_this.multiline) {
                        selected = selected.join("\r\n");
                    } else {
                        selected = selected.join();
                    }
                }
            }
            this.$emit('input', selected)  //----------回调父级的方法,改变v-model的值
            this.$emit('change', selected)  //----------回调父级的方法
            this.watchOptions = false;
            this.watchValue = false;//从内到外的更新就暂停监听value，避免死循环
        },
        loadOptions: function (selectedValue, optionsUrl) { //ajax 根据OptionsUrl地址获取选项数据
            var _this = this;
            var value = selectedValue;
            if (isNullOrEmpty(value)) {
                value = "";
            } else if (Array.isArray(value)) {
                value = value.join(",");
            }
            if (!isNullOrEmpty(optionsUrl)) {
                var props = extend({ label: "label", value: "value", remark: "" }, _this.props);
                var serverData = extend({ value: value, valueField: props.value, labelField: props.label }, _this.data);
                _this.ajax({
                    url: optionsUrl,
                    data: serverData,
                    success: function (responseData) {
                        if (isNullOrEmpty(responseData)) {
                            responseData = [];
                        };
                        if (!Array.isArray(responseData)) {
                            _this.optionsMiddleList = [responseData];
                        } else {
                            _this.optionsMiddleList = responseData;
                        }

                        _this.formatOptions();//对选项进行格式化，兼容element格式
                        _this.formatValue();//对数据进行转换
                    }
                });
            }
        },
    }
}

//单选框
Vue.component('ui-radio', {
    template: "<el-radio-group :key='key' v-model='selectedModel' :disabled='disabled'" +
    ":border='border' :size='size'  @change='updateModelValue'>" +
    "<el-radio v-for='item in optionsList' :key='item.value' :label='item.value' :disabled='item.disabled'>" +
    "{{item.label}}</el-radio><slot></slot></el-radio-group>",
    mixins: [_selectCheckbox_],
    props: {
        multple: false, //重写属性
        border: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'mini'
        }
    }
})

//下拉表单

Vue.component('ui-select', {
    template: "<el-select  :key='key'  :style='{width:width}' filterable v-model='selectedModel' :size='size' :disabled='disabled' :multiple='multiple'" +
    ":multiple-limit='multipleLimit' :clearable='clearable' :collapse-tags='collapseTags' :placeholder='placeholder' @change='updateModelValue'>" +
    "<el-option v-for='item in optionsList' :key='item.value' :label='item.label' :value='item.value'>" +
    "</el-option></el-select>",
    mixins: [_selectCheckbox_],
    props: {
        collapseTags: {//多选是否把标签收缩起来
            type: Boolean,
            default: true
        },
        width: {
            type: String,
            default: 'auto'
        }
    },
    methods: {
        getOptionsSlot: function () {
            var _this = this;
            //console.log(this.$slots.default);
            if (this.$slots.default != undefined) {
                this.$slots.default.forEach(function (item) {
                    if (item.data != undefined) {
                        _this.optionsMiddleList.push(item.componentOptions.propsData)
                    }
                })
            }
        },
    },
    mounted: function () {
        //如果值不存在选项中，则构造一个选项出来，否则下拉中会直接显示数字
        var _this = this;
        if (!this.multiple) {
            if (_this.optionsList.findIndex(function (item) { return item.value.toString() == _this.selectedModel.toString() }) < 0) {
                _this.selectedModel = "";
                //_this.updateModelValue("");
            }

        }
    },
});

//多选框

Vue.component('ui-checkbox', {
    template: "<el-checkbox-group :key='key' v-model='selectedModel' @change='updateModelValue'>" +
    "<el-checkbox v-for='(item,index) in optionsList'  :label='item.value' :key='item.value' :disabled='item.disabled'>{{item.label}}</el-checkbox></el-checkbox-group>",
    mixins: [_selectCheckbox_],
    props: {
        multiple: {  //重写属性
            type: Boolean,
            default: true
        },
        min: "",
        max: "",
    },
})

//数据选择框,配合ui-select-popup使用
Vue.component('ui-select-popup-data', {
    template: '<el-dialog v-on:open="inits" :title="title" :visible.sync="dialogVisible" :width="width">\
    <div :style="{height:height}">\
        <div style="text-align: right;">\
            <template v-for="item in classify">\
                <ui-select size="small" :placeholder="item.Remark" v-if="!item.IsCascader" :options="item.Options" v-model="item.Model" clearable v-on:change="classifyChange"></ui-select>\
                <ui-cascader slot="prepend" size="small" v-else :placeholder="item.Remark" :options="item.Options" v-model="item.Model" v-on:change="classifyChange"></ui-cascader>\
            </template>\
            <el-input size="small" v-show="showSearch" clearable style="width:150px;" v-on:clear="loadData" v-model.trim="searchInfo.keyword" placeholder="搜索关键词" class="input-with-select"></el-input>\
            <el-button size="small" v-show="showSearch" v-on:click="loadData">搜索</el-button>\
        </div>\
        <el-table  ref="tables" :row-key="getRowKey" :data="tableData" border highlight-current-row  tooltip-effect="dark" style="width:100%;margin-top:20px;max-height:400px;overflow-y:scroll;">\
            <el-table-column :show-overflow-tooltip="true" min-width="150px">\
                <template slot="header" slot-scope="scope">\
                    <span style="padding-left:20px">{{thTitle}}</span>\
                </template>\
                <template slot-scope="scope">\
                    <el-checkbox v-on:change="checkedHandel(scope.row)" v-show="!scope.row.disabled" :disabled="scope.row.disabled" v-model="scope.row.checked">{{ scope.row.label }}<span style="color:#999;padding-left:15px;">{{scope.row.remark }}</span></el-checkbox>\
                    <span v-show="scope.row.disabled">{{scope.row.label}}<span style="color:#999;padding-left:15px;" >{{scope.row.remark}}</span></span>\
              </template>\
            </el-table-column>\
        </el-table>\
        <ui-page-panel style="text-align: right;" v-model="pageInfos" v-on:change="loadData" v-show="showPagePanel"></ui-page-panel>\
        <div style="padding-left:30px;margin-top: 20px;">\
            <el-button size="small" type="primary" v-on:click="confirmSelect">确定</el-button>\
            <el-button size="small" v-on:click="closeSelf">关闭</el-button>\
        </div>\
    </div>\
</el-dialog>',
    props: {
        title: { //--------标题
            type: String,
            default: ''
        },
        width: {
            type: String,//-------宽度
            default: '50%'
        },
        value: {  //------------默认选中值
            type: Array | String | Number,
            default: function () {
                return [];
            }
        },
        url: {  //-----------Api地址
            type: String,
            default: ''
        },
        height: {  //-----------高度
            type: String,
            default: 'auto'
        },
        pageInfo: {
            type: Object,
            default: function () {
                return {}
            }
        },
        multiple: {
            type: Boolean,
            default: true
        },
        thTitle: {
            type: String,
            default: '标题'
        },
        dataSource: {
            type: Array,
            default: function () {
                return [];
            }
        },
        props: {   //属性配置
            type: Object,
            default: function () {
                return { label: 'label', value: 'value', remark: "", children: "children", checkStrictly: false, showSearch: true }
            }
        }
    },
    data: function () {
        return {
            tableData: [],
            selectList: [],
            pageInfos: this.pageInfo,
            showPagePanel: true,
            showSearch: true,
            classify: [],//分类
            searchInfo: { keyword: "" },
            loading: true,
            dialogVisible: false,
            SelectionChangeFlg: true,
            newValue: [],
            cascaderKey: "",
        }
    },
    methods: {
        classifyChange: function () {//分类改变
            this.loadData();
        },
        formatDataList: function (dataList) { //对数据列表进行格式化，并设置对应属性
            var _this = this;
            var props = _this.props;
            props = extend({ label: "label", value: "value", remark: "", children: "children", only: false, showSearch: true }, props);
            var lableField = props.label; //label字段
            var valueField = props.value; //value字段
            var remarkField = props.remark; //remark字段
            var childrenField = props.children;
            var parentOptions = _this.$parent.optionsList; //获取父级下拉数据
            var checkStrictly = props.checkStrictly;
            _this.showSearch = props.showSearch;//控制搜索是否显示
            function formatDataList(list, parentLabel) { //对options数据进行格式化
                list.forEach(function (optionsItem) {
                    if (!optionsItem.hasOwnProperty("label") && !isNullOrEmpty(lableField)) {
                        optionsItem["label"] = optionsItem[lableField];
                    }
                    if (parentLabel != undefined) {
                        optionsItem["nodePath"] = parentLabel + ">" + optionsItem["label"];
                    } else {
                        optionsItem["nodePath"] = optionsItem["label"];
                    }
                    if (!optionsItem.hasOwnProperty("value") && !isNullOrEmpty(valueField)) {
                        optionsItem["value"] = optionsItem[valueField];
                    }
                    if (!optionsItem.hasOwnProperty("remark") && !isNullOrEmpty(remarkField)) {
                        optionsItem["remark"] = optionsItem[remarkField];
                    }
                    if (!optionsItem.hasOwnProperty("children") && !isNullOrEmpty(childrenField)) {
                        optionsItem["children"] = optionsItem[childrenField];
                    }
                    var rowValue = optionsItem["value"];
                    var idx = parentOptions.findIndex(function (item) { return item.value.toString() == rowValue.toString() });
                    if (idx >= 0) {
                        optionsItem.checked = true;
                    }
                    else {
                        optionsItem.checked = false;
                    }
                    var children = optionsItem["children"];
                    if (Array.isArray(children)) {
                        if (checkStrictly == false) {
                            optionsItem.disabled = true;
                        }
                        formatDataList(children, optionsItem["nodePath"]); //递归设置
                    }
                });
            }
            if (Array.isArray(dataList)) {
                formatDataList(dataList);
            }
        },
        getRowKey: function (row) {
            var props = this.props;
            props = extend({ label: "label", value: "value" }, props);
            return row["value"] || row[props.value];
        },
        loadClassify: function (responseData) {
            var _this = this;
            if (_this.classify.length > 0) //获取分类,只执行一次
            {
                return;
            }
            _this.classify = responseData.Classify;
            if (_this.classify == null || _this.classify == undefined) {
                _this.classify = [];
            }
            else {
                //构造v-model
                _this.classify.forEach(function (item) {
                    item.Model = "";
                });
            }
        },
        loadData: function (callbacks) {  //---------Api
            var _this = this;
            var searchInfos = { label: '' }
            var props = this.props;
            props = extend({ label: "label", value: "value" }, props);
            searchInfos[props.label] = _this.searchInfo.keyword;
            var serverData = extend(_this.$parent.data, searchInfos, _this.pageInfos);
            //构造分类搜索
            this.classify.forEach(function (item) {
                serverData[item.Field] = item.Model;
            });

            _this.ajax({
                url: _this.url,
                data: serverData,
                success: function (responseData) {
                    if (!isNullOrEmpty(responseData)) {
                        var dataList;
                        if (Array.isArray(responseData)) {
                            dataList = responseData;
                        } else if (Array.isArray(responseData.Data)) {
                            dataList = responseData.Data;
                        }
                        if (!isNullOrEmpty(responseData.PageInfo)) {
                            _this.pageInfos = responseData.PageInfo;
                        } else {
                            _this.showPagePanel = false;
                        }
                        _this.formatDataList(dataList)
                        _this.tableData = dataList;
                        _this.loading = false;
                        _this.loadClassify(responseData);//加载分类
                    }
                    if (callbacks != undefined && typeof callbacks != 'object') {
                        callbacks()
                    }
                }
            });
        },
        loadDataSource: function () {//加载自定义数据源
            var _this = this;
            var dataSource = JSON.parse(JSON.stringify(_this.dataSource));
            _this.formatDataList(dataSource);
            _this.tableData = dataSource;
            _this.loading = false;
            _this.showPagePanel = false;
            _this.showSearch = false;
        },
        checkedHandel: function (rows) { //点击选项触发
            if (!this.multiple) {
                function singleCheck(list) {
                    list.forEach(function (item) {
                        if (item.value.toString() !== rows.value.toString()) {
                            item.checked = false;
                        }
                        if (Array.isArray(item.children)) {
                            singleCheck(item.children);
                        }
                    });
                }
                singleCheck(this.tableData);
            }
        },
        inits: function () {  //----------打开窗口时执行回调
            var _this = this;
            var selectedModel = deepCopy(this.$parent.selectedModel);
            if (_this.multiple) {
                if (isNullOrEmpty(selectedModel)) {
                    selectedModel = [];
                } else if (Array.isArray(selectedModel)) {
                    _this.newValue = selectedModel;
                } else {
                    selectedModel = [];
                }
            }
            else {
                _this.newValue[0] = selectedModel;
            }
            if (Array.isArray(_this.dataSource) && _this.dataSource.length > 0) {
                _this.loadDataSource();
            } else {
                this.pageInfos = this.pageInfo;
                this.loadData(function () {
                    setTimeout(function () {
                    }, 0);
                });
            }

        },
        confirmSelect: function () {  //--------确定按钮触发
            var _this = this;
            var options = JSON.parse(JSON.stringify(_this.$parent.optionsList));
            var selectedValue = [];
            if (this.multiple) {
                selectedValue = _this.newValue;
            }
            //console.log(selectedValue);
            function getSelected(dataList) {
                dataList.forEach(function (item) {
                    if (item.checked) {
                        selectedValue.remove(function (selectedValue) {
                            return selectedValue.toString() == item.value.toString();
                        });
                        selectedValue.push(item.value);
                        if (_this.multiple) {
                            options.remove(function (optionsItem) {
                                return optionsItem.value.toString() == item.value.toString();
                            });
                        }
                        else {
                            options.splice(0, options.length);
                        }
                        if (!isNullOrEmpty(item.nodePath)) {
                            item.label = item.nodePath;
                        }
                        options.push(item);
                    }
                    else {
                        selectedValue.remove(function (selectedValue) {
                            return selectedValue.toString() == item.value.toString();
                        });
                        options.remove(function (optionsItem) {
                            return optionsItem.value.toString() == item.value.toString();
                        });
                    }

                    var children = item["children"];
                    if (Array.isArray(children)) {
                        getSelected(children); //递归设置
                    }
                });
            }
            getSelected(this.tableData);

            if (this.multiple) {

            }
            else {
                if (Array.isArray(selectedValue)) {
                    if (selectedValue.length > 0) {
                        selectedValue = selectedValue[0];
                    } else {
                        selectedValue = "";
                    }
                }
            }
            _this.$emit('updateOptions', { options: options, selectedValue: selectedValue });//更新tagOptions
            _this.$emit('input', selectedValue)
            _this.$emit('updateModelValue', selectedValue);
            _this.closeSelf();
        },
        closeSelf: function () {  //------取消
            this.dialogVisible = false
        }
    }
})

//弹出选择器
Vue.component('ui-select-popup', {
    template: '<span>\
    <el-tag :key="tagItem.value" v-on:close="removeTag(tagItem.value)" v-for="tagItem in optionsList" closable :disable-transitions="false" style="margin-right:5px">\
     {{tagItem.label}}\
    </el-tag>\
    <el-button size="small" v-show="btnTitle!=\'\'"  style="position: relative;left:0px;top:2px;border-radius-left: 0 4px 4px 0;" v-on:click="openDialog">{{btnTitle}}</el-button>\
    <ui-select-popup-data ref="popupDialog" :props="props" @updateOptions="updateOptions" @updateModelValue="updateModelValue" :data-source="dataSource" v-model="selectedModel"  :multiple-limit="multipleLimit"  :th-title="thTitle" :multiple="multiple"  :pageInfo="pageInfo" :height="height" :url="url" :width="width" :title="title"  :visible="dialogVisable"></ui-select-popup-data>\
    </span>',
    mixins: [_selectCheckbox_],
    props: {
        optionsUrl: { //选中后转换的url，不设置则默认使用value和label对象，设置后将传递value参数到请求的url中获取
            type: String,
            default: ""
        },
        selectWidth: {  //------下拉宽度
            type: String,
            default: '100%'
        },
        btnTitle: {  //-------按钮标题
            type: String,
            default: '选择'
        },
        title: {   //----------顶部标题
            type: String,
            default: '选择界面'
        },
        url: {  //---------数据源的地址
            type: String,
            default: ''
        },
        width: {  //-----------对话框宽度
            type: String,
            default: '50%'
        },
        height: {  //-----------对话框高度
            type: String,
            default: 'auto'
        },
        pageInfo: {
            type: Object,
            default: function () {
                return {}
            }
        },
        collapseTags: {
            type: Boolean,
            default: true
        },
        thTitle: {
            type: String,
            default: '选择'
        },
        dataSource: {
            type: Array,
            default: function () {
                return [];
            }
        },
    },
    data: function () {
        return {
            isPopup: true, //重写data属性
            dialogVisable: false,//---------显示对话框
            serverData: this.data, //额外需要带到服务器端的参数对象
        }
    },
    watch: {
        data: {//监听options属性
            handler: function (newVal, oldVal) {
                this.serverData = newVal;
            },
            immediate: false,
        },
    },
    methods: {
        openDialog: function () {
            this.$refs.popupDialog.dialogVisible = true;
        },
        removeTag: function (tagValue) {
            var _this = this;
            var optionsList = deepCopy(_this.optionsList);
            optionsList.remove(function (item) { return item.value.toString() == tagValue.toString() });
            var remainValue = [];
            optionsList.forEach(function (item) {
                remainValue.push(item.value);
            });
            _this.optionsMiddleList = optionsList;
            _this.selectedMiddleValue = remainValue;
            _this.formatOptions();//格式化选项
            _this.formatValue();//格式化数据
            _this.updateModelValue(remainValue);//更新value
        },
        updateOptions: function (obj) { //弹出窗口选择后调用
            var _this = this;
            var newOptions = obj.options;
            var selectedValue = obj.selectedValue;
            if (isNullOrEmpty(_this.optionsUrl)) { //optionsUrl未设置有效。
                var _this = this;
                _this.optionsMiddleList = newOptions;
                _this.formatOptions();//格式化选项
            }
            else {
                _this.loadOptions(selectedValue, _this.optionsUrl);
            }
        },
    }
})

//发送验证码

Vue.component('ui-input-code', {
    template: "<el-input clearable  :placeholder='placeholder' v-model.trim='modelText'  :maxlength='maxlength' class='input-with-select' v-on:input='changeCode'>\
    <template slot='append'><el-button  :loading='btnloading' v-on:click='sendCode' :style=\"{cursor:sendCodeFlag?'pointer':'not-allowed'}\"  style='margin-left:-10px;margin-right:-10px'>{{btnTitleNews}} </el-button> </template>\
    </el-input>",
    data: function () {
        return {
            modelText: '',
            parameter: {},//--------Api参数
            sendCodeFlag: true,//-------是否可以发送
            btnTitleNews: '',
            delaySize: 120,//-----延迟秒数
            btnloading: false,
        }
    },
    created: function () {
        this.modelText = this.value;
        this.btnTitleNews = this.btnTitle
    },
    props: {
        placeholder: {
            type: String,
            default: '请输入验证码'
        },
        value: {
            type: String,
            default: ''
        },
        focusTarget: {
            type: String,
            default: ''
        },
        btnTitle: {
            type: String,
            default: '获取验证码'
        },
        type: {
            type: String,
            default: 'email'
        },
        urlApi: {
            type: String, //---------获取发送api
            default: '/E/SmsCode/Send'
        },
        urlCode: {  //-------获取TokenApi
            type: String,
            default: "/E/CodeBase/Send"
        },
        account: {   //---------获取手机号/email账号
            type: String,
            default: ''
        },
        maxlength:
        {
            type: Number,
            default: 6
        }
    },
    methods: {
        sendCode: function () {  //-发送验证码
            if (this.sendCodeFlag) {
                var _this = this

                var validationFlag = this.validationText();
                if (validationFlag) {
                    this.sendCodeFlag = false
                    this.btnloading = true
                    this.callToken(function () {
                        _this.callApi(_this.type)
                    })
                }
            }
        },
        changeCode: function (val) {//-------back-value
            this.$emit('input', val)
        },
        callToken: function (callbacks) {  //----------获取Token
            var _this = this
            _this.ajax({
                url: _this.urlCode,
                data: {},
                async: true,
                success: function (responseData) {
                    _this.parameter.Token = responseData.token;
                    callbacks()
                },
                error: function () {
                    setTimeout(function () {
                        _this.sendCodeFlag = true
                        _this.btnloading = false
                    }, 1000)
                    _this.$message.error('接口调用失败。请联系开发人员');
                }
            });
        },
        timingDelay: function () {  //--------定时器
            var _this = this
            var seconds = _this.delaySize;
            var time = setInterval(function () {
                if (seconds == _this.delaySize) {
                    _this.btnloading = false;
                }
                if (seconds <= 0) {
                    clearInterval(time)
                    _this.btnTitleNews = _this.btnTitle
                    _this.sendCodeFlag = true
                    return;
                }
                _this.btnTitleNews = seconds + '秒'
                --seconds;
            }, 1000)
        },
        callApi: function (type) {  //------调用Api
            var _this = this
            if (type == 'email') {
                this.parameter.email = this.account;
            }
            else {
                this.parameter.mobile = this.account;
            }
            _this.ajax({
                url: _this.urlApi,
                type: "post",
                data: _this.parameter,
                success: function (responseData) {
                    if (responseData.State == 1) {
                        _this.timingDelay()
                    }
                    else {
                        setTimeout(function () {
                            _this.btnloading = false
                            _this.sendCodeFlag = true
                            _this.$message.error(responseData.Msg);
                        }, 1000)
                    }
                },
                error: function () {
                    _this.btnloading = false
                    _this.sendCodeFlag = true
                    //_this.$message.error(responseData.Msg);
                }
            });
        },
        focus: function () {  //提示后获取焦点
            var focusTarget = this.focusTarget;
            if (focusTarget == "") {
                return;
            }
            var focusTarget = document.querySelector(focusTarget);
            if (focusTarget != null) {
                focusTarget.focus();
            }
        },
        validationText: function () {  //----------验证文本
            if (this.type == 'email') {
                if (this.account == '' || this.account == null) {
                    this.focus();
                    this.$message.error('请填写邮箱账号!')
                    return false
                }
                var emailFlag = isEmail(this.account);
                if (!emailFlag) {
                    this.focus();
                    this.$message.error("邮箱账号填写错误，请重新填写!");
                    return false;
                }
                else {
                    return true;
                }
            }
            if (this.type == 'mobile') {
                if (this.account == '' || this.account == null) {
                    this.focus();
                    this.$message.error('请填写手机号码!')
                    return false
                }
                var mobileFlag = isMobile(this.account);
                if (!mobileFlag) {
                    this.focus();
                    this.$message.error("手机号码填写错误，请重新填写!");
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    }
})

//图标选择器
Vue.component('icon-picker', {
    template: '<span>\
    <a class="el-button el-button--default"  size="small" v-show="showPreview" style="height:40px;overflow:hidden;border:1px dotted #ccc" v-on:click="openDialog"><i class="fa" style="font-size:16px" :class="iconClass(selectVal)"></i></a>\
    <a class="el-button el-button--default"  size="small" v-show="!showPreview" style="margin-left:0px;height:40px;overflow:hidden;border:1px dotted #ccc" v-on:click="openDialog"><i class="fa fa-plus" aria-hidden="true"> 选择</i></a>\
    <el-dialog title="选择图标" :visible.sync="dialogTableVisible"><ul style="height:250px;overflow-y:scroll;clear:both">\
    <li style="float:left;height:25px;width:25px;margin-right:20px;margin-bottom:10px" v-on:click="setSelected"><span style="font-size:14px;cursor:pointer;padding:5px;border:1px dotted #ccc" :style="iconActive()">空</span></li>\
    <li v-for="item in iconList" style= "float:left;height:25px;width:25px;margin-right:20px;margin-bottom:10px" v-on:click = "setSelected(item)" > <i style="font-size:18px;cursor:pointer;"  :style="iconActive(item)" class="fa" :class="iconClass(item)"></i></li >\
    </ul></el-dialog>\
    </span>',
    data: function () {
        return {
            iconList: ["fa-address-book", "fa-address-book-o", "fa-address-card", "fa-address-card-o", "fa-adjust", "fa-american-sign-language-interpreting", "fa-anchor", "fa-archive", "fa-area-chart", "fa-arrows", "fa-arrows-h", "fa-arrows-v", "fa-asl-interpreting", "fa-assistive-listening-systems", "fa-asterisk", "fa-at", "fa-audio-description", "fa-automobile", "fa-balance-scale", "fa-ban", "fa-bank", "fa-bar-chart", "fa-bar-chart-o", "fa-barcode", "fa-bars", "fa-bath", "fa-bathtub", "fa-battery", "fa-battery-0", "fa-battery-1", "fa-battery-2", "fa-battery-3", "fa-battery-4", "fa-battery-empty", "fa-battery-full", "fa-battery-half", "fa-battery-quarter", "fa-battery-three-quarters", "fa-bed", "fa-beer", "fa-bell", "fa-bell-o", "fa-bell-slash", "fa-bell-slash-o", "fa-bicycle", "fa-binoculars", "fa-birthday-cake", "fa-blind", "fa-bluetooth", "fa-bluetooth-b", "fa-bolt", "fa-bomb", "fa-book", "fa-bookmark", "fa-bookmark-o", "fa-braille", "fa-briefcase", "fa-bug", "fa-building", "fa-building-o", "fa-bullhorn", "fa-bullseye", "fa-bus", "fa-cab", "fa-calculator", "fa-calendar", "fa-calendar-check-o", "fa-calendar-minus-o", "fa-calendar-o", "fa-calendar-plus-o", "fa-calendar-times-o", "fa-camera", "fa-camera-retro", "fa-car", "fa-caret-square-o-down", "fa-caret-square-o-left", "fa-caret-square-o-right", "fa-caret-square-o-up", "fa-cart-arrow-down", "fa-cart-plus", "fa-cc", "fa-certificate", "fa-check", "fa-check-circle", "fa-check-circle-o", "fa-check-square", "fa-check-square-o", "fa-child", "fa-circle", "fa-circle-o", "fa-circle-o-notch", "fa-circle-thin", "fa-clock-o", "fa-clone", "fa-close", "fa-cloud", "fa-cloud-download", "fa-cloud-upload", "fa-code", "fa-code-fork", "fa-coffee", "fa-cog", "fa-cogs", "fa-comment", "fa-comment-o", "fa-commenting", "fa-commenting-o", "fa-comments", "fa-comments-o", "fa-compass", "fa-copyright", "fa-creative-commons", "fa-credit-card", "fa-credit-card-alt", "fa-crop", "fa-crosshairs", "fa-cube", "fa-cubes", "fa-cutlery", "fa-dashboard", "fa-database", "fa-deaf", "fa-deafness", "fa-desktop", "fa-diamond", "fa-dot-circle-o", "fa-download", "fa-drivers-license", "fa-drivers-license-o", "fa-edit", "fa-ellipsis-h", "fa-ellipsis-v", "fa-envelope", "fa-envelope-o", "fa-envelope-open", "fa-envelope-open-o", "fa-envelope-square", "fa-eraser", "fa-exchange", "fa-exclamation", "fa-exclamation-circle", "fa-exclamation-triangle", "fa-external-link", "fa-external-link-square", "fa-eye", "fa-eye-slash", "fa-eyedropper", "fa-fax", "fa-feed", "fa-female", "fa-fighter-jet", "fa-file-archive-o", "fa-file-audio-o", "fa-file-code-o", "fa-file-excel-o", "fa-file-image-o", "fa-file-movie-o", "fa-file-pdf-o", "fa-file-photo-o", "fa-file-picture-o", "fa-file-powerpoint-o", "fa-file-sound-o", "fa-file-video-o", "fa-file-word-o", "fa-file-zip-o", "fa-film", "fa-filter", "fa-fire", "fa-fire-extinguisher", "fa-flag", "fa-flag-checkered", "fa-flag-o", "fa-flash", "fa-flask", "fa-folder", "fa-folder-o", "fa-folder-open", "fa-folder-open-o", "fa-frown-o", "fa-futbol-o", "fa-gamepad", "fa-gavel", "fa-gear", "fa-gears", "fa-gift", "fa-glass", "fa-globe", "fa-graduation-cap", "fa-group", "fa-hand-grab-o", "fa-hand-lizard-o", "fa-hand-paper-o", "fa-hand-peace-o", "fa-hand-pointer-o", "fa-hand-rock-o", "fa-hand-scissors-o", "fa-hand-spock-o", "fa-hand-stop-o", "fa-handshake-o", "fa-hard-of-hearing", "fa-hashtag", "fa-hdd-o", "fa-headphones", "fa-heart", "fa-heart-o", "fa-heartbeat", "fa-history", "fa-home", "fa-hotel", "fa-hourglass", "fa-hourglass-1", "fa-hourglass-2", "fa-hourglass-3", "fa-hourglass-end", "fa-hourglass-half", "fa-hourglass-o", "fa-hourglass-start", "fa-i-cursor", "fa-id-badge", "fa-id-card", "fa-id-card-o", "fa-image", "fa-inbox", "fa-industry", "fa-info", "fa-info-circle", "fa-institution", "fa-key", "fa-keyboard-o", "fa-language", "fa-laptop", "fa-leaf", "fa-legal", "fa-lemon-o", "fa-level-down", "fa-level-up", "fa-life-bouy", "fa-life-buoy", "fa-life-ring", "fa-life-saver", "fa-lightbulb-o", "fa-line-chart", "fa-location-arrow", "fa-lock", "fa-low-vision", "fa-magic", "fa-magnet", "fa-mail-forward", "fa-mail-reply", "fa-mail-reply-all", "fa-male", "fa-map", "fa-map-marker", "fa-map-o", "fa-map-pin", "fa-map-signs", "fa-meh-o", "fa-microchip", "fa-microphone", "fa-microphone-slash", "fa-minus", "fa-minus-circle", "fa-minus-square", "fa-minus-square-o", "fa-mobile", "fa-mobile-phone", "fa-money", "fa-moon-o", "fa-mortar-board", "fa-motorcycle", "fa-mouse-pointer", "fa-music", "fa-navicon", "fa-newspaper-o", "fa-object-group", "fa-object-ungroup", "fa-paint-brush", "fa-paper-plane", "fa-paper-plane-o", "fa-paw", "fa-pencil", "fa-pencil-square", "fa-pencil-square-o", "fa-percent", "fa-phone", "fa-phone-square", "fa-photo", "fa-picture-o", "fa-pie-chart", "fa-plane", "fa-plug", "fa-plus", "fa-plus-circle", "fa-plus-square", "fa-plus-square-o", "fa-podcast", "fa-power-off", "fa-print", "fa-puzzle-piece", "fa-qrcode", "fa-question", "fa-question-circle", "fa-question-circle-o", "fa-quote-left", "fa-quote-right", "fa-random", "fa-recycle", "fa-refresh", "fa-registered", "fa-remove", "fa-reorder", "fa-reply", "fa-reply-all", "fa-retweet", "fa-road", "fa-rocket", "fa-rss", "fa-rss-square", "fa-s15", "fa-search", "fa-search-minus", "fa-search-plus", "fa-send", "fa-send-o", "fa-server", "fa-share", "fa-share-alt", "fa-share-alt-square", "fa-share-square", "fa-share-square-o", "fa-shield", "fa-ship", "fa-shopping-bag", "fa-shopping-basket", "fa-shopping-cart", "fa-shower", "fa-sign-in", "fa-sign-language", "fa-sign-out", "fa-signal", "fa-signing", "fa-sitemap", "fa-sliders", "fa-smile-o", "fa-snowflake-o", "fa-soccer-ball-o", "fa-sort", "fa-sort-alpha-asc", "fa-sort-alpha-desc", "fa-sort-amount-asc", "fa-sort-amount-desc", "fa-sort-asc", "fa-sort-desc", "fa-sort-down", "fa-sort-numeric-asc", "fa-sort-numeric-desc", "fa-sort-up", "fa-space-shuttle", "fa-spinner", "fa-spoon", "fa-square", "fa-square-o", "fa-star", "fa-star-half", "fa-star-half-empty", "fa-star-half-full", "fa-star-half-o", "fa-star-o", "fa-sticky-note", "fa-sticky-note-o", "fa-street-view", "fa-suitcase", "fa-sun-o", "fa-support", "fa-tablet", "fa-tachometer", "fa-tag", "fa-tags", "fa-tasks", "fa-taxi", "fa-television", "fa-terminal", "fa-thermometer", "fa-thermometer-0", "fa-thermometer-1", "fa-thermometer-2", "fa-thermometer-3", "fa-thermometer-4", "fa-thermometer-empty", "fa-thermometer-full", "fa-thermometer-half", "fa-thermometer-quarter", "fa-thermometer-three-quarters", "fa-thumb-tack", "fa-thumbs-down", "fa-thumbs-o-down", "fa-thumbs-o-up", "fa-thumbs-up", "fa-ticket", "fa-times", "fa-times-circle", "fa-times-circle-o", "fa-times-rectangle", "fa-times-rectangle-o", "fa-tint", "fa-toggle-down", "fa-toggle-left", "fa-toggle-off", "fa-toggle-on", "fa-toggle-right", "fa-toggle-up", "fa-trademark", "fa-trash", "fa-trash-o", "fa-tree", "fa-trophy", "fa-truck", "fa-tty", "fa-tv", "fa-umbrella", "fa-universal-access", "fa-university", "fa-unlock", "fa-unlock-alt", "fa-unsorted", "fa-upload", "fa-user", "fa-user-circle", "fa-user-circle-o", "fa-user-o", "fa-user-plus", "fa-user-secret", "fa-user-times", "fa-users", "fa-vcard", "fa-vcard-o", "fa-video-camera", "fa-volume-control-phone", "fa-volume-down", "fa-volume-off", "fa-volume-up", "fa-warning", "fa-wheelchair", "fa-wheelchair-alt", "fa-wifi", "fa-window-close", "fa-window-close-o", "fa-window-maximize", "fa-window-minimize", "fa-window-restore", "fa-wrench"],
            selectVal: this.value,
            dialogTableVisible: false,
        }
    },
    props: {
        value: {
            type: String,
            default: ""
        },
    },
    computed: {
        showPreview: function () //是否显示预览
        {
            return this.selectVal != undefined && this.selectVal != null && this.selectVal != "";
        },
    },
    methods: {
        openDialog: function () {
            this.dialogTableVisible = true;
        },
        setSelected: function (iconName) //点击图标触发
        {
            if (iconName == undefined) {
                iconName = "";
            }
            this.selectVal = iconName;
            this.$emit('input', iconName);
            this.dialogTableVisible = false;
        },
        clearVal: function () {
            this.selectVal = "";
            this.$emit('input', "");
        },
        iconActive: function (iconName) {
            if (iconName == undefined) {
                iconName = "";
            }
            var _this = this;
            if (iconName == _this.selectVal) {
                return { "color": "#409EFF", "font-weight": "bold" };
            }
        },
        iconClass: function (iconName) {
            return [iconName];
        },
    }
});

//管理列表附件展示组件
Vue.component('ui-list-attachment-display', {
    template: '<span>\
   <el-dropdown>\
        <span class="el-dropdown-link">\
             <a href="javascipt:void(0)" v-on:click="openUrl(firstFile)" v-if="showFirst" :title="firstFile.name">\
                <img :src="getThumbnail(firstFile)" class="thumbnail-mini" v-if="isImageList" :onerror="onLoadImageError"/>\
                <span v-else class="fa fa-cloud-download"> {{firstFile.name}}</span>\
            </a>\
            <i class="el-icon-arrow-down el-icon--right" v-if="showMore"></i>\
        </span>\
        <el-dropdown-menu slot="dropdown" v-if="showMore">\
            <el-dropdown-item v-for="item in fileListWithOutFirst" >\
                <a href="javascipt:void(0)" v-on:click="openUrl(item)" :title="item.name">\
                    <img :src="getThumbnail(item)" class="thumbnail-mini" v-if="isImageList" :onerror="onLoadImageError"/>\
                    <span v-else class="fa fa-cloud-download"> {{item.name}}<span></span> <span></span></span>\
                </a>\
            </el-dropdown-item>\
        </el-dropdown-menu>\
    </el-dropdown>\
    <el-dialog :visible.sync="dialogVisible" v-if="isImageList">\
        <el-carousel height="300px" type="card" trigger="click">\
            <el-carousel-item v-for="(item,index) in allFileList">\
                <span style="width:100%;height:100%;display:block;text-align:center;"><img style="max-width:100%;max-height:100%;" :src="loadImage(item)" :onerror="onLoadImageError"/></span>\
                <a :href="item.url" target="_blank" style="background-color:rgba(0,0,0,0.6);color:#fff;display:block;height:25px;width:100%;position:absolute;top:0px;left:0px;text-align:center;overflow:hidden">{{item.name}}</a>\
            </el-carousel-item>\
        </el-carousel>\
    </el-dialog>\
</span>',
    data: function () {
        return {
            imageLoaded: false,//图片是否加载过
            dialogVisible: false,//图片预览窗口
            allFileList: this.fileList,//所有图片
            firstFile: [], //第一条记录
            fileListWithOutFirst: [], //排除第一条记录的数组
            onLoadImageError: "this.style.display='none'"
        }
    },
    props: {
        fileList: {//附件集合，格式[{name:'',url:''}，{name:'',url:''}]
            type: Array,
            default: function () {
                return [];
            }
        },
        displayType: { //展示方式
            type: String,
            default: "file"
        },
    },
    created: function () {
        this.init();
    },
    computed: {
        isImageList: function () { //是否是图片类型附件
            return this.displayType == "image";
        },
        showFirst: function () {
            return this.firstFile != undefined && this.firstFile.url != undefined && this.firstFile.url != undefined
        },
        showMore: function () {
            return this.fileListWithOutFirst.length > 0;
        }
    },
    methods: {
        init: function () {
            if (isNullOrEmpty(this.allFileList)) {
                this.allFileList = [];
            }
            if (this.allFileList.length > 0) {
                this.firstFile = this.allFileList[0];
                this.fileListWithOutFirst = this.allFileList.slice(1);
            }
        },
        loadImage: function (item) {
            var img = new Image();
            img.src = item.url;
            img.onload = function () {
                item.url = img.src;
            }
            return item.url;
        },
        getThumbnail: function (file) { //获取缩略图路径
            var thumbnail = file.thumbnail;
            if (isNullOrEmpty(thumbnail)) {
                return file.url;
            }
            return thumbnail;
        },
        downFile: function (file) { //下载文件
            var url = file.url;
            var fileName = file.name;
            if (isImage(url)) { //图片直接打开
                window.open(url, "_blank");
            }
            else {//其他格式直接下载
                window.open("/e/download?file=" + urlEncode(url) + "&name=" + urlEncode(fileName), "_blank");
            }
        },
        openUrl: function (file) {//打开文件。
            var fileName = file.name;
            var url = file.url;
            if (this.displayType == "file") {
                this.downFile(file);//非图片改为直接下载
            }
            else {
                this.dialogVisible = true;
            }
        },
    }
});

//自定义组件
Vue.component('ui-script', {
    template: "<component :is='componentName' v-model='value' v-if='isTrue' :parameter='parameter'></component>",
    data: function () {
        return {
            isTrue: false,
        }
    },
    props: {
        value: {  //-----------数据源
            type: Array | String,
            default: ""
        },
        src: {  //js地址
            type: Array | String,
            default: ""
        },
        componentName: {  //组件名称
            type: String,
            default: ""
        },
        parameter: {  //自定义json参数
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    created: function () {
        var _this = this;
        var url = _this.src
        if (url != undefined && url != null && url != "") {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            document.head.appendChild(script);
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        script.onreadystatechange = null;
                        _this.isTrue = true;
                    }
                };

            } else {//其他浏览器
                script.onload = function () {
                    _this.isTrue = true;
                };
            }
        }
    },
    methods: {
    },
    watch: {
        value: {
            handler: function (newVal, oldVal) {
                this.$emit('input', newVal)
            },
            immediate: true,
            deep: true
        },
    },
})