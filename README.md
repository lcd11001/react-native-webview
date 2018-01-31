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