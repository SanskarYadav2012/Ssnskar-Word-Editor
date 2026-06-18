import { zipSync, strToU8 } from 'fflate';

/**
 * Self-contained .docx generator.
 *
 * Produces a valid OpenXML WordprocessingML package whose body is a single
 * `<w:altChunk>` that embeds the document's HTML. Microsoft Word (and
 * LibreOffice) import the embedded HTML on open, which preserves rich
 * formatting — headings, bold/italic, lists, tables, colors, images — without
 * needing a full HTML→OOXML translation layer. The whole package is zipped in
 * the browser with `fflate`, so there is no native/`with`-statement dependency.
 */

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/afchunk.html" ContentType="text/html"/>
</Types>`;

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const DOCUMENT_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <w:altChunk r:id="htmlChunk"/>
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

const DOCUMENT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="htmlChunk" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk" Target="afchunk.html"/>
</Relationships>`;

/** Build a .docx Blob from an already-wrapped, standalone HTML document. */
export function htmlToDocxBlob(fullHtml: string): Blob {
  const zipped = zipSync({
    '[Content_Types].xml': strToU8(CONTENT_TYPES),
    '_rels/.rels': strToU8(ROOT_RELS),
    'word/document.xml': strToU8(DOCUMENT_XML),
    'word/_rels/document.xml.rels': strToU8(DOCUMENT_RELS),
    'word/afchunk.html': strToU8(fullHtml),
  });
  // Copy into a fresh ArrayBuffer-backed view so the Blob type is unambiguous.
  return new Blob([zipped.slice()], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}
