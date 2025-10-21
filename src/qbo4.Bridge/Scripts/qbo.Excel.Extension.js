qbo3.Popups.define({
    'InvokeExcelResults': 'Theme.ashx/Render?Transform=Templates/Excel/InvokeExcelResults.Popup.xslt'
});
qbo3.Excel = {
    invokeExcel: function (method, data, callbacks) {
        var self = this;
        self.renderStart = new Date();

        if (typeof (method) == 'object' && !data) data = method;

        self.data = this.data ? Object.merge(this.data, data) : data;
        self.data = Object.fromEntries(Object.entries(self.data).filter(([k, v]) => k.length > 0));

        if (self.method.contains('?')) {
            const queryString = self.method.substring(self.method.indexOf('?') + 1);
            let methodData = {};
            queryString.split('&').each(function (param) {
                let [key, value] = param.split('=');
                if (decodeURIComponent(key).trim() != '')
                    methodData[decodeURIComponent(key)] = decodeURIComponent(value || '');
            });
            Object.merge(self.data, methodData);
            self.method = self.method.substring(0, self.method.indexOf('?'));
        }

        var tableName = (self && self.options && self.options.data && self.options.data.CategorySource) ? self.options.data.CategorySource : self.options.columns[1];
        var excelUrl = 'excel/' + tableName + '/' + self.method;

        if (!self.data.EmailResults) {
            var duration = 0, recordCount = 0, target = self.options.target;
            if (target) {
                var durationElement = target.getElements('span.rendertime')[0];
                if (durationElement && durationElement.innerText.length > 0) {
                    var durationText = durationElement.innerText.substring(1).substring(0, durationElement.innerText.substring(1).indexOf(' '));
                    if (durationText && durationText.trim() != '' && (!durationText.trim().startsWith('0') || durationText.contains('.')))
                        duration = parseFloat(durationText);
                }

                if (duration == 0) {
                    var paginateElement = target.getElements('span[data-behavior=Paginate]')[0];
                    if (paginateElement && paginateElement.attributes['data-paginate-options'])
                        recordCount = JSON.decode(paginateElement.attributes['data-paginate-options'].value)?.count ?? recordCount;
                }
            }

            if (duration < 10 && recordCount < 500) {
                document.location = new URI(excelUrl + '?' + Object.toQueryString(self.data));
                return;
            }
        }

        self.popup(self.data.Popup || 'InvokeExcelResults', {
            save: function (data) {

                popup = this;

                self.Request = new Request.JSON({
                    url: excelUrl,
                    method: 'get',
                    data: Object.merge(data, self.data),
                    secure: false,
                    async: self.options.async,
                    onRequest: function () {
                        self.fireEvent('request' + self.method);
                        self.working();
                    },
                    onError: function (text, error) {
                        if (self.Request.getHeader('X-Login-Required')) {
                            self.workingComplete();
                            qbo3.Popups.get('ReLogin').retrieve('qbo.Popup').setOptions({ 'closeOnClickOut': false, 'closeOnEsc': false }).show();
                            return;
                        }
                    },
                    onComplete: function () {
                        if (this.getHeader('X-Alert'))
                            qbo3.alert(this.getHeader('X-Alert'));
                        if (this.getHeader('X-Alert-Success'))
                            qbo3.alert(this.getHeader('X-Alert-Success'), { css: 'alert alert-success' });
                        if (this.getHeader('X-Alert-Error'))
                            qbo3.alert(this.getHeader('X-Alert-Error'), { css: 'alert alert-error' });
                        if (this.getHeader('X-Alert-Info'))
                            qbo3.alert(this.getHeader('X-Alert-Info'), { css: 'alert alert-info' });

                        popup.popupCancel();
                    },
                    onSuccess: function (json, text) {
                        self.fireEvent('response' + self.method);
                        if (self.Request.getHeader('X-Login-Required')) {
                            qbo3.Popups.get('ReLogin').retrieve('qbo.Popup').show();
                            return;
                        }
                        self.responseJson(json, text);
                        self.fireEvent('success', self.method);
                        if (self && self.options && self.options.columns)
                            qbo3.behavior.fireEvent(self.options.columns[1] + '/' + self.method);
                    },
                    onFailure: function (xhr) {
                        self.workingComplete();
                        self.fireEvent('error', self.method);
                    }
                });
                self.Request.send();
                self.fireEvent('invoke' + self.method);
            }
        });
    }
}
qbo3.AbstractObject.implement(qbo3.Excel);