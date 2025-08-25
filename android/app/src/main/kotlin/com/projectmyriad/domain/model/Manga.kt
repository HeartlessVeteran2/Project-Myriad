package com.projectmyriad.domain.model

import java.util.Date

/**
 * Domain model representing a Manga item.
 * This is the core business object used throughout the app.
 */
data class Manga(
    val id: String,
    val title: String,
    val description: String? = null,
    val author: String? = null,
    val artist: String? = null,
    val genres: List<String> = emptyList(),
    val status: MangaStatus = MangaStatus.UNKNOWN,
    val coverImagePath: String? = null,
    val sourceUrl: String? = null,
    val sourceName: String? = null,
    val isFavorite: Boolean = false,
    val dateAdded: Date = Date(),
    val lastRead: Date? = null,
    val chaptersRead: Int = 0,
    val totalChapters: Int = 0
)

/**
 * Enumeration of possible manga statuses.
 */
enum class MangaStatus {
    ONGOING,
    COMPLETED,
    HIATUS,
    CANCELLED,
    UNKNOWN
}