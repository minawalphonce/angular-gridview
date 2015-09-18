(function() {
    'use strict';

    angular
        .module('ngGridview')
        .directive('ciiGrid', ciiGrid);

    function ciiGrid()
    {
        // Usage:
        //     <ciiGrid></ciiGrid>
        // Creates:
        // 
        var directive = {
            scope: false,
            controller:ciigridController,
            restrict: 'EA',
            compile : compile
        };

        function compile(tElement, tAttributes)
        {
            /* reformat the HTML before compiling*/

            //header.
            var sortElments = angular.element("[cii-grid-sortexpression],[data-cii-grid-sortexpression]", tElement);
            sortElments.each(function ()
            {
                var sortEl = $(this);
                var sortExpression = sortEl.attr("cii-grid-sortexpression") || sortEl.attr("data-cii-grid-sortexpression");
                $(this).attr({
                    "ng-click": "ciiGrid.$$sort('" + sortExpression + "')",
                    "href": "javascript:void(0)"
                });
            });

            //body.
            var bodyElement = angular.element("[data-cii-grid-data-template],[cii-grid-data-template]", tElement);
            bodyElement.attr(
                {
                    "ng-Repeat": "item in ciiGrid.$$dataSource",
                    "ng-show": "ciiGrid.$$loaded && ciiGrid.$$dataSource && ciiGrid.$$dataSource.length"
                });

            //empty 
            var emptyElement = angular.element("[data-cii-grod-empty-template],[cii-grod-empty-template]", tElement);
            emptyElement.attr(
                {
                    "ng-show": "ciiGrid.$$loaded && (!ciiGrid.$$dataSource || !ciiGrid.$$dataSource.length)"
                });
            //pagger.
            var paggerElements = angular.element("[data-cii-grid-data-pager],[cii-grid-data-pager]", tElement);

            var container = paggerElements.filter("[data-cii-grid-data-pager='container'],[cii-grid-data-pager='container']");
            container.attr("ng-if", 'ciiGrid.$$pagingOptions.$$pagingAllowed');

            var first = paggerElements.filter("[data-cii-grid-data-pager='first'],[cii-grid-data-pager='first']");
            first.attr({ "ng-click": "ciiGrid.$$page('first')", "href": "javascript:void(0)" })
                 .text("<<")
                 .parent()
                 .attr({ "ng-show": "ciiGrid.$$pagingOptions.firstEnabled" });

            var next = paggerElements.filter("[data-cii-grid-data-pager='next'],[cii-grid-data-pager='next']");
            next.attr({ "ng-click": "ciiGrid.$$page('next')", "href": "javascript:void(0)" })
                .text(">")
                .parent()
                .attr({ "ng-class": "{'disabled' : !ciiGrid.$$pagingOptions.nextEnabled}" });

            var numeric = paggerElements.filter("[data-cii-grid-data-pager='numeric'],[cii-grid-data-pager='numeric']");
            numeric.attr({ "ng-click": "ciiGrid.$$page(i)", "href": "javascript:void(0)" })
                   .text("{{i + 1}}")
                   .parent()
                   .attr({ "ng-repeat": "i in ciiGrid.$$pagingOptions.visiblePageRange", "ng-class": "{'active' : i === ciiGrid.$pageIndex}" });


            var prev = paggerElements.filter("[data-cii-grid-data-pager='prev'],[cii-grid-data-pager='prev']");
            prev.attr({ "ng-click": "ciiGrid.$$page('prev')", "href": "javascript:void(0)" })
                .text("<")
                .parent()
                .attr({ "ng-class": "{'disabled' : !ciiGrid.$$pagingOptions.prevEnabled}" });


            var last = paggerElements.filter("[data-cii-grid-data-pager='last'],[cii-grid-data-pager='last']");
            last.attr({ "ng-click": "ciiGrid.$$page('last')", "href": "javascript:void(0)" })
                .text(">>")
                .parent()
                .attr({ "ng-show": "ciiGrid.$$pagingOptions.lastEnabled" });

            //-----------------------------------------------------------------
            return (link);
        }
        function link(scope, element, attrs, gridCtrl)
        {
            if (scope.ciiGrid.$options.autoLoad)
                gridCtrl.execute();
        }

        return directive;
    }
    ciigridController.$inject = ['$scope', '$attrs', '$parse'];

    function ciigridController($scope, $attrs, $parse)
    {
        var _this = this;
        //private 
        var lastSortExpressionDirection = "";
        //public:
        _this.execute = execute;
        //ctor
        (function ctor()
        {
            $scope.ciiGrid = {
                $$selectMethod: $parse($attrs.ciiGridSelectMethod),
                $$loaded : false,
                $options: {
                    allowPagging: false,
                    allowSorting: false,
                    autoLoad: false,
                    pageSize: 10,
                    visiblePageNumbers : 10,
                },

                $$sort: sort,
                $sortExpression: '',

                $$pagingOptions: {},
                $$page: page,
                $pageIndex: 0,

                $bind : bind
            };

            var options = $parse($attrs.ciiGrid)($scope);
            angular.extend($scope.ciiGrid.$options, options);
        })();
        //-------------------------------------- 
        function execute()
        {
            $scope.ciiGrid.$$selectMethod($scope, {
                sortExpression: $scope.ciiGrid.$sortExpression,
                pageIndex: $scope.ciiGrid.$pageIndex,
                pageSize: $scope.ciiGrid.$options.pageSize
            }).then(function (result)
            {
                $scope.ciiGrid.$$loaded = true;
                $scope.ciiGrid.$$dataSource = result.data.Items;
                var totalCount = result.data.TotalCount;

                if (totalCount <= $scope.ciiGrid.$options.pageSize)
                {
                    $scope.ciiGrid.$$pagingOptions.$$pagingAllowed = false;
                    return;
                }
                var $$pagingOptions = { $$pagingAllowed: true };

                $$pagingOptions.totalPageNumbers = Math.ceil(totalCount / $scope.ciiGrid.$options.pageSize);

                var preNum = Math.ceil($scope.ciiGrid.$options.visiblePageNumbers / 2);
                var nextNum = $scope.ciiGrid.$options.visiblePageNumbers - preNum;

                var visibleRangeStart = Math.max(0, $scope.ciiGrid.$pageIndex - preNum);
                var visibleRangeEnd = Math.min($$pagingOptions.totalPageNumbers - 1, $scope.ciiGrid.$pageIndex + nextNum);

                $$pagingOptions.visiblePageRange = [];
                for (var i = visibleRangeStart; i <= visibleRangeEnd; i++)
                    $$pagingOptions.visiblePageRange.push(i);

                $$pagingOptions.prevEnabled = $scope.ciiGrid.$pageIndex != 0;
                $$pagingOptions.nextEnabled = $scope.ciiGrid.$pageIndex < $$pagingOptions.totalPageNumbers - 1;

                $$pagingOptions.firstEnabled = visibleRangeStart != 0;
                $$pagingOptions.lastEnabled = visibleRangeEnd != $$pagingOptions.totalPageNumbers - 1;

                $scope.ciiGrid.$$pagingOptions = $$pagingOptions;
            });
        }

        function sort(sortExpression)
        {
            if ($scope.ciiGrid.totalCount <= 0)
                return;

            if ($scope.ciiGrid.$sortExpression == sortExpression)
            {
                lastSortExpressionDirection = " desc";
                $scope.ciiGrid.$sortExpression = sortExpression + lastSortExpressionDirection;
            }
            else
            {
                lastSortExpressionDirection = "";
                $scope.ciiGrid.$sortExpression = sortExpression;
            }
            $scope.ciiGrid.$pageIndex = 0;
            execute();
        }

        function page(action)
        {
            if (action == "first")
                $scope.ciiGrid.$pageIndex = 0;
            else if (action == "last")
                $scope.ciiGrid.$pageIndex = $scope.ciiGrid.$$pagingOptions.totalPageNumbers - 1;
            else if (action == "next")
            {
                if ($scope.ciiGrid.$pageIndex >= $scope.ciiGrid.$$pagingOptions.totalPageNumbers - 1)
                    return;

                $scope.ciiGrid.$pageIndex++;
            }
            else if (action == "prev")
            {
                if ($scope.ciiGrid.$pageIndex <= 0)
                    return;

                $scope.ciiGrid.$pageIndex--;
            }
            else if (angular.isNumber(action))
                $scope.ciiGrid.$pageIndex = parseInt(action);
            else
                return;
            execute();
        }

        function bind()
        {
            lastSortExpressionDirection = "";
            $scope.ciiGrid.$pageIndex = 0;
            execute();
        }
    }
})();