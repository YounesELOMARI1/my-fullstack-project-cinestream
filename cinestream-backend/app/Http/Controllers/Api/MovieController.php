<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    public function index(Request $request)
    {
        $query = Movie::with('genres', 'actors');

        if ($request->genre)  $query->whereHas('genres', fn($q) => $q->where('slug', $request->genre));
        if ($request->year)   $query->where('year', $request->year);
        if ($request->search) $query->where('title', 'like', '%'.$request->search.'%');
        if ($request->sort)   $query->orderBy($request->sort, $request->order ?? 'desc');

        return response()->json($query->paginate(20));
    }

    public function show(Movie $movie)
    {
        return response()->json($movie->load('genres', 'actors', 'reviews.user'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'    => 'required|string',
            'synopsis' => 'nullable|string',
            'poster'   => 'nullable|string',
            'backdrop' => 'nullable|string',
            'year'     => 'nullable|integer',
            'duration' => 'nullable|integer',
            'rating'   => 'nullable|numeric',
            'language' => 'nullable|string',
            'tmdb_id'  => 'nullable|integer|unique:movies',
            'genres'   => 'nullable|array',
            'actors'   => 'nullable|array',
        ]);

        $movie = Movie::create($data);

        if (!empty($data['genres'])) $movie->genres()->sync($data['genres']);
        if (!empty($data['actors'])) $movie->actors()->sync($data['actors']);

        return response()->json($movie->load('genres', 'actors'), 201);
    }

    public function update(Request $request, Movie $movie)
    {
        $data = $request->validate([
            'title'    => 'sometimes|string',
            'synopsis' => 'nullable|string',
            'poster'   => 'nullable|string',
            'year'     => 'nullable|integer',
            'duration' => 'nullable|integer',
            'rating'   => 'nullable|numeric',
            'genres'   => 'nullable|array',
            'actors'   => 'nullable|array',
        ]);

        $movie->update($data);

        if (isset($data['genres'])) $movie->genres()->sync($data['genres']);
        if (isset($data['actors'])) $movie->actors()->sync($data['actors']);

        return response()->json($movie->load('genres', 'actors'));
    }

    public function destroy(Movie $movie)
    {
        $movie->delete();
        return response()->json(['message' => 'Film supprimé']);
    }
}