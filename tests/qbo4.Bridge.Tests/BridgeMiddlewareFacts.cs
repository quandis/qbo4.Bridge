using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using qbo4.Bridge.Extensions;
using qbo4.Bridge.Tests.Extensions;
using qbo4.Extensions.Testing;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace qbo4.Bridge.Tests
{
    public class BridgeMiddlewareFacts
    {

        private readonly TestServer _server;
        private readonly HttpClient _client;

        public BridgeMiddlewareFacts()
        {
            _server = new TestServer(new WebHostBuilder().UseStartup<Startup>()) { BaseAddress = new Uri("https://qbo3.quandis.io") };
            _client = _server.CreateClient();
        }

        [EnvironmentFact("qbo3:ConnectionStrings:qbo.Default")]
        public void Compiles()
        {
            Assert.True(true);
        }

        [EnvironmentFact("qbo3:ConnectionStrings:qbo.Default")]
        public async Task BindsToRoutes()
        {
            var message = await _client.GetAsync("/api/matrix/search?output=xml");
            var headers = message.Headers;
            var result = await message.Content.ReadAsStringAsync();
            // Assert.Equal("bar", result);
        }
    }



    /// <summary>
    /// Sample startup class to handle server-side wiring.
    /// </summary>
    /// <see cref="https://docs.microsoft.com/en-us/aspnet/core/testing/integration-testing"/>
    public class Startup
    {
        IConfiguration _configuration;

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>() { { "foo", "bar" } })
                .AddEnvironmentVariables();
            _configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Proxy security class
            qbo.Application.Properties.Settings.Default.Override("PersonTypeDefault", qbo.Application.Properties.Settings.Default.PersonTypeDefault, typeof(TestUser).AssemblyQualifiedName);

            services.AddSingleton(_configuration);
            services.AddRouting();
            // qbo.Application.Properties.Settings.Default.Override("ConfigurationConnection", qbo.Application.Properties.Settings.Default.ConfigurationConnection, null);

            // services.AddSingleton<IRepository<Poco>, MemoryRepository<Poco>>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            // loggerFactory.AddConsole(LogLevel.Warning);
            // app.UseMiddleware<FinalizeMiddleware>();
            app.Use(async (context, next) =>
            {
                context.User = new TestUser();
                await next.Invoke();
            });
            app.UseCustomRoutes();
        }
    }

}
