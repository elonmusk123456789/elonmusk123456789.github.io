//数据类型
var frameUi_validateForm = window.frameUi_validateForm || {};
frameUi_validateForm.validateIdx =1;
var validateDataTypes = {};
//验证指定
Vue.directive('validate', { //初始化或组件中的key改变时会触发
    bind: function (el, binding, vnode, oldVnode) {
        var vue = vnode.context;
        var config = binding.value;
        var validateFormItems = vue.validateFormItems;
        if (validateFormItems == undefined) {
            validateFormItems = [];
            vue.validateFormItems = validateFormItems;
        }
        config.el = el;
        var idx = frameUi_validateForm.validateIdx;
        var oldIdx = -1;
        if (binding.oldValue && binding.oldValue.idx) {
            oldIdx = binding.oldValue.idx;
        } else {
            oldIdx = binding.value.idx;
        }
        if (oldIdx == undefined) {
            oldIdx = -1;
        }
        if (oldIdx >= 0) {
            config.idx = oldIdx;//序号
            config.binded = true;
            var arrayIndex = validateFormItems.findIndex(function (item) { return item.idx == oldIdx});
            if (arrayIndex >= 0) {
                validateFormItems[arrayIndex] = config;
            }
        } else
        {
            config.binded = true;
            config.idx = idx;//序号
            validateFormItems.push(config);
        }
        frameUi_validateForm.validateIdx++;
    },
    unbind: function (el, binding, vnode, oldVnode) { //v-if或key改变会触发
        var idx = -1;
        if (binding.oldValue != undefined) {
            idx = binding.oldValue.idx;
        }
        else {
            idx=binding.value.idx;
        }
        if (idx == undefined) { return; }
        var vue = vnode.context;
        var validateFormItems = vue.validateFormItems;
        var itemIdx = validateFormItems.findIndex(function (item) { return item.idx == idx });
        if (itemIdx >= 0) {
            var config = binding.value;
            config.binded = false;
            validateFormItems[itemIdx] = config;
        }
    },
    update: function (el, binding, vnode, oldVnode) {
        var vue = vnode.context;
        var validateFormItems = vue.validateFormItems;
        var idx = binding.oldValue.idx;
        var config = binding.value;
        config.el = el;
        config.idx = idx;//序号
        config.binded = true;
        if (idx>=0) {
            var arrayIndex = validateFormItems.findIndex(function (item) { return item.idx == idx }); {
                validateFormItems[arrayIndex] = config;
            } 
        }
    }
});

//vue全局验证
Vue.mixin({
    methods: {
        //验证
        validateForm: function (thisOptions, validateIndex) {
            var vue = this;
            var defaultOptions =
                {
                    showAllError: true,
                    dataTypes: {},//这里声明的是局部数据类型,也可以通过全局validateDataTypes在外部声明
                    tipsStyle: 1, //0,：alert， 1：msg  2,表单前后 ,3：all
                    errorClass: "validate-error",
                    tipsErrorAddClass: "validate-tips-error",
                    allTipsBoxTarget: ".validate-all-tips-box",
                    beforeCheck: null,
                    beforeSubmit: null
                };

            var defaultOptions = extend({}, defaultOptions, thisOptions);

            vue.validateFormConfig = defaultOptions;
            var showAllError = defaultOptions.showAllError;
            var dataTypes = defaultOptions.dataTypes;
            var tipsStyle = defaultOptions.tipsStyle;

            if (tipsStyle != 2) {
                showAllError = false;
            }
            var beforeCheck = defaultOptions.beforeCheck;
            var beforeSubmit = defaultOptions.beforeSubmit;
            var errorClass = defaultOptions.errorClass;   //验证出错后表单添加的样式
            var tipsErrorClass = defaultOptions.tipsErrorAddClass;  //错误提示添加的样式，tipsStyle为2时有效
            var allTipsBoxTarget = defaultOptions.allTipsBoxTarget;  //form第一行或最后一行提示信息的ul样式，tipsStyle为3时有效
            var validateFormItems = vue.validateFormItems;
            //console.log(validateFormItems)
            if (validateFormItems == undefined) {
                return true;
            }

            //开始验证
            var startValidate = function () {
                var canExecute = true;
                if (typeof (beforeCheck) == "string") {
                    if (beforeCheck != "") {
                        canExecute = eval(beforeExecute);
                    }

                }
                else if (typeof (beforeCheck) == "function") {
                    canExecute = beforeCheck();
                }
                if (typeof canExecute != "boolean") {
                    canExecute = true;
                }
                var validaResult;
                if (canExecute) {
                    validaResult = validating(); //开始遍历验证
                }
                else {
                    return false;
                }
                if (!validaResult) { return false; }
                if (typeof (beforeSubmit) == "string") {
                    if (beforeSubmit != "") {
                        canExecute = eval(beforeSubmit);
                    }
                }
                else if (typeof (beforeSubmit) == "function") {
                    canExecute = beforeSubmit();

                }
                if (typeof canExecute != "boolean") {
                    canExecute = true;
                }
                return canExecute;
            };

            //遍历所有数据，进行验证
            var validating = function () {
                var errorIndex = 0; //获取到错误的序号
                var validateResult = true;
                var $allTipsBoxTarget = null;
                if (allTipsBoxTarget) {
                    document.querySelector(allTipsBoxTarget);
                }
                if ($allTipsBoxTarget != null) {
                    $allTipsBoxTarget.innerHTML = "";
                }
                for (var i = 0; i < validateFormItems.length; i++) {
                    var validateConfig = validateFormItems[i];
                    if (!validateConfig.binded) { continue; }
                    var result = validateItem(validateConfig, errorIndex);
                    if (!result) {
                        errorIndex++;
                        validateResult = validateResult && result;
                    }
                    if (!showAllError) {
                        if (result == false) {
                            return false;  //如果不需要显示所有错误信息，则加return false跳出each循环
                        }
                    }
                }
                return validateResult;
            };

            var validateItem = function (validateConfig, errorIndex) {
                var defaultConfig = { dataType: "*", focusTarget: "", tipsTarget: "", regexp: "", getLengthByByte:false,minLength:0,maxLength: 0, nullMsg: "值不能为空！", errorMsg: "填写错误！", autoTruncated: true, maxLengthErrorMsg: "不能超过个{0}字符！", minLengthErrorMsg: "最少输入个{0}字符！", ignore: false, ignoreEmpty: false,compare: null, checkUrl: "", checkData: null, checkError: "", additionals: "", beforeExecute: null, execute: null };
                validateConfig = extend(defaultConfig, validateConfig);
                var $el = validateConfig.el;
                var validateTarget = validateConfig.validateTarget;
                var ignore = validateConfig.ignore;
                var focusTarget = validateConfig.focusTarget;
                var $focusTarget = null;

                if (focusTarget) {
                    $focusTarget = document.querySelector(focusTarget);
                }
                else {
                    $focusTarget = $el.querySelector(".el-input__inner");
                }
                if (ignore) {
                    return true;//继续下一个循环
                }
                var result = validateDataType(validateConfig);
                if ($focusTarget != null) {
                    if (showAllError) {
                        if (errorIndex == 0) {
                            if (result) {
                                $focusTarget.classList.remove(errorClass);
                            }
                            else {
                                $focusTarget.focus();
                                $focusTarget.classList.add(errorClass);
                            }
                        }
                    }
                    else {
                        if (result) {
                            $focusTarget.classList.remove(errorClass);
                        }
                        else {
                            $focusTarget.focus();
                            $focusTarget.classList.add(errorClass);
                        }
                    }
                }
                return result;
            };

            //验证数据类型，在Validating中调用，表单的的input和 propertychange事件会同时触发
            var validateDataType = function (validateConfig) {
                var dataType = validateConfig.dataType.trim();
                var regExpStr = validateConfig.regexp;
                var getLengthByByte = validateConfig.getLengthByByte;
                var minLength = validateConfig.minLength;
                var maxLength = validateConfig.maxLength;
                var minLengthErrorMsg = validateConfig.minLengthErrorMsg;
                var maxLengthErrorMsg = validateConfig.maxLengthErrorMsg;
                var autoTruncated = validateConfig.autoTruncated; //超过最大长度是否自动截断
                var nullMsg = validateConfig.nullMsg;
                var errorMsg = validateConfig.errorMsg;
                var ignoreEmpty = validateConfig.ignoreEmpty;
                var compare = validateConfig.compare;
                var checkUrl = validateConfig.checkUrl;
                var checkError = validateConfig.checkError;
                var checkAdditionals = validateConfig.additionals;
                var tipsTarget = validateConfig.tipsTarget;  //表单提示信息的span容器样式，没有定义则动态添加，tipsStyle为2时有效
                var validateTarget = validateConfig.validateTarget;
                var beforeExecute = validateConfig.beforeExecute;
                var execute = validateConfig.execute;
           
                var result = false;
                var gets = validateConfig.data;
                var resultType;
                if (gets === undefined || gets === null) {
                    gets = "";
                }
                var noMoreValidate = false;//表示是否继续后面的验证，对表单对比，远程ajax
                if (!validateConfig.hasOwnProperty("data")) {
                    noMoreValidate = true;
                    result = true;
                }
                if (!noMoreValidate) {
                    if (gets == "" && ignoreEmpty == true) //先进行非空忽略验证
                    {
                        noMoreValidate = true;
                        result = true;
                    }
                }
  
                //执行前
                if (!noMoreValidate && !isNullOrEmpty(beforeExecute)) {
                    if (typeof (beforeExecute) == "string") {
                        if (beforeExecute != "") {
                            result = eval(beforeExecute);
                        }
                    }
                    else if (typeof (beforeExecute) == "function") {
                        result = beforeExecute(validateConfig);
                    }
                    resultType = typeof (result);
                    if (resultType != "boolean") {
                        noMoreValidate = true;
                    }
                    else if (!result) {
                        noMoreValidate = true;
                    }
                }

                //接下来进行最小长度验证
                if (!noMoreValidate) {
                    if (minLength > 0) {
                        var currentLength = gets.strLength(getLengthByByte);
                        if (currentLength == 0) {
                            result = nullMsg;
                        }
                        else if (currentLength < minLength) {
                            result = minLengthErrorMsg.replace("{0}", minLength);
                        }
                        else {
                            result = true;
                        }
                        resultType = typeof (result);
                        if (resultType != "boolean") {
                            noMoreValidate = true;
                        }
                        else if (!result) {
                            noMoreValidate = true;
                        }
                    }
                }
                //接下来进行最大长度截取

                if (!noMoreValidate && typeof (gets) == "string") {
                    var currentLength = gets.strLength(getLengthByByte);
                    if (maxLength > 0 && currentLength > maxLength) {
                        if (autoTruncated) { //自动截断
                            var $input = validateConfig.el.querySelector(".el-input__inner");
                            if ($input != null) {
                                $input.value = gets.left(maxLength,getLengthByByte);
                                $input.dispatchEvent(new Event("input"));//触发v-model
                                $input.dispatchEvent(new Event("change"));//触发v-model
                            }
                        }
                        else {
                            result = maxLengthErrorMsg.replace("{0}", maxLength);
                            noMoreValidate = true;
                        }
                    }
                }
                //然后再进行数据类型验证
                if (!noMoreValidate) {

                    if (regExpStr != "")//有正则优先用正则匹配
                    {
                        var reg = new RegExp(regExpStr);
                        result = reg.test(gets);
                    }
                    else {

                        switch (dataType) {
                            case "":
                            case "*":
                                result = validateDataTypes.defaultDataType(gets, validateConfig);
                                break;

                            default:
                                var dataTypeFun = dataTypes[dataType]; //先检测dataTypes内部是否有定义，也可以用dataTypes.hasOwnProperty(dataType)判断
                                if (dataTypeFun == undefined) //如果找不到则到validateDataTypes中去找
                                {
                                    dataTypeFun = validateDataTypes[dataType];
                                }
                                if (typeof (dataTypeFun) != "function") {
                                    alert(dataType + "数据类型未定义");
                                    return false;
                                }
                                else {
                                    result = dataTypeFun(gets, validateConfig);//只能返回字符串，true或flase,字符串默认为false;
                                    if (typeof (result) == "string") {
                                        errorMsg = result;
                                        result = false;
                                    }
                                }
                                break;
                        }
                    }
                }

                resultType = typeof (result);
                if (resultType != "boolean") {
                    noMoreValidate = true;
                }
                else if (!result) {
                    noMoreValidate = true;
                }

                ///然后再进行比较验证
                if (!noMoreValidate) {
                    if (compare != null)//和其他值对别
                    {
                        if (gets != compare) {
                            result = errorMsg;
                        }
                    }
                }

                resultType = typeof (result);
                if (resultType != "boolean") {
                    noMoreValidate = true;
                }
                else if (!result) {
                    noMoreValidate = true;
                }


                //进行execute验证
                if (!noMoreValidate) {
                    if (typeof (execute) == "string") {
                        if (execute != "") {
                            result = eval(execute);
                        }
                    }
                    else if (typeof (execute) == "function") {
                        result = execute(validateConfig);
                    }
                }
                resultType = typeof (result);
                if (resultType != "boolean") {
                    noMoreValidate = true;
                }
                else if (!result) {
                    noMoreValidate = true;
                }

                //进行远程验证
                if (!noMoreValidate) {
                    if (checkUrl != "" && gets != "")//远程验证
                    {
                        var serverData = { data: gets };
                        var checkResult = ajax({ type: "post", url: checkUrl, data: serverData, async: false });//同步方法
                        checkResult = jsonParse(checkResult);
                        if (checkResult.State == 1) {

                        }
                        else if (checkResult.State == 0) {
                            if (checkError != "") {
                                result = checkError;
                            }
                            else {
                                result = checkResult.Msg;
                            }
                        }
                        else {
                            result = checkResult.Msg;
                        }
                    }
                }
                resultType = typeof (result); //每次验证后都需要重新获取
                if (resultType == "boolean") {

                }
                else if (resultType == "string") //返回字符串则表示不成功
                {
                    nullMsg = errorMsg = result;
                    result = false;
                }
                else {
                    result = false;
                    nullMsg = errorMsg = "填写错误（数据类型必须返回bool或字符串)！";
                }
                showTips(result, gets, nullMsg, errorMsg, validateConfig);
                return result;
            };


            //显示提示信息
            var showTips = function (result, gets, nullMsg, errorMsg, validateConfig) {
                var tipsMsg = "";
                if (gets.toString() == "") {
                    tipsMsg = nullMsg;
                }
                else {
                    tipsMsg = errorMsg
                }
                switch (tipsStyle.toString()) {
                    case "1":
                        tipsStyle1(result, tipsMsg, validateConfig); //依赖layer.js
                        break;
                    case "2": //html显示
                        tipsStyle2(result, tipsMsg, validateConfig);
                        break;
                    case "3": //
                        tipsStyle3(result, tipsMsg, validateConfig);
                        break;
                    default:
                        defaultTipsStyle(result, tipsMsg, validateConfig);
                        break;
                }
            };

            //默认风格，采用alert
            var defaultTipsStyle = function (result, tipsMsg, validateConfig) {
                if (result) { return; }
                //console.log(validateConfig.el);
                alert(tipsMsg);
            };

            var tipsStyle1 = function (result, tipsMsg, validateConfig) {
                if (result) { return; }
                //console.log(validateConfig.el);
                vue.$message({ message: tipsMsg, type: "warning", showClose: true });
            };

            //容器内部显示
            var tipsStyle2 = function (result, tipsMsg, validateConfig) {
                var tipsTarget = validateConfig.tipsTarget;
                var $item = validateConfig.el;
                var $tipBox = null;
                if (tipsTarget) {
                    $tipBox = document.querySelector(tipsTarget);
                }
                if ($tipBox != null) {
                    var defaultText = $tipBox.getAttribute("data-default-text");
                    if (defaultText == undefined) {
                        defaultText = $tipBox.innerHTML;
                        $tipBox.setAttribute("data-default-text", defaultText);
                    }
                    if (result) {
                        $tipBox.innerHTML = defaultText
                        $tipBox.classList.remove(tipsErrorClass);
                    }
                    else {

                        $tipBox.innerHTML = tipsMsg;
                        $tipBox.classList.add(tipsErrorClass);
                    }
                    showAllError = true;
                }
                else {
                    if (!result) {
                        console.log(validateConfig.el);
                        ui.msg({ content: tipsMsg, type: "warning" });
                        showAllError = false;
                    }
                }
            };

            //顶部显示
            var tipsStyle3 = function (result, tipsMsg) {
                var $tipsBox = document.querySelector(allTipsBoxTarget);
                if ($tipsBox != null) {
                    if (result) {
                        $tipsBox.innerHTML = ""; //避免页面跳动
                        return;
                    }
                    //console.log(validateConfig.el);
                    $tipsBox.innerHTML = tipsMsg;
                }
            };

            if (validateIndex == undefined) {
                return startValidate();
            }
            else {
                if (tipsStyle == 2) {
                    return validateItem(validateFormItems[validateIndex], 0); //弹出提示不需要单个验证！
                }
            }
        },

    }
})


//默认验证
validateDataTypes.defaultDataType = function (gets, itemConfig) {
    if (Array.isArray(gets)) {
        if (gets.length == 0) {
            gets = "";
        }
    }
    if (gets == null || gets == undefined) { return false; }
    if (gets.toString().trim() == "") { return false; }
    return true;
}

//匹配字符串
validateDataTypes.string = function (gets, itemConfig) {
    if (isStr(gets)) {
        return true
    }
    else {
        return false;
    }
}

//匹配数值型,默认最小值是-2147483647，默认最大值是2147483647,支持小数
validateDataTypes.numeric = function (gets, itemConfig) {
    var defaultOptions = { max: 2147483647, min: -2147483647 };
    defaultOptions = extend({}, defaultOptions, itemConfig);
    var max = defaultOptions.max;
    var min = defaultOptions.min;
    if (!isNumeric(gets)) {
        return false
    }
    if (typeof (gets) == "string"){
        gets = parseFloat(gets);
    }
    if (gets > max) {
        return false;
    } else if (gets < min) {
        return false;
    }
    return true;
}


//匹配货币类型
validateDataTypes.money = function (gets, itemConfig) {
    var reg = /^([\u0024\u00A2\u00A3\u00A4\u20AC\u00A5\u20B1\20B9\uFFE5]\s*)(\d+,?)+\.?\d*\s*$/;
    return reg.test(gets)
}

//匹配中文
validateDataTypes.chinese = function (gets, itemConfig) {
    var reg = /^[\u4e00-\u9fa5]+$/;
    return reg.test(gets)
}

validateDataTypes.email = function (gets, itemConfig) {
    if (isEmail(gets)) {
        return true;
    }
    else {
        return false;
    }
}

validateDataTypes.mobile = function (gets, itemConfig) {
    if (isMobile(gets)) {
        return true;
    }
    else {
        return false;
    }
}

validateDataTypes.editor = function (gets, itemConfig) {
    var editorId = itemConfig.el.getAttribute("name");
    if (gets == "") {
        if (editorId != null) {
            var editorObj = UE.getEditor(editorId);
            editorObj.focus(true);
        }
        return false;
    }
    else {
        return true;
    }
}

validateDataTypes.username = function (gets, itemConfig) {
    if (isNullOrEmpty(gets)) {
        return "请填写用户名!";
    }
    else if (isNumeric(gets)) {
        return "用户名不能为纯数字!";
    }
    var len = gets.strLength(true);
    if (len < 4) {
        return "用户名最少由4个字符组成，中文占两个字符！";
    }
    else if (len > 16) {
        return "用户名不能超过16个字符，中文占两个字符!";
    }
   if (!isUserName(gets)) {

       return "用户名仅支持中英文、数字和下划线!";
    }
    return true;
}

validateDataTypes.password = function (gets, itemConfig) {
    if (isNullOrEmpty(gets)) {
        return "请填写密码!";
    }
    if (includeChinese(gets)) {
        return "密码不能包含中文字符!";
    }
    var len = gets.strLength();
    if (len < 6) {
        return "密码最少由6个字符组成!";
    }
    else if (len > 20) {
        return "密码不能超过20个字符!";
    }
    return true;
}

validateDataTypes.datetime = function (gets, itemConfig) {
    if (isDateTime(gets)) {
        return true;
    }
    else {
        return false;
    }
}

validateDataTypes.date = function (gets, itemConfig) {
    if (isDate(gets)) {
        return true;
    }
    else {
        return false;
    }
}


validateDataTypes.file = function (gets, itemConfig) {
    if (gets.indexOf(".") > 0 && gets.length >= 4 && gets.indexOf(".") < (gets.length - 1)) {
        return true;
    }
    else {
        return false
    }
}


//匹配身份证
validateDataTypes.idcard = function (gets, itemConfig) {
    var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];// 加权因子;
    var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];// 身份证验证位值，10代表X;
    if (gets.length == 15) {
        return isValidityBrithBy15IdCard(gets);
    } else if (gets.length == 18) {
        var a_idCard = gets.split("");// 得到身份证数组   
        if (isValidityBrithBy18IdCard(gets) && isTrueValidateCodeBy18IdCard(a_idCard)) {
            return true;
        }
        return false;
    }
    return false;

    function isTrueValidateCodeBy18IdCard(a_idCard) {
        var sum = 0; // 声明加权求和变量   
        if (a_idCard[17].toLowerCase() == 'x') {
            a_idCard[17] = 10;// 将最后位为x的验证码替换为10方便后续操作   
        }
        for (var i = 0; i < 17; i++) {
            sum += Wi[i] * a_idCard[i];// 加权求和   
        }
        valCodePosition = sum % 11;// 得到验证码所位置   
        if (a_idCard[17] == ValideCode[valCodePosition]) {
            return true;
        }
        return false;
    }

    function isValidityBrithBy18IdCard(idCard18) {
        var year = idCard18.substring(6, 10);
        var month = idCard18.substring(10, 12);
        var day = idCard18.substring(12, 14);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题   
        if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
            return false;
        }
        return true;
    }

    function isValidityBrithBy15IdCard(idCard15) {
        var year = idCard15.substring(6, 8);
        var month = idCard15.substring(8, 10);
        var day = idCard15.substring(10, 12);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
        if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
            return false;
        }
        return true;
    }
}

validateDataTypes.table = function (gets, itemConfig) {
    gets = gets.toString().trim();
    if (isLStr(gets)) {
        return checkKey(gets);
    }
    else {
        return "表名只能由字母，数字和下划线组成，而且首字母必须是英文！";
    }
}

validateDataTypes.field = function (gets, itemConfig) {
    gets = gets.toString().trim();
    if (isLStr(gets)) {
        return checkKey(gets);
    }
    else {
        return "字段只能由字母，数字组成，而且首字母必须是英文！";
    }
}

function checkKey(str) {
    str = str.toLowerCase();
    var keys = new Array("in", "as", "currentpage", "page", "pagesize", "order", "sa", "dbo", "system", "index", "by", "select", "from", "table", "tableid", "table_", "field_", "top", "asc", "desc", "count", "sum", "link", "update", "insert", "to", "values", "where", "delete", "join", "charge", "guid", "parentguid", "id");
    if (keys.findIndex(function (item) { item == str }) >= 0) {
        return "对不起，" + str + "为表名或字段名的屏蔽词，请重写设置!"
    }
    else {
        return true;
    }
}