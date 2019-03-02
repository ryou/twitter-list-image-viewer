<?php

namespace App\Services\TwitterApiClient;

use Illuminate\Support\Facades\Storage;

class MockTwitterUserInfo
{
    public $token = '';
    public $tokenSecret = '';

    public function __construct(
        string $token,
        string $tokenSecret
    ) {
        $this->token = $token;
        $this->tokenSecret = $tokenSecret;
    }
}

class MockTwitterApiClient implements TwitterApiClient
{
    public function redirectForAuth()
    {
        return redirect()->route('login.callback');
    }

    public function getUserInfo()
    {
        return new MockTwitterUserInfo(
            'token',
            'secret'
        );
    }

    public function setTokenAndSecret(string $token, string $secret) {}

    public function verityCredentials()
    {
        $json = Storage::disk('api_mock')->get('verify_credentials.json');

        return [
            'code' => 200,
            'data' => json_decode($json),
        ];
    }

    public function getLists()
    {
        $json = Storage::disk('api_mock')->get('lists.json');

        return [
            'code' => 200,
            'data' => json_decode($json),
        ];
    }

    public function getListStatuses(array $parameter = [])
    {
        $jsonFileName = 'list_statuses.json';

        if (isset($parameter['since_id'])) $jsonFileName = 'list_statuses_since.json';
        if (isset($parameter['max_id'])) $jsonFileName = 'list_statuses_max.json';

        $json = Storage::disk('api_mock')->get($jsonFileName);

        return [
            'code' => 200,
            'data' => json_decode($json),
        ];
    }

    public function favorite(string $id)
    {
        return [
            'code' => 200,
            'data' => [],
        ];
    }

    public function unfavorite(string $id)
    {
        return [
            'code' => 200,
            'data' => [],
        ];
    }

    public function retweet(string $id)
    {
        return [
            'code' => 200,
            'data' => [],
        ];
    }

    public function unretweet(string $id)
    {
        return [
            'code' => 200,
            'data' => [],
        ];
    }
}
