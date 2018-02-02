
package com.reactnative.library.rim;

import android.util.Log;
import android.webkit.WebView;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
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
                ArrayList<Object> urlPrefixes = mEnableUrlPrefixes.toArrayList();
                for (Object urlPrefix : urlPrefixes) {
                    if (url.startsWith((String) urlPrefix)) {

                        dispatchEvent(view, new TopMessageEvent(view.getId(), url));
                        return true;
                    }
                }
            }

            return super.shouldOverrideUrlLoading(view, url);
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
    }
}