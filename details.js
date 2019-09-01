{ // local scope
const initialLevel = 2;
const id_treeActiveItem = "id_tree-active-item";

class CollapsibleList extends HTMLElement {
/*static get observedAttributes() {
return ["data-label"];
} // get observedAttributes
*/

constructor () {
super ();
} // constructor

connectedCallback () {
//console.debug (`list connected:\n${this.innerHTML}`);
const list = document.createElement("ul");
const parent = this.parentElement;
const noHeading = this.hasAttribute("no-heading");

if (this.hasAttribute("tree")) {
list.setAttribute("aria-activedescendant", id_treeActiveItem);
list.setAttribute("role", "tree");
list.setAttribute("tabindex", "0");
this.tree = true;
this.root = true;
bindTreeNavigationKeys(list);
} else if (this.tree === true) {
list.setAttribute("role", "group");
} // if

if (!this.level) {
console.log(`level is ${this.getAttribute("level")}`);
this.level = this.hasAttribute("level")? Number(this.getAttribute("level")) : initialLevel;
} // if

Array.from(this.children).forEach(child => {
if (!noHeading) child.level = this.level+1;
child.tree = this.tree;

if (child.matches("li")) {
if (!this.tree) {
if (child.hasAttribute("data-href")) {
const hRef = child.getAttribute("data-href");
child.innerHTML = `<a href="${hRef}">${child.textContent}</a>`;
child.removeAttribute("data-href");

} else if (child.hasAttribute("data-action")) {
const action = child.getAttribute("data-action");
child.innerHTML = `<button data-action="${action}">${child.textContent}</button>`;
child.removeAttribute("data-action");
} // if
} // if

} else {
const parent = child.parentElement;

const listItem = document.createElement("li");
listItem.appendChild(child);
child = listItem;
 } // if

if (this.tree) {
if (containsOnlyTextNodes(child)) {
child.innerHTML = `<span tabindex="-1">${child.textContent}</span>`;
} else if (isFocusable(child.firstElementChild)) {
child.firstElementChild.setAttribute("tabindex", "-1");
} // if

child.setAttribute("role", "treeitem");
if (child.querySelector("ul, collapsible-list")) child.setAttribute("aria-expanded", "false");

if (this.root && list.children.length === 0) child.setAttribute("id", id_treeActiveItem);
} // if tree

list.appendChild(child);
}); // forEach children

let container = list;
if (this.hasAttribute("data-label")) {
const labelText = this.getAttribute("data-label");
const details = document.createElement("details");
details.innerHTML =
(this.tree || noHeading)? `<summary>${labelText}</summary>`
: `<summary><span role="heading" aria-level=${this.level.toString()}>${labelText}</span></summary>`;
if (this.tree) details.querySelector("summary").setAttribute("tabindex", "-1");
details.setAttribute("role", "presentation");
details.appendChild(list);
container = details;
} // if

parent.replaceChild(container, this);
} // connectedCallback 

attributeChanged (name, value) {
console.log(`attributeChanged ${name}`);
} //attributeChanged 


} // class CollapsibleList

customElements.define ("collapsible-list", CollapsibleList);

function bindTreeNavigationKeys (root) {
console.log(`binding to ${root}:`);
root.addEventListener ("keydown", e => {
const key = e.key;
switch (key) {
case "ArrowUp": setFocus(previous(getFocus()));
break;

case "ArrowDown": setFocus(next(getFocus()));
break;

case "ArrowLeft": setFocus(up(getFocus()));
break;

case "ArrowRight": setFocus(down(getFocus()));
break;

default: return true;
} // switch

e.preventDefault();
return false;
}); // keydown

function getFocus () {
const element = document.getElementById(id_treeActiveItem);
console.log(`getFocus: `, element);
return element.closest("[role=treeitem]");
} // getFocus

function setFocus (element) {
/*if (isLeafNode(element)) {
element = element.firstElementChild;
} // if
*/

if (element) {
document.getElementById(id_treeActiveItem).removeAttribute("id");
element.setAttribute("id", id_treeActiveItem);
root.removeAttribute("aria-activedescendant");
root.setAttribute("aria-activedescendant", id_treeActiveItem);
console.log(`setFocus: `, element);
return element;
} // if

console.log(`setFocus: element is null`);
} // setFocus

function next (element) {
element = element.nextElementSibling;
console.log ("next: ", element);
return element;
} // next

function previous (element) {
element = element.previousElementSibling;
console.log ("previous: ", element);
return element;
} // previous

function up (element) {
if (! element) return null;
element = element.parentElement.closest("[role=treeitem]");
if (element && root.contains(element)) {
closeBranch(element);
return element;
} else {
return null;
} // if
} // up

function down (element) {
if (! element) return null
if (! isLeafNode(element)) {
openBranch(element);
element = element.querySelector("[role=treeitem]");
} // if
return element;
} // down

function openBranch (node) {
console.log(`opening branch: ${node.children[0].children[0].textContent}`);
if (node && !isLeafNode(node)) {
const details = node.children[0];
node.setAttribute("aria-expanded", "true");
if (details.matches("details")) details.setAttribute("open", "");
console.log(`openBranch: ${node} ${details}`);
} // if

return node;
} // openBranch

function closeBranch (node) {
console.log(`closing branch: ${node.children[0].children[0].textContent} ${node.children[0].hasAttribute("open")}`);
if (node && !isLeafNode(node)) {
const details = node.children[0];
node.setAttribute("aria-expanded", "false");
if (details.matches("details")) details.removeAttribute("open");
console.log(`closeBranch: ${node} ${details}`);
} // if

return node;
} // closeBranch

} // bindTreeNavigationKeys


function isLeafNode (element) {
return element.matches("[role=treeitem]") && !element.hasAttribute("aria-expanded");
} // isLeafNode

function containsOnlyTextNodes (element) {
return element.children.length === 0;
} // containsOnlyTextNodes 

function isFocusable (element) {
return element.matches("a, button, [tabindex]");
} // isFocusable

} // end local scope

/*function getFocus(element) {
console.log(`getFocus: ${element}`);
const container = element.closest("[role=treeitem]");
if (isLeafNode(element)) return element;
else if (container.contains(element) && !isLeafNode(element)) return element;
else {
alert ("invalid focus");
return null;
} // if
} // getFocus

function setFocus (element) {
element.focus();
} // setFocus
*/




function markupTree (root) {
Array.from(root.querySelectorAll("li ul"))
.forEach(ul => ul.setAttribute("role", "group"));

Array.from(root.querySelectorAll("li"))
.forEach(li => {
li.setAttribute("role", "treeitem")
if (li.querySelector("ul")) li.setAttribute("aria-expanded", "false");
});

Array.from(root.querySelectorAll("a, button"))
.forEach(focusable => focusable.setAttribute("tabindex", "-1"));

root.setAttribute("aria-activedescendant", id_treeActiveItem);
root.setAttribute("role", "tree");
return root;
} // markupTree

// tests

$ = document.querySelector.bind(document);
t = $("ul");

