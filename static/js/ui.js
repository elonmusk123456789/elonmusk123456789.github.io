/*iframe弹出层,width和height支持百分比字符*/
var frameUi_ui = window.frameUi_ui || {};
frameUi_ui.dialog = function (params) {
    var maxmin = false;
    var width = params.width;
    if (typeof (width) == "undefined") {
        width = "100%";
    }
    var height = params.height;
    if (typeof (height) == "undefined") {
        height = "100%";
    }
    if (width == "100%") {
        maxmin = false;
    }
    var defaultoption = {
        type:"iframe",
        title: "标题",
        shadeClose: true,
        target: "self",
        data:{},
        url:"",
        content: "",
        callback: "",
        cancelCallback:""
    };
    params = extend(defaultoption, params);
    params.url = getUrl();
    var target = params.target;
    var containerId = "uiDialogContainer", titleBarId ="uiDialogTitleBar", btnConfirmId = "uiDialogConfirmBtn", btnCancelId = "uiDialogCancelBtn", btnCloseBtnId = "uiDialogCloseBtn";
    var alertIcon = { alert: '<i class="ui-alert-icon" aria-hidden="true"> </i> ', confirm: '<i class="ui-alert-icon ui-alert-confirm-icon" aria-hidden="true"> </i> ' };
    var $container;
    //创建容器
    function createContainer() {
        var $document = document;
        $container = $document.getElementById(containerId);
        if ($container == null) {
            $container = $document.createElement("div");
            $container.setAttribute("id", containerId);
            $container.setAttribute("class", "el-dialog__wrapper el-dialog__" + params.type);
            $container.setAttribute("style", "background: rgba(0, 0, 0,0.1);z-index: 2038;height:100%;overflow:hidden");
            var $body = $document.getElementsByTagName("body")[0];
            $body.insertBefore($container, ($body.children)[0]);
        }
        return $container;
    }
    function closeDialog()
    {
        $container.style.display = "none";
        $container.innerHTML = ""
    }
    //格式化参数
    function getUrl() {
        var url = params.url;
        var pararmString = formatParams(params.data);
        if (url.indexOf("?") > 0) {
            url += "&";
        }
        else {
            url += "?";
        }
        //console.log(url)
        return url + pararmString;
    }

    //对象转为参数连接
    function formatParams(data) {
        var arr = [];
        for (var name in data) {
            var val = data[name];
            if (val == null || val == undefined) {
                val = "";
            }
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(val));
        };
        return arr.join('&');
    }

    function createDialog() {
        $container = createContainer();
        var winSize = clientSize();
        var winHeight = winSize.height;
        if (height.indexOf("%") > 0) {
            height = parseInt((winHeight * parseInt(height.replace("%", "")) / 100));
        }
        else {
            height = parseInt(height.replace(/[^0-9]/ig, ""));
        }
        var marginTop = parseInt(winHeight / 2) - parseInt(height / 2);
        if (marginTop <= 0) {
            marginTop = 0;
        }
        $container.style.display = "block";
        var dialog= '<div role="dialog" aria-modal="true" class="el-dialog" style="width:' + params.width + ';height:' + params.height + ';margin-top:' + marginTop + 'px">';
        if (params.title) {

            dialog += '<div class="el-dialog__header" id="' + titleBarId +'" >';
            dialog += '<span class="el-dialog__title">' + params.title+'</span>';
            dialog += '<button type="button" aria-label="Close" class="el-dialog__headerbtn" id="' + btnCloseBtnId +'"><i class="el-dialog__close el-icon el-icon-close"></i></button>';
            dialog += '</div>';
            height = height - 54;
        }
        dialog += '<div class="el-dialog__body">';
        if (params.type == "iframe") {
            dialog += '<div id="_ui-modal-loading-container_"  style="width:100%;position: absolute;left: 0px;top: 0px;opacity: 0.5;background: url(/FrameUi/1.0/css/loading.gif) no-repeat center center;height:' + height + 'px"></div>';
            dialog += '<iframe id="_ui-modal-iframe-container_" src="' + params.url + '" style="width:100%;height:' + height + 'px" scrolling="auto" frameborder="0"></iframe>';
        }
        else {
            dialog += ' <div class="el-dialog__body">' + alertIcon[params.type] + params.content + '</div>';
            dialog += '<div class="el-dialog__footer"><span class="dialog-footer">';
            if (params.type == "confirm")
            {
                dialog += '<button type="button" class="el-button el-button--default" id="' + btnCancelId +'"><span>取 消</span></button>';
            }
            dialog += '<button type="button" class="el-button el-button--primary" id="' + btnConfirmId+'"><span>确 定</span></button> ';
            dialog +="</span></div>"
        }
        dialog += '</div>';
        dialog += '</div>';
        $container.innerHTML = dialog;
        if (params.type == "iframe") {
            var $loading = document.getElementById("_ui-modal-loading-container_");
            var $iframe = document.getElementById("_ui-modal-iframe-container_")
            $iframe.onload = function () {
            $loading.style.display = "none";
            };
        }

        if (document.getElementById(btnCancelId)!= null)
        {
            document.getElementById(btnCancelId).onclick = function () {
                params.cancelCallback && params.cancelCallback.call();
                closeDialog();
            }
       };
        if (document.getElementById(btnConfirmId)!= null) {
            document.getElementById(btnConfirmId).onclick = function () {
                params.callback && params.callback.call();
                closeDialog();
            }
       };

       //右上角的关闭
       if (document.getElementById(btnCloseBtnId) != null) {
           document.getElementById(btnCloseBtnId).onclick = function (e) {
               stopBubble(e);
               closeDialog();
           }
       };
       //标题
       if (document.getElementById(titleBarId) != null) {
           document.getElementById(titleBarId).onclick = function (e) {
               stopBubble(e);//阻止冒泡
           }
       };
       
       $container.onclick = function (e) {
            stopBubble(e);
            if (params.shadeClose) {
               closeDialog();
            }
        };
    }
    createDialog();
}
//关闭弹出层
frameUi_ui.closeDialog = function () {
    var $document = document;
    var containerId = "uiDialogContainer"
    var $container = $document.getElementById(containerId);
    if ($container != null) {
        $container.innerHTML = "";
        $container.style.display = "none";
    }
    stopBubble();
}
function closeSelf(callback) //关闭弹出层
{
    if (typeof callback == "function") {
        try {
           callback.call(this);
        }
        catch (err) {
            console.log(err);
        }
    }
    try {
        parent.frameUi_ui.closeDialog();
    }
    catch (err) {
        console.log(err);
    }
}

