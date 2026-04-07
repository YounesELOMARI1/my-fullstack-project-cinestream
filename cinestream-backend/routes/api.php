<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\SeriesController;
use App\Http\Controllers\Api\SeasonController;
use App\Http\Controllers\Api\EpisodeController;
use App\Http\Controllers\Api\GenreController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WatchlistController;

// ─── Auth (public) ───────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ─── Routes protégées (token requis) ─────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Films
    Route::get('/movies',          [MovieController::class, 'index']);
    Route::get('/movies/{movie}',  [MovieController::class, 'show']);

    // Séries
    Route::get('/series',           [SeriesController::class, 'index']);
    Route::get('/series/{series}',  [SeriesController::class, 'show']);

    // Saisons & Épisodes
    Route::get('/series/{seriesId}/seasons',             [SeasonController::class, 'index']);
    Route::get('/seasons/{seasonId}/episodes',           [EpisodeController::class, 'index']);

    // Genres
    Route::get('/genres', [GenreController::class, 'index']);

    // Reviews & Watchlist
    Route::post('/reviews',              [ReviewController::class, 'store']);
    Route::put('/reviews/{review}',      [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}',   [ReviewController::class, 'destroy']);

    Route::get('/watchlist',                  [WatchlistController::class, 'index']);
    Route::post('/watchlist',                 [WatchlistController::class, 'store']);
    Route::delete('/watchlist/{watchlist}',   [WatchlistController::class, 'destroy']);

    // ─── Routes Admin uniquement ──────────────────────────
    Route::middleware('admin')->group(function () {

        // CRUD Films
        Route::post('/movies',            [MovieController::class, 'store']);
        Route::put('/movies/{movie}',     [MovieController::class, 'update']);
        Route::delete('/movies/{movie}',  [MovieController::class, 'destroy']);

        // CRUD Séries
        Route::post('/series',            [SeriesController::class, 'store']);
        Route::put('/series/{series}',    [SeriesController::class, 'update']);
        Route::delete('/series/{series}', [SeriesController::class, 'destroy']);

        // CRUD Saisons
        Route::post('/series/{seriesId}/seasons',      [SeasonController::class, 'store']);
        Route::put('/seasons/{season}',                [SeasonController::class, 'update']);
        Route::delete('/seasons/{season}',             [SeasonController::class, 'destroy']);

        // CRUD Épisodes
        Route::post('/seasons/{seasonId}/episodes',    [EpisodeController::class, 'store']);
        Route::put('/episodes/{episode}',              [EpisodeController::class, 'update']);
        Route::delete('/episodes/{episode}',           [EpisodeController::class, 'destroy']);

        // CRUD Genres
        Route::post('/genres',           [GenreController::class, 'store']);
        Route::put('/genres/{genre}',    [GenreController::class, 'update']);
        Route::delete('/genres/{genre}', [GenreController::class, 'destroy']);
    });
});