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

