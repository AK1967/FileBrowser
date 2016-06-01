'use strict';

angular.module('FileBrowserApp.controllers', [])
    .controller('FileBrowserController', [
        '$scope', 'fileBrowserService', function ($scope, fileBrowserService) {

            $scope.filterOneFrom = 0;
            $scope.filterOneTo = 10;
            $scope.filterTwoFrom = 10;
            $scope.filterTwoTo = 50;
            $scope.filterThreeFrom = 100;
            $scope.filterThreeTo = 100000;

            $scope.loading = true;

            $scope.GetTreeFiles = fileBrowserService.getTreeFiles().query().$promise.then(
                function (response) {
                    $scope.collectionFiles = angular.fromJson(response.list);
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }).finally(function () {
                    $scope.loading = false;
                });

            $scope.ViewFile = function () {
                var name = $("#viewFile").attr("value");
                $('#viewFile .modal-body').html('<div class="text-center" ng-if="loading"><img src="../Images/giphy.gif"/></div>');
                fileBrowserService.viewFile().query({ name: name }).$promise.then(
                    function (response) {
                        var textFromFile = response.data.substring(1, response.data.length - 1);

                        $('#viewFile .modal-body').html('<textarea class="form-control" style="resize:vertical; min-width: 100%" rows="20">' + textFromFile + '</textarea>');
                        $("#btnView").hide();
                    },
                    function (response) {
                        var errorMessage = "Error: " + response.status + " " + response.statusText;
                        $('#viewFile .modal-body').html('<div class="text-danger text-center" ng-if="loading">' + errorMessage + '</div>');
                    });
            };
        }
    ])

   .directive('collection', function () {
       return {
           restrict: 'E',
           replace: true,
           scope: {
               collection: '='
           },

           template: '<ul><member ng-repeat="member in collection" member="member"></member></ul>'
       };
   })
    .directive('member', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                member: '='
            },

            template: '<li><div id="{{member.NodeId}}" class="glyphicon glyphicon-file"  ng-if="member.ChildrenNode === null" ng-click="ShowViewFile(member)" value={{member.Size}}></div><div id="{{member.NodeId}}" class="glyphicon glyphicon-folder-close" ng-if="member.ChildrenNode !== null" ng-click="ExpandBranch(member.NodeId)" value =  {{member.Size}}></div> {{member.Node}}</li>',

            link: function (scope, element) {

                var node = scope.member.Node;

                if (angular.isArray(scope.member.ChildrenNode)) {
                    scope.treeNode = false;
                    scope.member.NodeId = "Dir_" + node.replace(/\\/g, "-slash-").replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\./g, "\\.").replace(/:/g, "");
                    element.append('<collection collection="member.ChildrenNode" ng-show="treeNode"></collection>');
                    $compile(element.contents())(scope);
                }
                else {
                    scope.member.NodeId = "File_" + node.replace(/\\/g, "-slash-").replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\./g, "\\.").replace(/:/g, "");
                };

                scope.ExpandBranch = function (nodeId) {

                    scope.countOne = 0;
                    scope.countTwo = 0;
                    scope.countThree = 0;

                    scope.treeNode = !scope.treeNode;

                    if (this.treeNode) {

                        $("#" + nodeId).removeClass('glyphicon-folder-close').addClass('glyphicon-folder-open');

                        $("[id^='File_" + nodeId.substr(4) + "']").each(function () {

                            var sizeFile = $(this).attr("value");

                            if (sizeFile >= parseFloat($("#filterOneFrom").attr("value")) && sizeFile <= parseFloat($("#filterOneTo").attr("value"))) {
                                scope.countOne = parseInt(scope.countOne) + 1;
                            }
                            else if (sizeFile > parseFloat($("#filterTwoFrom").attr("value")) && sizeFile <= parseFloat($("#filterTwoTo").attr("value"))) {
                                scope.countTwo = parseInt(scope.countTwo) + 1;
                            }
                            else if (sizeFile > parseFloat($("#filterThreeFrom").attr("value")) && sizeFile <= parseFloat($("#filterThreeTo").attr("value"))) {
                                scope.countThree = parseInt(scope.countThree) + 1;
                            };

                        });

                        $("#dirName").html("Path: " + scope.member.Node);
                        $("#countOne").html(scope.countOne);
                        $("#countTwo").html(scope.countTwo);
                        $("#countThree").html(scope.countThree);

                    } else if (!this.treeNode) {
                        $("#" + nodeId).removeClass('glyphicon-folder-open').addClass('glyphicon-folder-close');

                        $("#dirName").html("");
                        $("#countOne").html("");
                        $("#countTwo").html("");
                        $("#countThree").html("");
                    };
                };

                scope.ShowViewFile = function (member) {
                    var fileName = member.Node.substr(member.Node.lastIndexOf("\\") + 1);
                    var fileSize = member.Size;

                    $("#viewFile").attr('value', member.Node);
                    $('#viewFile .modal-title').html('File View: ' + fileName);
                    $('#viewFile .text-warning').html('Do you want to view file: ' + fileName + ' with size: ' + fileSize + ' bytes ?');

                    if (fileSize > 0) $('#viewFile').modal('show');
                };
            }
        };
    })
.directive('modal', function () {
    return {
        template: '<div id="viewFile" class="modal fade" visible="false">' +
            '<div class="modal-dialog">' +
              '<div class="modal-content">' +
                '<div class="modal-header">' +
                  '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="CloseView()">&times;</button>' +
                  '<h4 class="modal-title"></h4>' +
                '</div>' +
                '<div class="modal-body">' +
                 '<h4 class="text-warning text-center"></h4>' +
                '</div>' +
                '<div class="modal-footer">' +
                 '<div class="input-group input-group-btn">' +
                   '<button id="btnView" type="button" class="btn btn-success" ng-click="ViewFile()" >View</button>' +
                   '<button type="button" class="btn btn-default" data-dismiss="modal" ng-click="CloseView()">Close</button>' +
                  '</div>' +
                '</div>' +
            '</div>' +
          '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function (value) {
                if (value === true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = false;
                });
            });

            scope.CloseView = function () {
                $('#viewFile .modal-body').html('<h4 class="text-warning text-center"></h4>');
                $("#btnView").show();
            }
        }
    };
});





