<?php

namespace App\Http\Controllers;

use App\Services\TwitterApiClient\TwitterApiClient;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    /**
     * @var TwitterApiClient $client
     */
    protected $client = null;

    public function __construct(TwitterApiClient $client)
    {
        $this->client = $client;
    }

    public function verifyCredentials()
    {
        $this->setUpClient();
        $response = $this->client->verityCredentials();

        return response()->json($response['data'], $response['code']);
    }

    public function getLists()
    {
        $this->setUpClient();
        $response = $this->client->getLists();

        return response()->json($response['data'], $response['code']);
    }

    public function getListStatuses(Request $request, string $listId)
    {
        $parameters = array_merge([ 'list_id' => $listId ], $request->all());

        $this->setUpClient();
        $response = $this->client->getListStatuses($parameters);

        return response()->json($response['data'], $response['code']);
    }

    protected function setUpClient()
    {
        $this->client->setTokenAndSecret(
            session()->get('token'),
            session()->get('token_secret')
        );
    }
}
