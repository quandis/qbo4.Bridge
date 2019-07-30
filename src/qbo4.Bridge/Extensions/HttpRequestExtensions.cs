using qbo.Application;
using Microsoft.AspNetCore.Http;

namespace qbo4.Bridge.Extensions
{
    public static class HttpRequestExtensions
    {
        /// <summary>
        /// Determines the <see cref="OutputMethod"/> based on query string or Accept header.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public static OutputMethod GetOutputMethod(this HttpRequest request)
        {
            OutputMethod result = OutputMethod.Html;
            //var queryString = request.GetQueryNameValuePairs().ToList();
            //var output = queryString.FirstOrDefault(kvp => kvp.Key.Equals("output", StringComparison.OrdinalIgnoreCase));
            //var jsonp = queryString.FirstOrDefault(kvp => kvp.Key.Equals("jsonp", StringComparison.OrdinalIgnoreCase));
            //if (output.Value != null)
            //{
            //    if (!Enum.TryParse<OutputMethod>(output.Value, true, out result))
            //        throw new qbo.Exception.ArgumentOutOfRangeException("Output", output.Value, "Invalid value. Valid values are: Xml | Json | JsonP | Html | XHtml | Csv ");
            //}
            //else if (jsonp.Value != null)
            //{
            //    result = OutputMethod.JsonP;
            //    // _JsonCallback = jsonp.Value;
            //}
            //else if (request.Headers.Accept != null)
            //{
            //    var accept = request.Headers.Accept.FirstOrDefault();
            //    if (accept == AcceptValues.XML)
            //        return OutputMethod.Xml;
            //    if (accept == AcceptValues.CSV)
            //        return OutputMethod.Csv;
            //    if (accept == AcceptValues.JSON)
            //        return OutputMethod.Json;
            //    if (accept == AcceptValues.Javascript)
            //        return OutputMethod.Json;
            //    if (accept == AcceptValues.TextJavascript)
            //        return OutputMethod.JsonP;

            //}
            return result;
        }

        public static string[] StandardParameters = new string[4] { "Cache", "Transform", "Output", "QueueName" };


        public static Parameters GetParameters(this HttpRequest request)
        {
            var parameters = new qbo.Application.Parameters();
            var interim = new qbo4.Common.Parameters(request);
            foreach (var parameter in interim)
            {
                parameters.Add(parameter.Key, $"{qbo4.Common.Parameter.OperatorValues[parameter.Operator]}{parameter.Value}");
            }
            return parameters;
        }
    }
}