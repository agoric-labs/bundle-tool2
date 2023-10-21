// @ts-check

const { entries } = Object;

/**
 *
 * @param {Document} document
 */
export const makeDocTools = document => {
  /** @param {string} sel */
  const $ = sel => document.querySelector(sel);
  /** @param {string} name */
  const $field = name => {
    const it = $(`*[name=${JSON.stringify(name)}]`);
    if (!it) throw Error(name);
    return it;
  };

  /**
   *
   * @param {string} tag
   * @param {Record<string, string>} [attrs]
   * @param {Array<string | Element>} [children]
   */
  const elt = (tag, attrs = {}, children = []) => {
    const it = document.createElement(tag);
    entries(attrs).forEach(([name, value]) => it.setAttribute(name, value));
    children.forEach(ch => {
      if (typeof ch === 'string') {
        it.appendChild(document.createTextNode(ch));
      } else {
        it.appendChild(ch);
      }
    });
    return it;
  };

  /**
   * @template {string} LP
   * @template {string} VP
   *
   * @param {SelectElement} selectElt
   * @param {Array<Record<LP|VP, string>>} choices
   * @param {LP} labelProp
   * @param {VP} valueProp
   */
  const setChoices = (selectElt, choices, labelProp, valueProp) => {
    selectElt.innerHTML = '';
    choices.forEach(item => {
      const option = elt('option', { value: item[valueProp] }, [
        item[labelProp],
      ]);
    });
  };
  return { elt, $, $field, setChoices };
};
