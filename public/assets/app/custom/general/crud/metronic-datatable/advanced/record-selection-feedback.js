
"use strict";
// Class definition
var KTDatatableMealTypes = function () {
    // Private functions
    var options = {
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    url: `${location.protocol}//${window.location.host}/feedback/getall`,
                },
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
        },
        // layout definition
        layout: {
            scroll: true, // enable/disable datatable scroll both horizontal and
            // vertical when needed.
            height: 500, // datatable's body's fixed height
            footer: false // display/hide footer
        },

        // column sorting
        sortable: true,

        pagination: true,

        // columns definition

        columns: [

            // {
            //     field: 'user_id',
            //     title: 'User Name',
            //     sortable: true,
            //     template: '{{user_id}}',
            //     width: 300
            // },


            {
                field: 'user_name',
                title: 'User',
                sortable: true,
                // template: '{{user_id}}',

                template: function(row) {
                    return row.user_name;
                },
                width: 200
            },
            {
                field: 'date',
                title: 'Date',
                sortable: true,
                // template: '{{date}}',

                template: function(row) {
                    return row.date;
                },
                width: 200
            },
            {
                field: 'feedback_text',
                title: 'Feedback',
                sortable: true,
                // template: '{{feedback_text}}',

                template: function(row) {
                    return row.feedback_text;
                },
                width: 200
            },



            {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 120,
                overflow: 'visible',
                textAlign: 'left',
                autoHide: false,
                template: function (row) {
                    return '\
                    \<a href="' + location.protocol + "//" + window.location.host + '/feedback/detail/' + row._id + '" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Edit">\
                        <i class="flaticon-edit"></i>\
                    </a>';
                },
            }


            
        ],
    };

    // basic demo
    var mealTypesSelector = function () {

        options.search = {
            input: $('#generalSearch'),
        };

        var datatable = $('#mealTypesRecordSelection').KTDatatable(options);

        $('#kt_form_status').on('change', function () {
            datatable.search($(this).val(), 'Status');
        });

        $('#kt_form_type').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_form_status,#kt_form_type').selectpicker();

        datatable.on(
            'kt-datatable--on-check kt-datatable--on-uncheck kt-datatable--on-layout-updated',
            function (e) {
                var checkedNodes = datatable.rows('.kt-datatable__row--active').nodes();
                var count = checkedNodes.length;
                $('#kt_datatable_selected_number').html(count);
                if (count > 0) {
                    $('#kt_datatable_group_action_form').collapse('show');
                } else {
                    $('#kt_datatable_group_action_form').collapse('hide');
                }
            });

        $('#kt_modal_fetch_id').on('show.bs.modal', function (e) {
            var ids = datatable.rows('.kt-datatable__row--active').
                nodes().
                find('.kt-checkbox--single > [type="checkbox"]').
                map(function (i, chk) {
                    return $(chk).val();
                });
            var c = document.createDocumentFragment();
            for (var i = 0; i < ids.length; i++) {
                var li = document.createElement('li');
                li.setAttribute('data-id', ids[i]);
                li.innerHTML = 'Selected record ID: ' + ids[i];
                c.appendChild(li);
            }
            $(e.target).find('.kt-datatable_selected_ids').append(c);
        }).on('hide.bs.modal', function (e) {
            $(e.target).find('.kt-datatable_selected_ids').empty();
        });
        // $(document).on('click', '.KTStatusUpdate', function () {
        //     var elemID = $(this).data('id');
        //     swal.fire({
        //         title: ' Change Status ? ',
        //         // text: "You won't be able to revert this!",
        //         type: 'warning',
        //         showCancelButton: true,
        //         confirmButtonText: 'Yes, change it!',
        //         cancelButtonText: 'No, cancel!',
        //         reverseButtons: true
        //     }).then(function (result) {
        //         if (result.value) {
        //             window.location.href = `${window.location.protocol}//${window.location.host}/category/status-change/${elemID}`;
        //         }
        //     });
        // })
        // $(document).on('click', '.ktDelete', function () {
        //     var elemID = $(this).attr('id').replace('del-', '');
        //     swal.fire({
        //         title: 'Delete Record ?',
        //         text: "You won't be able to revert this!",
        //         type: 'warning',
        //         showCancelButton: true,
        //         confirmButtonText: 'Yes, delete it!',
        //         cancelButtonText: 'No, cancel!',
        //         reverseButtons: true
        //     }).then(function (result) {
        //         if (result.value) {
        //             window.location.href = `${location.protocol}//${window.location.host}/category/delete/${elemID}`;
        //         }
        //     });
        // });
    };



    return {
        // public functions
        init: function () {
            mealTypesSelector();
        },
    };
}();

jQuery(document).ready(function () {
    KTDatatableMealTypes.init();
});






