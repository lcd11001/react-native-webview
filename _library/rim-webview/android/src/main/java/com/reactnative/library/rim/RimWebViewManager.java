
package com.reactnative.library.rim;

import android.os.Build;
import android.graphics.Bitmap;
import android.util.Log;
import android.webkit.WebView;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.common.build.ReactBuildConfig;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.webview.ReactWebViewManager;
import com.facebook.react.views.webview.events.TopMessageEvent;

import java.util.ArrayList;

import javax.annotation.Nullable;

@ReactModule(name = RimWebViewManager.REACT_CLASS)
public class RimWebViewManager extends ReactWebViewManager {
    // this name must match what we're referring to in JS
    protected static final String REACT_CLASS = "RimWebView";
    protected final ReactApplicationContext mReactContext;


    public RimWebViewManager(ReactApplicationContext reactContext) {
        super();
        this.mReactContext = reactContext;
    }

    @ReactProp(name = "enableUrlPrefixes")
    public void setEnableUrlPrefixes(WebView view, @Nullable ReadableArray urlPrefixes) {
        Log.d(REACT_CLASS, "setEnableUrlPrefixes " + urlPrefixes.toString());

        RimWebViewClient client = (RimWebViewClient) ((RimWebView) view).getReactWebViewClient();
        if (client != null && urlPrefixes != null) {
            client.setEnableUrlPrefixes(urlPrefixes);
        }
    }

    @Override
    protected ReactWebView createReactWebViewInstance(ThemedReactContext reactContext) {
        return new RimWebView(reactContext);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected void addEventEmitters(ThemedReactContext reactContext, WebView view) {
        view.setWebViewClient(new RimWebViewClient());
    }

    ////////////////////////////////////////////////////////////////////
    //
    //  RimWebViewClient
    //
    ////////////////////////////////////////////////////////////////////
    protected static class RimWebViewClient extends ReactWebViewClient {
        protected @Nullable ReadableArray mEnableUrlPrefixes;

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (mEnableUrlPrefixes != null && mEnableUrlPrefixes.size() > 0) {
                for (int i=0; i<mEnableUrlPrefixes.size(); i++) {
                    boolean useCustomCheck = false;
                    boolean bValue = false;
                    String sValue = "";
                    String key = "";

                    ReadableType prefixType = mEnableUrlPrefixes.getType(i);
                    switch (prefixType) {
                        case Map:
                            useCustomCheck = true;
                            
                            ReadableMap readableMap = (ReadableMap)mEnableUrlPrefixes.getMap(i);
                            ReadableMapKeySetIterator iterator = readableMap.keySetIterator();

                            while (iterator.hasNextKey()) {
                                key = iterator.nextKey();
                                ReadableType type = readableMap.getType(key);
                                
                                switch (type) {
                                    case Boolean:
                                        bValue = readableMap.getBoolean(key);
                                        // Log.d(REACT_CLASS, "urlPrefix => key " + key + " bValue " + bValue);
                                    break;

                                    case String:
                                        sValue = readableMap.getString(key);
                                        // Log.d(REACT_CLASS, "urlPrefix => key " + key + " sValue " + sValue);
                                    break;

                                    default:
                                        Log.e(REACT_CLASS, "not support key " + key + " type " + type);
                                    break;
                                }
                            };

                        break;

                        default:
                            Log.e(REACT_CLASS, "not support urlPrefix " + mEnableUrlPrefixes.getDynamic(i));
                        break;
                    }

                    if (useCustomCheck) {
                        if (url.startsWith(key)) {
                            dispatchEvent(view, new TopMessageEvent(view.getId(), url));
                            
                            String newUrl = url;
                            if (sValue.compareToIgnoreCase("remove") == 0) {
                                newUrl = url.replace(key, "");
                                bValue = false;
                                // Log.d(REACT_CLASS, "urlPrefix => newUrl " + newUrl);
                            }

                            if (!bValue) {
                                return super.shouldOverrideUrlLoading(view, newUrl);
                            }

                            return bValue;
                        }
                    }
                }
            }

            Log.d(REACT_CLASS, "super check " + url);
            return super.shouldOverrideUrlLoading(view, url);
        }

        @Override
        public void onPageStarted(WebView webView, String url, Bitmap favicon) {
            super.onPageStarted(webView, url, favicon);

            if (ReactBuildConfig.DEBUG && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                WebView.setWebContentsDebuggingEnabled(true);
            }
        }

        public void setEnableUrlPrefixes(@Nullable ReadableArray urlPrefixes) {
            this.mEnableUrlPrefixes = urlPrefixes;
        }
    }

    ////////////////////////////////////////////////////////////////////
    //
    //  RimWebView
    //
    ////////////////////////////////////////////////////////////////////
    protected static class RimWebView extends ReactWebView {
        public RimWebView(ThemedReactContext reactContext) {
            super(reactContext);
        }

        @Override
        public void onHostResume() {
            super.onHostResume();
            loadUrl("javascript:onGameResume();");
            loadUrl("javascript:onResumeActive();");
            loadUrl("javascript:onResume();");
        }

        @Override
        public void onHostPause() {
            super.onHostPause();
            loadUrl("javascript:onGamePause();");
            loadUrl("javascript:onPauseActive();");
            loadUrl("javascript:onPause();");
        }
    }
}