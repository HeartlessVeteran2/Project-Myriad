package com.projectmyriad.data.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

/**
 * Database entity representing a Manga item in the local library.
 */
@Entity(tableName = "manga")
data class MangaEntity(
    @PrimaryKey
    val id: String,
    val title: String,
    val description: String?,
    val author: String?,
    val artist: String?,
    val genres: List<String>,
    val status: String,
    val coverImagePath: String?,
    val sourceUrl: String?,
    val sourceName: String?,
    val favorite: Boolean = false,
    val dateAdded: Date,
    val lastRead: Date?,
    val chaptersRead: Int = 0,
    val totalChapters: Int = 0
)