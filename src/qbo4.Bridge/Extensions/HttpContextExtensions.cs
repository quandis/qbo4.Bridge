using Microsoft.AspNetCore.Http;
using qbo.Application.Configuration;
using System;

namespace qbo4.Bridge.Extensions
{
    public static class HttpContextExtensions
    {
        public static bool MatchRoute(this HttpContext context)
        {
            return true;
        }
    }
}