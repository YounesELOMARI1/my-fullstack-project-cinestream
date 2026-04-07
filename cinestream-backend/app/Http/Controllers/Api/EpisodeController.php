<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Episode;
use Illuminate\Http\Request;

class EpisodeController extends Controller
{
    public function index($seasonId)
    {
        return response()->json(Episode::where('season_id', $seasonId)->get());
    }

    public function store(Request $request, $seasonId)
    {
        $data = $request->validate([
            'number'   => 'required|integer',
            'title'    => 'required|string',
            'synopsis' => 'nullable|string',
            'duration' => 'nullable|integer',
            'still'    => 'nullable|string',
        ]);

        $episode = Episode::create(array_merge($data, ['season_id' => $seasonId]));
        return response()->json($episode, 201);
    }

    public function update(Request $request, Episode $episode)
    {
        $episode->update($request->validate([
            'number'   => 'sometimes|integer',
            'title'    => 'sometimes|string',
            'synopsis' => 'nullable|string',
            'duration' => 'nullable|integer',
        ]));
        return response()->json($episode);
    }

    public function destroy(Episode $episode)
    {
        $episode->delete();
        return response()->json(['message' => 'Épisode supprimé']);
    }
}