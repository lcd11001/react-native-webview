//
//  RimWebViewManager.m
//  RNLibraryRimWebview
//
//  Created by Luong Cong Dan on 2/6/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "RimWebViewManager.h"

#import "RCTWebViewManager+Custom.h"
#import "RimWebView.h"

@interface RimWebViewManager () <RCTWebViewDelegate>

@end

@implementation RimWebViewManager { }

RCT_EXPORT_MODULE();

-(UIView*) view
{
    RimWebView* webView = [RimWebView new];
    webView.delegate = self;
    return webView;
}

RCT_EXPORT_VIEW_PROPERTY(enableUrlPrefixes, NSArray)

RCT_EXPORT_VIEW_PROPERTY(onLoadingStart, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadingFinish, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadingError, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMessage, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onShouldStartLoadWithRequest, RCTDirectEventBlock)

- (BOOL)webView:(__unused RCTWebView *)webView
shouldStartLoadForRequest:(NSMutableDictionary<NSString *, id> *)request
   withCallback:(RCTDirectEventBlock)callback
{
    NSLog(@"enableUrlPrefixes %@", [RimWebViewManager.propConfig_enableUrlPrefixes description]);
    return [super webView:webView shouldStartLoadForRequest:request withCallback:callback];
}

@end
