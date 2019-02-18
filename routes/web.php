<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the 'web' middleware group. Now create something great!
|
*/

Route::get('/', 'MainController@index')->name('home');

Route::get('auth/login/demo', 'LoginController@loginDemo')->name('login.demo');
Route::get('auth/login', 'LoginController@login')->name('login');
Route::get('auth/callback', 'LoginController@callback')->name('login.callback');
Route::get('auth/logout', 'LoginController@logout')->name('logout');

Route::group([ 'middleware' => 'token' ], function () {
    Route::get('/api/account/verify_credentials', 'ApiController@verifyCredentials')->name('api.account.verify_credentials');
    Route::get('/api/lists/list', 'ApiController@getLists')->name('api.lists.list');
    Route::get('/api/lists/statuses/{listId}', 'ApiController@getListStatuses')->name('api.lists.statuses');
});
