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
                    url: `${location.protocol}//${window.location.host}/booking/getall`,
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
            {
                field: 'date_of_appointment',
                title: 'Appointment Date',
                sortable: true,
                template: "{{date_of_appointment}}",
                width: 100
              },
              {
                field: 'date_of_booking',
                title: 'Booking`     Date',
                sortable: true,
                template: "{{date_of_booking}}",
                width: 100
              },

            {
                field: ' client',
                title: 'Client',
                sortable: true,
                template: '{{client}}',
                width: 100
            },
            {
                field: 'cleaner',
                title: 'Cleaner',
                sortable: true,
                template: '{{cleaner}}',
                width: 100,
                
            },
            {
                field: 'booking_status',
                title: 'Booking Status',
                sortable: true,
                template: '{{booking_status}}',
                width: 100,
                
            },
            {
                field: 'service',
                title: 'Service',
                sortable: true,
                template: '{{service}}',
                width: 100,
                textAlign: 'center',

            },
            {
                field: 'net_amount',
                title: 'Amount',
                sortable: true,
                // template: '{{user_amount}}',
                template: function(row){
                    console.log(row.net_amount);
                    return `$${row.net_amount.toFixed(2)}`
                },
                width: 100,
                textAlign: 'center',
                
            },
            
            
            
              
              
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
        $(document).on('click', '.KTStatusUpdate', function () {
            var elemID = $(this).data('id');
            swal.fire({
                title: 'Are you sure?',
                // text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {
                    window.location.href = `${window.location.protocol}//${window.location.host}/faq/status-change/${elemID}`;
                }
            });
        })
        $(document).on('click', '.ktDelete', function () {
            var elemID = $(this).attr('id').replace('del-', '');
            swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {
                    window.location.href = `${location.protocol}//${window.location.host}/faq/delete/${elemID}`;
                }
            });
        });
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