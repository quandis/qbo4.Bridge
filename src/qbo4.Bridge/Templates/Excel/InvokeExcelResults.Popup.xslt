This XML file does not appear to have any style information associated with it. The document tree is shown below.
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:data="urn:qbo3-data" xmlns:security="urn:qbo3-security" version="1.0" exclude-result-prefixes="msxsl data">
<xsl:import href="Theme.xslt"/>
<xsl:output method="xml" indent="yes"/>
<xsl:param name="HtmlTitle">Email Results</xsl:param>
<xsl:template match="/">
<div>
<form class="form-horizontal" data-behavior="Validator">
<div class="modal-header">
<a href="#" class="close">x</a>
<h3 class="refresh">
<xsl:value-of select="$HtmlTitle"/>
</h3>
</div>
<div class="modal-body">
<fieldset>
<div class="row-fluid">
<div class="span12">
<div class="control-group">
<label>Email Address</label>
<input type="text" class="validate-email required" name="ToAddress" placeholder="Email Address" value="{$EmailAddress}"/>
</div>
<div class="control-group">
<label>Subject</label>
<div class="input-block-level">
<input type="text" class="required" name="Message" value="Your Global Detail Report has been generated"/>
</div>
</div>
<div class="control-group">
<label>Body</label>
<div class="input-block-level">
<textarea rows="3" name="BodyText">
<xsl:text>Your Global Detail Report is attached.</xsl:text>
</textarea>
</div>
</div>
<div class="control-group">
<label>Results File</label>
<label class="radio">
<input type="radio" id="ResultsFileLink" name="ResultsFile" checked="true" value="Link"/>
<xsl:text xml:space="preserve"> Include a link to download</xsl:text>
</label>
<label class="radio">
<input type="radio" id="ResultsFileDownload" name="ResultsFile" value="Download"/>
<xsl:text xml:space="preserve"> Send as an email attachment</xsl:text>
</label>
</div>
</div>
</div>
</fieldset>
</div>
<div class="modal-footer form-actions">
<button type="button" class="btn btn-primary save dismiss">Save</button>
<button type="button" class="btn cancel secondary dismiss">Cancel</button>
</div>
</form>
</div>
</xsl:template>
</xsl:stylesheet>