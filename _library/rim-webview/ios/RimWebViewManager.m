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
    RimWebView* webView = [RimWebView new];
    webView.delegate = self;
    return webView;
}


- (BOOL)webView:(RCTWebView *)webView shouldStartLoadForRequest:(NSMutableDictionary<NSString *,id> *)request withCallback:(RCTDirectEventBlock)callback {
    if (true) {
        return [((RCTWebView*)super.view).delegate webView: webView shouldStartLoadForRequest: request withCallback: callback];
    }
    return FALSE;
}

@end
