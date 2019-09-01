# navigation

THis is an example of a webcomponent which implements accessible navigation. It implements two distinct behaviors, set via a simple attribute.

- simple collapsible nested list navigation
- same, but adds tree-style keyboard navigation and appropriate ARIA markup

The component accepts the following markup:

- `collapsible-list` elements are converted to `ul` wrapped in `details`
	+ adding `data-label` attributes creates `summary`
	+ omitting `data-label` creates a non-collapsible sublist
- `li` elements are leaf nodes
	if they contain subelements, they are used as-is
	+ if they contain bare text and `data-href` attributes, a link is created inside with the specified `href`
	+ if `data-action` is supplied, a button is created inside with the specified `data-action` attribute and value
	+ if bare text and no attribute and tree behavior requested, then a `span` is created wrapping the specified textContent (see below)

See details.txt for a sample of the results of this transformation.
Obviously, it is possible (and fairly easy) to create this by hand, and this removes any need for javascript at all.
The advantage of using this webcomponent is the slight simplification of the markup, and the ease of producing tree behavior.

[Click this link to see this running in your browser](https://RichCaloggero.github.io/navigation.git).

```
<nav>
<!-- adding boolean attribute "tree" to the top level adds appropriate aria markup and keyboard navigation -->
<!-- "no-heading" eliminates heading from top-level summary -->
<collapsible-list data-label="toggle navigation" no-heading>
<collapsible-list data-label="fruits">
<collapsible-list data-label="mellons">
<li data-href="water mellons are juicy">watermellon</li>
<li data-href="honey due mellons are kind of gross">honey due mellon</li>

</collapsible-list><collapsible-list data-label="citrus">
<li>orange</li>
<li>grapefruit</li>
</collapsible-list>
<a href="apples are cool">apple</a>
<li data-href="grapes are sweet">grape</li>

</collapsible-list><collapsible-list data-label="vegetables">
<collapsible-list data-label="root vegetables">
<li data-action="crunchy and good with hummus">carot</li>
<li data-action="great with bacon">potato</li>
</collapsible-list><collapsible-list data-label="greens">
<li>lettuce</li>
<li>spinach</li>
</collapsible-list>
<li>broccoli</li>
</collapsible-list>
</collapsible-list></nav>
```

