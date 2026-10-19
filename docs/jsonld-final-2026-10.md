# JSON-LD: serialización segura — 19/10/2026

Se añade `.replace(/</g, "\\u003c")` a las cuatro serializaciones existentes de `_document.jsx` (Person, WebSite, WebPage y ProfessionalService). No cambia ningún dato, URL, descripción ni estilo. No se añade ninguna dependencia. Es endurecimiento preventivo: el origen actual son constantes locales y no se demostró una entrada externa explotable.

`node tests/security/jsonld.cjs` verifica las cuatro expresiones reales del archivo mediante AST, inyecta datos adversos con `</script>`, cierre mixto, comentario HTML, caracteres especiales y Unicode, y comprueba round-trip sin alterar valores. Además, las cuatro estructuras del HTML productivo se comparan mediante SHA-256 de su JSON contra el baseline anterior al cambio. El test se ejecuta después de build.

Validación: Node 24.19.0/npm 11.17.0, `npm run qa`, prueba JSON-LD (4 expresiones + 4 cargas adversas + 4 schemas HTML) y `git diff --check` correctos. Los hashes conservados están en el test. No se ejecutaron actualizaciones ni scripts de instalación. Los checks remotos son requisito previo al merge.

Este PR es independiente del arreglo SSR del modal (#21) y parte de main f7f2c70. Mientras #21 no se integre, Doctor conserva su error previo del modal; las cuatro advertencias de JSON-LD desaparecen. El cierre consolidado registra el resultado combinado. La deuda braces permanece sin resolver y no se presenta el audit completo como aprobado.
