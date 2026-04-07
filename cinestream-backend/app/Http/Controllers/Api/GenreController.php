<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GenreController extends Controller
{
    public function index()
    {
        return response()->json(Genre::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|unique:genres']);
        $genre = Genre::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
        ]);
        return response()->json($genre, 201);
    }

    public function update(Request $request, Genre $genre)
    {
        $data = $request->validate(['name' => 'required|string|unique:genres,name,'.$genre->id]);
        $genre->update(['name' => $data['name'], 'slug' => Str::slug($data['name'])]);
        return response()->json($genre);
    }

    public function destroy(Genre $genre)
    {
        $genre->delete();
        return response()->json(['message' => 'Genre supprimé']);
    }
}