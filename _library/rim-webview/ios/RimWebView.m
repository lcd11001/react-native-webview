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

@property (nonatomic, copy) RCTDirectEventBlock onMessage;

@end

@implementation RimWebView { }

- (BOOL)webView:(__unused UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSString* url = request.URL.absoluteString;
    
    if (self.enableUrlPrefixes && self.enableUrlPrefixes.count > 0)
    {
        for (int i=0; i<self.enableUrlPrefixes.count; i++)
        {
            BOOL useCustomCheck = NO;
            BOOL bValue = NO;
            NSString* sValue = @"";
            NSString* key = @"";
            
            id obj = [self.enableUrlPrefixes objectAtIndex:i];
            NSString* className = NSStringFromClass([obj class]);
            
            if ([obj isKindOfClass:[NSDictionary class]])
            {
                useCustomCheck = YES;
                
                NSDictionary* dic = obj;
                for (NSString *k in dic)
                {
                    key = k;
                    id value = dic[key];
                    // NSLog(@"Value: %@ for key: %@", value, key);
                    
                    if ([value isKindOfClass:[NSNumber class]])
                    {
                        bValue = [dic[key] boolValue];
                    }
                    else if ([value isKindOfClass:[NSString class]])
                    {
                        sValue = [dic[key] stringValue];
                    }
                    else
                    {
                        NSLog(@"RimWebView not support key %@ value %@", key, value);
                    }
                }
            }
            else
            {
                NSLog(@"RimWebView not support urlPrefix type of class %@ object %@", className, obj);
            }
                
            if (useCustomCheck)
            {
                if ([url hasPrefix:key])
                {
                    [self postMessage:url];
                    
                    NSMutableDictionary<NSString *, id> *event = [self baseEvent];
                    [event addEntriesFromDictionary: @{
                        @"data": url,
                    }];
                    
                    _onMessage(event);
                    
                    NSString* newUrl = url;
                    if ([sValue compare:@"remove"] == 0)
                    {
                        newUrl = [url stringByReplacingOccurrencesOfString:key withString:@""];
                        
                        NSURL *anotherURL = [NSURL URLWithString:newUrl];
                        NSURLRequest *anotherRequest = [NSURLRequest requestWithURL:anotherURL];
                        
                        [webView loadRequest:anotherRequest];
                        return NO;
                    }
                    
                    return bValue == YES; // not same as Android
                }
            }
            
        }
        
    }
    return [super webView:webView shouldStartLoadWithRequest:request navigationType:navigationType];
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error
{
    NSString *theURLString = [error.userInfo objectForKey:@"NSErrorFailingURLStringKey"];
    NSLog(@"RimWebView didFailLoadWithError for url: %@", theURLString);
    NSLog(@"RimWebView reason: %@", error.localizedDescription);
    return;
}

@end

