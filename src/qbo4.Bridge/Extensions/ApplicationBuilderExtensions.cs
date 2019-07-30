using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using qbo.Application.Configuration;

namespace qbo4.Bridge.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static CustomRouteCollection Routes = CustomRouteConfiguration.Load().CustomRoutes;

        public static IApplicationBuilder UseCustomRoutes(this IApplicationBuilder applicationBuilder)
        {
            var builder = new RouteBuilder(applicationBuilder);
            foreach (CustomRoute route in Routes)
            {
                var methods = route.HttpMethods?.ToLower() ?? string.Empty;
                // todo: add route.DefaultParameters with overrides to methods found in https://github.com/aspnet/Routing/blob/master/src/Microsoft.AspNetCore.Routing/RequestDelegateRouteBuilderExtensions.cs

                if (string.IsNullOrEmpty(methods))
                {
                    builder.MapMiddlewareRoute(route.Url, appBuilder =>
                    {
                        appBuilder.UseMiddleware<BridgeMiddleware>();
                    });
                }
                if (methods.Contains("get")) { 
                    builder.MapMiddlewareGet(route.Url, appBuilder =>
                    {
                        appBuilder.UseMiddleware<BridgeMiddleware>();
                    });
                }
                if (methods.Contains("post"))
                {
                    builder.MapMiddlewarePost(route.Url, appBuilder =>
                    {
                        appBuilder.UseMiddleware<BridgeMiddleware>();
                    });
                }
                if (methods.Contains("put"))
                {
                    builder.MapMiddlewarePut(route.Url, appBuilder =>
                    {
                        appBuilder.UseMiddleware<BridgeMiddleware>();
                    });
                }
                if (methods.Contains("delete"))
                {
                    builder.MapMiddlewareDelete(route.Url, appBuilder =>
                    {
                        appBuilder.UseMiddleware<BridgeMiddleware>();
                    });
                }
            }
            applicationBuilder.UseRouter(builder.Build());
            return applicationBuilder;
        }
    }
}