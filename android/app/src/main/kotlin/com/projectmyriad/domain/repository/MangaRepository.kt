package com.projectmyriad.domain.repository

import com.projectmyriad.domain.model.Manga
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for manga data operations.
 * This defines the contract for data access in the domain layer.
 */
interface MangaRepository {
    
    fun getAllManga(): Flow<List<Manga>>
    
    fun getFavoriteManga(): Flow<List<Manga>>
    
    fun getRecentlyReadManga(): Flow<List<Manga>>
    
    suspend fun getMangaById(id: String): Manga?
    
    fun searchManga(query: String): Flow<List<Manga>>
    
    suspend fun addManga(manga: Manga)
    
    suspend fun updateManga(manga: Manga)
    
    suspend fun deleteManga(manga: Manga)
    
    suspend fun toggleFavorite(mangaId: String)
    
    suspend fun updateReadingProgress(mangaId: String, chaptersRead: Int)
}