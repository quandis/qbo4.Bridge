using Microsoft.AspNetCore.Http;
using qbo4.Common;

namespace qbo4.Bridge.Extensions
{
    public static class ParameterExtensions
    {
        public static qbo.Application.Parameters ToQbo3Parameters(this Parameters parameters)
        {
            var result = new qbo.Application.Parameters();
            foreach (var parameter in parameters)
            {
                result.Add(parameter.Key, $"{Parameter.OperatorValues[parameter.Operator]}{parameter.Value}");
            }
            return result;
        }

        public static qbo.Application.Parameters Add(this qbo.Application.Parameters parameters, HttpRequest request)
        {
            var interim = new Parameters(request);
            foreach (var parameter in interim)
            {
                parameters.Add(parameter.Key, $"{Parameter.OperatorValues[parameter.Operator]}{parameter.Value}");
            }
            return parameters;
        }
    }
}