<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'synopsis', 'poster', 'backdrop',
        'year', 'duration', 'rating', 'language', 'tmdb_id'
    ];

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'movie_genre');
    }

    public function actors()
    {
        return $this->belongsToMany(Actor::class, 'movie_actor')->withPivot('character');
    }

    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function watchlists()
    {
        return $this->morphMany(Watchlist::class, 'watchlistable');
    }
}