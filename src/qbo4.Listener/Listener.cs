using System;
using System.Net;
using System.Threading.Tasks;

namespace qbo4.Listener
{
    public static class Listener
    {
        private static HttpListener server;
        private static bool IsRunning;

        public async static void Start()
        {
            var prefixes = new string[] { "http://localhost:8081/test/" };
            server = new HttpListener();
            foreach (string s in prefixes)
                server.Prefixes.Add(s);

            server.Start();
            IsRunning = true;
            while (server.IsListening && (server != null))
            {
                try
                {
                    var context = await server.GetContextAsync();
                    // don't await this; keep listening for requests
                    Process(context);
                }
                catch (System.Net.HttpListenerException ex)
                {
                    // ignore errors from calls to Stop().
                }
            }
        }

        private static async Task Process(HttpListenerContext context)
        {
            var response = context.Response;

            byte[] buffer = System.Text.Encoding.UTF8.GetBytes("<HTML><BODY> Hello world!</BODY></HTML>");
            response.ContentLength64 = buffer.Length;
            using (var stream = response.OutputStream)
            {
                stream.Write(buffer, 0, buffer.Length);
            }
        }

        public static void Stop()
        {
            IsRunning = false;
            server.Stop();
        }
    }
}
