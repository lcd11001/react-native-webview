//
//  RimWebView.m
//  RNLibraryRimWebview
//
//  Created by Luong Cong Dan on 2/6/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RimWebView.h"
#import "RCTWebView+Custom.h"

@interface RimWebView ()

@end

@implementation RimWebView

- (BOOL)webView:(__unused UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    BOOL allowed = [super webView:webView shouldStartLoadWithRequest:request navigationType:navigationType];
    
    return allowed;
}

@end
