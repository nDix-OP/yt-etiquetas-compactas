// YouTube: Etiquetas de fecha compactas
// Quita el prefijo "hace" de las etiquetas de tiempo relativo ("hace 3 d" -> "3 días")
// y expande la unidad respetando singular/plural, sin tocar el resto de la página.

(() => {
  'use strict';

  // Cada clave es la unidad tal y como puede aparecer (abreviada o completa,
  // ya que YouTube usa una u otra según el espacio disponible en la etiqueta).
  // El valor es [singular, plural].
  const UNIT_FORMS = {
    // años
    'a': ['año', 'años'],
    // meses
    'm': ['mes', 'meses'],
    // semanas -> siempre abreviado "sem." (sin distinción singular/plural)
    'sem': ['sem.', 'sem.'],
    // días
    'd': ['día', 'días'],
    // horas
    'h': ['hora', 'horas'],
    //'hora': ['hora', 'horas'],
    //'horas': ['hora', 'horas'],
    // minutos -> siempre "min"
    /*'min': ['min', 'min'],
    'minuto': ['min', 'min'],
    'minutos': ['min', 'min'], */
    // segundos -> siempre "s"
    /*'s': ['s', 's'],
    'seg': ['s', 's'],
    'segundo': ['s', 's'],
    'segundos': ['s', 's'], */
  };

  // Coincide con textos como "hace 1 a", "hace 34 min", "hace 3 días", etc.
  // Se ancla a todo el texto del nodo porque estas etiquetas no contienen nada más.
  const DATE_RE = /^hace\s+(\d+)\s*([a-záéíóúñ.]+)\.?$/i;

  function shorten(rawText) {
    const text = rawText.trim();
    if (text.length < 5 || text.length > 20) return null; // descarte rápido
    const match = text.match(DATE_RE);
    if (!match) return null;

    const amount = parseInt(match[1], 10);
    const unitKey = match[2].toLowerCase().replace(/\.$/, '');
    const forms = UNIT_FORMS[unitKey] || UNIT_FORMS[unitKey + '.'];
    if (!forms) return null;

    const word = amount === 1 ? forms[0] : forms[1];
    return `${amount} ${word}`;
  }

  function tryRewrite(textNode) {
    const value = textNode.nodeValue;
    if (!value) return;
    const newValue = shorten(value);
    if (newValue !== null && newValue !== value) {
      textNode.nodeValue = newValue;
    }
  }

  function scan(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      tryRewrite(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      tryRewrite(node);
    }
  }

  function init() {
    scan(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          tryRewrite(mutation.target);
          continue;
        }
        for (const node of mutation.addedNodes) {
          scan(node);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
