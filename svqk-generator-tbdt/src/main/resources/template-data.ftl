<#macro nameSnippet name="">
  <#assign namePascal = name?cap_first>
  "pascal": "${namePascal}",
  "camel": "${namePascal?uncap_first}",
  "allCaps": "${namePascal?upper_case}",
  "plural": "${wordUtil.plual(namePascal)}",
  "kebab": "journal",
  "firstLetter": "${namePascal?substring(0, 1)?lower_case}"
</#macro>
<#macro fieldSnippet field={}>
  "fieldName": {
    <@nameSnippet name=field.fieldName />
  },
  "javaType": "${field.javaType}",
  "multiple": ${field.multiple?c},
  "id": ${field.id?c},
  "required": ${field.required?c}
</#macro>
<#macro fieldsSnippet fields=[]>
  <#list fields as f>
    {
      <@fieldSnippet field=f />
    }<#if f?has_next>,</#if>
  </#list>
</#macro>
[
  <#list root as metadata>
  {
    "tableNm": "${metadata.tableName!}",
    "pkgNm": {
      "domain": "${metadata.packageName}",
      "interfaces": "${metadata.packageName?replace('.domain.', '.interfaces.')}"
    },
    "entityNm": {
      <@nameSnippet name=metadata.className?replace('Entity', '') />
    },
    "fields": [
      <@fieldsSnippet fields=metadata.fields />
    ],
    <#assign idField = metadata.fields?filter(f -> f.id)[0]!{}>
    <#if idField?has_content>
      "idField": {
        <@fieldSnippet field=idField />
      },
      <#assign compIdFields = ((root?filter(meta -> meta.className == idField.javaType!""))[0].fields)![]>
      <#if compIdFields?has_content>
        "compIdFields": [
          <@fieldsSnippet fields=compIdFields />
        ],
      </#if>
    </#if>
    "nonIdFields": [
      <@fieldsSnippet fields=metadata.fields?filter(f -> !f.id) />
    ]
  }<#if metadata?has_next>,</#if>
  </#list>
]