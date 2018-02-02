
package com.reactnative.library.rim;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class RNLibraryRimWebviewModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNLibraryRimWebviewModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNLibraryRimWebview";
  }
}