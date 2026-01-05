const English = Java.type('org.atteo.evo.inflector.English');

function build_name_variation(pascalNm) {
  return {
    pascal: pascalNm,
    camel: pascalNm.charAt(0).toLowerCase() + pascalNm.slice(1),
    allCaps: pascalNm.toUpperCase(),
    plural: English.plural(pascalNm.toLowerCase()),
    kebab: pascalNm
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[A-Z]/g, (letter) => letter.toLowerCase()),
    firstLetter: pascalNm.charAt(0).toLowerCase(),
  };
}

function build_template_data(metadata) {
  // TODO field name process
  return {
    domainPkgNm: metadata.packageName,
    interfacesPkgNm: metadata.packageName.replace('.domain.', '.interfaces.'),
    entityNm: build_name_variation(metadata.className.replace('Entity', '')),
    fields: metadata.fields,
    // TODO add prop
  };
}

const metadataList = JSON.parse(project.getProperty('metadata'));

const templateData = metadataList.map((metadata) => {
  build_template_data(metadata);
});

// TODO 書き出しはantにパスかもしれない
const writer = new java.io.FileWriter(new java.io.File('input.json'));
writer.write(JSON.stringify(templateData, null, 2));
writer.close();
