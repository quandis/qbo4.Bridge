using System;
using System.Configuration;

namespace qbo4.Bridge.Tests.Extensions
{
    public static class ExtensionMethods
    {
        /// <summary>
        /// Overrides an application setting, until a Reload() or Reset() is called.
        /// </summary>
        /// <param name="settings">ApplicationSettingsBase containing a property to override</param>
        /// <param name="property">Name of property to override.</param>
        /// <param name="current">Reference to current property (to ensure it has been lazy-loaded).</param>
        /// <param name="desired">Value to set property to.</param>
        /// <returns>True if the current and desired setting are equal, false if they are different.</returns>
        /// <example>Settings.Default.Override('SetTextFromHtml', Settings.Default.SetTextFromHtml, false)</example>
        public static bool Override(this ApplicationSettingsBase settings, string property, object current, object desired)
        {
            if (settings.PropertyValues[property] == null)
                throw new ArgumentNullException(property, string.Format("Either this is not a valid property, or it had not yet been loaded into memory."));
            settings.PropertyValues[property].PropertyValue = desired;
            return (current == desired);
        }
    }
}
