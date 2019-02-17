<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class TwitterApiClientServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        if (config('app.env') === 'local')
        {
            $this->app->bind(
                'App\Services\TwitterApiClient\TwitterApiClient',
                'App\Services\TwitterApiClient\MockTwitterApiClient'
            );
        }
        else
        {
            $this->app->bind(
                'App\Services\TwitterApiClient\TwitterApiClient',
                'App\Services\TwitterApiClient\ProductionTwitterApiClient'
            );
        }
    }
}
