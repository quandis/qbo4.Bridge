<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl data" xmlns:data="urn:qbo3-data" xmlns:security="urn:qbo3-security">
	<xsl:import href="Theme.xslt" />
	<xsl:output method="xml" indent="yes"/>
	<xsl:param name="HtmlTitle">Email Results</xsl:param>
	<xsl:param name="UserName" select="security:userName()" />
	<xsl:param name="EmailAddress">
		<xsl:choose>
			<xsl:when test="contains($UserName, '@')">
				<xsl:value-of select="$UserName"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="data:invoke('Person', 'GetEmail', concat('PersonID=', security:userID()))//ContactValue"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:param>
	<xsl:param name="EmailSubject">Your report has been generated</xsl:param>
	<xsl:param name="EmailBody">Your report is attached.</xsl:param>

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
									<input type="hidden" name="EmailResults" value="true"/>
								</div>
								<div class="control-group">
									<label>Subject</label>
									<div class="input-block-level">
										<input type="text" class="required" name="Message" value="{$EmailSubject}"/>
									</div>
								</div>
								<div class="control-group">
									<label>Body</label>
									<div class="input-block-level">
										<textarea rows="3" name="BodyText">
											<xsl:value-of select="$EmailBody"/>
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