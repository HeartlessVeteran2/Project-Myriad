# JetBrains IDE Configuration

This directory contains configuration files for JetBrains IDEs (WebStorm, IntelliJ IDEA, etc.) to provide optimal development experience for the Project Myriad unified app.

## Features Configured

### 🎯 **Project Structure**
- Source folders for backend, mobile, and shared code
- Test source folders for all test directories
- Exclusion of build artifacts and dependencies

### 🔧 **Development Tools**
- **ESLint**: Automatic linting with fix-on-save
- **Prettier**: Code formatting on save and reformat
- **Node.js**: Proper interpreter and package manager setup
- **TypeScript**: Enhanced IntelliSense and auto-imports

### 🚀 **Run Configurations**
Ready-to-use run configurations for:
- Start Backend Server
- Start Mobile App (Expo)
- Start Web Version
- Install All Dependencies
- Run All Tests
- Start Unified App (all platforms)

### 📁 **File Structure Recognition**
- Backend source code recognition
- React Native mobile app structure
- Shared utilities and types
- Test file patterns
- Build exclusions

## Usage

### WebStorm/IntelliJ IDEA
1. Open the project folder in your JetBrains IDE
2. The IDE will automatically detect the configuration
3. Use the run configurations from the toolbar
4. Enable ESLint and Prettier in settings if not auto-detected

### Run Configurations
Access pre-configured run commands via:
- **Run** menu → **Run Configurations**
- Top toolbar run configuration dropdown
- Right-click on project → **Run**

### Quick Actions
- `Ctrl+Shift+F10` (Windows/Linux) or `Cmd+Shift+R` (Mac) - Run configuration
- `Ctrl+Alt+L` (Windows/Linux) or `Cmd+Alt+L` (Mac) - Format code
- `Alt+Enter` - Show quick fixes (ESLint suggestions)

## Customization

You can customize the configuration by editing files in `.idea/`:
- `runConfigurations.xml` - Add/modify run configurations
- `codeStyles.xml` - Adjust formatting preferences
- `modules.xml` - Modify project structure
- `jsLibraryMappings.xml` - Add JavaScript libraries

## VS Code Alternative

For VS Code users, use the `Project-Myriad.code-workspace` file which provides similar functionality with:
- Multi-folder workspace setup
- Integrated terminal configurations
- Debug configurations
- Task definitions
- Extension recommendations
