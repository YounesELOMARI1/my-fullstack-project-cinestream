<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Series extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'synopsis', 'poster', 'backdrop',
        'year', 'rating', 'status', 'language', 'tmdb_id'
    ];

    public function seasons()
    {
        return $this->hasMany(Season::class);
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'series_genre');
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