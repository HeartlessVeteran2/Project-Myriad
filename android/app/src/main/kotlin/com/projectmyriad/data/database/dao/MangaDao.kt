package com.projectmyriad.data.database.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.projectmyriad.data.database.entity.MangaEntity
import kotlinx.coroutines.flow.Flow

/**
 * Data Access Object (DAO) for manga entities.
 */
@Dao
interface MangaDao {

    @Query("SELECT * FROM manga ORDER BY dateAdded DESC")
    fun getAllManga(): Flow<List<MangaEntity>>

    @Query("SELECT * FROM manga WHERE favorite = 1 ORDER BY title ASC")
    fun getFavoriteManga(): Flow<List<MangaEntity>>

    @Query("SELECT * FROM manga WHERE lastRead IS NOT NULL ORDER BY lastRead DESC")
    fun getRecentlyReadManga(): Flow<List<MangaEntity>>

    @Query("SELECT * FROM manga WHERE id = :id")
    suspend fun getMangaById(id: String): MangaEntity?

    @Query("SELECT * FROM manga WHERE title LIKE '%' || :query || '%' OR description LIKE '%' || :query || '%'")
    fun searchManga(query: String): Flow<List<MangaEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertManga(manga: MangaEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertManga(manga: List<MangaEntity>)

    @Update
    suspend fun updateManga(manga: MangaEntity)

    @Delete
    suspend fun deleteManga(manga: MangaEntity)

    @Query("DELETE FROM manga WHERE id = :id")
    suspend fun deleteMangaById(id: String)
}