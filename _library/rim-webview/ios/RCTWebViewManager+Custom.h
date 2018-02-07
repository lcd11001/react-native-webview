//
//  RCTWebViewManager+Custom.h
//  RNLibraryRimWebview
//
//  Created by Gameloft on 2/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef RCTWebViewManager_Custom_h
#define RCTWebViewManager_Custom_h

#import <React/RCTWebView.h>

@interface RCTWebViewManager (Custom)

- (BOOL)webView:(__unused RCTWebView *)webView
shouldStartLoadForRequest:(NSMutableDictionary<NSString *, id> *)request
   withCallback:(RCTDirectEventBlock)callback;

@end

#endif /* RCTWebViewManager_Custom_h */
