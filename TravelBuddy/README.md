# Travel Buddy ✈️

Multi-screen React Native app dengan React Navigation untuk menjelajahi destinasi wisata Indonesia.

## Screenshots

![HomeScreen](hasil1.jpeg)
![DetailScreen](hasil2.jpeg)
![SearchScreen](hasil3.jpeg)
![FavoritesScreen](hasil4.jpeg)

## Features

- Bottom Tab Navigation (Home, Search, Favorites)
- Stack Navigator di Home tab (HomeScreen → DetailScreen)
- Nested Stack Navigator di Search tab (SearchScreen → DetailScreen)
- Route params untuk pass destination data ke DetailScreen
- FlatList dengan 8 destinasi wisata Indonesia
- Add to Favorites dengan AsyncStorage (data tersimpan permanen)
- Search & filter destinasi by nama atau lokasi
- Favorites count badge di tab icon
- @expo/vector-icons (Ionicons) untuk tab icons
- Safe Area support untuk semua ukuran HP

## Tech Stack

- React Native + Expo SDK 51
- React Navigation 6 (Bottom Tabs + Native Stack)
- AsyncStorage untuk persistent favorites
- StyleSheet untuk styling
- @expo/vector-icons

## Project Structure

```
TravelBuddy/
├── App.js
├── index.js
├── app.json
├── package.json
├── context/
│   └── FavoritesContext.js
├── navigation/
│   └── RootTabs.js
├── screens/
│   ├── HomeScreen.js
│   ├── DetailScreen.js
│   ├── SearchScreen.js
│   └── FavoritesScreen.js
├── components/
│   └── DestinationCard.js
└── data/
    └── destinations.js
```

## How to Run

1. Clone repository
   ```bash
   git clone https://github.com/Juaan2005/TravelBuddy.git
   cd TravelBuddy
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start Metro bundler
   ```bash
   npx expo start
   ```

4. Scan QR code di Expo Go (Android/iOS)

## Author

**Juan Moses Tambunan**
