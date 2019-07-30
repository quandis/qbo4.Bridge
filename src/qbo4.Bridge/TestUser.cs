using qbo.Application.Interfaces;
using System;
using System.Security.Claims;
using System.Security.Principal;

namespace qbo4.Bridge.Tests
{
    public class TestUser : ClaimsPrincipal, IPerson
    {
        public long UserID => 1;

        public bool HasUniversalAccess => true;

        public bool PermissionInherited { get; set; }
        public bool ForcePasswordChange { get; set; }
        public DateTime? LicenseAccepted { get; set; }
        public DateTime? Lockout { get; set; }

        public string Name => "admin@quandis.com";

        public string AuthenticationType => string.Empty;

        public bool IsAuthenticated => true;

        public IIdentity Identity => this;

        IIdentity IPrincipal.Identity => throw new NotImplementedException();

        public IPerson Clone()
        {
            return this;
        }

        public string GetDefault(string key)
        {
            throw new NotImplementedException();
        }

        public long? GetGroupID(string group)
        {
            throw new NotImplementedException();
        }

        public bool HasPermission(string systemFunction)
        {
            return true;
        }

        public IPerson Impersonate(long id)
        {
            throw new NotImplementedException();
        }

        public bool IsInRole(string role)
        {
            return true;
        }

        public void SendNotification(string method)
        {
            throw new NotImplementedException();
        }
    }
}
