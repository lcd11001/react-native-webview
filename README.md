* BUG FIXED

1. Modal does not fullscreen
    - Apply patches folder
    - cd Android
        + change android SDK & NDK path in local.properties file
        + call command:
            gradlew ReactAndroid:installArchives
    - cd Root Project
        + call command:
            react-native run-android

2. Run with default iOS simulator
    - list all iOS devices:
            xcrun simctl list devices
    - run with iPhone X:
            react-native run-ios --simulator "iPhone X"

3. On Android, you don't see /sdcard/Android/data/<your.package.name> folder
    - goto Android phone "Settings/Apps"
    - click on "Setting wheel" icon to go to "Configure apps"
    - goto "App permissions"
    - goto "Storage"
    - switch slider to "enable" for your app