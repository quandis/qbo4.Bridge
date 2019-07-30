using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using qbo4.Bridge.Extensions;
using System;
using Microsoft.AspNetCore.Routing;
using System.Collections.Generic;
using qbo.Application;
using qbo.Application.Interfaces;
using System.Net;

namespace qbo4.Bridge
{
    public class BridgeMiddleware
    {
        protected readonly RequestDelegate _next;

        /// <summary>
        /// Constructor. Derived classes should call base(<see cref="RequestDelegate"/> next)."/>
        /// </summary>
        /// <param name="next"><see cref="RequestDelegate"/> to call after processing the context.</param>
        public BridgeMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        IDictionary<string, object> _defaultParameters;

        public BridgeMiddleware(RequestDelegate next, IDictionary<string, object> defaultParameters)
        {
            _next = next;
            _defaultParameters = defaultParameters;
        }

        public virtual async Task Invoke(HttpContext context)
        {
            var routeFeature = context.Features.Get<IRoutingFeature>();
            var className = routeFeature?.RouteData?.Values["class"] as string;
            var operation = routeFeature?.RouteData?.Values["operation"] as string;
            await InvokeXml(context, className, operation);
            // await _next.Invoke(context);
        }

        private async Task InvokeXml(HttpContext context, string className, string operation)
        {
            if (context.User == null)
                throw new ArgumentNullException(nameof(context.User));
            if (!typeof(IPerson).IsAssignableFrom(context.User.GetType()))
                throw new ArgumentOutOfRangeException(nameof(context.User), "The HttpContext.User must implement IPerson to work with BridgeMiddleware.");
            var instance = AbstractObject.Create(className, context.User as IPerson);
            var parameters = context.Request.GetParameters();

            switch (instance.Configuration.ReturnType(operation))
            {
                case OperationReturnType.Collection:
                    await context.Response.WriteXmlAsync(await instance.InvokeCollectionAsync(operation, parameters), instance.GetType(), $"{instance.Configuration.Table}Collection");
                    break;
                case OperationReturnType.DataSet:
                case OperationReturnType.DataReader:
                    using (var reader = await instance.InvokeDataReaderAsync(operation, parameters))
                    {
                        await context.Response.Body.WriteXmlAsync(reader, operation);
                    }
                    break;
                case OperationReturnType.XmlReader:
                    using (var reader = await instance.InvokeXmlReaderAsync(operation, parameters))
                    {
                        await context.Response.Body.WriteXmlAsync(reader);
                    }
                    break;
                case OperationReturnType.Object:
                    await context.Response.Body.WriteXmlAsync(await instance.InvokeObjectAsync(operation, parameters));
                    break;
                case OperationReturnType.Void:
                    context.Response.StatusCode = (int)HttpStatusCode.NoContent;
                    await instance.InvokeAsync(operation, parameters);
                    break;
            }
        }
    }
}