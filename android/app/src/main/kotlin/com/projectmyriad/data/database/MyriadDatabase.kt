package com.projectmyriad.data.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.projectmyriad.data.database.converter.DateConverter
import com.projectmyriad.data.database.dao.MangaDao
import com.projectmyriad.data.database.entity.MangaEntity

/**
 * The Room database for Project Myriad.
 * Contains all data tables and provides DAOs for data access.
 */
@Database(
    entities = [
        MangaEntity::class,
        // Add more entities as needed
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(DateConverter::class)
abstract class MyriadDatabase : RoomDatabase() {

    abstract fun mangaDao(): MangaDao
    // Add more DAOs as needed
    
    companion object {
        const val DATABASE_NAME = "myriad_database"
    }
}