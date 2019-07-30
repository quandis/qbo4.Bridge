using qbo.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Data;
using System.Xml;
using qbo.Application;
using System.IO;

namespace qbo4.Bridge.Extensions
{
    public static class StreamExtensions
    {
        public static async Task WriteXmlAsync(this Stream stream, IAbstractCollection collection, System.Type type, string root)
        {
            var serializer = new System.Runtime.Serialization.DataContractSerializer(type, root, string.Empty);
            serializer.WriteObject(stream, collection);
        }

        public static async Task WriteXmlAsync(this Stream stream, IDataReader reader, string root)
        {
            var writer = XmlWriter.Create(stream, XmlWriterExtensions.DefaultSettings);
            writer.WriteStartDocument();
            writer.WriteStartElement(root);
            await writer.WriteAsync(reader, root);
            writer.WriteEndElement(); // root
            writer.WriteEndDocument();
            writer.Close();
        }

        public static async Task WriteXmlAsync(this Stream stream, XmlReader reader, string root = "Root")
        {
            using (var writer = XmlWriter.Create(stream, XmlWriterExtensions.DefaultSettings))
            {
                writer.WriteStartDocument();
                writer.WriteStartElement(root);
                await writer.WriteAsync(reader);
                writer.WriteEndElement();
                writer.WriteEndDocument();
                writer.Close();
            }
        }

        public static async Task WriteXmlAsync(this Stream stream, AbstractObject instance)
        {
            using (var writer = XmlWriter.Create(stream, XmlWriterExtensions.DefaultSettings))
            {
                instance.WriteXml(writer);
            }

        }

    }
}