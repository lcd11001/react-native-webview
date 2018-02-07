//
//  RimWebViewManager.m
//  RNLibraryRimWebview
//
//  Created by Luong Cong Dan on 2/6/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "RimWebViewManager.h"
#import "RimWebView.h"

@interface RimWebViewManager () <RCTWebViewDelegate>

@end

@implementation RimWebViewManager {}

RCT_EXPORT_MODULE()

-(UIView*) view
{
    NSLog(@"RimWebViewManager => view");
    RimWebView* webView = [RimWebView new];
    webView.delegate = self;
    return webView;
}

@end
