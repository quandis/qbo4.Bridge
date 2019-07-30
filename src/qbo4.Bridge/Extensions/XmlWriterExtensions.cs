using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

namespace qbo4.Bridge.Extensions
{
    public static class XmlWriterExtensions
    {
        public static XmlWriterSettings DefaultSettings = new XmlWriterSettings()
        {
            CloseOutput = false,
            Async = true,
            ConformanceLevel = ConformanceLevel.Auto
        };

        public static async Task WriteAsync(this XmlWriter writer, IDataReader reader, string root = "")
        {
            //// Infer the core element name from the result set. If the column ends with ID, the ID is stripped off.
            string elementName;
            string columnName = string.Empty;

            // Loop through all result sets
            int count = 0;
            do
            {
                // Infer the core element name from the result set. If the column ends with ID, the ID is stripped off.
                elementName = ((count++ == 0) && !string.IsNullOrEmpty(root)) ? root : reader.GetName(0);
                if (elementName.EndsWith("ID", StringComparison.OrdinalIgnoreCase))
                    elementName = elementName.Substring(0, elementName.Length - 2);

                writer.WriteStartElement(string.Format("{0}Collection", elementName));
                // Loop through all rows
                while (reader.Read())
                {
                    writer.WriteStartElement(string.Format("{0}Item", elementName));
                    // Loop through all columns
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        if (!reader.IsDBNull(i))
                        {
                            columnName = string.IsNullOrEmpty(reader.GetName(i)) ? string.Format("Column{0}", i) : reader.GetName(i);
                            await writer.WriteElementStringAsync(null, columnName, null, reader.GetValue(i).ToString());
                        }
                    }
                    writer.WriteEndElement(); // Item
                }
                writer.WriteEndElement(); // Collection
            } while (reader.NextResult());

        }

        public static async Task WriteAsync(this XmlWriter writer, XmlReader reader)
        {
            while (await reader.ReadAsync())
            {
                switch (reader.NodeType)
                {
                    case XmlNodeType.Element:
                        writer.WriteStartElement(reader.Name);
                        if (reader.HasAttributes)
                            writer.WriteAttributes(reader, true);
                        if (reader.IsEmptyElement)
                            writer.WriteEndElement();
                        break;
                    case XmlNodeType.CDATA:
                        await writer.WriteCDataAsync(reader.Value);
                        break;
                    case XmlNodeType.Text:
                        await writer.WriteStringAsync(reader.Value);
                        break;
                    case XmlNodeType.XmlDeclaration:
                        break;
                    case XmlNodeType.ProcessingInstruction:
                        writer.WriteProcessingInstruction(reader.Name, reader.Value);
                        break;
                    case XmlNodeType.Comment:
                        writer.WriteComment(reader.Value);
                        break;
                    case XmlNodeType.EndElement:
                        writer.WriteFullEndElement();
                        break;
                }
            }
        }
    }
}