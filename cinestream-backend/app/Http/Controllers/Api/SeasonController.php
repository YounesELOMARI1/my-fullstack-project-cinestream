<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Season;
use Illuminate\Http\Request;

class SeasonController extends Controller
{
    public function index($seriesId)
    {
        return response()->json(Season::where('series_id', $seriesId)->with('episodes')->get());
    }

    public function store(Request $request, $seriesId)
    {
        $data = $request->validate([
            'number' => 'required|integer',
            'title'  => 'nullable|string',
            'year'   => 'nullable|integer',
            'poster' => 'nullable|string',
        ]);

        $season = Season::create(array_merge($data, ['series_id' => $seriesId]));
        return response()->json($season, 201);
    }

    public function update(Request $request, Season $season)
    {
        $season->update($request->validate([
            'number' => 'sometimes|integer',
            'title'  => 'nullable|string',
            'year'   => 'nullable|integer',
        ]));
        return response()->json($season);
    }

    public function destroy(Season $season)
    {
        $season->delete();
        return response()->json(['message' => 'Saison supprimée']);
    }
}