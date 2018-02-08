//
//  RCTWebView+Custom.h
//  RNLibraryRimWebview
//
//  Created by Gameloft on 2/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef RCTWebView_Custom_h
#define RCTWebView_Custom_h

@interface RCTWebView (Custom)

- (NSMutableDictionary<NSString *, id> *)baseEvent;
- (BOOL)webView:(__unused UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType;

@end

#endif /* RCTWebView_Custom_h */

