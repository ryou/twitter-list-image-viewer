<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\TwitterApiClient\TwitterApiClient;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(TwitterApiClient $client)
    {
        return $client->redirectForAuth();
    }

    public function callback(TwitterApiClient $client)
    {
        $twitterUserInfo = $client->getUserInfo();

        session()->put([
            'token' =>$twitterUserInfo->token,
            'token_secret' =>$twitterUserInfo->tokenSecret,
        ]);

        return redirect()->route("home");
    }

    public function logout()
    {
        session()->forget([ 'token', 'token_secret' ]);

        return redirect()->route("home");
    }
}
