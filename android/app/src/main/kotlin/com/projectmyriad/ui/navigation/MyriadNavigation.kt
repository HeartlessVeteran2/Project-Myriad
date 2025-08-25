package com.projectmyriad.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.projectmyriad.R
import com.projectmyriad.ui.screens.browse.BrowseScreen
import com.projectmyriad.ui.screens.downloads.DownloadsScreen
import com.projectmyriad.ui.screens.library.LibraryScreen
import com.projectmyriad.ui.screens.settings.SettingsScreen

enum class MyriadScreen(
    val route: String,
    val titleResId: Int,
    val icon: ImageVector
) {
    Library("library", R.string.nav_library, Icons.Default.Book),
    Browse("browse", R.string.nav_browse, Icons.Default.Explore),
    Downloads("downloads", R.string.nav_downloads, Icons.Default.CloudDownload),
    Settings("settings", R.string.nav_settings, Icons.Default.Settings)
}

@Composable
fun MyriadNavigation(
    modifier: Modifier = Modifier
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    Scaffold(
        modifier = modifier,
        bottomBar = {
            NavigationBar {
                MyriadScreen.values().forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = null) },
                        label = { Text(stringResource(screen.titleResId)) },
                        selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            navController.navigate(screen.route) {
                                // Pop up to the start destination of the graph to
                                // avoid building up a large stack of destinations
                                // on the back stack as users select items
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                // Avoid multiple copies of the same destination when
                                // reselecting the same item
                                launchSingleTop = true
                                // Restore state when reselecting a previously selected item
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = MyriadScreen.Library.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(MyriadScreen.Library.route) {
                LibraryScreen()
            }
            composable(MyriadScreen.Browse.route) {
                BrowseScreen()
            }
            composable(MyriadScreen.Downloads.route) {
                DownloadsScreen()
            }
            composable(MyriadScreen.Settings.route) {
                SettingsScreen()
            }
        }
    }
}