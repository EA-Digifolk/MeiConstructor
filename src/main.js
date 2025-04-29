import { createApp } from 'vue';

import App from './App.vue';

import './style.css';
import "bootstrap/dist/css/bootstrap.css";
import SvgIcon from "vue3-icon";

import MeiMethods from './plugins/mei_methods.js';

import AuthomaticMethods from './plugins/automatic_functions.js';

const app = createApp(App)

app.component("svg-icon", SvgIcon);

app.provide('prettifyXml', (sourceXml) => {
    var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
    var xsltDoc = new DOMParser().parseFromString([
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);
    var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    var resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
});

app.provide('capitalizeFirstLetter', (string) => {
    return string && (string[0].toUpperCase() + string.slice(1));
});

app.provide(/* key */ 'message', /* value */ 'hello!');

app.use(MeiMethods);
app.use(AuthomaticMethods);

app.mount('#app');

import "bootstrap/dist/js/bootstrap.js";
