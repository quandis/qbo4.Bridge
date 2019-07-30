using qbo.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Data;
using System.Xml;
using qbo.Application;

namespace qbo4.Bridge.Extensions
{
    public static class HttpResponseExtensions
    {
        public static async Task WriteXmlAsync(this HttpResponse response, IAbstractCollection collection, System.Type type, string root)
        {
            var serializer = new System.Runtime.Serialization.DataContractSerializer(type, root, string.Empty);
            serializer.WriteObject(response.Body, collection);
        }

        public static async Task WriteXmlAsync(this HttpResponse response, IDataReader reader, string root)
        {
            var writer = XmlWriter.Create(response.Body);
            writer.WriteStartDocument();
            writer.WriteStartElement(root);
            await writer.WriteAsync(reader, root);
            writer.WriteEndElement(); // root
            writer.WriteEndDocument();
            writer.Close();
        }

        public static async Task WriteXmlAsync(this HttpResponse response, XmlReader reader, string root = "Root")
        {
            using (var writer = XmlWriter.Create(response.Body, XmlWriterExtensions.DefaultSettings))
            {
                writer.WriteStartDocument();
                writer.WriteStartElement(root);
                await writer.WriteAsync(reader);
                writer.WriteEndElement();
                writer.WriteEndDocument(); 
                writer.Close();
            }
        }

        public static async Task WriteXmlAsync(this HttpResponse response, AbstractObject instance)
        {
            using (var writer = XmlWriter.Create(response.Body, XmlWriterExtensions.DefaultSettings))
            {
                instance.WriteXml(writer);
            }

        }
    }
}