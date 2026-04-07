<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Watchlist;
use App\Models\Movie;
use App\Models\Series;
use Illuminate\Http\Request;

class WatchlistController extends Controller
{
    public function index(Request $request)
    {
        $list = $request->user()->watchlist()->with('watchlistable')->get();
        return response()->json($list);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:movie,series',
            'id'   => 'required|integer',
        ]);

        $model = $data['type'] === 'movie'
            ? Movie::findOrFail($data['id'])
            : Series::findOrFail($data['id']);

        $item = $model->watchlists()->firstOrCreate([
            'user_id' => $request->user()->id,
        ]);

        return response()->json($item, 201);
    }

    public function destroy(Request $request, Watchlist $watchlist)
    {
        $watchlist->delete();
        return response()->json(['message' => 'Retiré de la watchlist']);
    }
}