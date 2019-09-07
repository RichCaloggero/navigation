# navigation

This is an example of a webcomponent which implements accessible navigation. It implements two distinct behaviors, set via a boolean attribute.

- simple collapsible nested list navigation (default mode)
- tree-style keyboard navigation and appropriate ARIA markup (by adding "tree" attribute)

The component accepts the following markup:

- `collapsible-list` custom elements are converted to `ul` wrapped in `details`
	+ adding `label` attributes creates `summary`
	+ omitting `label` creates a non-collapsible sublist
- `li` elements are leaf nodes
	if they contain subelements, they are used as-is
	+ if they contain bare text and `data-href` attributes, a link is created inside with the specified `href`
	+ if they contain bare text and `data-action` is supplied, a button is created with the specified `data-action` attribute and value
	+ if bare text and no attribute and tree behavior requested, then a `span` is created wrapping the specified text (see below)

See details.txt for a sample of the results of this transformation.
Obviously, it is possible (and fairly easy) to create this by hand, and this removes any need for javascript at all.
The advantage of using this webcomponent is the slight simplification of the markup, and the ability to create tree behavior, which requires javascript.

- [Click this link to see this running in your browser](https://richcaloggero.github.io/navigation/collapsible-list.html).
- [click this link to see the generated nested list markup with headings](https://richcaloggero.github.io/navigation/list.txt).
- [click this link to see the generated tree markup](https://richcaloggero.github.io/navigation/tree.txt).
