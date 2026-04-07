<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Genre;
use Illuminate\Support\Str;

class GenreSeeder extends Seeder
{
    public function run(): void
    {
        $genres = [
            'Action', 'Aventure', 'Comédie', 'Drame',
            'Horreur', 'Science-Fiction', 'Thriller',
            'Romance', 'Animation', 'Documentaire'
        ];

        foreach ($genres as $name) {
            Genre::create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }
    }
}