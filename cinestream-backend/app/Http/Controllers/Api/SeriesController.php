<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Series;
use Illuminate\Http\Request;

class SeriesController extends Controller
{
    public function index(Request $request)
    {
        $query = Series::with('genres');

        if ($request->genre)  $query->whereHas('genres', fn($q) => $q->where('slug', $request->genre));
        if ($request->status) $query->where('status', $request->status);
        if ($request->search) $query->where('title', 'like', '%'.$request->search.'%');

        return response()->json($query->paginate(20));
    }

    public function show(Series $series)
    {
        return response()->json($series->load('genres', 'seasons.episodes', 'reviews.user'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'    => 'required|string',
            'synopsis' => 'nullable|string',
            'poster'   => 'nullable|string',
            'year'     => 'nullable|integer',
            'status'   => 'in:ongoing,ended,cancelled',
            'rating'   => 'nullable|numeric',
            'tmdb_id'  => 'nullable|integer|unique:series',
            'genres'   => 'nullable|array',
        ]);

        $series = Series::create($data);
        if (!empty($data['genres'])) $series->genres()->sync($data['genres']);

        return response()->json($series->load('genres'), 201);
    }

    public function update(Request $request, Series $series)
    {
        $data = $request->validate([
            'title'    => 'sometimes|string',
            'synopsis' => 'nullable|string',
            'status'   => 'in:ongoing,ended,cancelled',
            'rating'   => 'nullable|numeric',
            'genres'   => 'nullable|array',
        ]);

        $series->update($data);
        if (isset($data['genres'])) $series->genres()->sync($data['genres']);

        return response()->json($series->load('genres'));
    }

    public function destroy(Series $series)
    {
        $series->delete();
        return response()->json(['message' => 'Série supprimée']);
    }
}