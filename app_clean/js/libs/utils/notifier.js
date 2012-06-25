define(function () {
    return {
        ERROR:'error',
        WARNING:'warning',
        SUCCESS:'success',
        INFO:'info',
        alertDialog:function (title, msg) {
            require(['views/msg/modal/alert'], function (ModalAlertView) {

                if (arguments.length) {
                    var header = title || 'Alert!';
                    var modalAlertView = new ModalAlertView({
                        body:msg,
                        header:title || 'Alert!'
                    });

                    modalAlertView.render().$el.modal();
                }
            });
        },
        confirmDialog:function (title, msg, buttonLabel, onConfirm, onCancel) {
            require(['views/msg/modal/confirm'], function (ModalConfirmView) {
                // confirm should be moved on app wide functions?
                var modalConfirmView = new ModalConfirmView({
                    //model:this.model,
                    header:title || 'Confirm Delete',
                    body:msg || 'Are you sure you want to delete this item?',
                    buttonLabel:buttonLabel || 'delete',
                    onConfirm:onConfirm,
                    onCancel:onCancel
                });
                modalConfirmView.render().$el.modal();
            });
        },
        notify:function (msg, type) {
            $head = $('.head');

            if ($head.length && arguments.length) {
                type = type || this.WARNING;
                require(['views/msg/alert'], function (AlertView) {
                    var alertView = new AlertView({msg:msg, type:type});
                    $head.html(alertView.render().el);
                });
            }
            else {
                /* horrible way to end :) */
                alert(msg);
            }
        }
    };
});
