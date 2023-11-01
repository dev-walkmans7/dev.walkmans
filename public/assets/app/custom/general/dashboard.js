"use strict";

// Class definition
var KTDashboard = function () {


    // Daily Sales chart.
    // Based on Chartjs plugin - http://www.chartjs.org/
    var dailySales = function() {
        var chartContainer = KTUtil.getByID('kt_chart_daily_sales');

        if (!chartContainer) {
            return;
        }


        // var apiBaseURL = `${window.location.origin}`; 

        // $.ajax({
        //     type: 'GET',
        //     url: apiBaseURL+`/dashboard/getdailytransactions`,
        //     data: {},
        //     beforeSend: function () {

        //     },
        //     success: function (result) {
        //         // alert("Ajax Called Succesfully");
        //         var total = 0;
        //         var strLegand = '';
        //         var dataArray = Array();
        //         var colorArray = Array();
        //         var labelArray = Array();
        //         result.data.forEach(function (item) {
        //             dataArray.push(item.daiy_sum_amount);
        //             if (item.status == 'Inactive') {
        //                 colorArray.push(KTApp.getStateColor('danger'));
        //             }
        //             colorArray.push(KTApp.getStateColor('success'));
        //             labelArray.push(item.date);
        //             total = parseInt(result.data.length);
        //         });
                
        //         var chartData = {
        //             labels: labelArray,

        //             datasets: [{
        //                 //label: 'Dataset 1',
        //                 backgroundColor: '#3d9e38',
        //                 data: dataArray
        //             }]
        //         };
        
        //         var chart = new Chart(chartContainer, {
        //             type: 'bar',
        //             data: chartData,
        //             options: {
        //                 title: {
        //                     display: false,
        //                 },
        //                 tooltips: {
        //                     intersect: false,
        //                     mode: 'nearest',
        //                     xPadding: 10,
        //                     yPadding: 10,
        //                     caretPadding: 10
        //                 },
        //                 legend: {
        //                     display: false
        //                 }, 
        //                 responsive: true,
        //                 maintainAspectRatio: false,
        //                 barRadius: 4,
        //                 scales: {
        //                     xAxes: [{
        //                         display: false,
        //                         gridLines: false,
        //                         stacked: true
        //                     }],
        //                     yAxes: [{
        //                         display: false,
        //                         stacked: true,
        //                         gridLines: false
        //                     }]
        //                 },
        //                 layout: {
        //                     padding: {
        //                         left: 0,
        //                         right: 0,
        //                         top: 0,
        //                         bottom: 0
        //                     }
        //                 }
        //             }
        //         });
                
        //     }
        // });


        var chartData = {
            labels: ["November", "December", "January", "February", "March", "April", "May"],
            datasets: [{
                //label: 'Dataset 1',
                // backgroundColor: '#3d9e38',
                backgroundColor: '#e36068',
                data: [
                    15, 20, 25, 30, 25, 20, 35
                ]
            }, 
            // {
            //     //label: 'Dataset 2',
            //     backgroundColor: '#f3f3fb',
            //     data: [
            //         15, 20, 25, 30, 25, 20, 15, 20, 25, 30, 25, 20, 15, 10, 15, 20
            //     ]
            // }
        ]
        };

        var chart = new Chart(chartContainer, {
            type: 'bar',
            data: chartData,
            options: {
                title: {
                    display: false,
                },
                tooltips: {
                    intersect: false,
                    mode: 'nearest',
                    xPadding: 10,
                    yPadding: 10,
                    caretPadding: 10
                },
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false,
                barRadius: 4,
                scales: {
                    xAxes: [{
                        display: false,
                        gridLines: false,
                        stacked: true
                    }],
                    yAxes: [{
                        display: false,
                        stacked: true,
                        gridLines: false
                    }]
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        });
    }

    var customerRegistrationShare = function () {
        if (!KTUtil.getByID('kt_chart_user_reg_share')) {
            return;
        }

        var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
        };

        $.ajax({
            type: 'GET',
            url: `https://${window.location.host}/dashboard/getallusercount`,
            data: {},
            beforeSend: function () {

            },
            success: function (result) {
                var total = 0;
                var strLegand = '';
                var dataArray = Array();
                var colorArray = Array();
                var labelArray = Array();
                result.data.forEach(function (item) {
                    dataArray.push(item.count);
                    if (item.name == 'user') {
                        colorArray.push(KTApp.getStateColor('success'));
                    }
                    labelArray.push(item.name);
                    total = parseInt(total) + parseInt(item.count);
                });

                // for (var i = 0; i < dataArray.length; i++) {
                //     var percent = parseFloat((parseInt(dataArray[i]) / parseInt(total)) * 100);
                //     var strLegand = strLegand + '<div class="kt-widget14__legend"><span class="kt-widget14__bullet kt-bg-success"></span><span class="kt-widget14__stats">' + percent + '% ' + labelArray[i] + '</span></div>';
                // }
                $('#total_user_count').html(total);
                $('#user_share_legend').html(strLegand);
                var config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: dataArray,
                            backgroundColor: colorArray
                        }],
                        labels: labelArray
                    },
                    options: {
                        cutoutPercentage: 75,
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: false,
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: 'Technology'
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        },
                        tooltips: {
                            enabled: true,
                            intersect: false,
                            mode: 'nearest',
                            bodySpacing: 5,
                            yPadding: 10,
                            xPadding: 10,
                            caretPadding: 0,
                            displayColors: false,
                            backgroundColor: KTApp.getStateColor('brand'),
                            titleFontColor: '#ffffff',
                            cornerRadius: 4,
                            footerSpacing: 0,
                            titleSpacing: 0
                        }
                    }
                };

                var ctx = KTUtil.getByID('kt_chart_user_reg_share').getContext('2d');
                var myDoughnut = new Chart(ctx, config);
            }
        });


    }
    
    //genre count section start
    var genreRegistrationShare = function () {
        if (!KTUtil.getByID('kt_chart_recipies_reg_share')) {
            return;
        }

        var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
        };

        $.ajax({
            type: 'GET',
            url: `https://${window.location.host}/dashboard/getallMealCount`,
            data: {},
            beforeSend: function () {

            },
            success: function (result) {
                var total = 0;
                var strLegand = '';
                var dataArray = Array();
                var colorArray = Array();
                var labelArray = Array();
                result.data.forEach(function (item) {
                    dataArray.push(result.data.length);
                    if (item.status == 'Inactive') {
                        colorArray.push(KTApp.getStateColor('danger'));
                    }
                    colorArray.push(KTApp.getStateColor('success'));
                    labelArray.push(item.title);
                    total = parseInt(result.data.length);
                });
                // for (var i = 0; i < dataArray.length; i++) {
                //     var percent = parseFloat((parseInt(dataArray[i]) / parseInt(total)) * 100);
                //     var strLegand = strLegand + '<div class="kt-widget14__legend"><span class="kt-widget14__bullet kt-bg-success"></span><span class="kt-widget14__stats"> ' + labelArray[i] + '</span></div>';
                // }
                $('#total_genre_count').html(total);
                $('#user_genre_legend').html('');
                var config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: dataArray,
                            backgroundColor: colorArray
                        }],
                        labels: labelArray
                    },
                    options: {
                        cutoutPercentage: 75,
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: false,
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: 'Technology'
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        },
                        tooltips: {
                            enabled: false,
                            intersect: true,
                            mode: 'nearest',
                            bodySpacing: 5,
                            yPadding: 10,
                            xPadding: 10,
                            caretPadding: 0,
                            displayColors: false,
                            backgroundColor: KTApp.getStateColor('brand'),
                            titleFontColor: '#ffffff',
                            cornerRadius: 4,
                            footerSpacing: 0,
                            titleSpacing: 0
                        }
                    }
                };

                var ctx = KTUtil.getByID('kt_chart_recipies_reg_share').getContext('2d');
                var myDoughnut = new Chart(ctx, config);
            }
        });


    }



    return {
        // Init demos
        init: function () {
            //customerRegistrationShare();
            //genreRegistrationShare();
            dailySales();
            // demo loading
            var loading = new KTDialog({
                'type': 'loader',
                'placement': 'top center',
                'message': 'Loading ...'
            });
            loading.show();

            setTimeout(function () {
                loading.hide();
            }, 1000);
        }
    };
}();

// Class initialization on page load
jQuery(document).ready(function () {
    KTDashboard.init();
});