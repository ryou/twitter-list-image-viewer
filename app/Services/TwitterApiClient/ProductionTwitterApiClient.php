<?php

namespace App\Services\TwitterApiClient;

use Abraham\TwitterOAuth\TwitterOAuth;
use Laravel\Socialite\Facades\Socialite;

class ProductionTwitterApiClient implements TwitterApiClient
{
    /**
     * @var TwitterOAuth $connection
     */
    protected $connection = null;

    public function redirectForAuth()
    {
        return Socialite::driver("twitter")->redirect();
    }

    public function getUserInfo()
    {
        return Socialite::driver("twitter")->user();
    }

    public function setTokenAndSecret(string $token, string $secret)
    {
        $this->connection = new TwitterOAuth(
            config('services.twitter.client_id'),
            config('services.twitter.client_secret'),
            $token,
            $secret
        );
    }

    public function verityCredentials()
    {
        $result = $this->connection->get("account/verify_credentials");

        return [
            'code' => $this->connection->getLastHttpCode(),
            'data' => $result,
        ];
    }

    public function getLists()
    {
        $result = $this->connection->get("lists/list");

        return [
            'code' => $this->connection->getLastHttpCode(),
            'data' => $result,
        ];
    }

    public function getListStatuses(array $parameter = [])
    {
        $result = $this->connection->get("lists/statuses", $parameter);

        return [
            'code' => $this->connection->getLastHttpCode(),
            'data' => $result,
        ];
    }
}
