const English = Java.type('org.atteo.evo.inflector.English');

const buildPackageName = (domainPkgNm) => ({
  domain: domainPkgNm,
  interfaces: domainPkgNm.replace('.domain.', '.interfaces.'),
});

const buildNameVariation = (inputNm) => {
  const pascalNm = inputNm.charAt(0).toUpperCase() + inputNm.slice(1);

  return {
    pascal: pascalNm,
    camel: pascalNm.charAt(0).toLowerCase() + pascalNm.slice(1),
    allCaps: pascalNm.toUpperCase(),
    plural: English.plural(pascalNm.toLowerCase()),
    kebab: pascalNm.replaceAll(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
    firstLetter: pascalNm.charAt(0).toLowerCase(),
  };
};

const buildTemplateData = (metadata, metadataList) => {
  const idField = metadata.fields.find((field) => field.id) ?? {};

  return {
    pkgNm: buildPackageName(metadata.packageName),
    entityNm: buildNameVariation(metadata.className.replace('Entity', '')),
    fields: metadata.fields,
    idField: idField,
    nonIdFields: metadata.fields.filter((field) => !field.id),
    compIdFields: metadataList.find(
      (meta) => meta.className === idField.javaType,
    )?.fields,
  };
};

const processFieldName = (metadataList) => {
  metadataList.forEach((meta) => {
    meta.fields.forEach((field) => {
      field.fieldNm = buildNameVariation(field.fieldName);
    });
  });
};

function build() {
  const metadataList = JSON.parse(project.getProperty('metadata'));

  processFieldName(metadataList);

  const templateData = metadataList.map((meta) =>
    buildTemplateData(meta, metadataList),
  );

  project.setProperty('template.data', JSON.stringify(templateData, null, 2));
}

build();
