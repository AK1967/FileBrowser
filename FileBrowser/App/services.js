'use strict';

angular.module('FileBrowserApp.services', ["ngResource"])
    .constant("baseUrl", "http://localhost:4752/")
    .service('fileBrowserService', [
        '$resource', 'baseUrl', function ($resource, baseUrl) {
            this.getTreeFiles = function () {
                return $resource(baseUrl + 'api/filebrowser', null, { query: { method: 'get', transformResponse: function (data) { return { list: angular.fromJson(data) } } } });
            };
            this.viewFile = function () {
                return $resource(baseUrl + 'api/filebrowser', name,
                    {
                        query: { method: 'post', params: { name: '@name' }, transformResponse: function (data) { return { data } } }
                    });
            };
        }
    ]);
