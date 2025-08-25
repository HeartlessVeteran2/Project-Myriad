package com.projectmyriad.di

import android.content.Context
import androidx.room.Room
import com.projectmyriad.data.database.MyriadDatabase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for database dependencies.
 */
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): MyriadDatabase {
        return Room.databaseBuilder(
            context,
            MyriadDatabase::class.java,
            "myriad_database"
        )
            .fallbackToDestructiveMigration()
            .build()
    }
}