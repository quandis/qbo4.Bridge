using qbo.Application.Configuration;
using qbo.Application.Extensions;
using qbo.Application.Utilities.Extensions;
using System.Collections.Generic;

namespace qbo4.Bridge.Extensions
{
    public static class KeyValuePairExtensions
    {
        public static KeyValuePair<string, object> Clean(this KeyValuePair<string, object> keyValuePair)
        {
            if (keyValuePair.Value != null)
            {
                foreach (char c in SqlPattern.ParameterModifiers)
                {
                    if (keyValuePair.Key.EndsWith(c.ToString()))
                    {
                        return new KeyValuePair<string, object>(keyValuePair.Key.Substring(0, keyValuePair.Key.Length - 1), ((keyValuePair.Value == null) || string.IsNullOrEmpty(keyValuePair.Value.ToString())) ? c.ToString() : c.ToString() + keyValuePair.Value.ToString());
                    }
                }
            }
            var value = ((keyValuePair.Value == null) || string.IsNullOrEmpty(keyValuePair.Value.ToString()))
                ? null : keyValuePair.Value.ToString().Clean();
            return new KeyValuePair<string, object>(keyValuePair.Key, value);
        }
    }
}