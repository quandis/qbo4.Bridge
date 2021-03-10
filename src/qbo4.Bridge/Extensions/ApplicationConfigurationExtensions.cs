using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using qbo4.Extensions.DependencyInjection;
using System;

namespace qbo4.Bridge.Extensions
{
    public static class ApplicationConfigurationExtensions
    {
        private static IConfiguration _configuration;
        private static IServiceProvider _services;

        public static void Startup(this qbo.Application.Configuration.ApplicationConfiguration configuration)
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables("qbo3:");
            _configuration = builder.Build();

            var services = new ServiceCollection()
                .AddServiceCollectionMethods(_configuration);
            _services = services.BuildServiceProvider();

        }
        public static IConfiguration GetConfiguration(this qbo.Application.Configuration.ApplicationConfiguration configuration)
        {
            if (_configuration == null)
                throw new Exception("ApplicationConfiguration.GetConfiguration was called before GetConfiguration.");
            return _configuration;
        }

        public static IServiceProvider GetServiceProvider(this qbo.Application.Configuration.ApplicationConfiguration configuration)
        {
            if (_services == null)
                throw new Exception("ApplicationConfiguration.GetServiceProvider was called before Startup.");
            return _services;
        }
    }
}