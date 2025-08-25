package com.projectmyriad.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import com.projectmyriad.ui.navigation.MyriadNavigation
import com.projectmyriad.ui.theme.ProjectMyriadTheme
import dagger.hilt.android.AndroidEntryPoint

/**
 * Main Activity for Project Myriad.
 * Entry point for the Compose UI application.
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        enableEdgeToEdge()
        
        setContent {
            ProjectMyriadTheme {
                Scaffold(
                    modifier = Modifier.fillMaxSize()
                ) { innerPadding ->
                    MyriadNavigation(
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}