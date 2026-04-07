<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Movie;
use App\Models\Series;
use App\Models\Genre;
use App\Models\Actor;

class ImportTmdb extends Command
{
    protected $signature   = 'tmdb:import {type=movies} {--pages=3} {--id=}';
    protected $description = 'Importe les films ou séries populaires depuis TMDB, ou cible un ID spécifique';

    private string $apiKey;
    private string $baseUrl;
    private string $imageUrl;

    public function handle(): void
    {
        $this->apiKey   = config('services.tmdb.key');
        $this->baseUrl  = config('services.tmdb.url');
        $this->imageUrl = config('services.tmdb.image');

        $type  = $this->argument('type');
        $pages = (int) $this->option('pages');
        $id    = $this->option('id');

        if ($id) {
            if ($type === 'movies') {
                $response = Http::get("{$this->baseUrl}/movie/{$id}", [
                    'api_key'  => $this->apiKey,
                    'language' => 'fr-FR',
                ]);
                if ($response->successful()) {
                    $this->saveMovie($response->json());
                    $this->info("Film TMDB ID {$id} importé avec succès.");
                } else {
                    $this->error("Erreur HTTP au fetch TMDB ID {$id}: " . $response->status());
                }
            } elseif ($type === 'series') {
                $response = Http::get("{$this->baseUrl}/tv/{$id}", [
                    'api_key'  => $this->apiKey,
                    'language' => 'fr-FR',
                ]);
                if ($response->successful()) {
                    $this->saveSeries($response->json());
                    $this->info("Série TMDB ID {$id} importée avec succès.");
                } else {
                    $this->error("Erreur HTTP au fetch TMDB ID {$id}: " . $response->status());
                }
            }
            return;
        }

        if ($type === 'movies') {
            $this->importMovies($pages);
        } elseif ($type === 'series') {
            $this->importSeries($pages);
        } else {
            $this->error('Type invalide. Utilise: movies ou series');
        }
    }

    private function importMovies(int $pages): void
    {
        $this->info("Import des films populaires ({$pages} pages)...");

        for ($page = 1; $page <= $pages; $page++) {
            $response = Http::get("{$this->baseUrl}/movie/popular", [
                'api_key'  => $this->apiKey,
                'language' => 'fr-FR',
                'page'     => $page,
            ]);

            if (!$response->successful()) {
                $this->error("Erreur page {$page} : " . $response->status() . ' - ' . $response->body());
                continue;
            }

            foreach ($response->json('results') as $item) {
                $this->saveMovie($item);
            }

            $this->info("Page {$page}/{$pages} importée ✓");
        }

        $this->info('Import films terminé !');
    }

    private function saveMovie(array $data): void
    {
        $movie = Movie::updateOrCreate(
            ['tmdb_id' => $data['id']],
            [
                'title'    => $data['title'],
                'synopsis' => $data['overview'] ?? null,
                'poster'   => $data['poster_path']   ? $this->imageUrl.$data['poster_path']   : null,
                'backdrop' => $data['backdrop_path'] ? $this->imageUrl.$data['backdrop_path'] : null,
                'year'     => !empty($data['release_date']) ? substr($data['release_date'], 0, 4) : null,
                'rating'   => $data['vote_average'] ?? 0,
                'language' => $data['original_language'] ?? 'en',
            ]
        );

        $this->syncGenres($movie, $data['genre_ids'] ?? []);
    }

    private function importSeries(int $pages): void
    {
        $this->info("Import des séries populaires ({$pages} pages)...");

        for ($page = 1; $page <= $pages; $page++) {
            $response = Http::get("{$this->baseUrl}/tv/popular", [
                'api_key'  => $this->apiKey,
                'language' => 'fr-FR',
                'page'     => $page,
            ]);

            if (!$response->successful()) {
                $this->error("Erreur page {$page}");
                continue;
            }

            foreach ($response->json('results') as $item) {
                $this->saveSeries($item);
            }

            $this->info("Page {$page}/{$pages} importée ✓");
        }

        $this->info('Import séries terminé !');
    }

    private function saveSeries(array $data): void
    {
        $series = Series::updateOrCreate(
            ['tmdb_id' => $data['id']],
            [
                'title'    => $data['name'],
                'synopsis' => $data['overview'] ?? null,
                'poster'   => $data['poster_path']   ? $this->imageUrl.$data['poster_path']   : null,
                'backdrop' => $data['backdrop_path'] ? $this->imageUrl.$data['backdrop_path'] : null,
                'year'     => !empty($data['first_air_date']) ? substr($data['first_air_date'], 0, 4) : null,
                'rating'   => $data['vote_average'] ?? 0,
                'language' => $data['original_language'] ?? 'en',
            ]
        );

        $this->syncGenres($series, $data['genre_ids'] ?? [], 'series');
    }

    private function syncGenres(Movie|Series $model, array $tmdbGenreIds, string $type = 'movie'): void
    {
        if (empty($tmdbGenreIds)) return;

        $genreIds = [];
        foreach ($tmdbGenreIds as $tmdbId) {
            $genre = $this->fetchOrCreateGenre($tmdbId, $type);
            if ($genre) $genreIds[] = $genre->id;
        }

        $model->genres()->sync($genreIds);
    }

    private function fetchOrCreateGenre(int $tmdbId, string $type = 'movie'): ?Genre
    {
        static $genreCache = [];

        if (isset($genreCache[$tmdbId])) return $genreCache[$tmdbId];

        $endpoint = $type === 'series' ? 'tv' : 'movie';
        $response = Http::get("{$this->baseUrl}/genre/{$endpoint}/list", [
            'api_key'  => $this->apiKey,
            'language' => 'fr-FR',
        ]);

        if (!$response->successful()) return null;

        foreach ($response->json('genres') as $g) {
            $genre = Genre::firstOrCreate(
                ['name' => $g['name']],
                ['slug' => \Illuminate\Support\Str::slug($g['name'])]
            );
            $genreCache[$g['id']] = $genre;
        }

        return $genreCache[$tmdbId] ?? null;
    }
}