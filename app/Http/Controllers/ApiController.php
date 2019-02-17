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
        return response()->json($this->client->verityCredentials());
    }

    public function getLists()
    {
        $this->setUpClient();
        return response()->json($this->client->getLists());
    }

    public function getListStatuses(Request $request, string $listId)
    {
        $parameters = array_merge([ 'list_id' => $listId ], $request->all());

        $this->setUpClient();
        return response()->json($this->client->getListStatuses($parameters));
    }

    protected function setUpClient()
    {
        $this->client->setTokenAndSecret(
            session()->get('token'),
            session()->get('token_secret')
        );
    }
}
