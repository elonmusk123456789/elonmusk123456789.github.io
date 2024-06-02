$(function () {
    var $pa_flowrate = $("#pa_flowrate");
    var src = $pa_flowrate.attr("src");
    var id = Requestww("id", src);
    var sourceUrl = decodeURI(Referrer());
    var accessUrl = decodeURI(location.href);
    var utm_source = Requestww("utm_source");
    var utm_medium = Requestww("utm_medium");
    var utm_term = Requestww("utm_term");
    var utm_content = Requestww("utm_content");
    var utm_campaign = Requestww("utm_campaign");
    var userAgent = navigator.userAgent;
    $.ajax({
        url: "/p/PA-Flowrate/FlowrateApi/Add",
        type: "post",
        data: { SiteId: id, SourceUrl: sourceUrl, AccessUrl: accessUrl, UtmSource: utm_source, UtmMedium: utm_medium, UtmTerm: utm_term, UtmContent: utm_content, UtmCampaign: utm_campaign, UserAgent: userAgent},
        dataType: "json", //指定服务器返回的数据类型
        success: function (data) {
        }
    });
})
function Referrer()
{
    var ref = '';
    if (document.referrer.length > 0) {
        ref = document.referrer;
    }
    try {
        if (ref.length == 0 && opener.location.href.length > 0) {
            ref = opener.location.href;
        }
    } catch (e) { }
    return ref;
}

/*获取url参数*/
function Requestww(param, url) //获取url中参数
{
    if (param == undefined) {
        return "";
    }

    if (url == null) { url = location.href; }
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    var returnValue = "";
    for (var i = 0; i < paraString.length; i++) {
        var item = paraString[i].split("=");
        if (item.length == 2 && param.toLowerCase() == item[0].toLowerCase()) {
            if (returnValue != "") {
                returnValue += ",";
            }
            returnValue += item[1];
        }
    }
    if (typeof (returnValue) == "undefined") {
        return "";
    }
    else {
        return decodeURI(returnValue);
    }
}