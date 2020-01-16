{ // local scope
const initialHeadingLevel = 2;

class CollapsibleList extends HTMLElement {

constructor () {
super ();
} // constructor

connectedCallback () {
/* Here is where all the action happens...
This gets called each time a "collapsible-list" element is connected to the document.
It replaces "collapsible-list" elements with "ul" and wraps those with labels in details elements whose summary textContent reflects the value of the label attribute.
*/
const list = document.createElement("ul");
const parent = this.parentElement;
const noHeading = this.hasAttribute("no-heading");

// initialize tree mode by adding aria treeview markup on the fly
if (this.hasAttribute("tree")) {
// this is the root
list.setAttribute("role", "tree");
this.tree = true;
this.root = true;
bindTreeNavigationKeys(list);
} else if (this.tree === true) {
// this is a subtree (nested collapsible-list element)
list.setAttribute("role", "group");
} // if

// initialize heading level (used for non-tree mode)
if (!this.headingLevel) {
this.headingLevel = this.hasAttribute("level")? Number(this.getAttribute("level")) : initialHeadingLevel;
} // if

// process the direct children of this node
Array.from(this.children).forEach(child => {
if (!noHeading) child.headingLevel = this.headingLevel+1;
child.tree = this.tree;

if (child.matches("li")) {
// if we're given "li" elements, add links or button element children depending on attributes
if (child.hasAttribute("data-href")) {
const hRef = child.getAttribute("data-href");
child.innerHTML = `<a href="${hRef}">${child.textContent}</a>`;
child.removeAttribute("data-href");
//console.log("fixed child: ", child);

} else if (child.hasAttribute("data-action")) {
const action = child.getAttribute("data-action");
child.innerHTML = `<button data-action="${action}">${child.textContent}</button>`;
child.removeAttribute("data-action");
//console.log("fixed child: ", child);
} // if

} else {
// no "li" so wrap child in "li"
const parent = child.parentElement;

const listItem = document.createElement("li");
listItem.appendChild(child);
child = listItem;
 } // if

if (this.tree) {
child.classList.add("branch");

if (containsOnlyTextNodes(child)) {
// be sure firstElementChild of this "li" is a container
child.innerHTML = `<span tabindex="-1">${child.textContent}</span>`;
} else if (isFocusable(child.firstElementChild)) {
child.firstElementChild.setAttribute("tabindex", "-1");
} // if

// if not leaf node, add aria-expanded
if (child.querySelector("ul, collapsible-list")) {
child.setAttribute("aria-expanded", "false");
child.setAttribute("role", "treeitem");
} else {
// otherwise, treeitem role goes on firstElementChild and this child gets role of none or presentation
child.firstElementChild.setAttribute("role", "treeitem");
child.setAttribute("role", "none");
} // if

// if first child of top level of tree, set focus and selection on it
if (this.root && list.children.length === 0) {
child.setAttribute("tabindex", "0");
child.focus();
} // if
} // if tree

// finally, add this child node to the current list
list.appendChild(child);
}); // forEach children

let container = list;
if (this.hasAttribute("label")) {
// if this collapsible-list has a label, make it collapsible by wrapping it's list in details whose summary contains the label's text
const labelText = this.getAttribute("label");
const details = document.createElement("details");

// add heading to summary only if not a tree and this collapsible-list node doesn't have no-heading attribute
details.innerHTML =
(this.tree || noHeading)? `<summary>${labelText}</summary>`
: `<summary><span role="heading" aria-level=${this.headingLevel.toString()}>${labelText}</span></summary>`;

// be sure summary isn't focusable when in tree mode
if (this.tree && !this.root) details.querySelector("summary").setAttribute("tabindex", "-1");

// needs to be presentational so screen reader will properly count list items and report start / end of current level, etc
//details.setAttribute("role", "presentation");

// wrap
details.appendChild(list);
container = details;
} // if

// replace this collapsible-list element with the list we've created and let the process continue as new nested collapsible-list elements are found and added by the browser
parent.replaceChild(container, this);
} // connectedCallback 
} // class CollapsibleList

// define the custom element
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
//const element = document.getElementById(id_treeActiveItem);
const element = root.querySelector("[tabindex='0']");
console.log(`getFocus: `, element);
return element.closest(".branch");
} // getFocus

function setFocus (element) {
if (!element) return null;

if (isLeafNode(element)) {
element = element.firstElementChild;
} // if

//if (element) {
updateFocus(element);
console.log(`setFocus: `, element);
return element;
//} // if


function updateFocus (element) {
root.querySelector("[tabindex='0']").removeAttribute("tabindex");
element.setAttribute("tabindex", "0");
element.focus();
/*root.querySelector(`#${id_treeActiveItem}`).removeAttribute("id");
element.setAttribute("id", id_treeActiveItem);
root.removeAttribute("aria-activedescendant");
root.setAttribute("aria-activedescendant", id_treeActiveItem);
*/
} // updateId

function updateAriaSelected (element) {
root.querySelector("[aria-selected]").removeAttribute("aria-selected");
element.setAttribute("aria-selected", "true");
} // updateAriaSelected
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
return element.matches(".branch") && !element.hasAttribute("aria-expanded");
} // isLeafNode

function containsOnlyTextNodes (element) {
return element.children.length === 0;
} // containsOnlyTextNodes 

function isFocusable (element) {
return element.matches("a, button, [tabindex]");
} // isFocusable

} // end local scope




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

