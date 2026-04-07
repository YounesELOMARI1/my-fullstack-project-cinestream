<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movie;
use App\Models\Genre;

class MovieSeeder extends Seeder
{
    public function run(): void
    {
        $movies = [
            [
                'title'    => 'Inception',
                'synopsis' => 'Un voleur qui s\'infiltre dans les rêves des autres.',
                'year'     => 2010,
                'duration' => 148,
                'rating'   => 8.8,
                'language' => 'en',
                'poster'   => 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
                'genres'   => ['Science-Fiction', 'Action', 'Thriller'],
            ],
            [
                'title'    => 'Interstellar',
                'synopsis' => 'Un groupe d\'explorateurs voyage à travers un trou de ver.',
                'year'     => 2014,
                'duration' => 169,
                'rating'   => 8.6,
                'language' => 'en',
                'poster'   => 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
                'genres'   => ['Science-Fiction', 'Drame', 'Aventure'],
            ],
            [
                'title'    => 'The Dark Knight',
                'synopsis' => 'Batman affronte le Joker dans Gotham City.',
                'year'     => 2008,
                'duration' => 152,
                'rating'   => 9.0,
                'language' => 'en',
                'poster'   => 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
                'genres'   => ['Action', 'Thriller', 'Drame'],
            ],
            [
                'title'    => 'Parasite',
                'synopsis' => 'Une famille pauvre s\'infiltre dans la vie d\'une famille riche.',
                'year'     => 2019,
                'duration' => 132,
                'rating'   => 8.5,
                'language' => 'ko',
                'poster'   => 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
                'genres'   => ['Thriller', 'Drame', 'Comédie'],
            ],
            [
                'title'    => 'The Matrix',
                'synopsis' => 'Un hacker découvre la vraie nature de sa réalité.',
                'year'     => 1999,
                'duration' => 136,
                'rating'   => 8.7,
                'language' => 'en',
                'poster'   => 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
                'genres'   => ['Science-Fiction', 'Action'],
            ],
        ];

        foreach ($movies as $data) {
            $genreNames = $data['genres'];
            unset($data['genres']);

            $movie = Movie::create($data);

            $genreIds = Genre::whereIn('name', $genreNames)->pluck('id');
            $movie->genres()->sync($genreIds);
        }
    }
}