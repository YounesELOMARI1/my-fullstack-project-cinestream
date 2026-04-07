<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Movie;
use App\Models\Series;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'type'    => 'required|in:movie,series',
            'id'      => 'required|integer',
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $model = $data['type'] === 'movie'
            ? Movie::findOrFail($data['id'])
            : Series::findOrFail($data['id']);

        $review = $model->reviews()->updateOrCreate(
            ['user_id' => $request->user()->id],
            ['rating' => $data['rating'], 'comment' => $data['comment']]
        );

        return response()->json($review->load('user'), 201);
    }

    public function update(Request $request, Review $review)
    {
        $this->authorize('update', $review);
        $review->update($request->validate([
            'rating'  => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]));
        return response()->json($review);
    }

    public function destroy(Review $review)
    {
        $this->authorize('delete', $review);
        $review->delete();
        return response()->json(['message' => 'Avis supprimé']);
    }
}