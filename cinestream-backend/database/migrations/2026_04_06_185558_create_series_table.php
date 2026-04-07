<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('series', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('synopsis')->nullable();
            $table->string('poster')->nullable();
            $table->string('backdrop')->nullable();
            $table->integer('year')->nullable();
            $table->decimal('rating', 3, 1)->default(0);
            $table->enum('status', ['ongoing', 'ended', 'cancelled'])->default('ongoing');
            $table->string('language')->default('fr');
            $table->integer('tmdb_id')->unique()->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('series');
    }
};