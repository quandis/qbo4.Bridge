using System;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace qbo4.Listener.Tests
{
    public class ListenerTests
    {
        [Fact]
        public async Task ReceivesRequests()
        {
            Task.Run(() => { Listener.Start(); });

            var client = new HttpClient();
            var response = await client.GetAsync("http://localhost:8081/test/blah");
            var html = await response.Content.ReadAsStringAsync();
            Assert.Contains("Hello", html);
            Listener.Stop();
        }
    }
}
