<?php

namespace App\Services\TwitterApiClient;

interface TwitterApiClient
{
    public function redirectForAuth();

    public function getUserInfo();

    public function setTokenAndSecret(string $token, string $secret);

    public function verityCredentials();

    public function getLists();

    public function getListStatuses(array $parameter = []);
}
