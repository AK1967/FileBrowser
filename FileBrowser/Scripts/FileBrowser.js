'use strict';

angular.module('ngFileBrowser', [])

.controller('ngFileBrowserController', function ($scope, $http) {

    $http.get('Api/FileBrowser').success(function (response) {
        $scope.collectionFiles = angular.fromJson(response);

    }).error(function () { alert("Error"); });
       
})   
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
            template: '<li><div class="glyphicon glyphicon-file"  ng-if="member.ChildrenNode === null" ng-click="SelectNode(member.Node)" data-toggle="modal" data-target="#myModal"></div><div id="{{member.Node}}" class="glyphicon glyphicon-folder-close" ng-if="member.ChildrenNode !== null" ng-click="ExpandBranch(member.Node)"></div>  {{member.Node}}</li>',
            link: function (scope, element) {
                if (angular.isArray(scope.member.ChildrenNode)) {
                    scope.treeNode = false;
                    element.append('<collection collection="member.ChildrenNode" ng-show="treeNode"></collection>');
                    $compile(element.contents())(scope);
                };
                scope.ExpandBranch = function (nodeId) {
                    scope.treeNode = !scope.treeNode;

                    var idElement = nodeId.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\./g, "\\.");

                    if (this.treeNode) {
                        $("#" + idElement).removeClass('glyphicon-folder-close').addClass('glyphicon-folder-open');
                    } else if (!this.treeNode) {
                        $("#" + idElement).removeClass('glyphicon-folder-open').addClass('glyphicon-folder-close');
                    };
                };
                scope.SelectNode = function (nodeId) {
                    alert(nodeId);
                };
            }
        };
    });



//(function () {

//    var fileBrowserModule = angular.module('ngFileBrowser', []);

//    fileBrowserModule.directive('collection', function () {
//        return {
//            restrict: 'E',
//            replace: true,
//            scope: {
//                collection: '='
//            },
//            template: '<ul><member ng-repeat="member in collection" member="member"></member></ul>'
//        };
//    });

//    fileBrowserModule.directive('member', function ($compile) {
//        return {
//            restrict: 'E',
//            replace: true,
//            scope: {
//                member: '='
//            },
//            template: '<li><span class="glyphicon glyphicon-folder-close" ng-if="member.ChildrenNode !== null"><button class="btn-link" ng-click="ExpandBranch(member.Node)"></button></span>{{member.Node}}</li>',
//            link: function (scope, element) {
//                if (angular.isArray(scope.member.ChildrenNode)) {
//                    scope.treeNode = false;
//                    element.append('<collection collection="member.ChildrenNode" ng-show="treeNode"></collection>');
//                    $compile(element.contents())(scope);
//                };
//                scope.ExpandBranch = function () {scope.treeNode = !scope.treeNode; };
//            }
//        };
//    });

//    fileBrowserModule.controller('ngFileBrowserController', function ($scope, $http) {

//        $http.get('Api/FileBrowser').success(function (response) {
//            //   $scope.files =angular.fromJson('[{"Node": "Hello","ParentNode": "1"},{"Node": "Goodbye","ParentNode": "2"}]');
//            $scope.collectionFiles = angular.fromJson(response);

//        }).error(function () { alert("Error"); });
       
//    });
//})();

